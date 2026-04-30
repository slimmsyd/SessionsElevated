-- CreateEnum
CREATE TYPE "TierMode" AS ENUM ('admission', 'partnership');

-- CreateTable
CREATE TABLE "tiers" (
    "id" TEXT NOT NULL,
    "mode" "TierMode" NOT NULL,
    "name" TEXT NOT NULL,
    "rsvpCount" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "blurb" TEXT NOT NULL,
    "includes" TEXT[],
    "badge" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "doors" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
