// app/dashboard/page.jsx
import React from 'react'
import {
  getTotalStudents,
  getTotalInstructors,
  getTotalCourses,
  getTotalSections,
  getTotalOpenCourses,
  getAvgSectionCapacity,
  getApprovalRateSections,
  getTotalPendingStudents,
  getStudentsPerMajor,
  getCoursesByCategoryCount,
  getAvgCreditsPerCategory,
  getTop3CoursesByRegistrations,
  getAvgGpaPerCourse,
  getTop3StudentsByGpa,
  getTopInstructorBySections,
} from './actions/server-actions'

export default async function DashboardStats() {
  const [
    totalStudents,
    totalInstructors,
    totalCourses,
    totalSections,
    totalOpenCourses,
    avgSectionCapacity,
    approvalRateSections,
    totalPendingStudents,
    studentsPerMajor,
    coursesByCategoryCount,
    avgCreditsPerCategory,
    top3CoursesByRegistrations,
    avgGpaPerCourse,
    top3StudentsByGpa,
    topInstructorBySections,
  ] = await Promise.all([
    getTotalStudents(),
    getTotalInstructors(),
    getTotalCourses(),
    getTotalSections(),
    getTotalOpenCourses(),
    getAvgSectionCapacity(),
    getApprovalRateSections(),
    getTotalPendingStudents(),
    getStudentsPerMajor(),
    getCoursesByCategoryCount(),
    getAvgCreditsPerCategory(),
    getTop3CoursesByRegistrations(),
    getAvgGpaPerCourse(),
    getTop3StudentsByGpa(),
    getTopInstructorBySections(),
  ])

  const totalClosedCourses = totalCourses - totalOpenCourses

  return (
    <main className="container fade-in">
      <h1 className="page-title">SmartLeaf Statistics</h1>
      <section className="stats-grid">
        <article className="card">
          <h2 className="stat-title">Total Students</h2>
          <p className="stat-value">{totalStudents}</p>
        </article>

        <article className="card">
          <h2 className="stat-title">Total Instructors</h2>
          <p className="stat-value">{totalInstructors}</p>
        </article>

        <article className="card">
          <h2 className="stat-title">Total Courses</h2>
          <p className="stat-value">{totalCourses}</p>
        </article>

        <article className="card">
          <h2 className="stat-title">Total Sections</h2>
          <p className="stat-value">{totalSections}</p>
        </article>

        <article className="card">
          <h2 className="stat-title">Open / Closed Courses</h2>
          <p className="stat-value">
            {totalOpenCourses} / {totalClosedCourses}
          </p>
        </article>

        <article className="card">
          <h2 className="stat-title">Avg Section Capacity</h2>
          <p className="stat-value">{avgSectionCapacity}</p>
        </article>

        <article className="card">
          <h2 className="stat-title">Pending Students (all)</h2>
          <p className="stat-value">{totalPendingStudents}</p>
        </article>

        <article className="card">
          <h2 className="stat-title">Section Approval Rate</h2>
          <p className="stat-value">{approvalRateSections}%</p>
        </article>

        <article className="card">
          <h2 className="stat-title">Students per Major</h2>
          <ul className="list-inside list-disc">
            {Object.entries(studentsPerMajor).map(([major, count]) => (
              <li key={major}>
                <strong>{major}</strong>: {count}
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2 className="stat-title">Courses per Category</h2>
          <ul className="list-inside list-disc">
            {Object.entries(coursesByCategoryCount).map(([cat, count]) => (
              <li key={cat}>
                <strong>{cat}</strong>: {count}
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2 className="stat-title">Avg Credits per Category</h2>
          <ul className="list-inside list-disc">
            {Object.entries(avgCreditsPerCategory).map(([cat, avg]) => (
              <li key={cat}>
                <strong>{cat}</strong>: {avg}
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2 className="stat-title">Top 3 Courses by Registrations</h2>
          <ol className="list-inside list-decimal">
            {top3CoursesByRegistrations.map(({ courseId, count }) => (
              <li key={courseId}>
                {courseId}: {count}
              </li>
            ))}
          </ol>
        </article>

        <article className="card">
          <h2 className="stat-title">Average GPA per Course</h2>
          <ul className="list-inside list-disc">
            {Object.entries(avgGpaPerCourse).map(([cid, gpa]) => (
              <li key={cid}>
                {cid}: {gpa}
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2 className="stat-title">Top 3 Students by GPA</h2>
          <ol className="list-inside list-decimal">
            {top3StudentsByGpa.map(({ userId, avgGpa }) => (
              <li key={userId}>
                {userId}: {avgGpa}
              </li>
            ))}
          </ol>
        </article>

        <article className="card">
          <h2 className="stat-title">Top Instructor by Sections</h2>
          <p className="stat-value">
            {topInstructorBySections.instructor} (
            {topInstructorBySections.count})
          </p>
        </article>
      </section>
    </main>
  )
}
