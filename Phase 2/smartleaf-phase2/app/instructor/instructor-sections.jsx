"use client";
import { useEffect, useState } from "react";
import { getInstructorSections } from "../actions/server-actions";
import GradeModal from "./grade-modal";

export default function InstructorSections({ username }) {
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getInstructorSections(username).then(setSections);
  }, [username]);

  if (!sections.length) {
    return <p>No sections assigned to you.</p>;
  }

  return (
    <div className="course-list">
      {sections.map(({ course, section }) => (
        <div key={section.id} className="course-card">
          <div className="course-details">
            <h3>{course.name} - {section.id}</h3>
            <p><strong>Timing:</strong> {section.timing}</p>
            <p><strong>Capacity:</strong> {section.capacity}</p>
            <p><strong>Registered Students:</strong> {section.registeredStudents?.length || 0}</p>
          </div>
          <div className="course-actions">
            <button className="btn-view-section" onClick={() => setSelected({ course, section })}>
              View Section
            </button>
          </div>
        </div>
      ))}
      {selected && (
        <GradeModal
          course={selected.course}
          section={selected.section}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
