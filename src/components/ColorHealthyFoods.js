import React, { useState, useEffect } from 'react';
import { parse } from 'svgson';
import './ColorHealthyFoods.css';

const healthyDir = '/images/coloring-foods/bwhealthy';
const unhealthyDir = '/images/coloring-foods/bwunhealthy';
const manifestPath = '/images/coloring-foods/manifest.json';

const healthyColors = ['#4CAF50', '#8BC34A', '#FFD600', '#FF7043', '#F44336', '#FF9800'];
const unhealthyColors = ['#E57373', '#FFD600', '#A1887F', '#90A4AE'];

function ColorHealthyFoods() {
  const [foods, setFoods] = useState([]);
  const [colored, setColored] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [modalFood, setModalFood] = useState(null);
  const [selectedColor, setSelectedColor] = useState(healthyColors[0]);
  const [colorMap, setColorMap] = useState(() => {
    // Load from sessionStorage if available
    const saved = sessionStorage.getItem('coloringGameColorMap');
    return saved ? JSON.parse(saved) : {};
  });
  const [shakeId, setShakeId] = useState(null);
  const [svgJson, setSvgJson] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');
  const [warnMsg, setWarnMsg] = useState('');
  const [debugMsg, setDebugMsg] = useState('');

  useEffect(() => {
    async function loadFoods() {
      const res = await fetch(manifestPath);
      const manifest = await res.json();
      const healthyFoods = (manifest.healthy || []).map((file, i) => ({
        id: `healthy-${i}`,
        name: file.replace(/\.svg$/, ''),
        type: 'healthy',
        svg: `${healthyDir}/${file}`
      }));
      const unhealthyFoods = (manifest.unhealthy || []).map((file, i) => ({
        id: `unhealthy-${i}`,
        name: file.replace(/\.svg$/, ''),
        type: 'unhealthy',
        svg: `${unhealthyDir}/${file}`
      }));
      setFoods([...healthyFoods, ...unhealthyFoods]);
    }
    loadFoods();
  }, []);

  useEffect(() => {
    // Save colorMap to sessionStorage
    sessionStorage.setItem('coloringGameColorMap', JSON.stringify(colorMap));
  }, [colorMap]);

  const healthyIds = foods.filter(f => f.type === 'healthy').map(f => f.id);

  const handleFoodClick = async (food) => {
    if (food.type === 'healthy') {
      setModalFood(food);
      setSelectedColor(healthyColors[0]);
      setSaveMsg('');
      setWarnMsg('');
      setDebugMsg('');
      // Fetch and parse SVG as JSON
      const res = await fetch(food.svg);
      const text = await res.text();
      const json = await parse(text);
      setSvgJson(json);
      console.log('Parsed SVG JSON:', json);
      setDebugMsg('SVG parsed. Check console for structure.');
    } else {
      setShakeId(food.id);
      setTimeout(() => setShakeId(null), 600);
    }
  };

  // Save coloring explicitly
  const handleSave = () => {
    sessionStorage.setItem('coloringGameColorMap', JSON.stringify(colorMap));
    setSaveMsg('تم حفظ التلوين!');
    setTimeout(() => setSaveMsg(''), 1500);
  };

  // Reset coloring for current food
  const handleReset = () => {
    if (!modalFood) return;
    const newMap = { ...colorMap };
    newMap[modalFood.id] = {};
    setColorMap(newMap);
    setSaveMsg('تمت إعادة التلوين!');
    setTimeout(() => setSaveMsg(''), 1500);
    setSvgJson({ ...svgJson }); // force re-render
  };

  // Recursive function to render SVG JSON as React elements
  function renderSvgNode(node, foodId) {
    if (!node) return null;
    console.log('Rendering node:', node); // Debug: log each node
    const { name, type, value, attributes, children } = node;
    if (type === 'text') return value;
    let props = { ...attributes };
    // If this is a colorable part
    if (attributes && attributes.id && attributes.id.startsWith('part-')) {
      const partId = attributes.id;
      props.onClick = (e) => {
        e.stopPropagation();
        console.log('Clicked part:', partId, 'with color', selectedColor);
        setDebugMsg(`Clicked part: ${partId} with color ${selectedColor}`);
        const newMap = { ...colorMap };
        if (!newMap[foodId]) newMap[foodId] = {};
        newMap[foodId][partId] = selectedColor;
        setColorMap(newMap);
      };
      props.style = { cursor: 'pointer', stroke: selectedColor, strokeWidth: 2 };
      // Set fill from colorMap or fallback
      props.fill = (colorMap[foodId] && colorMap[foodId][partId]) || attributes.fill || '#fff';
    }
    // Recursively render children with unique keys
    return React.createElement(
      name,
      props,
      children && children.length > 0
        ? children.map((child, i) => {
            const element = renderSvgNode(child, foodId);
            return React.isValidElement(element)
              ? React.cloneElement(element, { key: child.attributes?.id || i })
              : element;
          })
        : null
    );
  }

  // Check if all parts of a healthy food are colored
  useEffect(() => {
    if (!modalFood || !svgJson) return;
    const parts = [];
    function collectParts(node) {
      if (node.attributes && node.attributes.id && node.attributes.id.startsWith('part-')) {
        parts.push(node.attributes.id);
      }
      if (node.children) node.children.forEach(collectParts);
    }
    collectParts(svgJson);
    const foodPartColors = (colorMap[modalFood.id] || {});
    if (parts.length > 0 && parts.every(pid => foodPartColors[pid])) {
      if (!colored.includes(modalFood.id)) {
        const newColored = [...colored, modalFood.id];
        setColored(newColored);
        if (newColored.length === healthyIds.length) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }
      setModalFood(null);
    }
  }, [colorMap, modalFood, svgJson, colored, healthyIds.length]);

  // Check if there are colorable parts
  function hasColorableParts(node) {
    if (!node) return false;
    if (node.attributes && node.attributes.id && node.attributes.id.startsWith('part-')) return true;
    if (node.children) return node.children.some(hasColorableParts);
    return false;
  }

  return (
    <div className="color-healthy-foods-game" dir="rtl">
      <h1 className="color-game-title">لون الأطعمة الصحية فقط</h1>
      <div className="color-foods-grid">
        {foods.map(food => (
          <div
            key={food.id}
            className={`color-food-frame ${food.type} ${colored.includes(food.id) ? 'colored' : ''} ${shakeId === food.id ? 'shake' : ''}`}
            onClick={() => handleFoodClick(food)}
            title={food.name}
            tabIndex={0}
            style={{ cursor: food.type === 'healthy' ? 'pointer' : 'not-allowed' }}
          >
            <img
              src={food.svg}
              alt={food.name}
              className="food-svg-img food-svg-thumb"
              style={{ filter: colored.includes(food.id) ? '' : 'grayscale(1)', background: (colorMap[food.id] && Object.values(colorMap[food.id])[0]) || '#fff' }}
              width={120}
              height={120}
            />
            <div className="food-label">{food.name}</div>
          </div>
        ))}
      </div>
      {modalFood && (
        <div className="color-modal-overlay" onClick={() => setModalFood(null)}>
          <div className="color-modal" onClick={e => e.stopPropagation()}>
            <h2>اختر لونًا ثم اضغط على جزء من الصورة للتلوين</h2>
            <div className="color-palette">
              {healthyColors.map(color => (
                <button
                  key={color}
                  className="color-palette-btn"
                  style={{ background: color, border: selectedColor === color ? '2px solid #333' : '2px solid #fff' }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            <div className="color-hint">اختر لونًا ثم اضغط على الجزء المناسب من الصورة لتلوينه</div>
            {warnMsg && <div className="color-warning">{warnMsg}</div>}
            <div className="food-svg-large" style={{ width: 500, height: 500, maxWidth: '90vw', maxHeight: '70vh', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {svgJson && hasColorableParts(svgJson)
                ? renderSvgNode({ ...svgJson, attributes: { ...(svgJson.attributes || {}), className: 'food-svg-large' } }, modalFood.id)
                : <div style={{color:'#d32f2f',textAlign:'center',marginTop:40}}>⚠️ لا توجد أجزاء قابلة للتلوين في هذه الصورة<br/>تأكد من أن الأجزاء لها معرفات part-</div>}
            </div>
            <div className="color-modal-actions">
              <button className="save-modal-btn" onClick={handleSave}>حفظ التلوين</button>
              <button className="reset-modal-btn" onClick={handleReset}>إعادة التلوين</button>
              {saveMsg && <span className="color-save-msg">{saveMsg}</span>}
            </div>
            <button className="close-modal-btn" onClick={() => setModalFood(null)}>إغلاق</button>
          </div>
        </div>
      )}
      {showCelebration && (
        <div className="color-celebration">
          <div className="color-balloons">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`color-balloon color-balloon-${i % 5}`}></div>
            ))}
          </div>
          <div className="color-celebration-text">🎉 أحسنت! لونت كل الأطعمة الصحية! 🎉</div>
        </div>
      )}
    </div>
  );
}

export default ColorHealthyFoods; 