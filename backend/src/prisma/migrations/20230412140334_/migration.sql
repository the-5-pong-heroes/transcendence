/*
  Warnings:

  - You are about to drop the column `banUntil` on the `ChannelUser` table. All the data in the column will be lost.
  - You are about to drop the column `isBan` on the `ChannelUser` table. All the data in the column will be lost.
  - You are about to drop the column `isMute` on the `ChannelUser` table. All the data in the column will be lost.
  - You are about to drop the column `last_login` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_friendsId_fkey";

-- DropIndex
DROP INDEX "Game_playerOneId_key";

-- DropIndex
DROP INDEX "Game_playerTwoId_key";

-- AlterTable
ALTER TABLE "ChannelUser" DROP COLUMN "banUntil",
DROP COLUMN "isBan",
DROP COLUMN "isMute",
ADD COLUMN     "bannedUntil" TIMESTAMP(3),
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMuted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isBlocked" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "mode" SET DEFAULT 'PONG_2D',
ALTER COLUMN "endedAt" DROP DEFAULT,
ALTER COLUMN "playerOneScore" SET DEFAULT 0,
ALTER COLUMN "playerTwoScore" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "last_login",
ADD COLUMN     "lastLogin" TIMESTAMP(3);

-- DropTable
DROP TABLE "Friends";

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
