import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  text,
  jsonb,
  boolean,
  timestamp,
  unique,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const masteryStatusEnum = pgEnum("mastery_status", [
  "untouched",
  "learning",
  "almost",
  "mastered",
]);

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  role: varchar("role", { length: 10 }).notNull().default("siswa"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const knowledgePoints = pgTable("knowledge_points", {
  id: varchar("id", { length: 10 }).primaryKey(),
  topicNumber: integer("topic_number").notNull(),
  topicTitle: varchar("topic_title", { length: 100 }).notNull(),
  kpTitle: varchar("kp_title", { length: 200 }).notNull(),
  kpDescription: text("kp_description"),
  prerequisiteId: varchar("prerequisite_id", { length: 10 }).references(
    (): AnyPgColumn => knowledgePoints.id
  ),
  orderNum: integer("order_num").notNull().unique(),
  materialContent: text("material_content"),
  exampleContent: text("example_content"),
});

export const questions = pgTable(
  "questions",
  {
    id: varchar("id", { length: 20 }).primaryKey(),
    kpId: varchar("kp_id", { length: 10 })
      .notNull()
      .references(() => knowledgePoints.id),
    questionText: text("question_text").notNull(),
    questionType: varchar("question_type", { length: 20 })
      .notNull()
      .default("input"),
    correctAnswer: jsonb("correct_answer")
      .$type<Record<string, string>>()
      .notNull(),
    feedbackLevel1: text("feedback_level_1").notNull(),
    feedbackLevel2: text("feedback_level_2").notNull(),
    feedbackLevel3: text("feedback_level_3").notNull(),
    feedbackCorrect: text("feedback_correct").notNull(),
    commonErrors: jsonb("common_errors")
      .$type<Array<{ wrong: Record<string, string>; type: string }> | null>(),
    difficulty: integer("difficulty").notNull().default(1),
    orderNum: integer("order_num").notNull(),
  },
  (t) => [index("idx_questions_kp").on(t.kpId)]
);

export const studentMastery = pgTable(
  "student_mastery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    kpId: varchar("kp_id", { length: 10 })
      .notNull()
      .references(() => knowledgePoints.id),
    status: masteryStatusEnum("status").notNull().default("untouched"),
    correctStreak: integer("correct_streak").notNull().default(0),
    totalAttempts: integer("total_attempts").notNull().default(0),
    totalCorrect: integer("total_correct").notNull().default(0),
    currentQuestionIndex: integer("current_question_index")
      .notNull()
      .default(0),
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
    masteredAt: timestamp("mastered_at", { withTimezone: true }),
  },
  (t) => [
    unique("student_mastery_student_kp_unique").on(t.studentId, t.kpId),
    index("idx_student_mastery_student").on(t.studentId),
    index("idx_student_mastery_kp").on(t.kpId),
  ]
);

export const attemptLogs = pgTable(
  "attempt_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    kpId: varchar("kp_id", { length: 10 })
      .notNull()
      .references(() => knowledgePoints.id),
    questionId: varchar("question_id", { length: 20 })
      .notNull()
      .references(() => questions.id),
    attemptNumber: integer("attempt_number").notNull(),
    studentAnswer: jsonb("student_answer").$type<Record<string, string>>(),
    isCorrect: boolean("is_correct").notNull(),
    errorType: varchar("error_type", { length: 50 }),
    feedbackLevel: integer("feedback_level").notNull(),
    timeSpentSeconds: integer("time_spent_seconds"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_attempt_logs_student").on(t.studentId),
    index("idx_attempt_logs_kp").on(t.kpId),
    index("idx_attempt_logs_created").on(t.createdAt),
  ]
);

export type Student = typeof students.$inferSelect;
export type KnowledgePoint = typeof knowledgePoints.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type StudentMastery = typeof studentMastery.$inferSelect;
export type AttemptLog = typeof attemptLogs.$inferSelect;
export type MasteryStatus =
  (typeof masteryStatusEnum.enumValues)[number];
