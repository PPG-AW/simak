import { NextResponse } from "next/server";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  attemptLogs,
  knowledgePoints,
  questions,
  studentMastery,
  type MasteryStatus,
} from "@/db/schema";
import { getSession } from "@/lib/session";
import { checkAnswer, detectErrorType } from "@/lib/shared";
import { ensureMasteryRows } from "@/lib/learning";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "siswa") {
    return NextResponse.json({ error: "Silakan masuk dulu." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const kpId = String(body?.kpId ?? "");
  const questionId = String(body?.questionId ?? "");
  const answer = (body?.answer ?? {}) as Record<string, string>;
  const timeSpent = Math.min(
    Math.max(Math.round(Number(body?.timeSpentSeconds) || 0), 0),
    3600
  );
  if (!kpId || !questionId) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }

  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1);
  if (!question || question.kpId !== kpId) {
    return NextResponse.json(
      { error: "Soal tidak ditemukan." },
      { status: 404 }
    );
  }

  await ensureMasteryRows(session.id);

  const qList = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.kpId, kpId))
    .orderBy(asc(questions.orderNum));

  const [m] = await db
    .select()
    .from(studentMastery)
    .where(
      and(
        eq(studentMastery.studentId, session.id),
        eq(studentMastery.kpId, kpId)
      )
    )
    .limit(1);
  if (!m) {
    return NextResponse.json(
      { error: "Data penguasaan tidak ditemukan." },
      { status: 404 }
    );
  }

  // Attempt number = consecutive most-recent logs on this same question + 1
  const recent = await db
    .select({ questionId: attemptLogs.questionId })
    .from(attemptLogs)
    .where(eq(attemptLogs.studentId, session.id))
    .orderBy(desc(attemptLogs.createdAt))
    .limit(8);
  let prev = 0;
  for (const r of recent) {
    if (r.questionId === question.id) prev++;
    else break;
  }
  const attemptNumber = Math.min(prev + 1, 3);

  const correct = checkAnswer(question.correctAnswer, answer);
  const errorType = correct
    ? null
    : detectErrorType(question.commonErrors, answer);

  const alreadyMastered = m.status === "mastered";
  const newStreak = correct ? m.correctStreak + 1 : 0;
  const masteredNow = !alreadyMastered && newStreak >= 3;

  let status: MasteryStatus = m.status;
  if (!alreadyMastered) {
    if (masteredNow) status = "mastered";
    else if (correct) status = newStreak >= 2 ? "almost" : "learning";
    else status = "learning";
  }

  const advance = correct || attemptNumber >= 3;
  const nextIndex = advance
    ? (m.currentQuestionIndex + 1) % Math.max(qList.length, 1)
    : m.currentQuestionIndex;

  await db
    .update(studentMastery)
    .set({
      status,
      correctStreak: masteredNow ? 3 : newStreak,
      totalAttempts: m.totalAttempts + 1,
      totalCorrect: m.totalCorrect + (correct ? 1 : 0),
      currentQuestionIndex: nextIndex,
      lastAttemptAt: new Date(),
      masteredAt: masteredNow ? new Date() : m.masteredAt,
    })
    .where(eq(studentMastery.id, m.id));

  await db.insert(attemptLogs).values({
    studentId: session.id,
    kpId,
    questionId: question.id,
    attemptNumber,
    studentAnswer: answer,
    isCorrect: correct,
    errorType,
    feedbackLevel: correct ? 0 : attemptNumber,
    timeSpentSeconds: timeSpent,
  });

  let nextKp: { id: string; title: string } | null = null;
  if (status === "mastered") {
    const [kp] = await db
      .select()
      .from(knowledgePoints)
      .where(eq(knowledgePoints.id, kpId))
      .limit(1);
    if (kp) {
      const [nk] = await db
        .select({
          id: knowledgePoints.id,
          title: knowledgePoints.kpTitle,
        })
        .from(knowledgePoints)
        .where(eq(knowledgePoints.orderNum, kp.orderNum + 1))
        .limit(1);
      nextKp = nk ?? null;
    }
  }

  const feedbackText = correct
    ? question.feedbackCorrect
    : attemptNumber === 1
      ? question.feedbackLevel1
      : attemptNumber === 2
        ? question.feedbackLevel2
        : question.feedbackLevel3;

  return NextResponse.json({
    correct,
    level: correct ? 0 : attemptNumber,
    text: feedbackText,
    errorType,
    attemptsUsed: correct ? 0 : attemptNumber,
    canNext: correct || attemptNumber >= 3,
    mastery: { status, streak: masteredNow ? 3 : newStreak },
    mastered: status === "mastered",
    masteredNow,
    nextKp,
  });
}
