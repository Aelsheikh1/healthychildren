const fs = require('fs');
const path = require('path');

const usefulDir = path.join(__dirname, '../public/images/healthy-unuseful/healthy-useful');
const unusefulDir = path.join(__dirname, '../public/images/healthy-unuseful/healthy-unusufal');
const outputJson = path.join(__dirname, '../public/images/healthy-unuseful/foods.json');

function getFoodsFromDir(dir, type) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.png'))
    .map((file, idx) => ({
      id: `${type}-${idx + 1}`,
      name: path.parse(file).name,
      type: type,
      image: `/images/healthy-unuseful/${type === 'useful' ? 'healthy-useful' : 'healthy-unusufal'}/${file}`
    }));
}

const usefulFoods = getFoodsFromDir(usefulDir, 'useful');
const unusefulFoods = getFoodsFromDir(unusefulDir, 'unuseful');

const allFoods = [...usefulFoods, ...unusefulFoods];

fs.writeFileSync(outputJson, JSON.stringify(allFoods, null, 2), 'utf8');
console.log(`foods.json generated with ${allFoods.length} items.`); 