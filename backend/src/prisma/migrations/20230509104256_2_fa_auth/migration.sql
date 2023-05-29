-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "otp_Enabled" BOOLEAN DEFAULT false,
ADD COLUMN     "otp_validated" BOOLEAN DEFAULT false,
ADD COLUMN     "otp_verified" BOOLEAN DEFAULT false;
