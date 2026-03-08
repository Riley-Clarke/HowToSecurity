import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './LearningModules.css';

const LearningModules = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                // Import all modules from the modules directory
                const moduleFiles = import.meta.glob('./modules/*.jsx', { eager: true });

                const moduleList = Object.entries(moduleFiles).map(([path, module]) => {
                    const fileName = path.split('/').pop().replace('.jsx', '');
                    const metadata = module.default?.metadata || {};

                    return {
                        id: fileName,
                        title: metadata.title || fileName.replace(/([A-Z])/g, ' $1'),
                        description: metadata.description || 'No description available',
                        path: `/modules/${fileName}`,
                        difficulty: metadata.difficulty || 'Beginner',
                        tags: metadata.tags || [],
                        estimatedTime: metadata.estimatedTime || 'Unknown',
                    };
                });

                setModules(moduleList.sort((a, b) => a.title.localeCompare(b.title)));
            } catch (error) {
                console.error('Error loading modules:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    // Get all unique tags and difficulties for filter options
    const allTags = useMemo(() => {
        const tagSet = new Set();
        modules.forEach(module => {
            module.tags.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    }, [modules]);

    const allDifficulties = useMemo(() => {
        const difficultySet = new Set(modules.map(module => module.difficulty));
        return ['All', ...Array.from(difficultySet).sort()];
    }, [modules]);

    // Filter modules based on search and filters
    const filteredModules = useMemo(() => {
        return modules.filter(module => {
            const matchesSearch = searchTerm === '' ||
                module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDifficulty = selectedDifficulty === 'All' || module.difficulty === selectedDifficulty;

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tag => module.tags.includes(tag));

            return matchesSearch && matchesDifficulty && matchesTags;
        });
    }, [modules, searchTerm, selectedDifficulty, selectedTags]);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedDifficulty('All');
        setSelectedTags([]);
    };

    if (loading) return <div className="learning-modules-container">Loading...</div>;

    return (
        <div className="learning-modules-container">
            <h1>Learning Modules</h1>

            {/* Search and Filter Controls */}
            <div className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search modules..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-controls">
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="difficulty-filter"
                    >
                        {allDifficulties.map(difficulty => (
                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                    </select>

                    <button onClick={clearFilters} className="clear-filters-btn">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
                <div className="tags-section">
                    <h3>Filter by Tags:</h3>
                    <div className="tags-container">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results Summary */}
            <div className="results-summary">
                Showing {filteredModules.length} of {modules.length} modules
            </div>

            {/* Modules Grid */}
            <div className="modules-grid">
                {filteredModules.length > 0 ? (
                    filteredModules.map((module) => (
                        <Link key={module.id} to={module.path} className="module-card">
                            <h3>{module.title}</h3>
                            <p>{module.description}</p>
                            <div className="module-meta">
                                <span className={`difficulty ${module.difficulty.toLowerCase()}`}>
                                    {module.difficulty}
                                </span>
                                <span className="estimated-time">{module.estimatedTime}</span>
                            </div>
                            {module.tags.length > 0 && (
                                <div className="module-tags">
                                    {module.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                    {module.tags.length > 3 && <span className="tag">+{module.tags.length - 3}</span>}
                                </div>
                            )}
                        </Link>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No modules match your current filters.</p>
                        <button onClick={clearFilters} className="clear-filters-btn">
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningModules;