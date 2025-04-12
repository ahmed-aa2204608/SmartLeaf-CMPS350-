document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const coursesData = JSON.parse(localStorage.getItem("courses")) || { courses: [] };
  const courses = coursesData || [];
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
    (c.category === student.major || c.category === "General") &&
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
  tableBody.innerHTML = rows
    .map(row => `
      <tr>
        <td>${row.name}</td>
        <td>${row.status}</td>
        <td>${row.grade}</td>
      </tr>
    `)
    .join("");

const scheduleTableBody = document.getElementById("scheduleTableBody");
if (!scheduleTableBody) return;

const timeLabels = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00"
];

function getTimingId(rowIndex, dayIndex) {
  if ([0, 2, 4].includes(dayIndex)) {
    return rowIndex + 1;
  } else if ([1, 3].includes(dayIndex)) {
    return rowIndex + 5;
  } else {
    return null;
  }
}

let scheduleHTML = "";

for (let rowIndex = 0; rowIndex < timeLabels.length; rowIndex++) {
  let rowCells = `<td>${timeLabels[rowIndex]}</td>`;

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const timingId = getTimingId(rowIndex, dayIndex);
    let cellContent = "";
    
    if (timingId) {
      const matchedCourses = [];
      student.registeredClasses.forEach(sectionId => {
        courses.forEach(courseObj => {
          const foundSection = courseObj.sections.find(sec => sec.id === sectionId);
          if (foundSection && foundSection.timing === timingId) {
            matchedCourses.push(courseObj.name);
          }
        });
      });

      const uniqueCourses = [...new Set(matchedCourses)];
      if (uniqueCourses.length > 0) {
        cellContent = uniqueCourses.join("<br/>");
      }
    }
    
    let cellHTML = "";
    if (cellContent) {
      cellHTML = `<td style="background-color: #168d3e; color: #fff;">${cellContent}</td>`;
    } else {
      cellHTML = `<td>${cellContent}</td>`;
    }
    
    rowCells += cellHTML;
  }

  scheduleHTML += `<tr>${rowCells}</tr>`;
}

scheduleTableBody.innerHTML = scheduleHTML;

});
