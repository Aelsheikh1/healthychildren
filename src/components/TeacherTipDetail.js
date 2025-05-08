import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaStar, FaLightbulb } from 'react-icons/fa';
import { GiTeacher, GiClassroom, GiTeaching, GiAssessment, GiStudent } from 'react-icons/gi';
import { IoIosArrowForward } from 'react-icons/io';
import 'animate.css';
import './TeacherTipDetail.css';

const TeacherTipDetail = () => {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const location = useLocation();
  const [tip, setTip] = useState(location.state || null);

  useEffect(() => {
    if (!tip) {
      const fetchTip = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/tips');
          const data = await response.json();
          const foundTip = data.tips.find(t => t.title === decodedTitle);
          setTip(foundTip);
        } catch (error) {
          setTip(null);
        }
      };
      fetchTip();
    }
  }, [decodedTitle]);

  if (!tip) {
    return <div className="no-content">لا يوجد نص</div>;
  }

  return (
    <div className="teacher-tip-detail">
      <div className="detail-grid">
        <div className="tip-image-container">
          {tip.image ? (
            <img 
              src={tip.image}
              alt={tip.title}
              className={`tip-image animate__${tip.animation}`}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="no-image">لا يوجد صورة</div>
          )}
        </div>
        <div className="text-container">
          <div className="text-content">
            <h2 className="tip-title">{tip.title}</h2>
            <div className="text-description" dangerouslySetInnerHTML={{ __html: tip.text }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTipDetail;
