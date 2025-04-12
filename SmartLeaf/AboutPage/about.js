document.addEventListener('DOMContentLoaded', () => {
  const userJSON = localStorage.getItem('currentUser');

  if (!userJSON) {
    console.error("No user data found in localStorage.");
    return;
  }

  const user = JSON.parse(userJSON);

  const profilePicElem = document.querySelector('.profile-picture');

  const defaultProfilePicURL = "";
  
  profilePicElem.src = (user.profilePic && user.profilePic.trim() !== "") 
                            ? user.profilePic 
                            : defaultProfilePicURL;
  console.log(user.profilePic)
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
      console.log(regCourse)
      if (regCourse) {
        currentCredits += regCourse.credits;
      } else {
        console.warn(`Course with id ${courseId} not found in courses list.`);
      }
    });

    console.log("Current Credits: ", currentCredits);

    function calculateGPA(student) {
      const gradeMapping = {
        "A": 4,
        "B": 3,
        "C": 2,
        "D": 1
      };
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

    console.log(calculateGPA(user))
    const gpaValue = infoItems[3].querySelector('.info-value');
    if (gpaValue) {
      gpaValue.textContent = calculateGPA(user) || "Unknown Role";
    }

    console.log(currentCredits)
    const creditValue = infoItems[4].querySelector('.info-value');
    if (creditValue) {
      creditValue.textContent = currentCredits || "0";
    }
  } else {
    console.warn("Profile Basic Info items are missing or have changed order.");
  }
});
