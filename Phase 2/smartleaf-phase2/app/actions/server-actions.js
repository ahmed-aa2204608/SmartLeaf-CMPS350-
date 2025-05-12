'use server'

import Repo from '../repo/repo'

export async function login(prevState, formData) {
    return await Repo.login(prevState, formData)
}

export async function getCurrentUser() {
    return await Repo.getCurrentUser()
}

export async function registerForSection(userId, courseId, sectionId) {
    return await Repo.registerForSection(userId, courseId, sectionId)
}

export async function searchCourses(query) {
    if (!query || query.trim() === "") {
        return await Repo.getAllCourses();
    }
    return await Repo.searchCourses(query);
}

export async function getTotalStudents() {
    return await Repo.getTotalStudents()
}

export async function getTotalInstructors() {
    return await Repo.getTotalInstructors()
}

export async function getTotalCourses() {
    return await Repo.getTotalCourses()
}

export async function getTotalSections() {
    return await Repo.getTotalSections()
}

export async function getTotalOpenCourses() {
    return await Repo.getTotalOpenCourses()
}

export async function getAvgSectionCapacity() {
    return await Repo.getAvgSectionCapacity()
}

export async function getApprovalRateSections() {
    return await Repo.getApprovalRateSections()
}

export async function getTotalPendingStudents() {
    return await Repo.getTotalPendingStudents()
}

export async function getStudentsPerMajor() {
    return await Repo.getStudentsPerMajor()
}

export async function getCoursesByCategoryCount() {
    return await Repo.getCoursesByCategoryCount()
}

export async function getAvgCreditsPerCategory() {
    return await Repo.getAvgCreditsPerCategory()
}

export async function getTop3CoursesByRegistrations() {
    return await Repo.getTop3CoursesByRegistrations()
}

export async function getAvgGpaPerCourse() {
    return await Repo.getAvgGpaPerCourse()
}

export async function getTop3StudentsByGpa() {
    return await Repo.getTop3StudentsByGpa()
}

export async function getTopInstructorBySections() {
    return await Repo.getTopInstructorBySections()
}
