import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-logo">
          <h1>وجبة في معلومة</h1>
        </div>
        <div className="nav-items">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            الرئيسية
          </Link>
          <Link to="/interactive-activities" className="nav-item">
            <span className="nav-icon">🎯</span>
            الأنشطة التفاعلية
          </Link>
          <Link to="/videos" className="nav-item">
            <span className="nav-icon">🎥</span>
            الفيديوهات التعليمية
          </Link>
          <Link to="/teacher-tips" className="nav-item">
            <span className="nav-icon">👩‍🏫</span>
            نصائح للأمهات
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
