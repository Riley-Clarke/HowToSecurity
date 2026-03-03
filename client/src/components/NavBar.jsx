import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <header>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        HowToSecurity
                    </Link>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/learning-modules" className="nav-link">
                                Learning Modules
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/sandbox" className="nav-link">
                                Sandbox
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/glossary" className="nav-link">
                                Glossary
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}