import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to close the menu (for when a link is clicked)
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-logo">
          <h1>وجبة في معلومة</h1>
        </div>
        
        {/* Mobile menu toggle button */}
        {isMobile && (
          <button 
            className={`mobile-nav-toggle ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
        
        {/* Navigation items - shown normally on desktop, controlled by menuOpen state on mobile */}
        <div className={`nav-items ${isMobile ? 'mobile' : ''} ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-item" onClick={closeMenu}>
            <span className="nav-icon">🏠</span>
            الرئيسية
          </Link>
          <Link to="/interactive-activities" className="nav-item" onClick={closeMenu}>
            <span className="nav-icon">🎯</span>
            الأنشطة التفاعلية
          </Link>
          <Link to="/videos" className="nav-item" onClick={closeMenu}>
            <span className="nav-icon">🎥</span>
            الفيديوهات التعليمية
          </Link>
          <Link to="/teacher-tips" className="nav-item" onClick={closeMenu}>
            <span className="nav-icon">👩‍🏫</span>
            نصائح للأمهات
          </Link>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMobile && menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  );
};

export default Navigation;
