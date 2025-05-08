import React from 'react';
import './ColorHealthyFoods.css'; // Reuse the same styles

function ColorUnhealthyFoods() {
  return (
    <div className="color-foods-container" dir="rtl">
      <h1>تلوين الأطعمة غير الصحية</h1>
      <p>اختر الصورة التي تريد تلوينها من القائمة أدناه</p>
      {/* Add your unhealthy foods coloring logic here */}
    </div>
  );
}

export default ColorUnhealthyFoods;
