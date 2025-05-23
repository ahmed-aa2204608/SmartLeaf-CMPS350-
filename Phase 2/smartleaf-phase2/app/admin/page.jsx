import "@/public/phase1/css/styles.css";
import CourseSearch from "../student/course-search";
import StatisticsNavItem from "../components/StatisticsNavItem";
import { searchCourses, getCurrentUser } from "../actions/server-actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage({ searchParams }) {
    const user = await getCurrentUser();
  
    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo"><h1>Menu</h1></div>
          <nav className="nav-menu">
            <a href="/admin" className="nav-item active"><i className="fas fa-home"></i></a>
            <a href="/phase1/learningPath/course-schedule.html" className="nav-item"><i className="fa-solid fa-calendar-days"></i></a>
            <a href="/phase1/AboutPage/about.html" className="nav-item"><i className="fas fa-user"></i></a>
            <a href="/statistics" className="nav-item"><i className="fas fa-chart-simple"></i></a>
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
              <h2>Hello Admin!</h2>
              <p>It's good to see you again.</p>
            </div>
            <div className="welcome-illustration">
              <img src="/images/image.png" alt="Welcome illustration" className="illustration" />
            </div>
          </section>
  
          <section className="stats-section">
            <div className="stat-card">
              <h2 className="stat-number">11</h2>
              <p className="stat-label">Courses open</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">4</h2>
              <p className="stat-label">Courses in progress</p>
            </div>
          </section>
          <Link href={"/phase1/admin/create-course.html"}>
          <div className="admin-controls">
                    <button className="btn-create" id="createCourseBtn">Create Course</button>
                    
                  </div></Link>
           <CourseSearch studentId={user.id} />
          
        </main>
      </div>
    );
  }