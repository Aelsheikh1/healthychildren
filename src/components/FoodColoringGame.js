import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaSave, FaEraser, FaUndo } from 'react-icons/fa';
import { coloringFoodItems } from '../data/coloringFoodItems';
import './FoodColoringGame.css';

function FoodColoringGame() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [currentImage, setCurrentImage] = useState(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [coloredItems, setColoredItems] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const brushSizes = [5, 10, 20, 30, 40];
  const [showCursor, setShowCursor] = useState(false);

  // Color palette
  const colorPalette = [
    '#FF0000', '#FFA500', '#FFFF00', '#00FF00', 
    '#0000FF', '#4B0082', '#EE82EE', '#FF69B4',
    '#FFFFFF', '#C0C0C0', '#808080', '#000000'
  ];

  useEffect(() => {
    if (!isModalOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    
    // Set canvas to exact size
    canvas.width = 350;
    canvas.height = 350;
    
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
      // Clear canvas with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw image scaled to fit 350x350
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    // Hide default cursor
    canvas.style.cursor = 'none';

    return () => {
      // Restore default cursor when modal closes
      canvas.style.cursor = 'auto';
    };
  }, [isModalOpen, currentImage]);

  const handleFoodClick = (food) => {
    if (food.type === 'unhealthy') {
      setShowError(true);
      return;
    }

    setSelectedFood(food);
    setCurrentImage(food.image);
    setIsModalOpen(true);
    setCurrentColor(colorPalette[0]);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (ctxRef.current) {
      ctxRef.current.beginPath();
    }
  };

  const draw = (e) => {
    if (!isDrawing || !currentColor || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let x, y;
    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Ensure coordinates are within canvas
    x = Math.max(0, Math.min(x, canvas.width));
    y = Math.max(0, Math.min(y, canvas.height));

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    
    if (currentColor === '#FFFFFF') {
      // Eraser mode
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1.0;
    } else {
      // Normal drawing mode
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.5;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const resetDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const saveDrawing = () => {
    if (selectedFood && !coloredItems.includes(selectedFood.id)) {
      setColoredItems([...coloredItems, selectedFood.id]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="food-coloring-game">
      <h1>تلوين الطعام الصحي</h1>
      
      {showError && (
        <div className="error-modal">
          <div className="error-modal-content">
            <button className="close-button" onClick={() => setShowError(false)}>❌</button>
            <div className="error-icon">⚠️</div>
            <h3>تنبيه!</h3>
            <p>هذا الطعام غير صحي، الرجاء اختيار طعام صحي!</p>
          </div>
        </div>
      )}
      
      <div className="food-grid">
        {coloringFoodItems.map((food) => (
          <div
            key={food.id}
            className={`food-item ${coloredItems.includes(food.id) ? 'colored' : ''}`}
            onClick={() => handleFoodClick(food)}
          >
            <img src={food.image} alt={food.name} />
            <h3>{food.name}</h3>
            {coloredItems.includes(food.id) && (
              <div className="colored-badge">✓</div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="coloring-modal">
          <div className="coloring-modal-content">
            <h2>تلوين {selectedFood?.name}</h2>
            
            <div className="coloring-canvas-container">
              <canvas
                ref={canvasRef}
                className="coloring-canvas"
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseMove={draw}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={endDrawing}
                onTouchMove={draw}
              />
            </div>

            <div className="brush-size-container">
              <span className="brush-size-label">حجم الفرشاة:</span>
              <select
                className="brush-size-input"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
              >
                {brushSizes.map(size => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
              <div 
                className="brush-size-preview" 
                style={{ 
                  width: `${brushSize}px`,
                  height: `${brushSize}px`,
                  border: `2px solid ${currentColor === '#FFFFFF' ? '#333' : currentColor}`,
                  backgroundColor: currentColor === '#FFFFFF' ? '#FFF' : 'transparent'
                }}
              />
            </div>

            <div className="color-palette">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  className={`color-button ${currentColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>

            <div className="tool-buttons">
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                <FaTimes /> إغلاق
              </button>
              <button className="save-button" onClick={saveDrawing}>
                <FaSave /> حفظ
              </button>
              <button className="reset-button" onClick={resetDrawing}>
                <FaUndo /> إعادة
              </button>
              <button 
                className={`eraser-button ${currentColor === '#FFFFFF' ? 'active' : ''}`}
                onClick={() => setCurrentColor('#FFFFFF')}
              >
                <FaEraser /> ممحاة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodColoringGame;