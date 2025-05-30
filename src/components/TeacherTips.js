import React, { useState, useEffect } from 'react';
import { FaCog, FaTimes, FaEdit, FaSave, FaImage, FaUpload } from 'react-icons/fa';
import './TeacherTips.css';
import 'animate.css';

const TeacherTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState(null);

  useEffect(() => {
    fetchTips();
  }, []);

  const processTips = async () => {
    try {
      console.log('Processing tips...');
      const response = await fetch('/api/process-tips');
      if (!response.ok) {
        console.error('Failed to process tips:', response.statusText);
        throw new Error('Failed to process tips');
      }
      
      // Fetch the updated tips after processing
      fetchTips();
    } catch (error) {
      console.error('Error processing tips:', error);
    }
  };

  const fetchTips = async () => {
    try {
      console.log('Fetching tips.json...');
      const response = await fetch('/data/tips.json');
      if (!response.ok) {
        console.error('Failed to fetch tips:', response.statusText);
        throw new Error('Failed to fetch tips');
      }
      
      const data = await response.json();
      console.log('Received tips:', data);
      setTips(data.tips || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tips:', error);
      setTips([]);
      setLoading(false);
    }
  };

  const handleTipClick = (tip) => {
    setSelectedTip(tip);
  };

  const handleCloseModal = (e) => {
    if (e.target.classList.contains('tip-modal-overlay') || e.target.classList.contains('close-modal-btn')) {
      setSelectedTip(null);
    }
  };

  return (
    <div className="teacher-tips">
      <div className="header">
        <h2>نصائح المعلم</h2>
        <button className="manage-tips-button" onClick={() => window.location.href = '/manage-tips'}>
          <FaCog /> إدارة النصائح
        </button>
      </div>
      {loading ? (
        <div className="loading">
          <div className="spinner">جاري التحميل...</div>
        </div>
      ) : (
        <>
          <div className="tips-grid modern-grid">
            {tips.length === 0 ? (
              <div className="no-tips">
                <div className="no-tips-icon">ℹ️</div>
                <p>لا توجد نصائح متاحة حالياً</p>
              </div>
            ) : (
              tips.map((tip) => (
                <div key={tip.id} className="tip-thumb-card modern-card" onClick={() => handleTipClick(tip)}>
                  <div className="tip-thumb-image modern-thumb">
                    {tip.image ? (
                      <img src={tip.image} alt={tip.title} />
                    ) : (
                      <div className="default-image">💡</div>
                    )}
                  </div>
                  <div className="tip-thumb-title modern-title">{tip.title}</div>
                </div>
              ))
            )}
          </div>
          {selectedTip && (
            <div className="tip-modal-overlay" onClick={handleCloseModal}>
              <div className="tip-modal animate__animated animate__fadeInDown extra-large-modal">
                <div className="modal-header">
                  <div className="close-modal-container">
                    <button className="close-modal-btn" type="button" tabIndex={0} onClick={() => setSelectedTip(null)}><FaTimes /></button>
                  </div>
                </div>
                <h2 className="modal-title">{selectedTip.title}</h2>
                <div className="tip-modal-content">
                  <div className="tip-modal-image">
                    {selectedTip.image ? (
                      <img src={selectedTip.image} alt={selectedTip.title} className="floating-image" />
                    ) : (
                      <div className="default-image">💡</div>
                    )}
                  </div>
                  <div className="tip-modal-text">
                    <h2 className="tip-title" style={{ direction: 'rtl', textAlign: 'right', fontSize: '1.8em', marginBottom: '16px', width: '100%' }}>{selectedTip.title}</h2>
                    <div className="tip-text-container" style={{ direction: 'rtl', textAlign: 'right', width: '100%' }}>
                      {selectedTip.text.split('\n').map((line, idx) => (
                        <p key={idx} className="tip-text" style={{ direction: 'rtl', textAlign: 'right', fontSize: '1.2em', fontWeight: 500, margin: '0 0 10px 0', width: '100%' }}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherTips;
