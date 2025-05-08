import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Videos.css';

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);

  const processVideos = async () => {
    try {
      console.log('Processing videos...');
      const response = await fetch('http://localhost:3001/process-videos');
      if (!response.ok) {
        console.error('Failed to process videos:', response.statusText);
        throw new Error('Failed to process videos');
      }
      
      // Fetch the updated videos after processing
      fetchVideos();
    } catch (error) {
      console.error('Error processing videos:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      console.log('Fetching videos.json...');
      const response = await fetch('http://localhost:3001/data/videos.json');
      if (!response.ok) {
        console.error('Failed to fetch videos:', response.statusText);
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      console.log('Received videos:', data);
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="videos-container">
      <div className="refresh-button-container">
        <button className="refresh-button" onClick={processVideos}>
          <i className="video-icon">🔄</i>
          تحديث القائمة
        </button>
      </div>
      <h2 className="section-title">الفيديوهات التعليمية</h2>
      {videos.length === 0 ? (
        <div className="no-videos-message">
          <p>لا توجد فيديوهات متاحة حالياً</p>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card" onClick={() => handleVideoClick(video)}>
              <div className="video-thumbnail-container">
                <video 
                  src={`/videos/${video.filename}`} 
                  className="video-thumbnail"
                  muted
                  playsInline
                  preload="metadata"
                  ref={(videoRef) => {
                    if (videoRef) {
                      videoRef.currentTime = 10; // Show frame from 10th second
                      videoRef.addEventListener('loadeddata', () => {
                        videoRef.pause();
                      });
                      videoRef.addEventListener('seeked', () => {
                        videoRef.pause();
                      });
                    }
                  }}
                >
                  <source src={`/videos/${video.filename}`} type="video/mp4" />
                </video>
                <div className="video-overlay">
                  <div className="play-button">
                    <i className="play-icon">▶️</i>
                  </div>
                  <span className="video-duration">{video.duration}</span>
                  <span className="video-views">{video.views} مشاهدة</span>
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                  <span className="video-views">{video.views} مشاهدة</span>
                  <span className="video-date">{video.date}</span>
                </div>
                {video.description && (
                  <div className="video-description-container">
                    <span className="video-description-label">الوصف:</span>
                    <span className="video-description-text">
                      {video.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedVideo && (
        <div className="video-popup">
          <div className="video-popup-content">
            <button className="close-button" onClick={closeVideo}>❌</button>
            <div className="video-container">
              <video
                src={selectedVideo.url}
                controls
                className="video-player"
                controlsList="nodownload"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
