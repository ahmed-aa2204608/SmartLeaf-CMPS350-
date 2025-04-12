export function loginUser(username, password, fetchFn) {
  if (username.trim() === "" || password.trim() === "") {
    return Promise.reject("Please fill all fields");
  }
  
  return fetchFn("users.json")
    .then(response => response.json())
    .then(data => {
      const user = data.users.find(u => u.username === username && u.password === password);
      if (!user) {
        return Promise.reject("Invalid credentials");
      }
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      if (user.role === "student") {
        return "student.html";
      } else if (user.role === "admin") {
        return "admin.html";
      } else if (user.role === "instructor") {
        return "instructor.html";
      } else {
        return Promise.reject("Unknown user role");
      }
    })
    .catch(err => {
      if (
        err === "Invalid credentials" ||
        err === "Unknown user role" ||
        err === "Please fill all fields"
      ) {
        return Promise.reject(err);
      }
      console.error("Error fetching users.json:", err);
      return Promise.reject("Error fetching user data. Please try again later.");
    });
}
