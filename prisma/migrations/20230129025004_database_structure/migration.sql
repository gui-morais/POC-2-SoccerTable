-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "home" INTEGER NOT NULL,
    "away" INTEGER NOT NULL,
    "home_goals" INTEGER,
    "away_goals" INTEGER,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_fkey" FOREIGN KEY ("away") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_fkey" FOREIGN KEY ("home") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
