
import "@/public/phase1/css/styles.css";
import CourseSearch from "./course-search";
import StatisticsNavItem from "../components/StatisticsNavItem";
import { searchCourses, getCurrentUser } from "../actions/server-actions";


export default async function StudentPage() {
  const user = await getCurrentUser();
  
    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo"><h1>Menu</h1></div>
          <nav className="nav-menu">
            <a href="/student" className="nav-item active"><i className="fas fa-home"></i></a>
            <a href="/learningPath/learning-path.html" className="nav-item"><i className="fas fa-graduation-cap"></i></a>
            <a href="/AboutPage/about.html" className="nav-item"><i className="fas fa-user"></i></a>
            <StatisticsNavItem/>
            <a href="/login" className="nav-item"><i className="fas fa-sign-out-alt"></i></a>
          </nav>
        </aside>
  
        <main className="main-content">
          <header className="header">
            <div className="user-menu">
              <div className="user-profile">
                <img src="/images/free-user-icon-3296-thumb.png" alt="User profile" className="profile-img" />
              </div>
            </div>
          </header>
  
          <section className="welcome-section">
            <div className="welcome-text">
              <h2>Hello {user.name}!</h2>
              <p>It's good to see you again.</p>
            </div>
            <div className="welcome-illustration">
              <img src="/images/image.png" alt="Welcome illustration" className="illustration" />
            </div>
          </section>
  
          <section className="stats-section">
            <div className="stat-card">
              <h2 className="stat-number">11</h2>
              <p className="stat-label">Courses completed</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">4</h2>
              <p className="stat-label">Courses in progress</p>
            </div>
          </section>
          <CourseSearch studentId={user.id} />
        </main>
      </div>
    );
  }

/*
<header className="header">
<div className="user-menu">
  <div className="user-profile">
    <img src="/images/free-user-icon-3296-thumb.png" alt="User profile" className="profile-img" />
  </div>
</div>
</header>

<section className="welcome-section">
<div className="welcome-text">
  <h2 id="greet">Hello!</h2>
  <p>It's good to see you again.</p>
</div>
<div className="welcome-illustration">
  <img src="/images/image.png" alt="Welcome illustration" className="illustration" />
</div>
</section>

<section className="stats-section">
<div className="stat-card">
  <h2 className="stat-number">11</h2>
  <p className="stat-label">Courses completed</p>
</div>
<div className="stat-card">
  <h2 className="stat-number">4</h2>
  <p className="stat-label">Courses in progress</p>
</div>
</section>

<section className="courses-section">
<h2 className="section-title">Courses</h2>
<div className="search-container">
  <input type="text" className="search-input" placeholder="Search by course name or category..." />
  <i className="fas fa-search search-icon"></i>
</div>
<div className="course-tabs">
  <button className="tab-btn active">All Courses</button>
  <button className="tab-btn">Current</button>
</div>
<div className="course-list">
{courses.map((course) => (
    <div key={course.id} className="course-card">
      <div className="course-details">
  <h3>{course.name}</h3>
  <p>Instructor: Multiple</p>
  <span className="course-category">{course.category}</span>
</div>
<div className="course-actions">
  <button className="btn-register">Register</button>
</div>
    </div>
  ))}
</div>
</section>
*/