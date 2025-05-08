const fs = require('fs');
const path = require('path');

const VIDEOS_FOLDER = path.join(__dirname, '../public/videos');

// Get video metadata from file
const getVideoMetadata = (videoPath) => {
  const stats = fs.statSync(videoPath);
  const filename = path.basename(videoPath);
  const title = filename.replace(/\.[^/.]+$/, ""); // Remove file extension

  return {
    title: title.replace(/-/g, ' ').replace(/_/g, ' '), // Replace - and _ with spaces
    path: videoPath,
    size: stats.size,
    lastModified: stats.mtime,
    duration: null, // We'll get this from the video file
    thumbnail: null // We'll generate this from the video
  };
};

// Scan videos folder and return video metadata
const scanVideos = () => {
  const videos = [];
  try {
    const files = fs.readdirSync(VIDEOS_FOLDER);
    files.forEach(file => {
      const filePath = path.join(VIDEOS_FOLDER, file);
      if (fs.statSync(filePath).isFile() && file.toLowerCase().endsWith('.mp4')) {
        videos.push(getVideoMetadata(filePath));
      }
    });
  } catch (error) {
    console.error('Error scanning videos:', error);
  }
  return videos;
};

module.exports = {
  scanVideos,
  getVideoMetadata
};
