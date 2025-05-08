
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value.trim();

    if (username === "" || password === "") {
      alert("Please fill all fields");
      return;
    }

    fetch('/data/users.json')
      .then(response => response.json())
      .then(data => {
        const user = data.users.find(u => u.username === username && u.password === password);
        if (!user) {
          alert("Invalid credentials");
          return;
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.role === "student") {
          window.location.href = "/student/student.html";
        } else if (user.role === "admin") {
          window.location.href = "/admin/admin.html";
        } else if (user.role === "instructor") {
          window.location.href = "/instructor/instructor.html";
        } else {
          alert("Unknown user role");
        }
      })
      .catch(err => {
        console.error("Error fetching users.json: ", err);
        alert("Error fetching user data. Please try again later.");
      });
  });