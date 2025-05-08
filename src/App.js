import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import './i18n';
import SplashScreen from './components/SplashScreen';

import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import InteractiveActivitiesList from './components/InteractiveActivitiesList';
import ActivitySetup from './components/ActivitySetup';
import HealthyUnusefulGame from './components/HealthyUnusefulGame';
import InteractiveActivities from './components/InteractiveActivities';
import Navigation from './components/Navigation';
import Videos from './components/Videos';
import TeacherTips from './components/TeacherTips';
import TeacherTipDetail from './components/TeacherTipDetail';
import TipManagement from './components/TipManagement';
import ColorHealthyFoods from './components/ColorHealthyFoods';
import NutritionQuizGame from './components/NutritionQuizGame';
import FoodColoringGame from './components/FoodColoringGame';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  // Listen for content updates
  useEffect(() => {
    // Listen for content processed message
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CONTENT_PROCESSED') {
        // Force a re-render to update content
        window.location.reload();
      }
    });

    // Clean up event listener
    return () => {
      window.removeEventListener('message', (event) => {
        if (event.data && event.data.type === 'CONTENT_PROCESSED') {
          window.location.reload();
        }
      });
    };
  }, []);

  // Always show splash screen on app start
  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <TransitionGroup>
          <CSSTransition
            key={window.location.pathname}
            timeout={300}
            classNames="transition"
            unmountOnExit
          >
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/interactive-activities" element={<InteractiveActivitiesList />} />
                <Route path="/activity-setup" element={<ActivitySetup />} />
                <Route path="/interactive-activities/healthy-food-sorting" element={<InteractiveActivities />} />
                <Route path="/interactive-activities/discrimination-between-healthy-and-unhealthy" element={<HealthyUnusefulGame />} />
                <Route path="/activities" element={<InteractiveActivities />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/teacher-tips" element={<TeacherTips />} />
                <Route path="/tips/:title" element={<TeacherTipDetail />} />
                <Route path="/manage-tips" element={<TipManagement />} />
                <Route path="/interactive-activities/color-healthy-foods" element={<ColorHealthyFoods />} />
                <Route path="/interactive-activities/nutrition-quiz" element={<NutritionQuizGame />} />
                <Route path="/interactive-activities/food-coloring" element={<FoodColoringGame />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>

      </div>
    </Router>
  );
}

export default App;
