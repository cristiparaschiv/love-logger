-- CreateTable
CREATE TABLE "daily_questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'free_text',
    "options" TEXT
);

-- CreateTable
CREATE TABLE "daily_checkins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "daily_checkins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "daily_checkins_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "daily_questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "checkin_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notification_hour" INTEGER NOT NULL DEFAULT 20
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_checkins_user_id_date_key" ON "daily_checkins"("user_id", "date");
