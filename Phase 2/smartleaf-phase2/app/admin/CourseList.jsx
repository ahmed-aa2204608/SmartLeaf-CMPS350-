'use client'
import "@/public/phase1/css/styles.css";
export default function CourseList({ courses, onCreate, onAddSection }) {
    return (
        <>
            <div className="list-header">
                <h2>All Courses</h2>
                <button onClick={onCreate} className="btn-create">+ Create Course</button>
            </div>
            <ul className="course-list">
                {courses.map(course => (
                    <li key={course.id} className="course-card">
                        <div>
                            <strong>{course.id}</strong> – {course.name}
                        </div>
                        <button
                            onClick={() => onAddSection(course)}
                            className="btn-create-section"
                        >+ Add Section</button>
                    </li>
                ))}
            </ul>
        </>
    )
}