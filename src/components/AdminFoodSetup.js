import React, { useState } from 'react';
import './AdminFoodSetup.css';

const AdminFoodSetup = () => {
  const [foodName, setFoodName] = useState('');
  const [foodImage, setFoodImage] = useState(null);
  const [foodCategory, setFoodCategory] = useState('healthy');
  const [foodsList, setFoodsList] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setFoodImage(reader.result);
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!foodName || !foodImage) {
      alert('يرجى إدخال اسم الطعام وصورته');
      return;
    }

    const newFood = {
      id: Date.now(),
      name: foodName,
      image: foodImage,
      category: foodCategory
    };

    setFoodsList([...foodsList, newFood]);
    
    // Reset form
    setFoodName('');
    setFoodImage(null);
    document.getElementById('imageUpload').value = '';
  };

  const handleDelete = (id) => {
    setFoodsList(foodsList.filter(food => food.id !== id));
  };

  return (
    <div className="admin-food-setup" dir="rtl">
      <div className="admin-container">
        <h1>إدارة الأطعمة التعليمية</h1>
        
        <form onSubmit={handleSubmit} className="food-form">
          <div className="form-group">
            <label htmlFor="foodName">اسم الطعام</label>
            <input 
              type="text" 
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="أدخل اسم الطعام"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUpload">صورة الطعام</label>
            <input 
              type="file" 
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
            {foodImage && (
              <div className="image-preview">
                <img src={foodImage} alt="معاينة الطعام" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="foodCategory">تصنيف الطعام</label>
            <select 
              id="foodCategory"
              value={foodCategory}
              onChange={(e) => setFoodCategory(e.target.value)}
            >
              <option value="healthy">صحي</option>
              <option value="unhealthy">غير صحي</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            إضافة الطعام
          </button>
        </form>

        <div className="foods-list">
          <h2>قائمة الأطعمة</h2>
          {foodsList.map((food) => (
            <div key={food.id} className="food-item-admin">
              <img src={food.image} alt={food.name} />
              <div className="food-details">
                <span>{food.name}</span>
                <span className={`category ${food.category}`}>
                  {food.category === 'healthy' ? 'صحي' : 'غير صحي'}
                </span>
              </div>
              <button 
                onClick={() => handleDelete(food.id)} 
                className="delete-btn"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminFoodSetup;
