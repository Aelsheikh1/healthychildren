import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinished }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash screen for 2.5 seconds before starting fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      // After fade out animation completes, call onFinished
      setTimeout(() => {
        if (onFinished) onFinished();
      }, 500); // 500ms for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-image">
          <img src="/splash.png" alt="وجبة في معلومة" className="splash-img" />
        </div>
        <h1 className="splash-title">وجبة في معلومة</h1>
        <p className="splash-tagline">تعلم الغذاء الصحي بطريقة ممتعة</p>
      </div>
    </div>
  );
};

export default SplashScreen;
