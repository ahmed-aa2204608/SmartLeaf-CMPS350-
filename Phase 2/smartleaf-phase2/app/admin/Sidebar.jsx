'use client'
import Link from 'next/link'
export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo"><h1>Menu</h1></div>
            <nav className="nav-menu">
                <a href="/statistics" className="nav-item"><i className="fas fa-chart-simple"></i></a>
                <a href="/" className="nav-item"><i className="fas fa-sign-out-alt"></i></a>
            </nav>
        </aside>
    )
}