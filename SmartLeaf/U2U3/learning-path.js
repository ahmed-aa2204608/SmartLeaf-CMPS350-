document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    const tableBody = document.getElementById("learningPathTableBody");
    const rows = [];
    if (currentUser.grades && currentUser.grades.length > 0) {
      currentUser.grades.forEach(g => {
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
    currentUser.registeredCourses.forEach(courseId => {
      if (!currentUser.grades.some(g => g.courseId === courseId)) {
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
      !currentUser.registeredCourses.includes(c.id) &&
      !currentUser.grades.some(g => g.courseId === c.id) &&
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
  