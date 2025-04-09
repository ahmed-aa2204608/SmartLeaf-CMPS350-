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
    
    //get courses from local storage if available or from json
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
        courses = JSON.parse(storedCourses);  
        renderCourses(courses);  
    } else {
        fetch('courses.json')
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
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            users = data.users;
            localStorage.setItem('users', JSON.stringify(users));
        })
        .catch(error => console.error('Error loading users:', error));
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
          <div class="course-meta">
            <span class="status"><i class="far fa-clock"></i>${course.stage}</span>
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
          <label>Grade: <input class="grade-input" type="text" id="grade-${student.id}" /></label>
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
      
          // validation
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
        const course = courses.find(course => course.id === courseId);
        console.log(course);
        const section = course.sections.find(section => section.id === sectionId);
        console.log(section);
        // Check prerequisites
        if (course.prerequisite !== null && !currentUser.completedCourses.includes(course.prerequisite)) {
          alert("You have not completed the prerequisite for this course");
          return;
        }
        // check whether student is already registered for the course
        if (currentUser.registeredCourses.includes(course.id)) {
          alert("You are already registered for this course");
          return;
        }
        //check if student already completed the course before
        if(currentUser.completedCourses.includes(course.id)) {
            alert("You have already completed this course");
            return;
        }

        // Check if section has available capacity
        if (section.registeredStudents.length >= section.capacity) {
          alert("This section is already full!");
          return;
        }
    
        // register the student user for the section
        section.registeredStudents.push(currentUser.id);
        currentUser.registeredCourses.push(course.id);
        
        // updates the course and student data
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('courses', JSON.stringify(courses));

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