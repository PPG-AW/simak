import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { knowledgePoints, studentMastery } from "@/db/schema";
import { getSession } from "@/lib/session";
import { presentQuestion } from "@/lib/shared";
import {
  ensureMasteryRows,
  getKpQuestions,
  isKpUnlockedForStudent,
} from "@/lib/learning";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "siswa") {
    return NextResponse.json({ error: "Silakan masuk dulu." }, { status: 401 });
  }

  const kpId = new URL(req.url).searchParams.get("kpId") ?? "";
  const [kp] = await db
    .select()
    .from(knowledgePoints)
    .where(eq(knowledgePoints.id, kpId))
    .limit(1);
  if (!kp) {
    return NextResponse.json({ error: "KP tidak ditemukan." }, { status: 404 });
  }

  await ensureMasteryRows(session.id);

  const unlocked = await isKpUnlockedForStudent(session.id, kp);
  if (!unlocked) {
    return NextResponse.json(
      { error: "KP ini masih terkunci." },
      { status: 403 }
    );
  }

  const qList = await getKpQuestions(kpId);
  if (qList.length === 0) {
    return NextResponse.json(
      { error: "Belum ada soal untuk KP ini." },
      { status: 404 }
    );
  }

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

  const index = (m?.currentQuestionIndex ?? 0) % qList.length;
  const question = qList[index];

  return NextResponse.json({
    question: presentQuestion(question),
    questionIndex: index,
    totalQuestions: qList.length,
    mastery: {
      status: m?.status ?? "untouched",
      streak: m?.correctStreak ?? 0,
    },
  });
}
