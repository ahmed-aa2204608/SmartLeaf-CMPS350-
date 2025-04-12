document.addEventListener('DOMContentLoaded', () => {
  const userJSON = localStorage.getItem('currentUser');
  if (!userJSON) {
    console.error("No user data found in localStorage.");
    return;
  }
  const user = JSON.parse(userJSON);

  const form = document.getElementById('changepass-form');
  const currentPasswordInput = document.getElementById('current-password');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const messageElem = document.getElementById('message');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  
    if (currentPasswordInput.value !== user.password) {
      messageElem.style.color = 'red';
      messageElem.textContent = 'Current password is incorrect.';
      return;
    }
  
    if (newPasswordInput.value !== confirmPasswordInput.value) {
      messageElem.style.color = 'red';
      messageElem.textContent = 'New passwords do not match.';
      return;
    }
  
    user.password = newPasswordInput.value;
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log(localStorage.getItem('currentUser'));
    messageElem.style.color = 'green';
    messageElem.textContent = 'Password changed successfully!';
    form.reset();
  });

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
