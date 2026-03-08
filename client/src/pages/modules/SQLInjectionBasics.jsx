import React from 'react';
import './Modules.css';

const SQLInjectionBasics = () => {
  return (
    <div className="module-container">
      <h1 className="module-header">SQL Injection Basics</h1>
      <p className="module-body">This module covers the fundamentals of SQL injection attacks and how to prevent them.</p>

      <h2 className="module-header">What is SQL Injection?</h2>
      <p className="module-body">SQL injection is a code injection technique that exploits vulnerabilities in an application's software...</p>

      {/* Add your module content here */}
    </div>
  );
};

// Module metadata - this is what gets picked up by the LearningModules component
SQLInjectionBasics.metadata = {
  title: 'SQL Injection Basics',
  description: 'Learn the fundamentals of SQL injection attacks and prevention techniques.',
  difficulty: 'Beginner',
  estimatedTime: '15 minutes',
  tags: ['SQL', 'Injection', 'Security', 'Database'],
  prerequisites: [],
  learningObjectives: [
    'Understand what SQL injection is',
    'Identify vulnerable code patterns',
    'Learn proper input sanitization techniques',
    'Implement parameterized queries'
  ]
};

export default SQLInjectionBasics;