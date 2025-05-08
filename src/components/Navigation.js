import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navigation.css';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-logo">
          <h1>وجبة في معلومة</h1>
        </div>
        <div className="nav-mobile-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div className={`nav-items ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-item" onClick={toggleMobileMenu}>
            <span className="nav-icon">🏠</span>
            الرئيسية
          </Link>
          <Link to="/interactive-activities" className="nav-item" onClick={toggleMobileMenu}>
            <span className="nav-icon">🎯</span>
            الأنشطة التفاعلية
          </Link>
          <Link to="/videos" className="nav-item" onClick={toggleMobileMenu}>
            <span className="nav-icon">🎥</span>
            الفيديوهات التعليمية
          </Link>
          <Link to="/teacher-tips" className="nav-item" onClick={toggleMobileMenu}>
            <span className="nav-icon">👩‍🏫</span>
            نصائح للأمهات
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
