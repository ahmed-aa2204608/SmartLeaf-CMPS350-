'use server'
import Repo from '../repo/repo'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData) {
    return Repo.login(null, formData)
}
export async function getCurrentUser() {
    return Repo.getCurrentUser()
}
export async function getAllCourses() {
    return Repo.getAllCourses()
}
export async function searchCourses(q) {
    return q?.trim() ? Repo.searchCourses(q) : Repo.getAllCourses()
}
export async function createCourse(fd) {
    return Repo.createCourse(fd)
}
export async function createSection(courseId, fd) {
    return Repo.createSection(courseId, fd)
}