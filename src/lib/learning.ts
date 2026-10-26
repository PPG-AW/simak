import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  knowledgePoints,
  questions,
  studentMastery,
  type KnowledgePoint,
  type MasteryStatus,
  type Question,
} from "@/db/schema";

/* ------------------------------- Server helpers ------------------------------ */

export async function ensureMasteryRows(studentId: string) {
  const kps = await db
    .select({ id: knowledgePoints.id })
    .from(knowledgePoints);
  const existing = await db
    .select({ kpId: studentMastery.kpId })
    .from(studentMastery)
    .where(eq(studentMastery.studentId, studentId));
  const have = new Set(existing.map((e) => e.kpId));
  const missing = kps.filter((k) => !have.has(k.id));
  if (missing.length > 0) {
    await db
      .insert(studentMastery)
      .values(missing.map((k) => ({ studentId, kpId: k.id })))
      .onConflictDoNothing();
  }
}

export function isKpUnlocked(
  kp: Pick<KnowledgePoint, "prerequisiteId">,
  masteryByKp: Map<string, { status: MasteryStatus }>
): boolean {
  if (!kp.prerequisiteId) return true;
  return masteryByKp.get(kp.prerequisiteId)?.status === "mastered";
}

export async function isKpUnlockedForStudent(
  studentId: string,
  kp: Pick<KnowledgePoint, "prerequisiteId">
): Promise<boolean> {
  if (!kp.prerequisiteId) return true;
  const rows = await db
    .select({ status: studentMastery.status })
    .from(studentMastery)
    .where(
      and(
        eq(studentMastery.studentId, studentId),
        eq(studentMastery.kpId, kp.prerequisiteId)
      )
    )
    .limit(1);
  return rows[0]?.status === "mastered";
}

export async function getKpQuestions(kpId: string): Promise<Question[]> {
  return db
    .select()
    .from(questions)
    .where(eq(questions.kpId, kpId))
    .orderBy(asc(questions.orderNum));
}
