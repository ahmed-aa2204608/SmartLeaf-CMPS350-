import "@/public/phase1/css/styles.css";

import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import AdminContent from './AdminContent'
import { getCurrentUser, getAllCourses } from '../actions/server-actions2'

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (user.role !== 'admin') {
    return <p>Unauthorized</p>
  }

  const courses = await getAllCourses()

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header user={user} />
        <AdminContent initialCourses={courses} />
      </div>
    </div>
  )
}