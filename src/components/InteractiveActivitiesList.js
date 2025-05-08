import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InteractiveActivitiesList.css';

const activities = [
  {
    id: 'healthy-food-sorting',
    title: 'طبق الطعام المتوازن',
    icon: 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png',
    route: '/interactive-activities/healthy-food-sorting'
  },
  {
    id: 'discrimination-between-healthy-and-unhealthy',
    title: 'صحي وغير صحي',
    icon: 'https://cdn-icons-png.flaticon.com/512/706/706164.png',
    route: '/interactive-activities/discrimination-between-healthy-and-unhealthy'
  },
  {
    id: 'food-coloring',
    title: 'تلوين الطعام الصحي',
    icon: 'https://cdn-icons-png.flaticon.com/512/3448/3448063.png',
    route: '/interactive-activities/food-coloring'
  },
  {
    id: 'food-nutrition-quiz',
    title: 'اختر اجابتك',
    icon: 'https://cdn-icons-png.flaticon.com/512/1205/1205526.png',
    route: '/interactive-activities/nutrition-quiz'
  }
];

function InteractiveActivitiesList() {
  const navigate = useNavigate();

  const handleActivityClick = (route) => {
    navigate(route);
  };

  return (
    <div className="interactive-activities-list" dir="rtl">
      <div className="activities-container">
        <h1>أنشطة تعليمية تفاعلية</h1>
        <div className="activities-grid">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="activity-card fixed-card-size"
              onClick={() => handleActivityClick(activity.route)}
            >
              <img 
                src={activity.icon} 
                alt={activity.title} 
                className="activity-icon" 
              />
              <div className="activity-details">
                <h2>{activity.title}</h2>
                <p>{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InteractiveActivitiesList;