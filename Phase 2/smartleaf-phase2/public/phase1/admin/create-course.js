// DOM Elements
const createCourseForm = document.getElementById('createCourseForm');
const sectionsList = document.getElementById('sectionsList');
const addSectionBtn = document.getElementById('addSectionBtn');

// Modal Elements
const addSectionModal = document.getElementById('addSectionModal');
const closeSectionModal = document.getElementById('closeSectionModal');
const saveSectionBtn = document.getElementById('saveSectionBtn');

let tempSections = [];



// Global in-memory courses array
let courses = [];

const savedCourses = localStorage.getItem('courses');
if (savedCourses) {
  // Parse from localStorage
  courses = JSON.parse(savedCourses);
  console.log('Loaded courses from localStorage:', courses);
} else {
  // Otherwise, fetch from JSON
  fetch('/data/courses.json')
    .then((res) => res.json())
    .then((data) => {
      courses = data.courses || [];
      // Save to localStorage
      localStorage.setItem('courses', JSON.stringify(courses));
      console.log('Fetched courses from JSON and saved to localStorage:', courses);
    })
    .catch((err) => console.error('Error loading courses:', err));
}


addSectionBtn.addEventListener('click', () => {
  addSectionModal.style.display = 'block';
});
closeSectionModal.addEventListener('click', () => {
  addSectionModal.style.display = 'none';
});

// Close modal if user clicks outside it
window.addEventListener('click', (event) => {
  if (event.target === addSectionModal) {
    addSectionModal.style.display = 'none';
  }
});


saveSectionBtn.addEventListener('click', () => {
  const sectionId = document.getElementById('sectionId').value.trim();
  const instructor = document.getElementById('instructor').value.trim();
  const capacity = parseInt(document.getElementById('capacity').value.trim(), 10);
  const minRegs = parseInt(document.getElementById('minRegistrations').value.trim(), 10);
  const approved = document.getElementById('approvedCheck').checked;

  // Build the new section object
  const newSection = {
    id: sectionId,
    instructor,
    capacity: capacity || 0,
    minRegistrations: minRegs || 10,
    registeredStudents: [],
    pendingStudents: [],
    approved
  };

  // Push to tempSections
  tempSections.push(newSection);

  // Display in the UI (optional)
  const sectionDiv = document.createElement('div');
  sectionDiv.textContent = `Section: ${sectionId} - ${instructor} (cap: ${capacity})`;
  sectionsList.appendChild(sectionDiv);

  // Clear modal fields
  document.getElementById('sectionId').value = '';
  document.getElementById('instructor').value = '';
  document.getElementById('capacity').value = '';
  document.getElementById('minRegistrations').value = 10;
  document.getElementById('approvedCheck').checked = true;

  // Hide modal
  addSectionModal.style.display = 'none';
});

createCourseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Gather input fields
  const id = document.getElementById('courseId').value.trim();
  const name = document.getElementById('courseName').value.trim();
  const category = document.getElementById('courseCategory').value.trim();
  const prerequisite = document.getElementById('prerequisite').value.trim() || null;
  const openForRegistration = document.getElementById('openForRegistration').checked;
  const stage = "open";

  const newCourse = {
    id,
    name,
    category,
    prerequisite,
    openForRegistration,
    stage,
    sections: tempSections
  };

  courses.push(newCourse);

  localStorage.setItem('courses', JSON.stringify(courses));

  console.log('New Course Created:', newCourse);
  console.log('Updated coursesData:', courses);

  createCourseForm.reset();
  sectionsList.innerHTML = '';
  tempSections = [];

  alert(`Course ${id} has been created successfully!`);
});
