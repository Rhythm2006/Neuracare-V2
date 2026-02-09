import React, { useState } from 'react';
import Layout from './components/Layout';
import MoodInput from './components/MoodInput';
import BurnoutResult from './components/BurnoutResult';
import LandingPage from './components/LandingPage';
import Journal from './components/Journal';
import JournalAnalyzer from './components/JournalAnalyzer';
import FluidBackground from './components/FluidBackground';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, mood, journal, journal-analysis
  const [burnoutLevel, setBurnoutLevel] = useState(null);

  const calculateBurnout = (moodData) => {
    const { stress, sleep, workload, energy } = moodData;
    const score = (stress + (10 - sleep) + workload + (10 - energy)) / 40 * 100;
    setBurnoutLevel({ score: Math.round(score), details: moodData });
  };

  const resetAssessment = () => {
    setBurnoutLevel(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentView} />;

      case 'journal':
        return <Journal />;

      case 'journal-analysis':
        return <JournalAnalyzer />;

      case 'mood':
        return (
          <div className="max-w-2xl mx-auto animate-fade-in">
            {!burnoutLevel && (
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-neon-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  Check Your Burnout Level
                </h2>
                <p className="text-gray-400 text-lg">
                  Answer a few questions about your current state of mind and body.
                </p>
              </div>
            )}

            {burnoutLevel === null ? (
              <MoodInput onCalculate={calculateBurnout} />
            ) : (
              <BurnoutResult result={burnoutLevel} onReset={resetAssessment} />
            )}
          </div>
        );

      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      <FluidBackground />
      <div className="relative z-10">
        <Layout>
          {currentView !== 'landing' && (
            <button
              onClick={() => setCurrentView('landing')}
              className="mb-8 flex items-center gap-2 text-gray-400 hover:text-neon-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          )}
          {renderContent()}
        </Layout>
      </div>
    </>
  );
}

export default App;
