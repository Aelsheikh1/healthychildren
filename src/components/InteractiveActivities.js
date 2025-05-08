import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCog } from 'react-icons/fa';
import './InteractiveActivities.css';
import { getAvailableFoods, updateFoodName, updateFoodImage } from '../utils/foodManager';

const InteractiveActivities = () => {
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [availableFoods, setAvailableFoods] = useState([]);
  const [droppedFoods, setDroppedFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [wrongMessage, setWrongMessage] = useState('');
  const [gameFinished, setGameFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const plateRef = useRef(null);
  const celebrationMessages = [
    'رائع! أحسنت!',
    'ممتاز! أنت بطل!',
    'أحسنت الصنع! استمر!',
  ];

  // Initialize available foods
  useEffect(() => {
    let isMounted = true;
    getAvailableFoods().then((foods) => {
      if (isMounted) {
        setAvailableFoods(foods);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Initialize game with random foods (6 healthy + 3 unhealthy)
  useEffect(() => {
    let isMounted = true;
    getAvailableFoods().then((foods) => {
      if (isMounted) {
        const healthyFoods = foods.filter(food => food.type === 'healthy');
        const unhealthyFoods = foods.filter(food => food.type === 'unhealthy');

        const selectedHealthy = healthyFoods.sort(() => 0.5 - Math.random()).slice(0, 5);
        const selectedUnhealthy = unhealthyFoods.sort(() => 0.5 - Math.random()).slice(0, 3);

        setAvailableFoods([...selectedHealthy, ...selectedUnhealthy].sort(() => 0.5 - Math.random()));
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!loading && availableFoods.length === 0 && (droppedFoods.length > 0)) {
      setGameFinished(true);
      setTimeout(() => setGameFinished(false), 4000);
    }
  }, [availableFoods, droppedFoods, loading]);

  const handleDragStart = (e, food) => {
    if (food.type !== 'healthy') {
      setWrongMessage('هذا الطعام غير صحي! جرب طعامًا صحيًا.');
      setTimeout(() => setWrongMessage(''), 1500);
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify(food));
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const droppedFood = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const isDuplicate = droppedFoods.some(food => food.id === droppedFood.id);
    
    if (!isDuplicate) {
      if (droppedFood.type === 'healthy') {
        const updatedDroppedFoods = [...droppedFoods, droppedFood];
        setDroppedFoods(updatedDroppedFoods);
        setScore(prev => prev + 1);
        setCelebrationMessage(celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1200);
        const updatedAvailableFoods = availableFoods.filter(food => food.id !== droppedFood.id);
        setAvailableFoods(updatedAvailableFoods);
        if (updatedDroppedFoods.length === 5) {
          setGameStatus('won');
          setGameFinished(true);
          setTimeout(() => {
            setGameFinished(false);
            resetGame();
          }, 4000);
          return;
        }
      } else {
        setWrongMessage('هذا الطعام غير صحي! جرب طعامًا صحيًا.');
        setTimeout(() => setWrongMessage(''), 1500);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setDroppedFoods([]);
    setWrongMessage('');
    setShowCelebration(false);
    setGameFinished(false);
    setLoading(true);
    getAvailableFoods().then((foods) => {
      setAvailableFoods(foods);
      setLoading(false);
    });
  };

  const handleFoodNameEdit = (food) => {
    setEditingFood(food.id);
  };

  const handleFoodNameChange = (e, food) => {
    const newName = e.target.value;
    setAvailableFoods(availableFoods.map(f => f.id === food.id ? { ...f, name: newName } : f));
  };

  const handleFoodNameBlur = () => {
    setEditingFood(null);
  };

  const handleFoodNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditingFood(null);
    }
  };

  return (
    <div className="interactive-activities" dir="rtl">
      <div className="game-container">
        <div className="game-header">
          <h1>طبق الطعام المتوازن</h1>
          <p>ساعد الطفل على التعرف على الأطعمة الصحية عن طريق سحب الأطعمة الجيدة إلى الطبق</p>
        </div>
        
        {showCelebration && (
          <div className="celebration">
            <div className="confetti-container">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`confetti confetti-${i + 1}`}></div>
              ))}
            </div>
            <div className="celebration-content">
              <h2 className="celebration-text">{celebrationMessage}</h2>
              <div className="celebration-emoji">
                <span className="emoji emoji-1">🎉</span>
                <span className="emoji emoji-2">🌟</span>
                <span className="emoji emoji-3">👏</span>
              </div>
            </div>
          </div>
        )}

        {gameFinished && (
          <div className="final-celebration">
            <div className="balloon-container">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`balloon balloon-${i % 6}`}></div>
              ))}
            </div>
            <div className="final-celebration-content">
              <h2 className="final-celebration-text">🎈🎉 تهانينا! أنهيت اللعبة! 🎉🎈</h2>
              <div className="final-celebration-emoji">
                <span className="emoji">🥳</span>
                <span className="emoji">🎊</span>
                <span className="emoji">🎂</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button className="start-over-btn" onClick={resetGame}>ابدأ من جديد</button>
              </div>
            </div>
          </div>
        )}

        <div className="game-board">
          <div className="food-options-container">
            <div className="food-options">
              {availableFoods.map((food) => (
                <div
                  key={food.id}
                  className={`food-item`}
                  draggable={food.type === 'healthy'}
                  onDragStart={(e) => handleDragStart(e, food)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="food-item-content">
                    <div className="food-image-container">
                      <img 
                        src={food.image} 
                        alt={food.name} 
                        className="food-image food-image-large" 
                        onClick={() => handleFoodNameEdit(food)}
                      />
                    </div>
                    <div className="food-name" onClick={() => handleFoodNameEdit(food)}>
                      {editingFood === food.id ? (
                        <input
                          type="text"
                          value={food.name}
                          onChange={(e) => handleFoodNameChange(e, food)}
                          onBlur={handleFoodNameBlur}
                          onKeyDown={handleFoodNameKeyDown}
                          autoFocus
                        />
                      ) : (
                        food.name
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="plate-container">
            <div 
              className="plate-container"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              ref={plateRef}
            >
              <div className="plate-image"></div>
              {droppedFoods.length === 0 ? (
                <div className="plate-empty">
                  <span className="plate-text">اسحب الأطعمة الصحية إلى الطبق</span>
                </div>
              ) : (
                <div className="dropped-foods">
                  {droppedFoods.map(food => (
                    <div key={food.id} className="food-item dropped-food">
                      <img src={food.image} alt={food.name} className="food-image" />
                      <span className="food-name">{food.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="score-container">
          <div className="score-badge">
            <div className="score-inner">
              <h3>النتيجة: {score}/5</h3>
              <div className="progress-bar">
                <div className="progress" style={{width: `${(score / 5) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {wrongMessage && (
        <div className="wrong-message-popup">
          {wrongMessage}
        </div>
      )}
    </div>
  );
};

export default InteractiveActivities;