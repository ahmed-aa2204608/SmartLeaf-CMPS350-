import { PrismaClient } from "@prisma/client"
import fs from "fs-extra"
import path from "path"

const prisma = new PrismaClient()

async function seed() {
    console.log("Seeding started…")

    const { courses } = await fs.readJSON(
        path.join(process.cwd(), "app/data/courses.json")
    )
    const { users } = await fs.readJSON(
        path.join(process.cwd(), "app/data/users.json")
    )

    await prisma.grade.deleteMany()
    await prisma.section.deleteMany()
    await prisma.course.deleteMany()
    await prisma.user.deleteMany()

    for (const course of courses) {
        await prisma.course.create({
            data: {
                id: course.id,
                name: course.name,
                category: course.category,
                credits: course.credits,
                prerequisite: course.prerequisite,
                openForRegistration: course.openForRegistration,
                stage: course.stage,
                sections: {
                    create: course.sections.map((sec) => ({
                        id: sec.id,
                        instructor: sec.instructor,
                        timing: sec.timing,
                        capacity: sec.capacity,
                        minRegistrations: sec.minRegistrations,
                        registeredStudents: sec.registeredStudents,
                        pendingStudents: sec.pendingStudents,
                        approved: sec.approved,
                    })),
                },
            },
        })
        console.log(`Created course ${course.id}`)
    }

    for (const user of users) {
        const userData = {
            id: user.id,
            username: user.username,
            password: user.password,
            profilePic: user.profilePic ?? null,
            name: user.name,
            role: user.role,
            major: user.major ?? null,
            completedCourses: user.completedCourses ?? [],
            registeredCourses: user.registeredCourses ?? [],
            registeredClasses: user.registeredClasses ?? [],
            pendingCourses: user.pendingCourses ?? null,
            expertise: user.expertise ?? null,
            assignedCourses: user.assignedCourses ?? null,
            grades: {
                create: (user.grades || []).map((g) => ({
                    courseId: g.courseId,
                    grade: g.grade,
                })),
            },
        }

        await prisma.user.create({ data: userData })
        console.log(`Created user ${user.id}`)
    }

    console.log("Seeding completed!")
}

seed()
    .catch((e) => {
        console.error("Seeding error:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
