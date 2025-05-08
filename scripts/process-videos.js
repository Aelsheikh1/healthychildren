#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const videosDir = path.join(__dirname, '../public/videos');
const videosJson = path.join(__dirname, '../src/data/videos.json');

// Create videos directory if it doesn't exist
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
}

// Create videos.json if it doesn't exist
if (!fs.existsSync(videosJson)) {
    fs.writeFileSync(videosJson, JSON.stringify({ videos: [] }, null, 2));
}

// Helper function to get video metadata
async function getVideoMetadata(filename) {
    const filePath = path.join(videosDir, filename);
    const stats = fs.statSync(filePath);
    
    // Extract URL from filename (format: https___www.google.com___test.mp4)
    const urlMatch = filename.match(/^https___([^_]+)___/);
    const authorUrl = urlMatch ? `https://${urlMatch[1]}` : '';
    
    // Extract title (everything after the URL and before the extension)
    const titleMatch = filename.match(/___([^\.]+)\.mp4$/);
    const title = titleMatch ? titleMatch[1] : filename.replace(/\.[^/.]+$/, "");
    
    console.log('Processing video:', filename);
    console.log('Extracted URL:', authorUrl);
    console.log('Extracted title:', title);
    
    return {
        id: filename,
        filename,
        title,
        url: `/videos/${filename}`,
        date: stats.birthtime.toISOString().split('T')[0],
        views: 0,
        duration: '', // Could be filled by frontend or extended backend
        author_url: authorUrl
    };
}

// Function to process all videos
async function processVideos() {
    try {
        const files = fs.readdirSync(videosDir)
            .filter(f => f.match(/\.(mp4|webm|ogg|mov)$/i));
        
        const videoMetadata = await Promise.all(files.map(f => getVideoMetadata(f)));
        fs.writeFileSync(videosJson, JSON.stringify({ videos: videoMetadata }, null, 2));
        console.log(`Processed ${videoMetadata.length} videos`);
    } catch (error) {
        console.error('Error processing videos:', error);
    }
}

// Initial processing
console.log('Starting video processing...');
processVideos();

// Watch for changes
const watcher = chokidar.watch(videosDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

watcher
    .on('add', (path) => {
        console.log(`File ${path} has been added`);
        processVideos();
    })
    .on('unlink', (path) => {
        console.log(`File ${path} has been removed`);
        processVideos();
    })
    .on('error', (error) => console.error('Error:', error));

console.log('Video processing script is now monitoring for changes...');
