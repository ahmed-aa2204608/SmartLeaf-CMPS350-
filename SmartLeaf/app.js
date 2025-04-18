document.addEventListener('DOMContentLoaded', function () {
    let courses = [];
    let users = [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')); 
    console.log(currentUser);
    const courseList = document.querySelector('.course-list');
    const searchInput = document.querySelector('.search-input');
    const allCoursesTab = document.querySelector('.tab-btn:nth-child(1)');
    const currentCoursesTab = document.querySelector('.tab-btn:nth-child(2)');
    

    //greet user by their name
    const greetUser = document.getElementById('greet');
    if (greetUser && currentUser?.name) {
    greetUser.textContent = `Hello, ${currentUser.name}!`;
    }


    if (currentUser.role === "student") {
      function calculateGPA(currentUser) {
        const gradeMapping = { "A": 4, "B": 3, "C": 2, "D": 1 };
        let totalPoints = 0, count = 0;
        currentUser.grades.forEach(gradeObj => {
          if (gradeMapping.hasOwnProperty(gradeObj.grade)) {
            totalPoints += gradeMapping[gradeObj.grade];
            count++;
          } else {
            console.warn("Grade " + gradeObj.grade + " is not recognized.");
          }
        });
        return count > 0 ? totalPoints / count : 0;
      }
    
      const gpa = calculateGPA(currentUser);
    
      let warnings = [];
      const hasDGrade = currentUser.grades.some(gradeObj => gradeObj.grade === "D");
      if (hasDGrade) {
        warnings.push("Warning: You have a course with a D grade.");
      }
      if (gpa < 2.50) {
        warnings.push(`Warning: Your overall GPA (${gpa.toFixed(2)}) is below 2.50.`);
      }
    
      let warningSection = document.querySelector(".warning-section");
      if (!warningSection) {
        warningSection = document.createElement("section");
        warningSection.className = "warning-section";
        const mainContent = document.querySelector(".main-content");
        const coursesSection = document.querySelector(".courses-section");
        if (mainContent && coursesSection) {
          mainContent.insertBefore(warningSection, coursesSection);
        } else {
          mainContent.appendChild(warningSection);
        }
      }
    
      if (warnings.length > 0) {
        warningSection.innerHTML = warnings.map(msg => `<p>${msg}</p>`).join("");
        warningSection.style.display = "block";
      } else {
        warningSection.style.display = "none";
      }
    }
    

    //get courses from local storage if available or from json
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
        courses = JSON.parse(storedCourses);  
        renderCourses(courses);  
    } else {
        fetch('/data/courses.json')
          .then(response => response.json())
          .then(data => {
            courses = data.courses;
            localStorage.setItem('courses', JSON.stringify(courses));  // Save to localStorage
            renderCourses(courses);
          })
          .catch(error => console.error('Error loading courses:', error));
    }

    //get users (mainly for students) from local storage if available or from json
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
    users = JSON.parse(storedUsers);
    } else {
    fetch('/data/users.json')
        .then(response => response.json())
        .then(data => {
            users = data.users;
            localStorage.setItem('users', JSON.stringify(users));
        })
        .catch(error => console.error('Error loading users:', error));
    }

    //gpa calculation
    if (currentUser.role === "student") {
      function calculateGPA(currentUser) {
        const student = users.find(u => u.id === currentUser.id);
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
        return count > 0 ? totalPoints / count : 0;
      }
    
      const gpa = calculateGPA(currentUser);
    
      let warnings = [];
      const student = users.find(u => u.id === currentUser.id);
      const hasDGrade = student.grades.some(gradeObj => gradeObj.grade === "D");
      if (hasDGrade) {
        warnings.push("Warning: You have a course with a D grade.");
      }
      if (gpa < 2.50) {
        warnings.push(`Warning: Your overall GPA (${gpa.toFixed(2)}) is below 2.50.`);
      }
    
      let warningSection = document.querySelector(".warning-section");
      if (!warningSection) {
        warningSection = document.createElement("section");
        warningSection.className = "warning-section";
        const mainContent = document.querySelector(".main-content");
        const coursesSection = document.querySelector(".courses-section");
        if (mainContent && coursesSection) {
          mainContent.insertBefore(warningSection, coursesSection);
        } else {
          mainContent.appendChild(warningSection);
        }
      }
    
      if (warnings.length > 0) {
        warningSection.innerHTML = warnings.map(msg => `<p>${msg}</p>`).join("");
        warningSection.style.display = "block";
      } else {
        warningSection.style.display = "none";
      }
    }

    //dynamic course stats 
    const statsSection = document.querySelector(".stats-section");
    if (statsSection) {

      const statCards = statsSection.querySelectorAll(".stat-card");
      if (statCards.length >= 2) {
        if(currentUser.role === "student") {
        const student = users.find(u => u.id === currentUser.id);
        statCards[0].querySelector(".stat-number").textContent =
        student.completedCourses ? student.completedCourses.length : 0;
        statCards[0].querySelector(".stat-label").textContent = "Courses completed";
        statCards[1].querySelector(".stat-number").textContent =
        student.registeredCourses ? student.registeredCourses.length : 0;
        statCards[1].querySelector(".stat-label").textContent = "Courses in progress";
        }
      }
    }
  
    // searching course
    searchInput.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase().trim();
      
      if (searchTerm === '') {
        // if search is empty, show all or current courses based on active tab
        if (currentCoursesTab.classList.contains('active')) {
          filterCoursesByStatus('In Progress');
        } else {
          renderCourses(courses);
        }
        return;
      }
      
      // filter courses by name or category
      const filteredCourses = courses.filter(course => {
        const matchesName = course.name.toLowerCase().includes(searchTerm);
        const matchesCategory = course.category.toLowerCase().includes(searchTerm);
        
        // if current tab is active, also filter by status
        if (currentCoursesTab.classList.contains('active')) {
          return (matchesName || matchesCategory) && course.status === 'In Progress';
        }
        
        return matchesName || matchesCategory;
      });
      
      renderCourses(filteredCourses);
    });
  
    // course tabs (all/current)
    allCoursesTab.addEventListener('click', function () {
      allCoursesTab.classList.add('active');
      currentCoursesTab.classList.remove('active');
      
      // apply search filter if there's a search term
      const searchTerm = searchInput.value.toLowerCase().trim();
      if (searchTerm === '') {
        renderCourses(courses);
      } else {
        // reload search to apply current filter
        searchInput.dispatchEvent(new Event('input'));
      }
    });
    
    currentCoursesTab.addEventListener('click', function () {
      currentCoursesTab.classList.add('active');
      allCoursesTab.classList.remove('active');
      
      filterCoursesByStatus('In Progress');
    });
  
    // filter courses by status
    function filterCoursesByStatus(status) {
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (searchTerm === '') {
        // if no search term, just filter by status
        const filteredCourses = courses.filter(course => course.status === status);
        renderCourses(filteredCourses);
      } else {
        // reload search to apply current filter with status
        searchInput.dispatchEvent(new Event('input'));
      }
    }
  
    // show the courses
    function renderCourses(courses) {
      // clear
      courseList.innerHTML = '';
      
      if (courses.length === 0) {
        courseList.innerHTML = `
          <div class="no-courses">
            <p>No courses found matching your search.</p>
          </div>
        `;
        return;
      }
      

      
      // add courses to the list
      courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
          <div class="course-details">
            <h3>${course.name}</h3>
            <p>Instructor: Multiple</p>
            <span class="course-category">${course.category}</span>
          </div>
          <div class="course-actions">
          ${currentUser.role === "admin" 
            ? `<button class="btn-edit-sections">Edit Sections</button>` 
            : `<button class="btn-register">Register</button>`}
          </div>
        `;
        courseList.appendChild(courseCard);
        
        if (currentUser.role === 'admin') {
            const editButton = courseCard.querySelector('.btn-edit-sections');
            editButton.addEventListener('click', () => {
              openEditSectionsModal(course);
            });
          } else if (currentUser.role === 'student') {
            const registerButton = courseCard.querySelector('.btn-register');
            registerButton.addEventListener('click', () => {
              openRegisterModal(course);
            });
          }
          
      });
    }
    
    //for instructor sections
    if (currentUser.role === 'instructor') {
    renderInstructorSections();
    } 
    function renderInstructorSections() {
    const instructorSections = [];
    courses.forEach(course => {
      course.sections.forEach(section => {
        if (section.instructor === currentUser.name) {
          instructorSections.push({ course, section });
        }
      });
    });
  
    courseList.innerHTML = '';
    if (instructorSections.length === 0) {
      courseList.innerHTML = '<p>No sections assigned to you.</p>';
      return;
    }
  
    instructorSections.forEach(({ course, section }) => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <div class="course-details">
          <h3>${course.name} - ${section.id}</h3>
          <p>Timing:</strong> ${section.timing}</p>
          <p>Capacity:</strong> ${section.capacity}</p>
          <p>Registered Students:</strong> ${section.registeredStudents.length}</p>
        </div>
        <div class="course-actions">
          <button class="btn-view-section">View Section</button>
        </div>
        
      `;
      const btn = card.querySelector('.btn-view-section');
      btn.addEventListener('click', () => openGradeModal(course, section));
      courseList.appendChild(card);
    });
  }
  
  //grade students in a section
  function openGradeModal(course, section) {
    const modal = document.getElementById('sectionModal');
    const sectionList = document.getElementById('sectionList');
    sectionList.innerHTML = '';
    if (section.registeredStudents.length === 0) {
      sectionList.innerHTML = '<p>No students registered in this section!</p>';
    } else {
      section.registeredStudents.forEach(studentId => {
        const student = getUserById(studentId);
        const div = document.createElement('div');
        div.className = 'section-option';
        div.innerHTML = `
          <p><strong>${student.name}</strong></p>
          <label>Grade: 
            <select class="grade-input" id="grade-${student.id}">
              <option value="">Select Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </label>
          <button class="btn-submit-grade" onclick="submitGrade('${student.id}', '${course.id}')">Submit</button>
        `;
        sectionList.appendChild(div);
      });
    }
    modal.style.display = 'block';
  }
  
  
  window.submitGrade = function(studentId, courseId) {
    const gradeInput = document.getElementById(`grade-${studentId}`);
    const grade = gradeInput.value.trim();
    if (!grade) {
      alert("Please enter a grade.");
      return;
    }
  
    const users = JSON.parse(localStorage.getItem('users'));
    const student = users.find(u => u.id === studentId);
    console.log(student);
  
    if (!student.grades) {
      student.grades = [];
    }
  
    const currentGrade = student.grades.find(g => g.courseId === courseId);
    if (currentGrade) {
      currentGrade.grade = grade;
    } else {
      student.grades.push({ courseId, grade });
    }
  
    // Add to completedCourses
    if (!student.completedCourses) {
      student.completedCourses = [];
    }
    if (!student.completedCourses.includes(courseId)) {
      student.completedCourses.push(courseId);
    }
  
    // Remove from registeredCourses
    if (student.registeredCourses) {
      student.registeredCourses = student.registeredCourses.filter(id => id !== courseId);
    }
  
    localStorage.setItem('users', JSON.stringify(users));
    alert('Grade submitted successfully.');
    document.getElementById('sectionModal').style.display = 'none';
  };
  
  
  
  function getUserById(id) {
    const users = JSON.parse(localStorage.getItem('users'));
    return users.find(u => u.id === id);
  }
  
    // modal window for registering course section
    function openRegisterModal(course) {
        const modal = document.getElementById('sectionModal');
        const sectionList = document.getElementById('sectionList');
        
        // clear previous sections
        sectionList.innerHTML = '';
        
        // verify if course is open
        if (!course.openForRegistration) {
          alert("This course is not open for registration.");
          return;
        }
        
        // get sections based on prerequisites and capacity
        course.sections.forEach(section => {
          if (section.capacity > section.registeredStudents.length) {
            const sectionOption = document.createElement('div');
            sectionOption.classList.add('section-option');
            sectionOption.innerHTML = `
              <p><strong>Instructor:</strong> ${section.instructor}</p>
              <p><strong>Timing:</strong> ${section.timing}</p>
              <p><strong>Capacity:</strong> ${section.registeredStudents.length}/${section.capacity}</p>
              <button class="btn-register-section" onclick="registerForSection('${course.id}', '${section.id}')">Register</button>
            `;
            sectionList.appendChild(sectionOption);
          }
        });
    
        // display modal
        modal.style.display = "block";
    }

    //modal for editing section
    function openEditSectionsModal(course) {
      const modal = document.getElementById('sectionModal');
      const sectionList = document.getElementById('sectionList'); 
      sectionList.innerHTML = '';  
    
      const newSectionBtn = document.createElement('button');
      newSectionBtn.textContent = 'New Section';
      newSectionBtn.className = 'btn-new-section';
      newSectionBtn.style.marginBottom = '0.5rem';
      newSectionBtn.addEventListener('click', () => {
        window.location.href = `/admin/create-class.html?courseId=${course.id}`;
      });
      sectionList.appendChild(newSectionBtn);
    
      course.sections.forEach(section => {
        const sectionOption = document.createElement('div');
        sectionOption.classList.add('section-option');
        sectionOption.innerHTML = `
          <p><strong>Instructor:</strong> ${section.instructor}</p>
          <p><strong>Timing:</strong> ${section.timing}</p>
          <p><strong>Capacity:</strong> ${section.registeredStudents.length}/${section.capacity}</p>
          <p><strong>Minimum Registrations:</strong> ${section.minRegistrations}</p>
          <p><strong>Approved:</strong> ${section.approved ? 'Yes' : 'No'}</p>
          <button class="btn-validate">Validate</button>
          <button class="btn-cancel">Cancel</button>
        `;
    
        // validate
        sectionOption.querySelector('.btn-validate').addEventListener('click', () => {
          if (section.registeredStudents.length >= section.minRegistrations) {
            section.approved = true;
            alert("Section validated!");
          } else {
            alert("Not enough registrations to validate this section!");
          }
          localStorage.setItem('courses', JSON.stringify(courses));
          openEditSectionsModal(course); 
        });
    
        // cancel
        sectionOption.querySelector('.btn-cancel').addEventListener('click', () => {
          const confirmCancel = confirm("Are you sure you want to cancel this section?");
          if (confirmCancel) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
    
            section.registeredStudents.forEach(studentId => {
              const student = users.find(u => u.id === studentId);
              if (student && Array.isArray(student.registeredCourses)) {
                student.registeredCourses = student.registeredCourses.filter(cid => cid !== course.id);
              }
            });
    
            localStorage.setItem('users', JSON.stringify(users));
    
            course.sections = course.sections.filter(s => s.id !== section.id);
            localStorage.setItem('courses', JSON.stringify(courses));
            openEditSectionsModal(course); 
          }
        });
    
        sectionList.appendChild(sectionOption);
      });
    
      modal.style.display = "block";
    }
    
      
      
    
    // register for a specific section
    window.registerForSection = function(courseId, sectionId) {
        const users = JSON.parse(localStorage.getItem('users'));
        const student = users.find(u => u.id === currentUser.id);
        const course = courses.find(course => course.id === courseId);
        console.log(course);
        console.log(course.id);
        const section = course.sections.find(section => section.id === sectionId);
        console.log(section);
        // Check prerequisites
        if (course.prerequisite !== null && !student.completedCourses.includes(course.prerequisite)) {
          alert("You have not completed the prerequisite for this course");
          return;
        }

        //can't register if the course is not general and the category mismatches with the student major
        if(course.category !== "General" && course.category !== student.major) {
            alert("You cannot register for this course as it does not match your major.");
            return;
        }
        // check whether student is already registered for the course
        if (student.registeredCourses.includes(course.id)) {
          alert("You are already registered for this course");
          return;
        }
        //check if student already completed the course before
        if(student.completedCourses.includes(course.id)) {
            alert("You have already completed this course");
            return;
        }

        // Check if section has available capacity
        if (section.registeredStudents.length >= section.capacity) {
          alert("This section is already full!");
          return;
        }

        
        let currentCredits = 0;
        student.registeredCourses.forEach(courseId => {
          const regCourse = courses.find(c => c.id === courseId);
          if (regCourse) {
            currentCredits += regCourse.credits;
          }
        });

        if (currentCredits + course.credits > 9) {
          alert("Registering for this course would exceed the maximum allowed credit hours (9).");
          return;
        }
        
    
        const conflict = student.registeredClasses.some(existingSectionId => {
          return courses.some(courseItem => {
            const existingSection = courseItem.sections.find(sec => sec.id === existingSectionId);
            return existingSection && existingSection.timing === section.timing;
          });
        });
        if (conflict) {
          alert("Time conflict: You are already registered for another class that meets at the same time.");
          return;
        }
        // register the student user for the section
        section.registeredStudents.push(student.id);
        student.registeredCourses.push(course.id);
        student.registeredClasses.push(section.id);
        
        // updates the course and student data
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('courses', JSON.stringify(courses));
        localStorage.setItem('users', JSON.stringify(users));

        console.log("Updated courses data:", courses);

        alert("You have successfully registered for the course!");
        
        // close the modal
        document.getElementById('sectionModal').style.display = "none";
        renderCourses(courses); 
    }
  
    // Close modal
    document.querySelector('.close').addEventListener('click', () => {
      document.getElementById('sectionModal').style.display = "none";
    });

      
});