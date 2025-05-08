const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const videoUtils = require('./videoUtils');

const VIDEOS_FOLDER = path.join(__dirname, '../public/videos');
const THUMBNAILS_FOLDER = path.join(VIDEOS_FOLDER, 'thumbnails');
const VIDEOS_DATA_FILE = path.join(__dirname, '../src/data/videos.json');

// Create necessary folders if they don't exist
if (!fs.existsSync(VIDEOS_FOLDER)) {
  fs.mkdirSync(VIDEOS_FOLDER, { recursive: true });
}

if (!fs.existsSync(THUMBNAILS_FOLDER)) {
  fs.mkdirSync(THUMBNAILS_FOLDER, { recursive: true });
}

// Create videos data file if it doesn't exist
if (!fs.existsSync(VIDEOS_DATA_FILE)) {
  fs.writeFileSync(VIDEOS_DATA_FILE, JSON.stringify([], null, 2));
}

// Get video duration using ffprobe
const getVideoDuration = (videoPath) => {
  return new Promise((resolve, reject) => {
    const command = `ffprobe -v quiet -show_format -show_streams ${videoPath} -print_format json`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      try {
        const data = JSON.parse(stdout);
        const duration = parseFloat(data.format.duration).toFixed(2);
        resolve(duration);
      } catch (err) {
        reject(err);
      }
    });
  });
};

// Generate thumbnail using ffmpeg
const generateThumbnail = (videoPath) => {
  return new Promise((resolve, reject) => {
    const thumbnailPath = path.join(THUMBNAILS_FOLDER, path.basename(videoPath, path.extname(videoPath)) + '.jpg');
    const command = `ffmpeg -i ${videoPath} -vf "select=gt(scene\,0.3)" -frames:v 1 ${thumbnailPath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(thumbnailPath);
    });
  });
};

// Process a single video
const processVideo = async (videoPath) => {
  try {
    const stats = fs.statSync(videoPath);
    const filename = path.basename(videoPath);
    const title = filename.replace(/\.[^/.]+$/, "").replace(/-/g, ' ').replace(/_/g, ' ');

    // Generate thumbnail
    const thumbnailPath = await generateThumbnail(videoPath);

    // Get duration
    const duration = await getVideoDuration(videoPath);

    // Create video object
    const video = {
      id: Date.now(), // Use timestamp as ID
      title: title,
      thumbnail: path.relative(VIDEOS_FOLDER, thumbnailPath),
      duration: duration,
      views: '0',
      date: new Date().toLocaleDateString('ar-SA'),
      url: path.relative(VIDEOS_FOLDER, videoPath)
    };

    return video;
  } catch (error) {
    console.error(`Error processing video ${videoPath}:`, error);
    return null;
  }
};

// Scan videos folder and return video metadata
const scanVideos = () => videoUtils.scanVideos();

// Update videos data file
const updateVideosData = async (videos) => {
  try {
    const existingVideos = JSON.parse(fs.readFileSync(VIDEOS_DATA_FILE, 'utf8'));
    const newVideos = videos.filter(video => {
      return !existingVideos.some(existing => existing.url === video.url);
    });

    if (newVideos.length > 0) {
      const updatedVideos = [...existingVideos, ...newVideos];
      fs.writeFileSync(VIDEOS_DATA_FILE, JSON.stringify(updatedVideos, null, 2));
      console.log(`Added ${newVideos.length} new video(s) to the app`);
    } else {
      console.log('No new videos found');
    }
  } catch (error) {
    console.error('Error updating videos data:', error);
  }
};

// Watch for changes in the videos folder
const watchVideosFolder = () => {
  fs.watch(VIDEOS_FOLDER, (eventType, filename) => {
    if (eventType === 'change' && filename.toLowerCase().endsWith('.mp4')) {
      console.log(`Detected change in video: ${filename}`);
      scanVideos().then(videos => updateVideosData(videos));
    }
  });
};

// Run the initial scan and start watching
scanVideos().then(videos => updateVideosData(videos));
watchVideosFolder();

console.log('Video processor is running...');
