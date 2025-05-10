import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { createSession } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

class Repo {

     async login(prevState, formData) {
        const username = formData.get('username');
        const password = formData.get('password');
      
        const user = await prisma.user.findUnique({ where: { username } });
      
        if (!user || user.password !== password) {
          return { error: 'Invalid username or password' };
        }
      
        await cookies().set('user', JSON.stringify({ id: user.id, role: user.role }), {
          httpOnly: true,
          path: '/',
        });
      
        switch (user.role) {
          case 'student':
            redirect('/student');
          case 'instructor':
            redirect('/instructor');
          case 'admin':
            redirect('/admin');
          default:
            redirect('/');
        }
      }

    async getTotalStudents() {
        return prisma.user.count({ where: { role: 'student' } })
    }

    async getTotalInstructors() {
        return prisma.user.count({ where: { role: 'instructor' } })
    }

    async getTotalCourses() {
        return prisma.course.count()
    }

    async getTotalSections() {
        return prisma.section.count()
    }

    async getTotalOpenCourses() {
        return prisma.course.count({ where: { openForRegistration: true } })
    }

    async getAvgSectionCapacity() {
        const res = await prisma.section.aggregate({ _avg: { capacity: true } })
        return +res._avg.capacity.toFixed(2)
    }

    async getApprovalRateSections() {
        const total = await this.getTotalSections()
        const approved = await prisma.section.count({ where: { approved: true } })
        return Math.round((approved / total) * 100)
    }

    async getTotalPendingStudents() {
        const result = await prisma.$queryRaw`
      SELECT SUM(json_array_length(pendingStudents)) as total
      FROM Section;
    `
        return result[0].total || 0
    }

    async getStudentsPerMajor() {
        const groups = await prisma.user.groupBy({
            by: ['major'],
            where: { role: 'student' },
            _count: { major: true }
        })
        return Object.fromEntries(groups.map(g => [g.major || 'Unknown', g._count.major]))
    }

    async getCoursesByCategoryCount() {
        const groups = await prisma.course.groupBy({
            by: ['category'],
            _count: { category: true }
        })
        return Object.fromEntries(groups.map(g => [g.category, g._count.category]))
    }

    async getAvgCreditsPerCategory() {
        const groups = await prisma.course.groupBy({
            by: ['category'],
            _avg: { credits: true }
        })
        return Object.fromEntries(
            groups.map(g => [g.category, +g._avg.credits.toFixed(2)])
        )
    }

    async getTop3CoursesByRegistrations() {
        const rows = await prisma.$queryRaw`
      SELECT courseId, SUM(json_array_length(registeredStudents)) as count
      FROM Section
      GROUP BY courseId
      ORDER BY count DESC
      LIMIT 3;
    `
        return rows.map(r => ({ courseId: r.courseId, count: r.count }))
    }

    async getAvgGpaPerCourse() {
        const rows = await prisma.$queryRaw`
      SELECT courseId,
        ROUND(AVG(
          CASE
            WHEN grade LIKE 'A%' THEN 4
            WHEN grade LIKE 'B%' THEN 3
            WHEN grade LIKE 'C%' THEN 2
            WHEN grade LIKE 'D%' THEN 1
            ELSE 0 END
        ), 2) as avgGpa
      FROM Grade
      GROUP BY courseId;
    `
        return Object.fromEntries(rows.map(r => [r.courseId, r.avgGpa]))
    }

    async getTop3StudentsByGpa() {
        const rows = await prisma.$queryRaw`
      SELECT userId,
        ROUND(AVG(
          CASE
            WHEN grade LIKE 'A%' THEN 4
            WHEN grade LIKE 'B%' THEN 3
            WHEN grade LIKE 'C%' THEN 2
            WHEN grade LIKE 'D%' THEN 1
            ELSE 0 END
        ), 2) as avgGpa
      FROM Grade
      GROUP BY userId
      ORDER BY avgGpa DESC
      LIMIT 3;
    `
        return rows.map(r => ({ userId: r.userId, avgGpa: r.avgGpa }))
    }

    async getTopInstructorBySections() {
        const groups = await prisma.section.groupBy({
            by: ['instructor'],
            _count: { instructor: true }
        })
        groups.sort((a, b) => b._count.instructor - a._count.instructor)
        const top = groups[0]
        return { instructor: top.instructor, count: top._count.instructor }
    }
}

export default new Repo()
