// Browser-compatible video utilities

// Get video metadata from file URL
const getVideoMetadata = async (videoUrl) => {
  const response = await fetch(videoUrl);
  const blob = await response.blob();
  const filename = videoUrl.split('/').pop();
  const title = filename.replace(/\.[^/.]+$/, ""); // Remove file extension

  return {
    title: title.replace(/-/g, ' ').replace(/_/g, ' '), // Replace - and _ with spaces
    url: videoUrl,
    size: blob.size,
    lastModified: new Date().toISOString(),
    duration: null, // Duration will be fetched from video element
    thumbnail: null // Thumbnail will be generated from video
  };
};

// Scan videos from a given URL (e.g., /videos)
const scanVideos = async (baseUrl = '/videos') => {
  try {
    const response = await fetch(`${baseUrl}/index.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch video index');
    }
    const videos = await response.json();
    return videos.map(video => ({
      ...video,
      url: `${baseUrl}/${video.filename}`
    }));
  } catch (error) {
    console.error('Error scanning videos:', error);
    return [];
  }
};

export { scanVideos, getVideoMetadata };
