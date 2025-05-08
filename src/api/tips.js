const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const tipsFilePath = path.join(__dirname, '../../public/data/tips.json');

// Initialize tips file if it doesn't exist
if (!fs.existsSync(tipsFilePath)) {
  fs.writeFileSync(tipsFilePath, JSON.stringify({ tips: [] }, null, 2));
}

// Read tips from file
const readTips = async () => {
  try {
    const data = await fsp.readFile(tipsFilePath, 'utf8');
    try {
      const tipsData = JSON.parse(data);
      console.log('Tips data read:', tipsData);
      return tipsData;
    } catch (parseError) {
      console.error('JSON parse error in tips.json:', parseError);
      console.error('Raw file data:', data);
      throw parseError;
    }
  } catch (error) {
    console.error('Error reading tips file:', error);
    return { tips: [] };
  }
};

// Write tips to file
const writeTips = async (tips) => {
  try {
    await fsp.writeFile(tipsFilePath, JSON.stringify({ tips }, null, 2));
  } catch (error) {
    console.error('Error writing tips file:', error);
    throw error;
  }
};

// Add new tip
const addTip = async (newTip) => {
  try {
    console.log('Adding new tip:', newTip);
    const { tips } = await readTips();
    const id = Date.now().toString();
    const tip = {
      id,
      title: newTip.title || '',
      text: newTip.text || '',
      image: newTip.image || '',
      icon: newTip.icon || 'teacher',
      animation: newTip.animation || 'fadeIn'
    };
    tips.push(tip);
    await writeTips(tips);
    console.log('Tip added successfully:', tip);
    return tip;
  } catch (error) {
    console.error('Error adding tip:', error);
    throw error;
  }
};

// Delete tip
const deleteTip = async (id) => {
  try {
    const { tips } = await readTips();
    const index = tips.findIndex(t => t.id === id);
    
    if (index === -1) {
      return false;
    }

    tips.splice(index, 1);
    await writeTips(tips);
    return true;
  } catch (error) {
    console.error('Error deleting tip:', error);
    throw error;
  }
};

module.exports = {
  addTip,
  deleteTip,
  readTips
};
