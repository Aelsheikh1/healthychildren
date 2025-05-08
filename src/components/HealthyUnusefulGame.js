import React, { useState, useCallback, useEffect, useRef } from 'react';
import '../components/InteractiveActivities.css';
import { getUnusefulFoods } from '../utils/foodManager';

const HealthyUnusefulGame = () => {
  const [score, setScore] = useState(0);
  const [availableFoods, setAvailableFoods] = useState([]);
  const [droppedFoods, setDroppedFoods] = useState({ useful: [], unuseful: [] });
  const [wrongMessage, setWrongMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropFeedback, setDropFeedback] = useState({ useful: '', unuseful: '' });
  const [rowFeedback, setRowFeedback] = useState('');
  const [gameFinished, setGameFinished] = useState(false);
  const celebrationMessages = [
    'رائع! أحسنت!',
    'ممتاز! أنت بطل!',
    'أحسنت الصنع! استمر!',
  ];

  useEffect(() => {
    let isMounted = true;
    getUnusefulFoods().then((foods) => {
      if (isMounted) {
        setAvailableFoods(foods);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!loading && availableFoods.length === 0 && (droppedFoods.useful.length + droppedFoods.unuseful.length > 0)) {
      setGameFinished(true);
      setTimeout(() => setGameFinished(false), 4000);
    }
  }, [availableFoods, droppedFoods, loading]);

  const handleDragStart = useCallback((e, food) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(food));
    e.target.style.opacity = '0.5';
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1';
  }, []);

  const handleDrop = useCallback((e, category) => {
    e.preventDefault();
    const food = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (droppedFoods.useful.some(f => f.id === food.id) || 
        droppedFoods.unuseful.some(f => f.id === food.id)) {
      return;
    }
    if ((category === 'useful' && food.type === 'useful') || 
        (category === 'unuseful' && food.type === 'unuseful')) {
      const newDroppedFoods = { ...droppedFoods };
      newDroppedFoods[category].push(food);
      setDroppedFoods(newDroppedFoods);
      setAvailableFoods(availableFoods.filter(f => f.id !== food.id));
      setScore(prev => prev + 1);
      setShowCelebration(true);
      setDropFeedback(fb => ({ ...fb, [category]: 'correct' }));
      setTimeout(() => setShowCelebration(false), 1200);
      setTimeout(() => setDropFeedback(fb => ({ ...fb, [category]: '' })), 700);
    } else {
      setWrongMessage('خطأ! حاول مرة أخرى');
      setDropFeedback(fb => ({ ...fb, [category]: 'wrong' }));
      setRowFeedback('wrong');
      setTimeout(() => setWrongMessage(''), 1200);
      setTimeout(() => setDropFeedback(fb => ({ ...fb, [category]: '' })), 700);
      setTimeout(() => setRowFeedback(''), 700);
    }
  }, [droppedFoods, availableFoods]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const resetGame = () => {
    setScore(0);
    setDroppedFoods({ useful: [], unuseful: [] });
    setWrongMessage('');
    setShowCelebration(false);
    setGameFinished(false);
    setLoading(true);
    getUnusefulFoods().then((foods) => {
      setAvailableFoods(foods);
      setLoading(false);
    });
  };

  return (
    <div className="interactive-activities" dir="rtl">
      <div className="game-container">
        <div className="game-header">
          <h1>صحي وغير صحي</h1>
          <p>اسحب الأطعمة إلى الصندوق المناسب: صحي أو غير صحي</p>
          <div className="score">النقاط: {score}</div>
        </div>
        {showCelebration && (
          <div className="celebration celebration-burst">
            <div className="confetti-container">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`confetti confetti-${i + 1}`}></div>
              ))}
            </div>
            <div className="celebration-content">
              <h2 className="celebration-text">🎉 أحسنت! 🎉</h2>
              <div className="celebration-emoji">
                <span className="emoji emoji-1">🌟</span>
                <span className="emoji emoji-2">👏</span>
                <span className="emoji emoji-3">🎈</span>
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
        {loading ? (
          <div className="loading">جاري التحميل...</div>
        ) : (
          <>
            <div className={`food-row${rowFeedback ? ' row-wrong' : ''}`} style={{ display: 'flex', flexDirection: 'row', gap: 24, justifyContent: 'center', marginBottom: 40, overflowX: 'auto' }}>
              {availableFoods.map(food => (
                <div
                  key={food.id}
                  className="food-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, food)}
                  onDragEnd={handleDragEnd}
                  style={{ minWidth: 120 }}
                >
                  <div className="food-item-content">
                    <div className="food-image-container">
                      <img src={food.image} alt={food.name} className="food-image food-image-large" />
                    </div>
                    <div className="food-name">
                      {food.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drop-zones" style={{ display: 'flex', flexDirection: 'row', gap: 40, justifyContent: 'center', alignItems: 'stretch' }}>
              <div
                className={`drop-zone ${dropFeedback.useful}`}
                onDrop={(e) => handleDrop(e, 'useful')}
                onDragOver={handleDragOver}
                style={{ flex: 1, minHeight: 300, maxWidth: 350, border: '3px dashed #4CAF50', borderColor: dropFeedback.useful === 'correct' ? '#4CAF50' : dropFeedback.useful === 'wrong' ? '#FF5252' : '#4CAF50', transition: 'border-color 0.3s' }}
              >
                <h3>صحي</h3>
                <div className="dropped-thumbnails">
                  {droppedFoods.useful.map(food => (
                    <div key={food.id} className="dropped-thumbnail">
                      <img src={food.image} alt={food.name} />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`drop-zone ${dropFeedback.unuseful}`}
                onDrop={(e) => handleDrop(e, 'unuseful')}
                onDragOver={handleDragOver}
                style={{ flex: 1, minHeight: 300, maxWidth: 350, border: '3px dashed #e74c3c', borderColor: dropFeedback.unuseful === 'correct' ? '#4CAF50' : dropFeedback.unuseful === 'wrong' ? '#FF5252' : '#e74c3c', transition: 'border-color 0.3s' }}
              >
                <h3>غير صحي</h3>
                <div className="dropped-thumbnails">
                  {droppedFoods.unuseful.map(food => (
                    <div key={food.id} className="dropped-thumbnail">
                      <img src={food.image} alt={food.name} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="game-score" style={{ textAlign: 'center', marginTop: 32, fontSize: '1.5rem', color: '#388E3C', fontWeight: 'bold', letterSpacing: 1 }}>
              النتيجة: {score} / {(droppedFoods.useful.length + droppedFoods.unuseful.length + availableFoods.length)}
            </div>
            {wrongMessage && <div className="wrong-message">{wrongMessage}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default HealthyUnusefulGame;
