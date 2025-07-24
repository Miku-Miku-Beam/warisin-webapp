-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Applicant', 'ARTISAN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'Applicant',
    "bio" TEXT,
    "profileImageUrl" TEXT,
    "location" TEXT,
    "authId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "portfolioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicantProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "location" TEXT,
    "imageUrl" TEXT,
    "works" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtisanProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HerittageCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HerittageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ProgramId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "motivation" TEXT,
    "cvUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantProfile_userId_key" ON "ApplicantProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtisanProfile_userId_key" ON "ArtisanProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HerittageCategory_name_key" ON "HerittageCategory"("name");

-- AddForeignKey
ALTER TABLE "ApplicantProfile" ADD CONSTRAINT "ApplicantProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanProfile" ADD CONSTRAINT "ArtisanProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "HerittageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_ProgramId_fkey" FOREIGN KEY ("ProgramId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
