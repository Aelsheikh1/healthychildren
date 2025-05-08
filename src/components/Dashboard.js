import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
// Using online image URLs for icons

function Dashboard() {
  const navigate = useNavigate();

  const dashboardButtons = [
    {
      id: 'interactive-activities',
      title: 'أنشطة تفاعلية',
      icon: '🍎', // Apple emoji
      route: '/interactive-activities'
    },
    {
      id: 'educational-videos',
      title: 'فيديوهات تعليمية',
      icon: '🎥', // Film emoji
      route: '/videos'
    },
    {
      id: 'teacher-tips',
      title: 'نصائح للأمهات',
      icon: '👩‍🏫', // Teacher emoji
      route: '/teacher-tips'
    }
  ];

  return (
    <div className="dashboard" dir="rtl">
      <div className="dashboard-content">
        <h1 className="dashboard-title">وجبة في معلومة</h1>
        <div className="dashboard-buttons">
          {dashboardButtons.map((button) => (
            <div 
              key={button.id} 
              className="dashboard-button"
              onClick={() => navigate(button.route)}
            >
              <span className="button-icon">{button.icon}</span>
              <span className="button-title" style={{ userSelect: 'none' }}>{button.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
