import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
const healthyFoodImage = 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png';

function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-page" dir="rtl">
      <div className="landing-content">
        <img 
          src={healthyFoodImage} 
          alt="Healthy Food Illustration" 
          className="hero-image"
        />
        <h1 className="main-title">وجبة في معلومة</h1>
        <p className="subtitle">تعلم عن الطعام الصحي بطريقة ممتعة</p>
        <button className="start-button" onClick={handleStart}>أبدء</button>
      </div>
    </div>
  );
}

export default LandingPage;
