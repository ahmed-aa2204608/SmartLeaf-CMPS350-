import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


class Repo {
    constructor() {
        this.prisma = prisma;
    }

    async getCourses() {
        return await this.prisma.course.findMany({
            include: {
            },
        });
    }
}

export default new Repo();