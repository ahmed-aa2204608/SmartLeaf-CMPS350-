document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('changepass-form');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageElem = document.getElementById('message');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const userJSON = localStorage.getItem('currentUser');
      if (!userJSON) {
        messageElem.style.color = 'red';
        messageElem.textContent = 'User not found. Please log in.';
        return;
      }
  
      const user = JSON.parse(userJSON);
  
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
  });
  