import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, PictureInPicture } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, problem }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Sync isPlaying state with actual video state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Time, duration, and ended handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        togglePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]); // Re-attach when isPlaying changes (for stability)

  const togglePlayPause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  }, [isPlaying]);

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);

    if (newMuted) {
      video.volume = 0;
    } else {
      video.volume = volume || 0.5;
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const changePlaybackRate = (rate) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP not supported", error);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    if (isPlaying && !isHovering) {
      timeout = setTimeout(() => setShowControls(false), 2500);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, isHovering]);

  return (
    <div className='p-5 space-y-3'>
      <h2 className="text-2xl font-bold tracking-tight">Video Solution</h2>
      <div 
        className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={secureUrl}
          poster={thumbnailUrl}
          onClick={togglePlayPause}
          className="w-full aspect-video bg-black cursor-pointer"
          playsInline
        />

        {/* Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-black/70 to-transparent pointer-events-none" />

        {/* Video Controls Overlay */}
        <div 
          className={`absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 ${
            showControls || isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Center Play Button (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xl pointer-events-auto"
              >
                <Play className="w-6 h-8 text-black ml-1" fill="black" />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-3 text-white text-sm">
              <span className="tabular-nums w-12">{formatTime(currentTime)}</span>
              
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="range range-primary range-xs flex-1 accent-white"
                style={{ '--range-thumb-size': '7px' }}
              />
              
              <span className="tabular-nums w-12 text-right">{formatTime(duration)}</span>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between text-white">
              {/* Left Side Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayPause}
                  className="btn btn-circle btn-ghost hover:bg-white/20 text-white"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={22} /> : <Play size={22} fill="white" />}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={toggleMute}
                    className="btn btn-circle btn-ghost hover:bg-white/20 text-white"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="range range-xs w-24 accent-white opacity-0 group-hover/volume:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-1">
                {/* Playback Speed */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="btn btn-ghost btn-sm text-white hover:bg-white/20 flex items-center gap-1 px-3"
                  >
                    <Settings size={18} />
                    <span className="text-xs font-medium">{playbackRate}x</span>
                  </button>

                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-xl py-2 shadow-2xl border border-white/10 z-50 w-40">
                      {playbackRates.map(rate => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`w-full text-left px-4 py-2 hover:bg-white/10 text-sm ${playbackRate === rate ? 'text-primary font-medium' : 'text-white'}`}
                        >
                          {rate}x {rate === 1 && '(Normal)'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Picture-in-Picture */}
                <button
                  onClick={togglePictureInPicture}
                  className="btn btn-circle btn-ghost hover:bg-white/20 text-white"
                  title="Picture in Picture"
                >
                  <PictureInPicture size={20} />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="btn btn-circle btn-ghost hover:bg-white/20 text-white"
                >
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="absolute top-4 right-4 text-xs text-white/60 bg-black/50 px-2 py-1 rounded hidden sm:block">
          Space • Play/Pause
        </div>
      </div>

      {/* Solutions Section */}
      <div className='mt-10'>
        <h2 className="text-xl font-semibold mb-3 pl-3 text-gray-300">Solutions Section</h2>
        <div className="space-y-6 p-3">
          {problem.referenceSolution?.map((solution, index) => (
            <div key={index} className="border border-base-300 rounded-lg">
              <div className=" px-4 py-2 rounded-t-lg bg-gray-700">
                <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
              </div>
              <div className="">
                <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                  <code>{solution?.completeCode}</code>
                </pre>
              </div>
            </div>
          )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
        </div>
      </div>
    </div>
  );
};

export default Editorial;