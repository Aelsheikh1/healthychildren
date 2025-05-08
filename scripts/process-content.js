const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const tipsDir = path.join(__dirname, '../public/tips');
const videosDir = path.join(__dirname, '../public/videos');
const tipsJsonPath = path.join(__dirname, '../public/data/tips.json');
const videosJsonPath = path.join(__dirname, '../public/data/videos.json');

async function processContent() {
  try {
    // Process tips
    await processTips();
    
    // Process videos
    await processVideos();
    
    console.log('Content processed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error processing content:', error);
    return { success: false, error: error.message };
  }
}

async function processTips() {
  // Process text files in tips directory
  const textFiles = fs.readdirSync(tipsDir)
    .filter(file => file.endsWith('.txt'));

  if (textFiles.length === 0) {
    console.log('No text files found in tips directory');
    return;
  }

  // Process only the first text file
  const textFile = textFiles[0];
  const filePath = path.join(tipsDir, textFile);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Split content into title and text
  const [title, ...textLines] = content.split('\n');
  
  // Process text to handle bullet points and formatting
  const text = textLines
    .map(line => {
      // Handle bullet points
      if (line.startsWith('-') || line.startsWith('*')) {
        return `<li>${line.slice(1)}</li>`;
      }
      
      // Handle empty lines
      if (line === '') {
        return '<br>';
      }
      
      // Handle regular text
      return line;
    })
    .join('\n');
  
  // Create a unique ID
  const id = uuidv4();
  
  // Create a matching image name (without extension)
  const imageBaseName = path.basename(textFile, '.txt');
  const imageFiles = fs.readdirSync(tipsDir)
    .filter(file => {
      const baseName = path.basename(file, path.extname(file));
      return baseName === imageBaseName && 
             file !== textFile &&
             (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    });
  
  if (imageFiles.length === 0) {
    console.warn(`No matching image found for ${textFile}`);
    return;
  }

  // Use the first matching image
  const imageFile = imageFiles[0];

  // Create the tip object
  const tip = {
    id,
    title: title.trim(),
    text: text.trim(),
    image: `/tips/${imageFile}`,
    icon: "teacher",
    animation: "fadeIn"
  };

  // Write to tips.json
  fs.writeFileSync(tipsJsonPath, JSON.stringify({ tips: [tip] }, null, 2));
  console.log('Processed single tip');
}

async function processVideos() {
  // Read existing videos
  let existingVideos = [];
  try {
    const videosJson = fs.readFileSync(videosJsonPath, 'utf8');
    existingVideos = JSON.parse(videosJson).videos;
  } catch (error) {
    console.log('No existing videos found, starting fresh');
  }

  // Process video files in videos directory
  const videoFiles = fs.readdirSync(videosDir)
    .filter(file => file.endsWith('.mp4'));

  const newVideos = [];

  videoFiles.forEach(videoFile => {
    const videoPath = path.join(videosDir, videoFile);
    
    // Create a unique ID
    const id = uuidv4();
    
    // Create a matching thumbnail name
    const thumbnailFile = `${path.basename(videoFile, '.mp4')}.jpg`;
    const thumbnailPath = path.join(videosDir, thumbnailFile);
    
    // Add the new video
    newVideos.push({
      id,
      title: path.basename(videoFile, '.mp4'),
      url: `/videos/${videoFile}`,
      thumbnail: `/videos/${thumbnailFile}`,
      duration: '0:00', // This would be calculated from the video
      views: 0,
      date: new Date().toISOString().split('T')[0]
    });
  });

  // Combine existing and new videos
  const allVideos = [...existingVideos, ...newVideos];

  // Write to videos.json
  fs.writeFileSync(videosJsonPath, JSON.stringify({ videos: allVideos }, null, 2));
  console.log(`Processed ${newVideos.length} new videos`);
}

// Run when called directly
if (require.main === module) {
  processContent()
    .then(result => {
      if (result.success) {
        console.log('Content processed successfully');
        process.exit(0);
      } else {
        console.error('Failed to process content:', result.error);
        process.exit(1);
      }
    });
}
