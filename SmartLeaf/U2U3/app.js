document.addEventListener('DOMContentLoaded', function () {
    let courses = [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')); 
    console.log(currentUser);
    const courseList = document.querySelector('.course-list');
    const searchInput = document.querySelector('.search-input');
    const allCoursesTab = document.querySelector('.tab-btn:nth-child(1)');
    const currentCoursesTab = document.querySelector('.tab-btn:nth-child(2)');
    
    // get the courses from json
    fetch('courses.json')
      .then(response => response.json())
      .then(data => {
        courses = data.courses;
        renderCourses(courses);
      })
      .catch(error => console.error('Error loading courses:', error));
  
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
            <button class="btn-register">Register</button>
          </div>
        `;
        courseList.appendChild(courseCard);
        
        const registerButton = courseCard.querySelector('.btn-register');
        registerButton.addEventListener('click', () => {
          openRegisterModal(course); 
        });
      });
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
              <p><strong>Capacity:</strong> ${section.registeredStudents.length}/${section.capacity}</p>
              <button class="btn-register-section" onclick="registerForSection('${course.id}', '${section.id}')">Register</button>
            `;
            sectionList.appendChild(sectionOption);
          }
        });
    
        // display modal
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