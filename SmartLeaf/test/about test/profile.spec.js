// profile.spec.js (ES module)
import { expect } from "chai";
import { calculateGPA, getCurrentCredits, getProfileInfoHTML, getNavMenuHTML } from "./profile.js";

describe("Profile Module", () => {

  const studentUser = {
    id: "student1",
    username: "alice",
    password: "alice123",
    profilePic: "https://example.com/pic.jpg",
    name: "Alice",
    role: "student",
    major: "CS",
    completedCourses: ["C101", "C102"],
    registeredCourses: ["C103", "C105", "C106"],
    registeredClasses: ["C101-001", "C102-001", "C104-001"],
    grades: [
      { courseId: "C101", grade: "A" },
      { courseId: "C102", grade: "B" }
    ]
  };

  const instructorUser = {
    id: "instructor1",
    username: "drsmith",
    password: "smith123",
    profilePic: "",
    name: "Dr. Smith",
    role: "instructor",
    expertise: ["Algorithms", "Data Structures"]
  };

  const adminUser = {
    id: "admin1",
    username: "admin",
    password: "adminpass",
    profilePic: "",
    name: "Administrator",
    role: "admin"
  };

  // Sample courses array
  const courses = [
    { id: "C101", name: "Intro to Programming", credits: 3 },
    { id: "C102", name: "Object-Oriented Programming", credits: 3 },
    { id: "C103", name: "Design of Systems", credits: 3 },
    { id: "C104", name: "Web Development", credits: 3 },
    { id: "C105", name: "Computer Networks", credits: 3 },
    { id: "C106", name: "Hardware Arch", credits: 3 }
  ];

  describe("calculateGPA", () => {
    it("should calculate the correct GPA", () => {
      // Grades: A=4, B=3 → Average = 3.5
      const gpa = calculateGPA(studentUser);
      expect(gpa).to.be.closeTo(3.5, 0.01);
    });

    it("should return 0 if no grades", () => {
      const userNoGrades = { ...studentUser, grades: [] };
      const gpa = calculateGPA(userNoGrades);
      expect(gpa).to.equal(0);
    });
  });

  describe("getCurrentCredits", () => {
    it("should sum up the total credits for registered courses", () => {
      // studentUser.registeredCourses = ["C103", "C105", "C106"]
      // Each course is 3 credits, so total should be 9.
      const totalCredits = getCurrentCredits(studentUser, courses);
      expect(totalCredits).to.equal(9);
    });

    it("should return 0 if no registered courses", () => {
      const userNoRegistered = { ...studentUser, registeredCourses: [] };
      const totalCredits = getCurrentCredits(userNoRegistered, courses);
      expect(totalCredits).to.equal(0);
    });
  });

  describe("getProfileInfoHTML", () => {
    it("should return HTML with GPA, Credit Hours, and Major for a student", () => {
      const html = getProfileInfoHTML(studentUser, studentUser, courses);
      expect(html).to.include("Basic Information");
      expect(html).to.include("Full Name:");
      expect(html).to.include("ID:");
      expect(html).to.include("Role:");
      expect(html).to.include("GPA:");
      expect(html).to.include("Credit Hours:");
      expect(html).to.include("Major:");
      // Also, check that it includes the student's name and calculated values.
      expect(html).to.include("Alice");
      // GPA should be 3.50 in this example (A=4, B=3 average of 3.5)
      expect(html).to.include("3.50");
      // Credit Hours = 9
      expect(html).to.include("9");
      // Major is "CS"
      expect(html).to.include("CS");
    });

    it("should return HTML with Expertise for an instructor", () => {
      const html = getProfileInfoHTML(instructorUser, instructorUser, []);
      expect(html).to.include("Basic Information");
      expect(html).to.include("Expertise:");
      expect(html).to.include("Algorithms, Data Structures");
    });

    it("should return HTML with password change link for any role", () => {
      const html = getProfileInfoHTML(adminUser, adminUser, []);
      expect(html).to.include("Password:");
      expect(html).to.include("changepass.html");
    });
  });

  describe("getNavMenuHTML", () => {
    it("should return the student nav menu", () => {
      const navHTML = getNavMenuHTML(studentUser);
      expect(navHTML).to.include("/U2U3/student.html");
      expect(navHTML).to.include("learning-path");
      expect(navHTML).to.include("about.html");
      expect(navHTML).to.include("/Login/index.html");
    });
    it("should return the instructor nav menu", () => {
      const navHTML = getNavMenuHTML(instructorUser);
      expect(navHTML).to.include("/instructor/instructor.html");
      expect(navHTML).to.include("course-schedule.html");
      expect(navHTML).to.include("about.html");
      expect(navHTML).to.include("/Login/index.html");
    });
    it("should return the admin nav menu", () => {
      const navHTML = getNavMenuHTML(adminUser);
      expect(navHTML).to.include("/admin/admin.html");
      expect(navHTML).to.include("course-schedule.html");
      expect(navHTML).to.include("about.html");
      expect(navHTML).to.include("/Login/index.html");
    });
  });
});
