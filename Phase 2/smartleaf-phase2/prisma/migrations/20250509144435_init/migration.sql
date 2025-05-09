-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "prerequisite" TEXT,
    "openForRegistration" BOOLEAN NOT NULL,
    "stage" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "timing" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "minRegistrations" INTEGER NOT NULL,
    "registeredStudents" JSONB NOT NULL,
    "pendingStudents" JSONB NOT NULL,
    "approved" BOOLEAN NOT NULL,
    CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePic" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "major" TEXT,
    "completedCourses" JSONB NOT NULL,
    "registeredCourses" JSONB NOT NULL,
    "registeredClasses" JSONB NOT NULL,
    "pendingCourses" JSONB,
    "expertise" JSONB,
    "assignedCourses" JSONB
);

-- CreateTable
CREATE TABLE "Grade" (
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,

    PRIMARY KEY ("userId", "courseId"),
    CONSTRAINT "Grade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Grade_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
