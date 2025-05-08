const fs = require('fs');
const path = require('path');

const folders = [
  path.join(__dirname, '../public/images/coloring-foods/bwhealthy'),
  path.join(__dirname, '../public/images/coloring-foods/bwunhealthy'),
];

const TAGS = ['g', 'path', 'polygon', 'rect'];

function addIdsToSvg(svgContent) {
  let partCounter = 1;
  // Regex to match tags without id
  TAGS.forEach(tag => {
    // Only add id if not present
    const regex = new RegExp(`<${tag}(?![^>]*id=)([^>]*)>`, 'g');
    svgContent = svgContent.replace(regex, match => {
      return match.replace(
        `<${tag}`,
        `<${tag} id=\"part-${partCounter++}\"`
      );
    });
  });
  return svgContent;
}

folders.forEach(folder => {
  fs.readdirSync(folder).forEach(file => {
    if (file.endsWith('.svg')) {
      const filePath = path.join(folder, file);
      let svg = fs.readFileSync(filePath, 'utf8');
      const updated = addIdsToSvg(svg);
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`Processed: ${filePath}`);
    }
  });
});

console.log('SVG id assignment complete!'); 