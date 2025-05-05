import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import './VideoCard.css';

function VideoCard({ videoPath, title, onPlay, onPause, onEnd }) {
  const playerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (playerRef.current) {
      const playerElement = playerRef.current.wrapper;
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
      } else if (playerElement.mozRequestFullScreen) {
        playerElement.mozRequestFullScreen();
      } else if (playerElement.webkitRequestFullscreen) {
        playerElement.webkitRequestFullscreen();
      } else if (playerElement.msRequestFullscreen) {
        playerElement.msRequestFullscreen();
      }
      setIsFullscreen(true);

      // Play the video after entering fullscreen
      const internalPlayer = playerRef.current.getInternalPlayer();
      internalPlayer.play();
    }
  };

  const handleFullscreenChange = () => {
    const isInFullScreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;
    if (!isInFullScreen && isFullscreen) {
      setIsFullscreen(false);
      if (playerRef.current) {
        const internalPlayer = playerRef.current.getInternalPlayer();
        internalPlayer.pause();
        internalPlayer.currentTime = 0; // Restart the video from the beginning
      }
    }
  };

  const handleVideoEnd = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    onEnd();
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'MSFullscreenChange',
        handleFullscreenChange
      );
    };
  }, [isFullscreen]);

  return (
    <div className="video-card">
      <div className="video" onClick={handleFullscreen}>
        <ReactPlayer
          ref={playerRef}
          url={videoPath}
          controls={true}
          width="100%"
          height="100%"
          onPlay={onPlay}
          onPause={onPause}
          onEnded={handleVideoEnd}
        />
      </div>
      <p className="title">{title}</p>
    </div>
  );
}

export default VideoCard;
