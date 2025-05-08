import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Videos.css';

// Import static video data
import staticVideosData from '../data/staticVideos';

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Use static data instead of API call
    setVideos(staticVideosData.videos || []);
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="videos-container">
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
