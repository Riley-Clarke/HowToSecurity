import React from 'react';
import NavBar from '../components/NavBar';


export default function Homepage() {
    return (
        <>
            <NavBar />
            <h1>What is HowToSecurity?</h1>
            <div className="intro">
                HowToSecurity is an educational platform focused on an interactive learning experience for software security
                concepts. It aims to teach fundamental skill in the field of cybersecurity in an easily understandable way
                for developers of any skill level. Through simple documentation, external resources, and interactive learning 
                labs, developers can learn however works best for them.
            </div>
        </>
    );
}
