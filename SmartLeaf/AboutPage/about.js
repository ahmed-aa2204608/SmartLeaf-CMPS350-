document.addEventListener('DOMContentLoaded', () => {
  const userJSON = localStorage.getItem('currentUser');
  if (!userJSON) {
    console.error("No user data found in localStorage.");
    return;
  }
  const user = JSON.parse(userJSON);

  const profilePicElem = document.querySelector('.profile-picture');
  const defaultProfilePicURL = "";
  profilePicElem.src =
    (user.profilePic && user.profilePic.trim() !== "")
      ? user.profilePic
      : defaultProfilePicURL;
  console.log(user.profilePic);

  const infoItems = document.querySelectorAll('.profile-basic-info .info-item');
  if (infoItems.length >= 3) {
    const nameValue = infoItems[0].querySelector('.info-value');
    if (nameValue) {
      nameValue.textContent = user.name || "Unknown Name";
    }
    const idValue = infoItems[1].querySelector('.info-value');
    if (idValue) {
      idValue.textContent = user.id || "Unknown ID";
    }
    const roleValue = infoItems[2].querySelector('.info-value');
    if (roleValue) {
      roleValue.textContent = user.role || "Unknown Role";
    }

    if (user.role === "student") {
      if (infoItems.length < 5) {
        console.warn("Expected GPA and Credit Hours info items for a student.");
      } else {
        const coursesJSON = localStorage.getItem('courses');
        let courses = [];
        if (coursesJSON) {
          const parsedData = JSON.parse(coursesJSON);
          courses = parsedData.courses ? parsedData.courses : parsedData;
        }
        let currentCredits = 0;
        const courseIds = user.registeredCourses;
        courseIds.forEach(courseId => {
          const regCourse = courses.find(course => course.id === courseId);
          if (regCourse) {
            currentCredits += regCourse.credits;
          } else {
            console.warn(`Course with id ${courseId} not found in courses list.`);
          }
        });
        console.log("Current Credits: ", currentCredits);

        function calculateGPA(student) {
          const gradeMapping = { "A": 4, "B": 3, "C": 2, "D": 1 };
          let totalPoints = 0;
          let count = 0;
          student.grades.forEach(gradeObj => {
            if (gradeMapping.hasOwnProperty(gradeObj.grade)) {
              totalPoints += gradeMapping[gradeObj.grade];
              count++;
            } else {
              console.warn("Grade " + gradeObj.grade + " is not recognized.");
            }
          });
          return count > 0 ? totalPoints / count : 0;
        }
        const gpaValue = infoItems[3].querySelector('.info-value');
        const gpaLabel = infoItems[3].querySelector('.info-label');
        if (gpaValue) {
          gpaValue.textContent = calculateGPA(user).toFixed(2);
          gpaLabel.textContent = "GPA:";
        }
        const creditValue = infoItems[4].querySelector('.info-value');
        const creditLabel = infoItems[4].querySelector('.info-label');
        if (creditValue) {
          creditValue.textContent = currentCredits;
          creditLabel.textContent = "Credit Hours:";
        }
      }
    } else if (user.role === "instructor") {
      if (infoItems.length >= 4) {
        const expertiseValue = infoItems[3].querySelector('.info-value');
        if (expertiseValue) {
          expertiseValue.textContent =
            "Expertise: " + (user.expertise ? user.expertise.join(", ") : "N/A");
        }
      }
      if (infoItems.length >= 5) {
        infoItems[4].style.display = "none";
      }
    } else if (user.role === "admin") {
      if (infoItems.length >= 4) {
        infoItems[3].style.display = "none";
      }
      if (infoItems.length >= 5) {
        infoItems[4].style.display = "none";
      }
    }
  } else {
    console.warn("Profile Basic Info items are missing or have changed order.");
  }
});
