/*
  Warnings:

  - You are about to drop the column `otp_Enabled` on the `Auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "otp_Enabled",
ADD COLUMN     "otp_enabled" BOOLEAN DEFAULT false;
