const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  try {
    const tipsPath = path.join(process.cwd(), 'public', 'data', 'tips.json');
    const tipsData = await fs.readFile(tipsPath, 'utf8');
    const tips = JSON.parse(tipsData);

    // Optional: Add any tips processing logic here
    const processedTips = tips.tips.map(tip => ({
      ...tip,
      likes: tip.likes + Math.floor(Math.random() * 5) // Simulate like increment
    }));

    await fs.writeFile(tipsPath, JSON.stringify({ tips: processedTips }, null, 2));

    res.status(200).json({ 
      message: 'Tips processed successfully', 
      tips: processedTips 
    });
  } catch (error) {
    console.error('Tips processing error:', error);
    res.status(500).json({ error: 'Failed to process tips' });
  }
};
