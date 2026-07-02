-- CreateEnum
CREATE TYPE "DeckShareRole" AS ENUM ('VIEWER', 'EDITOR');

-- CreateTable
CREATE TABLE "DeckShare" (
    "id" TEXT NOT NULL,
    "role" "DeckShareRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deckId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DeckShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeckShare_deckId_userId_key" ON "DeckShare"("deckId", "userId");

-- CreateIndex
CREATE INDEX "DeckShare_userId_idx" ON "DeckShare"("userId");

-- CreateIndex
CREATE INDEX "DeckShare_deckId_idx" ON "DeckShare"("deckId");

-- AddForeignKey
ALTER TABLE "DeckShare" ADD CONSTRAINT "DeckShare_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckShare" ADD CONSTRAINT "DeckShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
