-- CreateEnum
CREATE TYPE "GuestType" AS ENUM ('FAMILY', 'FRIEND');

-- CreateEnum
CREATE TYPE "GuestStatus" AS ENUM ('PENDING', 'INVITED', 'REJECTED');

-- CreateTable
CREATE TABLE "Guest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "GuestType" NOT NULL,
    "status" "GuestStatus" NOT NULL DEFAULT 'PENDING',
    "invitedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);
