"use client";
import { useState } from "react";
import { registerForSection } from "../actions/server-actions";

export default function RegisterModal({ course, studentId, onClose }) {
  const [message, setMessage] = useState("");

  async function handleRegister(sectionId) {
    const res = await registerForSection(studentId, course.id, sectionId);
    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage("Successfully registered!");
      setTimeout(onClose, 1500); // optional delay
    }
  }

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>Select a Section</h3>
        {course.sections?.map((section) => {
          const registered = Array.isArray(section.registeredStudents)
            ? section.registeredStudents
            : JSON.parse(section.registeredStudents || "[]");

          const isFull = registered.length >= section.capacity;

          return (
            <div key={section.id} className="section-option">
              <p><strong>Instructor:</strong> {section.instructor}</p>
              <p><strong>Timing:</strong> {section.timing}</p>
              <p><strong>Capacity:</strong> {registered.length}/{section.capacity}</p>
              <button
                disabled={isFull}
                onClick={() => handleRegister(section.id)}
                className="btn-register-section"
              >
                {isFull ? "Full" : "Register"}
              </button>
            </div>
          );
        })}
        {console.log("hello")}
        {console.log(course)}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
