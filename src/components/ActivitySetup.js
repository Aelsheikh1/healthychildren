import React, { useState } from 'react';
import './ActivitySetup.css';

const ActivitySetup = () => {
  const [activities, setActivities] = useState([
    {
      id: 'healthy-food-sorting',
      name: 'فرز الأطعمة الصحية',
      description: 'اسحب الأطعمة الصحية إلى الطبق',
      foods: []
    },
    {
      id: 'food-nutrition-quiz',
      name: 'اختبار التغذية',
      description: 'اختر معلوماتك عن التغذية',
      foods: []
    }
  ]);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newFood, setNewFood] = useState({
    name: '',
    type: 'healthy',
    image: null
  });

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFood(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFood = () => {
    if (selectedActivity && newFood.name && newFood.image) {
      const updatedActivities = activities.map(activity => 
        activity.id === selectedActivity.id 
          ? {
              ...activity, 
              foods: [...activity.foods, {
                ...newFood,
                id: Date.now()
              }]
            }
          : activity
      );
      
      setActivities(updatedActivities);
      setNewFood({ name: '', type: 'healthy', image: null });
    }
  };

  const removeFood = (activityId, foodId) => {
    const updatedActivities = activities.map(activity => 
      activity.id === activityId 
        ? { ...activity, foods: activity.foods.filter(food => food.id !== foodId) }
        : activity
    );
    setActivities(updatedActivities);
  };

  return (
    <div className="activity-setup" dir="rtl">
      <h1>إعداد الأنشطة التعليمية</h1>
      
      <div className="activity-selector">
        <h2>اختر النشاط</h2>
        {activities.map(activity => (
          <button 
            key={activity.id}
            onClick={() => handleActivitySelect(activity)}
            className={selectedActivity?.id === activity.id ? 'selected' : ''}
          >
            {activity.name}
          </button>
        ))}
      </div>

      {selectedActivity && (
        <div className="activity-details">
          <h2>{selectedActivity.name}</h2>
          <p>{selectedActivity.description}</p>

          <div className="food-input">
            <input 
              type="text" 
              placeholder="اسم الطعام"
              value={newFood.name}
              onChange={(e) => setNewFood(prev => ({...prev, name: e.target.value}))}
            />
            <select 
              value={newFood.type}
              onChange={(e) => setNewFood(prev => ({...prev, type: e.target.value}))}
            >
              <option value="healthy">صحي</option>
              <option value="unhealthy">غير صحي</option>
            </select>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            {newFood.image && (
              <img 
                src={newFood.image} 
                alt="Preview" 
                className="image-preview" 
              />
            )}
            <button onClick={addFood}>إضافة طعام</button>
          </div>

          <div className="food-list">
            <h3>الأطعمة المضافة</h3>
            {selectedActivity.foods.map(food => (
              <div key={food.id} className="food-item">
                <img src={food.image} alt={food.name} />
                <span>{food.name}</span>
                <span>{food.type === 'healthy' ? 'صحي' : 'غير صحي'}</span>
                <button onClick={() => removeFood(selectedActivity.id, food.id)}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySetup;
