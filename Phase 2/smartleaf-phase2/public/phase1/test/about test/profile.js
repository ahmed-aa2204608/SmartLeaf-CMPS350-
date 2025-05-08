// profile.js
export function calculateGPA(student) {
    const gradeMapping = { A: 4, B: 3, C: 2, D: 1 };
    let totalPoints = 0;
    let count = 0;
    student.grades.forEach(gradeObj => {
      if (gradeMapping.hasOwnProperty(gradeObj.grade)) {
        totalPoints += gradeMapping[gradeObj.grade];
        count++;
      }
    });
    return count > 0 ? totalPoints / count : 0;
  }
  
  export function getCurrentCredits(student, courses) {
    let totalCredits = 0;
    student.registeredCourses.forEach(courseId => {
      const regCourse = courses.find(course => course.id === courseId);
      if (regCourse) {
        totalCredits += regCourse.credits;
      }
    });
    return totalCredits;
  }
  
  export function getProfileInfoHTML(user, student, courses) {
    let infoHTML = `<h3>Basic Information</h3>
      <div class="info-item">
        <span class="info-label">Full Name:</span>
        <span class="info-value">${user.name || "Unknown Name"}</span>
      </div>
      <div class="info-item">
        <span class="info-label">ID:</span>
        <span class="info-value">${user.id || "Unknown ID"}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Role:</span>
        <span class="info-value">${user.role || "Unknown Role"}</span>
      </div>`;
    
    if (user.role === "student") {
      const currentCredits = getCurrentCredits(student, courses);
      const gpa = calculateGPA(student).toFixed(2);
      infoHTML += `<div class="info-item">
        <span class="info-label">GPA:</span>
        <span class="info-value">${gpa}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Credit Hours:</span>
        <span class="info-value">${currentCredits}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Major:</span>
        <span class="info-value">${student.major || "N/A"}</span>
      </div>`;
    } else if (user.role === "instructor") {
      infoHTML += `<div class="info-item">
        <span class="info-label">Expertise:</span>
        <span class="info-value">${(user.expertise && user.expertise.length > 0) ? user.expertise.join(", ") : "N/A"}</span>
      </div>`;
    }
    // For every role, include a password change link.
    infoHTML += `<div class="info-item">
        <span class="info-label">Password:</span>
        <a href="changepass.html" class="info-value change-password">Change password</a>
      </div>`;
    
    return infoHTML;
  }
  
  export function getNavMenuHTML(user) {
    let navMenuHTML = "";
    if (user.role === "student") {
      navMenuHTML = `
        <a href="/U2U3/student.html" class="nav-item active"><i class="fas fa-home"></i></a>
        <a href="/learning-path/course-schedule.html" id="learningPath" class="nav-item"><i class="fas fa-graduation-cap"></i></a>
        <a href="about.html" class="nav-item"><i class="fas fa-user"></i></a>
        <a href="#" class="nav-item"><i class="fas fa-envelope"></i></a>
        <a href="/Login/index.html" class="nav-item"><i class="fas fa-sign-out-alt"></i></a>
      `;
    } else if (user.role === "instructor") {
      navMenuHTML = `
        <a href="/instructor/instructor.html" class="nav-item active"><i class="fas fa-home"></i></a>
        <a href="/learningPath/course-schedule.html" class="nav-item"><i class="fa-solid fa-calendar-days"></i></a>
        <a href="about.html" class="nav-item"><i class="fas fa-user"></i></a>
        <a href="/Login/index.html" class="nav-item"><i class="fas fa-sign-out-alt"></i></a>
      `;
    } else if (user.role === "admin") {
      navMenuHTML = `
        <a href="/admin/admin.html" class="nav-item active"><i class="fas fa-home"></i></a>
        <a href="/learningPath/course-schedule.html" class="nav-item"><i class="fa-solid fa-calendar-days"></i></a>
        <a href="about.html" class="nav-item"><i class="fas fa-user"></i></a>
        <a href="/Login/index.html" class="nav-item"><i class="fas fa-sign-out-alt"></i></a>
      `;
    }
    return navMenuHTML;
  }
  