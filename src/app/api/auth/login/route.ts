import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { students, type Student } from "@/db/schema";
import { SESSION_COOKIE } from "@/lib/session";
import { ensureMasteryRows } from "@/lib/learning";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: "Permintaan tidak valid." },
      { status: 400 }
    );
  }

  let user: Student | undefined;

  if (body.as === "guru") {
    const rows = await db
      .select()
      .from(students)
      .where(eq(students.role, "guru"))
      .limit(1);
    user = rows[0];
  } else {
    const name = String(body.name ?? "")
      .trim()
      .replace(/\s+/g, " ");
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Tulis nama lengkapmu dulu ya (minimal 2 huruf)." },
        { status: 400 }
      );
    }
    const rows = await db
      .select()
      .from(students)
      .where(sql`lower(${students.name}) = lower(${name})`)
      .limit(1);
    if (rows[0]) {
      user = rows[0];
      if (user.role === "guru") {
        return NextResponse.json(
          {
            error:
              "Nama ini milik akun guru. Gunakan tombol Masuk sebagai Guru.",
          },
          { status: 400 }
        );
      }
    } else {
      try {
        const inserted = await db
          .insert(students)
          .values({ name, role: "siswa" })
          .returning();
        user = inserted[0];
      } catch {
        const retry = await db
          .select()
          .from(students)
          .where(sql`lower(${students.name}) = lower(${name})`)
          .limit(1);
        user = retry[0];
      }
    }
  }

  if (!user) {
    return NextResponse.json(
      { error: "Gagal masuk. Coba lagi ya." },
      { status: 500 }
    );
  }

  await db
    .update(students)
    .set({ lastLoginAt: new Date() })
    .where(eq(students.id, user.id));

  if (user.role === "siswa") {
    await ensureMasteryRows(user.id);
  }

  const res = NextResponse.json({ ok: true, role: user.role, name: user.name });
  res.cookies.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
