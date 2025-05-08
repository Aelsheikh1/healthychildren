const videoUtils = require('./videoUtils');
const fs = require('fs');
const path = require('path');

const VIDEOS_FOLDER = path.join(__dirname, '../public/videos');
const VIDEOS_DATA_FILE = path.join(__dirname, '../src/data/videos.json');

// Create videos folder if it doesn't exist
if (!fs.existsSync(VIDEOS_FOLDER)) {
  fs.mkdirSync(VIDEOS_FOLDER, { recursive: true });
}

// Create videos data file if it doesn't exist
if (!fs.existsSync(VIDEOS_DATA_FILE)) {
  fs.writeFileSync(VIDEOS_DATA_FILE, JSON.stringify([], null, 2));
}

// Scan for new videos
const scanForNewVideos = async () => {
  try {
    const currentVideos = videoUtils.scanVideos();
    const existingData = JSON.parse(fs.readFileSync(VIDEOS_DATA_FILE, 'utf8'));
    const existingVideos = Array.isArray(existingData) ? existingData : existingData.videos || [];    
    const newVideos = currentVideos.filter(video => {
      return !existingVideos.some(existing => existing.path === video.path);
    });

    if (newVideos.length > 0) {
      const updatedVideos = [...existingVideos, ...newVideos];
      fs.writeFileSync(VIDEOS_DATA_FILE, JSON.stringify(updatedVideos, null, 2));
      console.log(`Added ${newVideos.length} new video(s) to the app`);
    } else {
      console.log('No new videos found');
    }
  } catch (error) {
    console.error('Error scanning for new videos:', error);
  }
};

// Watch for changes in the videos folder
const watchVideosFolder = () => {
  fs.watch(VIDEOS_FOLDER, (eventType, filename) => {
    if (eventType === 'change' && filename.toLowerCase().endsWith('.mp4')) {
      console.log(`Detected change in video: ${filename}`);
      scanForNewVideos();
    }
  });
};

// Run the initial scan and start watching
scanForNewVideos();
watchVideosFolder();

console.log('Video watcher is running...');
