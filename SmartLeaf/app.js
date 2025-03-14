document.addEventListener('DOMContentLoaded', function() {
    let courses = [];
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
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // if search is empty, show all or current courses based on active tab
            if (currentCoursesTab.classList.contains('active')) {
                filterCoursesByStatus('Current');
            } else {
                renderCourses(courses);
            }
            return;
        }
        
        // filter courses by name or category
        const filteredCourses = courses.filter(course => {
            const matchesName = course.name.toLowerCase().includes(searchTerm) || 
                               course.fullName.toLowerCase().includes(searchTerm);
            const matchesCategory = course.category.toLowerCase().includes(searchTerm);
            
            // if current tab is active, also filter by status
            if (currentCoursesTab.classList.contains('active')) {
                return (matchesName || matchesCategory) && course.status === 'Current';
            }
            
            return matchesName || matchesCategory;
        });
        
        renderCourses(filteredCourses);
    });
    
    // course tabs (all/current)
    allCoursesTab.addEventListener('click', function() {
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
    
    currentCoursesTab.addEventListener('click', function() {
        currentCoursesTab.classList.add('active');
        allCoursesTab.classList.remove('active');
        
        filterCoursesByStatus('Current');
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
                    <h3>${course.fullName}</h3>
                    <p>Instructor: ${course.instructor}</p>
                    <span class="course-category">${course.category}</span>
                </div>
                <div class="course-meta">
                    <span class="status"><i class="far fa-clock"></i>${course.status}</span>
                </div>
                <div class="course-actions">
                    <button class="btn-view">View course</button>
                </div>
            `;
            courseList.appendChild(courseCard);
        });
    }
});