document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const tableBody = document.getElementById("learningPathTableBody");
    const student = users.find(u => u.username === currentUser.username && u.role === "student");
  
    if (!student) return;
  
    const rows = [];
  
    if (student.grades && student.grades.length > 0) {
      student.grades.forEach(g => {
        const course = courses.find(c => c.id === g.courseId);
        if (course) {
          rows.push({
            name: course.name,
            status: "Completed",
            grade: g.grade
          });
        }
      });
    }
  
    student.registeredCourses.forEach(courseId => {
      if (!student.grades.some(g => g.courseId === courseId)) {
        const course = courses.find(c => c.id === courseId);
        if (course) {
          rows.push({
            name: course.name,
            status: "In Progress",
            grade: "-"
          });
        }
      }
    });
  
    const pendingCourses = courses.filter(c =>
      !student.registeredCourses.includes(c.id) &&
      !student.grades.some(g => g.courseId === c.id) &&
      c.openForRegistration
    );
  
    pendingCourses.forEach(course => {
      rows.push({
        name: course.name,
        status: "Pending",
        grade: "-"
      });
    });
    tableBody.innerHTML = rows.map(row => `
      <tr>
        <td>${row.name}</td>
        <td>${row.status}</td>
        <td>${row.grade}</td>
      </tr>
    `).join("");
  });
  