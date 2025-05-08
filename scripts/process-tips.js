const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const tipsDir = path.join(__dirname, '../public/tips');
const tipsJsonPath = path.join(__dirname, '../public/data/tips.json');

// Create tips directory if it doesn't exist
if (!fs.existsSync(tipsDir)) {
  fs.mkdirSync(tipsDir, { recursive: true });
}

// Read existing tips
let existingTips = [];
try {
  const tipsJson = fs.readFileSync(tipsJsonPath, 'utf8');
  existingTips = JSON.parse(tipsJson).tips;
} catch (error) {
  console.log('No existing tips found, starting fresh');
}

// Process text files in tips directory
const textFiles = fs.readdirSync(tipsDir)
  .filter(file => file.endsWith('.txt'));

const newTips = [];

textFiles.forEach(textFile => {
  const filePath = path.join(tipsDir, textFile);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Split content into title and text
  const [title, ...textLines] = content.split('\n');
  const text = textLines.join(' ').trim();
  
  // Create a unique ID
  const id = uuidv4();
  
  // Create a matching image name (without extension)
  const imageBaseName = path.basename(textFile, '.txt');
  const imageFile = fs.readdirSync(tipsDir)
    .find(file => file.startsWith(imageBaseName) && file !== textFile);
  
  if (!imageFile) {
    console.warn(`No matching image found for ${textFile}`);
    return;
  }

  // Add the new tip
  newTips.push({
    id,
    title: title.trim(),
    text: text.trim(),
    image: `/tips/${imageFile}`,
    icon: "teacher",
    animation: "fadeIn"
  });

  // Keep the text file for reference
  // fs.unlinkSync(filePath);
});

// Combine existing and new tips
const allTips = [...existingTips, ...newTips];

// Write to tips.json
fs.writeFileSync(tipsJsonPath, JSON.stringify({ tips: allTips }, null, 2));

console.log(`Processed ${newTips.length} new tips`);
console.log(`Total tips: ${allTips.length}`);
