const { createCanvas, loadImage } = require('canvas');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, '../public/videos');
const THUMBNAILS_DIR = path.join(__dirname, '../public/thumbnails');

// Ensure thumbnails directory exists
if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

// Function to generate thumbnail from video
async function generateThumbnail(videoPath, thumbnailPath) {
    try {
        // Use ffmpeg to extract the first frame
        const ffmpegCmd = `ffmpeg -i "${videoPath}" -vf "select=gt(scene\,0.3)" -vframes 1 -q:v 2 "${thumbnailPath}" -y`;
        await new Promise((resolve, reject) => {
            exec(ffmpegCmd, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        // Load the thumbnail and resize it
        const img = await loadImage(thumbnailPath);
        const canvas = createCanvas(320, 180);
        const ctx = canvas.getContext('2d');
        
        // Calculate the scaling factor to maintain aspect ratio
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        // Draw the image
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Save the resized thumbnail
        const out = fs.createWriteStream(thumbnailPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        
        return new Promise((resolve, reject) => {
            out.on('finish', resolve);
            out.on('error', reject);
        });
    } catch (error) {
        console.error(`Error generating thumbnail for ${videoPath}:`, error);
        throw error;
    }
}

async function processVideos() {
    try {
        // Get all video files
        const files = fs.readdirSync(VIDEOS_DIR)
            .filter(f => f.match(/\.(mp4|webm|ogg|mov)$/i));

        for (const file of files) {
            const videoPath = path.join(VIDEOS_DIR, file);
            const thumbnailPath = path.join(THUMBNAILS_DIR, `${path.basename(file, path.extname(file))}.png`);

            try {
                await generateThumbnail(videoPath, thumbnailPath);
                console.log(`Generated thumbnail for ${file}`);
            } catch (error) {
                console.error(`Failed to generate thumbnail for ${file}:`, error);
            }
        }
    } catch (error) {
        console.error('Error processing videos:', error);
    }
}

// Run the processing
processVideos();
