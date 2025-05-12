import "@/public/phase1/css/styles.css";
import CourseSearch from "../student/course-search";
import StatisticsNavItem from "../components/StatisticsNavItem";
import { searchCourses } from "../actions/server-actions";
import { redirect } from "next/navigation";

export default async function InstructorPage({ searchParams }) {
    const query1 = await searchParams;
    const query2 = await query1?.q || "";
    const courses = await searchCourses(query2);
  
    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo"><h1>Menu</h1></div>
          <nav className="nav-menu">
            <a href="/instructor" className="nav-item active"><i className="fas fa-home"></i></a>
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
              <h2>Hello Instructor!</h2>
              <p>It's good to see you again.</p>
            </div>
            <div className="welcome-illustration">
              <img src="/images/image.png" alt="Welcome illustration" className="illustration" />
            </div>
          </section>
  
          <section className="stats-section">
            <div className="stat-card">
              <h2 className="stat-number">11</h2>
              <p className="stat-label">Courses taught</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-number">4</h2>
              <p className="stat-label">Courses in progress</p>
            </div>
          </section>
          <CourseSearch searchTerm={query2} />
        </main>
      </div>
    );
  }