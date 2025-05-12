'use client'
import { useState } from 'react'
import CourseList from './CourseList'
import CreateCourseForm from './CreateCourseForm'
import CreateSectionForm from './CreateSectionForm.jsx'
import "@/public/phase1/css/styles.css";

export default function AdminContent({ initialCourses }) {
    const [view, setView] = useState('list')
    const [courses, setCourses] = useState(initialCourses)
    const [selectedCourse, setSelectedCourse] = useState(null)

    return (
        <section className="admin-content">
            {view === 'list' && (
                <CourseList
                    courses={courses}
                    onCreate={() => setView('createCourse')}
                    onAddSection={(course) => { setSelectedCourse(course); setView('createSection') }}
                />
            )}

            {view === 'createCourse' && (
                <CreateCourseForm
                    onDone={(newCourse) => {
                        setCourses([newCourse, ...courses]);
                        setView('list');
                    }}
                    onCancel={() => setView('list')}
                />
            )}

            {view === 'createSection' && selectedCourse && (
                <CreateSectionForm
                    course={selectedCourse}
                    onDone={(updatedCourse) => {
                        setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                        setView('list');
                    }}
                    onCancel={() => setView('list')}
                />
            )}
        </section>
    )
}