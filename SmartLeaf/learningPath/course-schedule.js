document.addEventListener("DOMContentLoaded", function () {
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    const tableBody = document.getElementById("courseScheduleTableBody");
    const rows = [];
    courses.forEach(c => {
        c.sections.forEach(s => {
            rows.push({
                course: c.name,
                section: s.id,
                instructor: s.instructor,
                timing: s.timing
              });
        })
        
        
    });

    tableBody.innerHTML = rows.map(row => `
      <tr>
        <td>${row.course}</td>
        <td>${row.section}</td>
        <td>${row.instructor}</td>
        <td>${row.timing}</td>
      </tr>
    `).join("");
  });
  