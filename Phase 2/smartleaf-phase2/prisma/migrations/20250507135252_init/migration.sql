-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePic" TEXT,
    "role" TEXT NOT NULL,
    "major" TEXT,
    "expertise" JSONB,
    "completedCourses" JSONB,
    "registeredCourses" JSONB,
    "registeredClasses" JSONB,
    "grades" JSONB,
    "pendingCourses" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "openForRegistration" BOOLEAN NOT NULL,
    "stage" TEXT NOT NULL,
    "prerequisiteId" TEXT,
    "sections" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
