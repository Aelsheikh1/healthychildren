import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import './TipManagement.css';

// Import static tips data
import staticTipsData from '../data/staticTips';

const TipManagement = () => {
  const [tips, setTips] = useState([]);
  const [newTip, setNewTip] = useState({
    title: '',
    text: '',
    image: '',
    icon: 'teacher',
    animation: 'fadeIn'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Use static data instead of API call
    setTips(staticTipsData.tips || []);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTip(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTip(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };

  const extractBulletPoints = (text) => {
    if (!text) return [];
    const lines = text.split('\n').filter(line => line.trim());
    const hasBulletPoints = lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('• '));
    if (hasBulletPoints) {
      return lines.map(line => line.trim().replace(/^•\s*/, ''));
    }
    return lines;
  };

  const addTip = () => {
    if (!newTip.title || !newTip.text) return;
    
    // In static mode, we would normally update the staticTips.js file
    // For demonstration purposes, we'll just show a message
    alert('في وضع البيانات الثابتة، يمكنك تعديل الملف src/data/staticTips.js مباشرة لإضافة نصائح جديدة');
    
    // For UI demonstration, we'll add the tip to the local state
    const newTipWithId = {
      ...newTip,
      id: `temp-${Date.now()}`,
      image: selectedImage ? URL.createObjectURL(selectedImage) : ''
    };
    
    setTips([...tips, newTipWithId]);
    setNewTip({ title: '', text: '', image: '', icon: 'teacher', animation: 'fadeIn' });
    setSelectedImage(null);
  };

  const editTip = (tip) => {
    // In static mode, we would normally update the staticTips.js file
    alert('في وضع البيانات الثابتة، يمكنك تعديل الملف src/data/staticTips.js مباشرة لتعديل النصائح');
    // For demonstration, we'll just show the navigation
    navigate(`/edit-tip/${encodeURIComponent(tip.title)}`, { state: tip });
  };

  const deleteTip = (tip) => {
    // In static mode, we would normally update the staticTips.js file
    alert('في وضع البيانات الثابتة، يمكنك تعديل الملف src/data/staticTips.js مباشرة لحذف النصائح');
    
    // For UI demonstration, we'll remove the tip from the local state
    setTips(tips.filter(t => t.id !== tip.id));
  };

  return (
    <div className="tip-management">
      <h2>إدارة النصائح</h2>
      
      <div className="static-mode-notice">
        <FaInfoCircle /> 
        <span>وضع البيانات الثابتة: لإجراء تغييرات دائمة، يرجى تعديل الملف <code>src/data/staticTips.js</code> مباشرة.</span>
      </div>
      <div className="form-container">
        <div className="form-group">
          <label>العنوان:</label>
          <input type="text" name="title" value={newTip.title} onChange={handleInputChange} placeholder="أدخل عنوان النصيحة" style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label>النص:</label>
          <textarea name="text" value={newTip.text} onChange={handleInputChange} placeholder="أدخل نص النصيحة (يمكنك إضافة نقاط باستخدام رمز •)" rows="5" className="bullet-points-textarea" style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label>الصورة:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%' }} />
          {selectedImage && (
            <div className="image-preview-container">
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="image-preview" />
              <button onClick={() => { setSelectedImage(null); setNewTip(prev => ({ ...prev, image: '' })); }} className="remove-image-button">إزالة الصورة</button>
            </div>
          )}
        </div>
        <div className="form-group">
          <label>الرمز:</label>
          <select name="icon" value={newTip.icon} onChange={handleInputChange} style={{ width: '100%' }}>
            <option value="teacher">معلم</option>
            <option value="student">طالب</option>
            <option value="book">كتاب</option>
            <option value="lightbulb">فكرة</option>
          </select>
        </div>
        <div className="form-group">
          <label>الحركة:</label>
          <select name="animation" value={newTip.animation} onChange={handleInputChange} style={{ width: '100%' }}>
            <option value="fadeIn">ظهور تدريجي</option>
            <option value="slideIn">انزلاق</option>
            <option value="bounce">ارتداد</option>
          </select>
        </div>
        <button onClick={addTip} className="add-tip-button">إضافة نصيحة</button>
      </div>
      <div className="tips-list">
        <h3>النصائح الحالية</h3>
        {loading ? (
          <div className="loading-message">جاري التحميل...</div>
        ) : tips.length === 0 ? (
          <div className="no-tips-message"><p>لا توجد نصائح متاحة حالياً</p></div>
        ) : (
          <div className="tips-grid">
            {tips.map((tip) => (
              <div key={tip.id} className="tip-card">
                <h4 className="tip-title">{tip.title}</h4>
                <div className="tip-text-container">
                  {extractBulletPoints(tip.text).map((line, index) => (
                    <p key={index} className="tip-text">{line.trim().startsWith('•') ? line : `• ${line}`}</p>
                  ))}
                </div>
                <div className="tip-actions">
                  <button onClick={() => editTip(tip)} className="edit-button"><FaEdit /> تعديل</button>
                  <button onClick={() => deleteTip(tip)} className="delete-button"><FaTrash /> حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipManagement;
