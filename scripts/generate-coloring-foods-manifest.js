const fs = require('fs');
const path = require('path');

const healthyDir = path.join(__dirname, '../public/images/coloring-foods/bwhealthy');
const unhealthyDir = path.join(__dirname, '../public/images/coloring-foods/bwunhealthy');
const manifestPath = path.join(__dirname, '../public/images/coloring-foods/manifest.json');

function getSvgFiles(dir) {
  return fs.readdirSync(dir).filter(file => file.endsWith('.svg'));
}

const healthy = getSvgFiles(healthyDir);
const unhealthy = getSvgFiles(unhealthyDir);

const manifest = {
  healthy,
  unhealthy
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Manifest generated with ${healthy.length} healthy and ${unhealthy.length} unhealthy items.`); 