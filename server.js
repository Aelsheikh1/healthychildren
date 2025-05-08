const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/data', express.static(path.join(__dirname, 'public', 'data')));

// Simulate Vercel serverless function for videos
app.get('/api/process-videos', async (req, res) => {
  try {
    const videosPath = path.join(__dirname, 'public', 'data', 'videos.json');
    const videosData = await fs.readFile(videosPath, 'utf8');
    const videos = JSON.parse(videosData);

    const processedVideos = videos.videos.map(video => ({
      ...video,
      views: video.views + Math.floor(Math.random() * 10)
    }));

    await fs.writeFile(videosPath, JSON.stringify({ videos: processedVideos }, null, 2));

    res.status(200).json({ 
      message: 'Videos processed successfully', 
      videos: processedVideos 
    });
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500).json({ error: 'Failed to process videos' });
  }
});

// Simulate Vercel serverless function for tips
app.get('/api/process-tips', async (req, res) => {
  try {
    const tipsPath = path.join(__dirname, 'public', 'data', 'tips.json');
    const tipsData = await fs.readFile(tipsPath, 'utf8');
    const tips = JSON.parse(tipsData);

    const processedTips = tips.tips.map(tip => ({
      ...tip,
      likes: tip.likes + Math.floor(Math.random() * 5)
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
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
