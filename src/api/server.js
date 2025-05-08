const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tipsApi = require('./tips');

const app = express();
const port = 3001;

const VIDEOS_DIR = path.join(__dirname, '../../public/videos');
const VIDEOS_JSON = path.join(__dirname, '../../public/data/videos.json');

// Ensure directories exist
if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(VIDEOS_JSON))) {
    fs.mkdirSync(path.dirname(VIDEOS_JSON), { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/tips');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static('public/images'));
app.use('/videos', express.static('public/videos'));
app.use('/data', express.static('public/data'));

// API endpoints
app.get('/api/tips', async (req, res) => {
  try {
    const tipsData = await tipsApi.readTips();
    console.log('Tips fetched:', tipsData.tips);
    res.json({ tips: tipsData.tips });
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      url: `/images/tips/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tips', async (req, res) => {
  try {
    console.log('Adding tip:', req.body);
    const tip = await tipsApi.addTip(req.body);
    console.log('Tip added:', tip);
    res.status(201).json(tip);
  } catch (error) {
    console.error('Error adding tip:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tips/:id', async (req, res) => {
  try {
    const tipId = req.params.id;
    const updatedTip = req.body;

    const { tips } = await tipsApi.readTips();
    const index = tips.findIndex(t => t.id === tipId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    // Update the tip with new data
    const updatedTips = [...tips];
    updatedTips[index] = {
      ...tips[index],
      ...updatedTip
    };

    await tipsApi.writeTips(updatedTips);
    res.status(200).json(updatedTips[index]);
  } catch (error) {
    console.error('Error updating tip:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tips/:id', async (req, res) => {
  try {
    const success = await tipsApi.deleteTip(req.params.id);
    if (success) {
      res.status(200).json({ message: 'Tip deleted successfully' });
    } else {
      res.status(404).json({ error: 'Tip not found' });
    }
  } catch (error) {
    console.error('Error deleting tip:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper to get video metadata
function getVideoMetadata(filename) {
  const filePath = path.join(VIDEOS_DIR, filename);
  const stats = fs.statSync(filePath);
  
  // Extract description from filename (format: _ description _ title.mp4)
  const descriptionMatch = filename.match(/^_([^_]+)_/);
  const description = descriptionMatch ? descriptionMatch[1] : '';
  
  // Extract title (everything after the last underscore and before the extension)
  const titleMatch = filename.match(/_([^_]+)\.mp4$/);
  const title = titleMatch ? titleMatch[1] : filename.replace(/\.[^/.]+$/, "");
  
  console.log('Processing video:', filename);
  console.log('Extracted description:', description);
  console.log('Extracted title:', title);
  
  // Remove any underscores from the title
  const cleanTitle = title.replace(/_/g, ' ');
  
  return {
    id: filename,
    filename,
    title: cleanTitle,
    description,
    url: `/videos/${filename}`,
    date: stats.birthtime.toISOString().split('T')[0],
    views: 0,
    duration: '', // Could be filled by frontend or extended backend
  };
}

// Endpoint to process videos and update videos.json
app.get('/process-videos', (req, res) => {
  try {
    if (!fs.existsSync(VIDEOS_DIR)) {
      return res.status(404).json({ error: 'Videos directory not found' });
    }
    
    // Get all video files
    const files = fs.readdirSync(VIDEOS_DIR)
      .filter(f => f.match(/\.(mp4|webm|ogg|mov)$/i));
    
    // Process each file
    const videos = files.map(getVideoMetadata);
    
    // Write to JSON file
    fs.writeFileSync(VIDEOS_JSON, JSON.stringify({ videos }, null, 2));
    
    // Also serve the JSON file directly
    res.json({ success: true, count: videos.length, videos });
  } catch (error) {
    console.error('Error processing videos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve videos.json directly from root
app.get('/data/videos.json', (req, res) => {
  try {
    if (!fs.existsSync(VIDEOS_JSON)) {
      return res.status(404).json({ error: 'Videos JSON not found' });
    }
    const data = require(VIDEOS_JSON);
    res.json(data);
  } catch (error) {
    console.error('Error serving videos.json:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
