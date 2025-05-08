import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './NutritionQuizGame.css';
import { 
  FaCheckCircle, FaTimesCircle, FaCheck, FaTimes, FaTrophy, 
  FaRedo, FaInfo, FaAppleAlt
} from 'react-icons/fa';
import Confetti from 'react-confetti';
import { nutritionQuizQuestions } from '../data/nutritionQuizQuestions';

const foodIcons = {
  apple: { icon: '🍎', color: '#e74c3c' },
  chocolate: { icon: '🍫', color: '#6b4423' },
  spinach: { icon: '🥬', color: '#27ae60' },
  fries: { icon: '🍟', color: '#f39c12' },
  milk: { icon: '🥛', color: '#3498db' },
  soda: { icon: '🥤', color: '#9b59b6' },
  nuts: { icon: '🥜', color: '#d35400' },
  bread: { icon: '🍞', color: '#f1c40f' },
  fish: { icon: '🐟', color: '#3498db' },
  sugar: { icon: '🍚', color: '#ecf0f1' },
  egg: { icon: '🥚', color: '#f1c40f' },
  pizza: { icon: '🍕', color: '#e74c3c' },
  chips: { icon: '🍟', color: '#f39c12' }
};

const foodNames = {
  apple: "تفاح",
  chocolate: "شوكولاتة داكنة",
  spinach: "سبانخ",
  fries: "بطاطس مقلية",
  milk: "حليب",
  soda: "مشروبات غازية",
  nuts: "مكسرات",
  bread: "خبز",
  fish: "سمك",
  sugar: "سكر",
  egg: "بيض",
  pizza: "بيتزا",
  chips: "شيبس"
};

function NutritionQuizGame() {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [playConfetti, setPlayConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const question = nutritionQuizQuestions[currentQuestion];

  useEffect(() => {
    if (currentQuestion >= 0) {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setShowHint(false);
    }
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentQuestion]);

  const handleAnswer = (isTrue) => {
    setSelectedAnswer(isTrue);
    const isCorrect = isTrue === question.isTrue;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setPlayConfetti(true);
      setTimeout(() => setPlayConfetti(false), 3000);
      setShowFeedback(true);
      
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        if (currentQuestion < nutritionQuizQuestions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          setShowFinalScore(true);
        }
      }, 3000);
    } else {
      setShowFeedback(true);
      setShowHint(true);
    }
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowCelebration(false);
    setShowHint(false);
    setShowFinalScore(false);
    setPlayConfetti(false);
  };

  const scorePercentage = Math.round((score / nutritionQuizQuestions.length) * 100);
  
  const getFeedbackMessage = () => {
    if (scorePercentage >= 90) return "ممتاز! أنت خبير تغذية حقيقي!";
    if (scorePercentage >= 70) return "جيد جداً! لديك معرفة جيدة بالتغذية!";
    if (scorePercentage >= 50) return "جيد! يمكنك تحسين معرفتك بالتغذية.";
    return "استمر في التعلم عن التغذية الصحية!";
  };

  return (
    <div className="nutrition-quiz-game">
      {playConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          gravity={0.15}
        />
      )}

      {!showFinalScore ? (
        <div className="quiz-container">
          <div className="quiz-header">
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestion + 1) / nutritionQuizQuestions.length) * 100}%` }}
                />
              </div>
              <div className="question-counter">
                السؤال {currentQuestion + 1} من {nutritionQuizQuestions.length}
              </div>
            </div>
          </div>

          <div className="question-section">
            <div className="food-display">
              <div 
                className="food-icon"
                style={{ backgroundColor: foodIcons[question.foodIcon].color }}
              >
                {foodIcons[question.foodIcon].icon}
              </div>
            </div>

            <div className="question-text">{question.question}</div>

            <button 
              className="hint-btn"
              onClick={handleShowHint}
            >
              <FaInfo className="btn-icon" />
              {showHint ? 'إخفاء التلميح' : 'اظهار التلميح'}
            </button>

            {showHint && (
              <div className="hint-box">
                <FaInfo className="hint-icon" />
                <span>{question.hint}</span>
              </div>
            )}

            <div className="answer-buttons">
              <button
                className={`answer-btn true-btn ${selectedAnswer !== null ? (selectedAnswer ? 'correct' : 'incorrect') : ''}`}
                onClick={() => handleAnswer(true)}
                disabled={selectedAnswer !== null && selectedAnswer === question.isTrue}
              >
                <FaCheck className="answer-icon" />
                صحيح
              </button>
              <button
                className={`answer-btn false-btn ${selectedAnswer !== null ? (selectedAnswer ? 'incorrect' : 'correct') : ''}`}
                onClick={() => handleAnswer(false)}
                disabled={selectedAnswer !== null && selectedAnswer === question.isTrue}
              >
                <FaTimes className="answer-icon" />
                خطأ
              </button>
            </div>

            {showFeedback && (
              <div className={`feedback-box ${selectedAnswer === question.isTrue ? 'correct' : 'incorrect'}`}>
                {selectedAnswer === question.isTrue ? (
                  <FaCheckCircle className="feedback-icon" />
                ) : (
                  <FaTimesCircle className="feedback-icon" />
                )}
                <div className="feedback-content">
                  <div className="feedback-text">
                    {selectedAnswer === question.isTrue ? 'إجابة صحيحة!' : 'إجابة خاطئة!'}
                  </div>
                  <div className="feedback-detail">
                    {selectedAnswer === question.isTrue ? question.feedback : question.hint}
                  </div>
                  {selectedAnswer !== question.isTrue && (
                    <div className="try-again">حاول مرة أخرى!</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="result-container">
          <div className="result-header">
            <FaTrophy className="trophy-icon" />
            <h2>أحسنت! اكتمل الاختبار</h2>
          </div>

          <div className="score-display">
            <div className="score-value">
              {score} / {nutritionQuizQuestions.length}
            </div>
            <div className="score-percentage">
              <div className="percentage-bar">
                <div 
                  className="percentage-fill" 
                  style={{ width: `${scorePercentage}%` }}
                />
              </div>
              <span>{scorePercentage}%</span>
            </div>
          </div>

          <div className="feedback-message">{getFeedbackMessage()}</div>

          <button className="restart-btn" onClick={resetQuiz}>
            <FaRedo className="btn-icon" />
            إعادة الاختبار
          </button>
        </div>
      )}

      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-box">
            <FaCheckCircle className="celebration-icon" />
            <h3>إجابة صحيحة!</h3>
            <p>{question.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NutritionQuizGame;