const fs = require('fs');
const path = require('path');

const healthyDir = path.join(__dirname, '../public/images/healthy-food-sorting/healthy');
const unhealthyDir = path.join(__dirname, '../public/images/healthy-food-sorting/not-healthy');
const outputJson = path.join(__dirname, '../public/images/healthy-food-sorting/foods.json');

function getFoodsFromDir(dir, type) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.png'))
    .map((file, idx) => ({
      id: `${type}-${idx + 1}`,
      name: path.parse(file).name,
      type: type,
      image: `/images/healthy-food-sorting/${type === 'healthy' ? 'healthy' : 'not-healthy'}/${file}`
    }));
}

const healthyFoods = getFoodsFromDir(healthyDir, 'healthy');
const unhealthyFoods = getFoodsFromDir(unhealthyDir, 'unhealthy');

const allFoods = [...healthyFoods, ...unhealthyFoods];

fs.writeFileSync(outputJson, JSON.stringify(allFoods, null, 2), 'utf8');
console.log(`foods.json generated with ${allFoods.length} items.`); 