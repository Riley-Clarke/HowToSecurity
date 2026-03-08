import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

export default function Homepage() {
    const features = [
        { title: 'Simple Explanations', description: 'Clear, concise explanations of security concepts for all levels.', link: '/learning-modules' },
        { title: 'Code Snippets', description: 'Learn with practical code examples from an open source library.', link: '/learning-modules' },
        { title: 'Interactive Experiences', description: 'Hands-on labs where you can practice and experiment securely.', link: '/sandbox' },
        { title: 'External Documentation', description: 'Curated links to industry resources and best practices.', link: '/glossary' },
    ];
    return (
        <>
            <div className="page-content" id="top">
                <h1 className="pagetext-heading">Security Foundations for Developers</h1>
                <div className="pagetext">
                    HowToSecurity is an educational platform focused on an interactive learning experience for software security
                    concepts. It aims to teach fundamental skill in the field of cybersecurity in an easily understandable way
                    for developers of any skill level. It's a practical approach to learning proactive software design concepts,
                    best practices, and the <i>why</i> behind the decisions you make for your software.
                    Our platform is focused on giving users a way to learn that works for you.
                </div>
            </div>
            <div className="features-section">
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <Link key={index} to={feature.link} className="feature-card-link">
                            <div className="feature-card">
                                <h3>{feature.title} <span className="arrow">→</span></h3>
                                <p>{feature.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="page-content" id="under-features">
                <h1 className="pagetext-heading">The Goal</h1>
                <div className="pagetext">
                    Security is a requirement for any software, and developers at every level should feel comfortable
                    and confident with the security of their programs. HowToSecurity can give those developers the 
                    knowledge they need to build safe systems.
                </div>
            </div>
            <div className="page-content">
                <h1 className="pagetext-heading">Why HTS?</h1>
                <div className="pagetext">
                    Other software security resources online can be scattered, outdated, or too complex for all 
                    levels of developers. The goal of HTS is to make the field accessible to those at all levels,
                    not just cybersecurity professionals.
                </div>
            </div>
            
            
        </>
    );
}
