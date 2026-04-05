import React, { useState } from 'react';
import './SymptomChecker.css';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheck = async () => {
        if (!symptoms.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('http://localhost:5003/api/ai/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symptoms }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze symptoms. Please try again.');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="symptom-checker-container">
            <div className="glass-card">
                <h2 className="title">AI Symptom Checker</h2>
                <p className="subtitle">Describe how you feel, and our AI will provide preliminary suggestions.</p>
                
                <textarea
                    className="symptom-input"
                    placeholder="e.g., I have a persistent cough and a mild fever..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                />
                
                <button 
                    className={`check-button ${loading ? 'loading' : ''}`}
                    onClick={handleCheck}
                    disabled={loading || !symptoms.trim()}
                >
                    {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                </button>

                {error && <div className="error-message">{error}</div>}

                {result && (
                    <div className="result-area fade-in">
                        <div className="result-section">
                            <h3>Possible Conditions</h3>
                            <ul>
                                {result.possibleConditions.map((cond, i) => (
                                    <li key={i}>{cond}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="result-section">
                            <h3>Health Suggestions</h3>
                            <ul>
                                {result.suggestions.map((sug, i) => (
                                    <li key={i}>{sug}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="result-section">
                            <h3>Recommended Specialties</h3>
                            <div className="specialties-tags">
                                {result.recommendedSpecialties.map((spec, i) => (
                                    <span key={i} className="tag">{spec}</span>
                                ))}
                            </div>
                        </div>

                        <div className="disclaimer">
                            <strong>Note:</strong> {result.disclaimer}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SymptomChecker;
