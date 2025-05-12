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

    const cookieStore = await cookies();
    cookieStore.set('user', JSON.stringify({ id: user.id, role: user.role }), {
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
  async getAllCourses() {
    return await prisma.course.findMany({
      include: {
        sections: true,
      },
    });
  }

  async searchCourses(query) {
    return await prisma.course.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { category: { contains: query } },
        ],
      },
      include: {
        sections: {
          include: {
            registeredStudents: true,   //need to change to sections: true
          }
        }
      },
    });
  }



  async getCurrentUser() {
    const cookieStore = await cookies();
    const raw = cookieStore.get('user')?.value
    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch (err) {
      console.error('Failed to parse user cookie:', err)
      return null
    }
  }

  async registerForSection(currentUserId, courseId, sectionId) {
    const student = await prisma.user.findUnique({ where: { id: currentUserId } });
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    const section = await prisma.section.findUnique({ where: { id: sectionId } });

    if (!student || !course || !section) return { error: "Invalid data." };
    if (!course.openForRegistration) return { error: "Course not open for registration." };

    const registeredStudents = Array.isArray(section.registeredStudents)
      ? section.registeredStudents
      : JSON.parse(section.registeredStudents || "[]");

    if (registeredStudents.includes(currentUserId))
      return { error: "Already registered for this section." };

    if (registeredStudents.length >= section.capacity)
      return { error: "Section full." };

    const completedCourses = Array.isArray(student.completedCourses)
      ? student.completedCourses
      : JSON.parse(student.completedCourses || "[]");

    if (course.prerequisite && !completedCourses.includes(course.prerequisite))
      return { error: "Prerequisite not met." };

    if (course.category !== "General" && course.category !== student.major)
      return { error: "Course category doesn't match your major." };

    const registeredCourses = Array.isArray(student.registeredCourses)
      ? student.registeredCourses
      : JSON.parse(student.registeredCourses || "[]");

    if (registeredCourses.includes(courseId))
      return { error: "Already registered for this course." };

    if (completedCourses.includes(courseId))
      return { error: "You already completed this course." };

    // Count current credits
    let currentCredits = 0;
    for (const cId of registeredCourses) {
      const c = await prisma.course.findUnique({ where: { id: cId } });
      if (c) currentCredits += c.credits;
    }

    if (currentCredits + course.credits > 9)
      return { error: "Credit limit exceeded (max 9)." };

    // Check timing conflict
    const registeredClasses = Array.isArray(student.registeredClasses)
      ? student.registeredClasses
      : JSON.parse(student.registeredClasses || "[]");

    const existingSections = await prisma.section.findMany({
      where: { id: { in: registeredClasses } }
    });

    const hasConflict = existingSections.some(s => s.timing === section.timing);
    if (hasConflict)
      return { error: "Time conflict with another class." };

    // Update section
    registeredStudents.push(currentUserId);
    await prisma.section.update({
      where: { id: sectionId },
      data: {
        registeredStudents: registeredStudents
      }
    });

    // Update user
    registeredCourses.push(courseId);
    registeredClasses.push(sectionId);
    await prisma.user.update({
      where: { id: currentUserId },
      data: {
        registeredCourses: registeredCourses,
        registeredClasses: registeredClasses
      }
    });

    return { success: true };
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

  async createCourse(formData) {
    // parse course fields
    const id = formData.get('id')
    const name = formData.get('name')
    const category = formData.get('category')
    const prerequisite = formData.get('prerequisite') || null
    const openForRegistration = formData.get('openForRegistration') === 'on'
    const stage = formData.get('stage')
    // parse sections JSON
    const sectionsJson = formData.get('sections')
    const sections = sectionsJson ? JSON.parse(sectionsJson) : []

    const created = await prisma.course.create({
      data: {
        id, name, category, credits: 0, prerequisite,
        openForRegistration, stage,
        sections: {
          create: sections.map(s => ({
            id: s.id,
            instructor: s.instructor,
            timing: s.timing,
            capacity: s.capacity,
            minRegistrations: s.minRegistrations,
            registeredStudents: [],
            pendingStudents: [],
            approved: s.approved,
          }))
        }
      },
      include: { sections: true }
    })
    return created
  }

  async createSection(courseId, formData) {
    const id = formData.get('id')
    const instructor = formData.get('instructor')
    const timing = parseInt(formData.get('timing'), 10)
    const capacity = parseInt(formData.get('capacity'), 10)
    const minRegistrations = parseInt(formData.get('minRegistrations'), 10)
    const approved = formData.get('approved') === 'on'

    return prisma.section.create({
      data: {
        id,
        courseId,
        instructor,
        timing,
        capacity,
        minRegistrations,
        registeredStudents: [],
        pendingStudents: [],
        approved,
      }
    })
  }
}

export default new Repo()
