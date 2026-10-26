/* Pure logic shared between server routes and client components.
   No database or Node-only imports allowed here. */

export function normalizeAnswerText(raw: string | undefined | null): string {
  return (raw ?? "")
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, "")
    .replace(/^\+/, "");
}

function numericEq(a: string, b: string): boolean {
  if (a === b) return true;
  const na = Number(a);
  const nb = Number(b);
  if (a !== "" && b !== "" && !Number.isNaN(na) && !Number.isNaN(nb)) {
    return na === nb;
  }
  return false;
}

/** Factor-form answers like (x+2)(x+3) — compare as unordered factor list. */
function canonicalValue(v: string): string {
  const n = normalizeAnswerText(v).replace(/=0$/, "");
  const parts = n.match(/\([^)]*\)/g);
  if (parts && parts.length >= 2) {
    return parts.slice().sort().join("|");
  }
  return n;
}

export function checkAnswer(
  correct: Record<string, string>,
  student: Record<string, string>
): boolean {
  const keys = Object.keys(correct);

  if (keys.length === 1 && keys[0] === "answer") {
    return (
      canonicalValue(student.answer ?? "") === canonicalValue(correct.answer)
    );
  }

  if (keys.includes("p") && keys.includes("q")) {
    const s = [student.p ?? "", student.q ?? ""]
      .map(normalizeAnswerText)
      .sort()
      .join("|");
    const c = [correct.p ?? "", correct.q ?? ""]
      .map(normalizeAnswerText)
      .sort()
      .join("|");
    return s === c;
  }

  return keys.every((k) =>
    numericEq(
      normalizeAnswerText(student[k] ?? ""),
      normalizeAnswerText(correct[k])
    )
  );
}

export function detectErrorType(
  commonErrors: Array<{ wrong: Record<string, string>; type: string }> | null,
  student: Record<string, string>
): string | null {
  if (!commonErrors) return null;
  for (const entry of commonErrors) {
    const wrongKeys = Object.keys(entry.wrong);
    if (wrongKeys.includes("p") && wrongKeys.includes("q")) {
      const s = [student.p ?? "", student.q ?? ""]
        .map(normalizeAnswerText)
        .sort()
        .join("|");
      const w = [entry.wrong.p ?? "", entry.wrong.q ?? ""]
        .map(normalizeAnswerText)
        .sort()
        .join("|");
      if (s === w) return entry.type;
      continue;
    }
    const allMatch = wrongKeys.every((k) =>
      numericEq(
        normalizeAnswerText(student[k] ?? ""),
        normalizeAnswerText(entry.wrong[k])
      )
    );
    if (allMatch) return entry.type;
  }
  return null;
}

/* --------------------------- Question presentation --------------------------- */

export interface QuestionChoice {
  key: string;
  text: string;
}

export interface PublicQuestion {
  id: string;
  kpId: string;
  type: "input" | "multiple_choice";
  prompt: string;
  choices: QuestionChoice[] | null;
  fields: string[] | null;
  difficulty: number;
}

interface QuestionShape {
  id: string;
  kpId: string;
  questionText: string;
  questionType: string;
  correctAnswer: Record<string, string>;
  difficulty: number;
}

export function presentQuestion(q: QuestionShape): PublicQuestion {
  if (q.questionType === "multiple_choice") {
    const expected = q.correctAnswer.answer ?? "";
    if (expected === "YA" || expected === "TIDAK") {
      return {
        id: q.id,
        kpId: q.kpId,
        type: "multiple_choice",
        prompt: q.questionText,
        choices: [
          { key: "YA", text: "Ya, termasuk" },
          { key: "TIDAK", text: "Tidak termasuk" },
        ],
        fields: null,
        difficulty: q.difficulty,
      };
    }
    const choices: QuestionChoice[] = [];
    const stem: string[] = [];
    for (const line of q.questionText.split("\n")) {
      const m = line.match(/^\s*([A-Z])[\).]\s*(.+)$/);
      if (m) choices.push({ key: m[1], text: m[2].trim() });
      else stem.push(line);
    }
    return {
      id: q.id,
      kpId: q.kpId,
      type: "multiple_choice",
      prompt: stem.join("\n").trim(),
      choices,
      fields: null,
      difficulty: q.difficulty,
    };
  }
  return {
    id: q.id,
    kpId: q.kpId,
    type: "input",
    prompt: q.questionText,
    choices: null,
    fields: Object.keys(q.correctAnswer),
    difficulty: q.difficulty,
  };
}

export const FIELD_LABELS: Record<string, string> = {
  a: "a",
  b: "b",
  c: "c",
  p: "p",
  q: "q",
  x1: "x₁",
  x2: "x₂",
  answer: "Jawaban",
};

export const ERROR_TYPE_LABELS: Record<string, string> = {
  sign_error: "Lupa tanda negatif pada koefisien / bilangan",
  sign_error_partial: "Sebagian tanda masih keliru",
  no_rearrange: "Tidak menyusun ke bentuk standar lebih dulu",
  no_rearrange_partial: "Susunan bentuk standar belum tepat",
  no_rearrange_sign: "Tanda berubah saat memindah ruas",
  pasangan_salah: "Salah memilih pasangan faktor",
  missing_coefficient: "Melewatkan koefisien 1 / −1 yang tidak tertulis",
  bentuk_tidak_standar: "Keliru membaca bentuk yang belum standar",
  konsep_salah: "Konsep dasar PK belum tepat",
  pangkat_salah: "Keliru menentukan pangkat tertinggi",
  syarat_a_salah: "Mengabaikan syarat a ≠ 0",
  syarat_b_c_salah: "Mengira b atau c tidak boleh nol",
  koef_negatif_bingung: "Ragu dengan koefisien negatif",
  posisi_salah: "Tertukar posisi a, b, c",
};
