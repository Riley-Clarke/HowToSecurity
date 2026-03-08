import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ModuleRenderer = () => {
    const { moduleId } = useParams();
    const [ModuleComponent, setModuleComponent] = useState(null);

    useEffect(() => {
        const loadModule = async () => {
            try {
                const module = await import(`./modules/${moduleId}.jsx`);
                setModuleComponent(() => module.default);
                window.scrollTo(0, 0); // Scroll to top when module loads
            } catch (err) {
                console.error('Module not found:', err);
                setModuleComponent(null);
            }
        };

        if (moduleId) {
            loadModule();
        }
    }, [moduleId]);

    if (!ModuleComponent) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Module Not Found</h2>
                <p>The requested module could not be loaded.</p>
                <Link to="/learning-modules" style={{
                    color: '#203446',
                    textDecoration: 'none',
                    padding: '10px 15px',
                    border: '2px solid #203446',
                    borderRadius: '5px',
                    backgroundColor: 'white'
                }}>
                    ← Back to Learning Modules
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <Link to="/learning-modules" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#203446',
                textDecoration: 'none',
                marginBottom: '2rem',
                padding: '10px 15px',
                border: '2px solid #203446',
                borderRadius: '5px',
                backgroundColor: 'white'
            }}>
                ← Back to Learning Modules
            </Link>
            <ModuleComponent />
        </div>
    );
};

export default ModuleRenderer;