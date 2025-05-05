import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './VideoPlayer.css';
import button from './button.png';
import VideoCard from '../components/VideoCard';
import Popup from '../components/Popup';

function VideoPlayer() {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [points, setPoints] = useState(0);

  let timeoutId;

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/videos')
      .then((response) => {
        const genreData = response.data.find((g) => g.genre === genre);
        if (genreData) {
          setVideos(genreData.videos);
        } else {
          setVideos([]);
        }
      })
      .catch((error) => console.error('Error fetching videos:', error));
  }, [genre]);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isVideoPlaying) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          navigate('/');
        }, 300000);
      }
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('mousemove', handleUserInteraction);

    if (!isVideoPlaying) {
      timeoutId = setTimeout(() => {
        navigate('/');
      }, 300000);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('mousemove', handleUserInteraction);
    };
  }, [navigate, isVideoPlaying]);

  const handleVideoPlay = () => {
    clearTimeout(timeoutId);
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    timeoutId = setTimeout(() => {
      navigate('/');
    }, 300000);
  };

  const handleVideoEnd = () => {
    const randomPoints = Math.floor(Math.random() * 16) + 80; // Generates a random number between 80 and 95
    setPoints(randomPoints);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="bg-vplayer">
      <div className="videoplayer">
        <div className="button" onClick={() => navigate('/genre')}>
          <img src={button} width={50} height={50} alt="logo" />
        </div>
        <div className="video-grid">
          {videos.map((videoPath, index) => {
            let title = videoPath.split('/').pop().split('.')[0];
            if (title.length > 30) {
              title = `${title.substring(0, 30)}...`;
            }
            return (
              <VideoCard
                key={index}
                videoPath={videoPath}
                title={title}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnd={handleVideoEnd}
              />
            );
          })}
        </div>
      </div>
      {showPopup && <Popup points={points} onClose={closePopup} />}
    </div>
  );
}

export default VideoPlayer;
