const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  try {
    const videosPath = path.join(process.cwd(), 'public', 'data', 'videos.json');
    const videosData = await fs.readFile(videosPath, 'utf8');
    const videos = JSON.parse(videosData);

    // Optional: Add any video processing logic here
    const processedVideos = videos.videos.map(video => ({
      ...video,
      views: video.views + Math.floor(Math.random() * 10) // Simulate view increment
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
};
