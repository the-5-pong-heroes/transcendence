-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PRIVATE', 'PUBLIC', 'PROTECTED', 'DIRECT');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING', 'RUNNING', 'FINISHED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE', 'IN_GAME');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "status" "UserStatus" NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "userId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "accessToken" TEXT NOT NULL DEFAULT 'noToken',
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "twoFAactivated" BOOLEAN DEFAULT false,
    "twoFASecret" TEXT,
    "otp_enabled" BOOLEAN DEFAULT false,
    "otp_verified" BOOLEAN DEFAULT false,
    "otp_validated" BOOLEAN DEFAULT false,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Blocked" (
    "blockedUserId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blocked_pkey" PRIMARY KEY ("userId","blockedUserId")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "userId" UUID NOT NULL,
    "addedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("userId","addedById")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "status" "GameStatus" NOT NULL DEFAULT 'WAITING',
    "playerOneId" UUID NOT NULL,
    "playerOneScore" INTEGER NOT NULL DEFAULT 0,
    "playerTwoId" UUID,
    "playerTwoScore" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ChannelType" NOT NULL,
    "password" TEXT,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelUser" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntil" TIMESTAMP(3),

    CONSTRAINT "ChannelUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelBan" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "bannedUntil" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelBan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" UUID,
    "channelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelUser" ADD CONSTRAINT "ChannelUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelUser" ADD CONSTRAINT "ChannelUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelBan" ADD CONSTRAINT "ChannelBan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelBan" ADD CONSTRAINT "ChannelBan_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
