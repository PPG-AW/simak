import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { students, type Student } from "@/db/schema";

export const SESSION_COOKIE = "simak_session";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getSession(): Promise<Student | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id || !UUID_RE.test(id)) return null;
  const rows = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return rows[0] ?? null;
}
