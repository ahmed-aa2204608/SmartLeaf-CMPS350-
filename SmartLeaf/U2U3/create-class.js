const createClassForm = document.getElementById('createClassForm');
const courseSelect = document.getElementById('courseSelect');
const instructorSelect = document.getElementById('instructorSelect');

const COURSES_URL = '/data/courses.json';
const USERS_URL = '/data/users.json';

let coursesData = [];
let instructorsData = [];

const savedCourses = localStorage.getItem('coursesData');
if (savedCourses) {
  coursesData = JSON.parse(savedCourses);
  populateCoursesDropdown(coursesData);
} else {
  // Otherwise, fetch from JSON
  fetch(COURSES_URL)
    .then((res) => res.json())
    .then((data) => {
      coursesData = data.courses || [];
      // Save to localStorage
      localStorage.setItem('coursesData', JSON.stringify(coursesData));
      // Populate dropdown
      populateCoursesDropdown(coursesData);
    })
    .catch((err) => console.error('Error loading courses:', err));
}


const savedUsers = localStorage.getItem('usersData');
if (savedUsers) {
  const allUsers = JSON.parse(savedUsers);
  instructorsData = allUsers.filter(u => u.role === 'instructor');
  populateInstructorsDropdown(instructorsData);
} else {
  fetch(USERS_URL)
    .then((res) => res.json())
    .then((data) => {
      const usersArray = data.users || [];
      instructorsData = usersArray.filter(u => u.role === 'instructor');
      localStorage.setItem('usersData', JSON.stringify(usersArray));
      populateInstructorsDropdown(instructorsData);
    })
    .catch((err) => console.error('Error loading instructors:', err));
}

function populateCoursesDropdown(courses) {
  courseSelect.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Choose a Course...';
  courseSelect.appendChild(defaultOption);

  courses.forEach((course) => {
    const option = document.createElement('option');
    option.value = course.id; // e.g. "C101"
    option.textContent = `${course.id} - ${course.name}`;
    courseSelect.appendChild(option);
  });
}

function populateInstructorsDropdown(instructors) {
  instructorSelect.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Choose an Instructor...';
  instructorSelect.appendChild(defaultOption);

  instructors.forEach((instructor) => {
    const option = document.createElement('option');
    option.value = instructor.name; // e.g. "Dr. Smith"
    option.textContent = instructor.name;
    instructorSelect.appendChild(option);
  });
}


createClassForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const selectedCourseId = courseSelect.value;
  const sectionId = document.getElementById('sectionId').value.trim();
  const instructorName = instructorSelect.value;
  const capacity = parseInt(document.getElementById('capacity').value.trim(), 10);
  const minRegs = parseInt(document.getElementById('minRegistrations').value.trim(), 10);

  // Basic validation
  if (!selectedCourseId) {
    alert('Please select a course.');
    return;
  }
  if (!sectionId) {
    alert('Please enter a Section ID.');
    return;
  }
  if (!instructorName) {
    alert('Please select an instructor.');
    return;
  }

  // Build the new section object
  const newSection = {
    sectionId,
    instructor: instructorName,
    capacity: capacity || 0,
    minRegistrations: minRegs || 0,
    registeredStudents: [],
    pendingStudents: [],
    approved: false
  };

  // Find the selected course
  const courseObj = coursesData.find((c) => c.id === selectedCourseId);
  if (!courseObj) {
    alert('Selected course not found in data.');
    return;
  }

  // Push new section
  courseObj.sections.push(newSection);

  // Persist to localStorage
  localStorage.setItem('coursesData', JSON.stringify(coursesData));

  alert(`Successfully created section ${sectionId} for course ${selectedCourseId}!`);

  // Reset form
  createClassForm.reset();
});
