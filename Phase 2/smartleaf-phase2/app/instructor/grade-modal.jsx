"use client";
import { useEffect, useState } from "react";
import { getStudentById, submitGrade } from "../actions/server-actions";
import ReactDOM from "react-dom";

export default function GradeModal({ course, section, onClose }) {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    async function fetchStudents() {
      const fetched = await Promise.all(
        section.registeredStudents.map(id => getStudentById(id))
      );
      setStudents(fetched);
    }
    fetchStudents();
  }, [section]);

  function handleChange(studentId, value) {
    setGrades(prev => ({ ...prev, [studentId]: value }));
  }

  async function handleSubmit(studentId) {
    const grade = grades[studentId];
    if (!grade) return alert("Please select a grade");

    await submitGrade({ studentId, courseId: course.id, grade });
    alert("Grade submitted");
    onClose();
  }

  const modalContent = (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>Grade Students</h3>
        {students.length === 0 ? (
          <p>No students registered in this section!</p>
        ) : (
          students.map((student) => (
            <div key={student.id} className="section-option">
              <p><strong>{student.name}</strong></p>
              <label>Grade:
                <select
                  value={grades[student.id] || ""}
                  onChange={(e) => handleChange(student.id, e.target.value)}
                  className="grade-input"
                >
                  <option value="">Select Grade</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </label>
              <button onClick={() => handleSubmit(student.id)} className="btn-submit-grade">
                Submit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
