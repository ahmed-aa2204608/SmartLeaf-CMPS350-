
"use client";

import { useEffect, useState } from "react";
import { searchCourses } from "../actions/server-actions";
import RegisterModal from "./register-modal";

export default function CourseSearch({ studentId }) {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    searchCourses(query).then(setCourses);
  }, [query]);

  return (
    <section className="courses-section">
      <h2 className="section-title">Courses</h2>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by course name or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <i className="fas fa-search search-icon"></i>
      </div>
      <br></br>
      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-details">
              <h3>{course.name}</h3>
              <p>Instructor: Multiple</p>
              <span className="course-category">{course.category}</span>
            </div>
            <div className="course-actions">
              <button className="btn-register" onClick={() => setSelectedCourse(course)}>
                Register
              </button>
              {selectedCourse && (
                <RegisterModal
                  course={selectedCourse}
                  studentId={studentId}
                  onClose={() => setSelectedCourse(null)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
