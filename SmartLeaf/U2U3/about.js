document.addEventListener('DOMContentLoaded', () => {
  const userJSON = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem("users")) || [];
  
  if (!userJSON) {
    console.error("No user data found in localStorage.");
    return;
  }
  const user = JSON.parse(userJSON);
  const student = users.find(u => u.id === user.id);
  const profilePicElem = document.querySelector('.profile-picture');
  const defaultProfilePicURL = "";
  profilePicElem.src =
    (user.profilePic && user.profilePic.trim() !== "")
      ? user.profilePic
      : defaultProfilePicURL;

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
    const coursesJSON = localStorage.getItem('courses');
    let courses = [];
    if (coursesJSON) {
      const parsedData = JSON.parse(coursesJSON);
      courses = parsedData.courses ? parsedData.courses : parsedData;
    }

    let currentCredits = 0;
    const courseIds = student.registeredCourses;
    courseIds.forEach(courseId => {
      const regCourse = courses.find(course => course.id === courseId);
      if (regCourse) {
        currentCredits += regCourse.credits;
      } else {
        console.warn(`Course with id ${courseId} not found in courses list.`);
      }
    });

    function calculateGPA(student) {
      const gradeMapping = { "A": 4, "B": 3, "C": 2, "D": 1 };
      let totalPoints = 0, count = 0;
      student.grades.forEach(gradeObj => {
        if (gradeMapping.hasOwnProperty(gradeObj.grade)) {
          totalPoints += gradeMapping[gradeObj.grade];
          count++;
        } else {
          console.warn("Grade " + gradeObj.grade + " is not recognized.");
        }
      });
      return count > 0 ? (totalPoints / count) : 0;
    }

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
      <span class="info-value">${student.major}</span>
    </div>`;
  } else if (user.role === "instructor") {
    infoHTML += `<div class="info-item">
      <span class="info-label">Expertise:</span>
      <span class="info-value">${(user.expertise && user.expertise.length > 0) ? user.expertise.join(", ") : "N/A"}</span>
    </div>`;
  } else if (user.role === "admin") {
  }

  infoHTML += `<div class="info-item">
      <span class="info-label">Password:</span>
      <a href="changepass.html" class="info-value change-password">Change password</a>
    </div>`;

  const profileInfoContainer = document.querySelector('.profile-basic-info');
  if (profileInfoContainer) {
    profileInfoContainer.innerHTML = infoHTML;
  }


  const navMenuElem = document.querySelector('.nav-menu');
  let navMenuHTML = "";
  if (user.role === "student") {
    navMenuHTML = `
      <a href="student.html" class="nav-item active"><i class="fas fa-home"></i></a>
      <a href="learning-path.html" id="learningPath" class="nav-item"><i class="fas fa-graduation-cap"></i></a>
      <a href="about.html" class="nav-item"><i class="fas fa-user"></i></a>
      <a href="#" class="nav-item"><i class="fas fa-envelope"></i></a>
      <a href="index.html" class="nav-item"><i class="fas fa-sign-out-alt"></i></a>
    `;
  } else if (user.role === "instructor") {
    navMenuHTML = `
      <a href="#" class="nav-item active"><i class="fas fa-home"></i></a>
      <a href="course-schedule.html" class="nav-item"><i class="fa-solid fa-calendar-days"></i></a>
      <a href="about.html" class="nav-item"><i class="fas fa-user"></i></a>
      <a href="index.html" class="nav-item"><i class="fas fa-sign-out-alt"></i></a>
    `;
  } else if (user.role === "admin") {
    navMenuHTML = `
      <a href="#" class="nav-item active"><i class="fas fa-home"></i></a>
      <a href="course-schedule.html" class="nav-item"><i class="fa-solid fa-calendar-days"></i></a>
      <a href="about.html" class="nav-item"><i class="fas fa-user"></i></a>
      <a href="index.html" class="nav-item"><i class="fas fa-sign-out-alt"></i></a>
    `;
  }
  if (navMenuElem) {
    navMenuElem.innerHTML = navMenuHTML;
  }
});
