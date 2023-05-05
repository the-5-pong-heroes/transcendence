-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "accessToken" TEXT NOT NULL DEFAULT 'noToken',
ADD COLUMN     "isRegistered" BOOLEAN NOT NULL DEFAULT false;
