import { PrismaClient } from "@prisma/client"
import fs from "fs-extra"
import path from "path"

const prisma = new PrismaClient()

async function seed() {
    console.log("Seeding started…")

    const coursesJSON = await fs.readJSON(
        path.join(process.cwd(), "app/data/courses.json")
    )
    const usersJSON = await fs.readJSON(
        path.join(process.cwd(), "app/data/users.json")
    )

    const courseList = coursesJSON.courses
    const userList = usersJSON.users


    for (const c of courseList) {
        await prisma.course.create({
            data: {
                id: c.id,
                name: c.name,
                category: c.category,
                credits: c.credits,
                openForRegistration: c.openForRegistration,
                stage: c.stage,
                sections: c.sections
            }
        })
    }

    for (const c of courseList) {
        if (c.prerequisite) {
            await prisma.course.update({
                where: { id: c.id },
                data: { prerequisiteId: c.prerequisite }
            })
        }
    }


    for (const u of userList) {
        await prisma.user.create({
            data: {
                id: u.id,
                username: u.username,
                password: u.password,
                name: u.name,
                profilePic: u.profilePic ?? null,
                role: u.role,
                major: u.major ?? null,

                expertise: u.expertise ?? null,
                completedCourses: u.completedCourses ?? null,
                registeredCourses: u.registeredCourses ?? null,
                registeredClasses: u.registeredClasses ?? null,
                grades: u.grades ?? null,
                pendingCourses: u.pendingCourses ?? null
            }
        })
    }

    console.log("✅  Seeding completed")
}


seed()
    .catch((e) => {
        console.error("❌  Seeding error:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
