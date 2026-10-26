import { notFound, redirect } from "next/navigation";
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
import PracticeClient from "@/components/PracticeClient";

export const dynamic = "force-dynamic";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ kpId: string }>;
}) {
  const { kpId } = await params;
  const session = await getSession();
  if (!session) redirect("/");
  if (session.role === "guru") redirect("/guru");

  const [kp] = await db
    .select()
    .from(knowledgePoints)
    .where(eq(knowledgePoints.id, kpId))
    .limit(1);
  if (!kp) notFound();

  await ensureMasteryRows(session.id);
  const unlocked = await isKpUnlockedForStudent(session.id, kp);
  if (!unlocked) redirect("/dashboard");

  const qList = await getKpQuestions(kpId);
  if (qList.length === 0) notFound();

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

  const [nk] = await db
    .select({ id: knowledgePoints.id, title: knowledgePoints.kpTitle })
    .from(knowledgePoints)
    .where(eq(knowledgePoints.orderNum, kp.orderNum + 1))
    .limit(1);

  return (
    <PracticeClient
      kp={{
        id: kp.id,
        kpTitle: kp.kpTitle,
        topicNumber: kp.topicNumber,
        topicTitle: kp.topicTitle,
      }}
      initialQuestion={presentQuestion(qList[index])}
      initialMeta={{ index, total: qList.length }}
      initialMastery={{
        status: m?.status ?? "untouched",
        streak: m?.correctStreak ?? 0,
      }}
      nextKp={nk ?? null}
      studentName={session.name.split(" ")[0]}
    />
  );
}
