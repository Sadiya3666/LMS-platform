"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { PlayCircle, Maximize, Volume2, VolumeX, PauseCircle, SkipForward, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  startPositionSeconds: number;
  onProgress: (currentTime: number, completed: boolean) => void;
  onCompleted: () => void;
}

export const VideoPlayer = ({
  videoId,
  youtubeUrl,
  thumbnailUrl,
  startPositionSeconds,
  onProgress,
  onCompleted,
}: VideoPlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(startPositionSeconds);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const getYTId = (url: string) => {
    if (!url) return null;
    if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    return url;
  };

  const ytId = getYTId(youtubeUrl);

  const startTracking = () => {
    stopTracking();
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        const tot = playerRef.current.getDuration() || duration;
        setCurrentTime(time);
        
        const completed = tot > 0 && time / tot > 0.9;
        onProgress(time, completed);
        if (completed) onCompleted();
      }
    }, 1000); // UI updates every 1s, API handles debouncing
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopTracking();
  }, [videoId]);

  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
    setIsReady(true);
    
    if (startPositionSeconds > 0) {
      event.target.seekTo(startPositionSeconds, true);
    }
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    // 1: Playing, 2: Paused, 0: Ended
    if (event.data === 1) {
      setIsPlaying(true);
      setHasStarted(true);
      setDuration(event.target.getDuration());
      startTracking();
    } else if (event.data === 2) {
      setIsPlaying(false);
      stopTracking();
      onProgress(event.target.getCurrentTime(), false);
    } else if (event.data === 0) {
      setIsPlaying(false);
      stopTracking();
      onProgress(event.target.getDuration(), true);
      onCompleted();
    }
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const changePlaybackRate = (rate: number) => {
    if (playerRef.current) {
      setPlaybackRate(rate);
      playerRef.current.setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      playsinline: 1,
      controls: 0, // Using custom controls
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1, // Disable keyboard controls to limit default behavior
    },
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  if (!ytId) {
    return (
      <div className="w-full pt-[56.25%] bg-black relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
         <div className="absolute inset-0 flex items-center justify-center text-slate-500">
           Invalid Video Source
         </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="video-player-box group">
      
      {/* YouTube Player */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <YouTube
          videoId={ytId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
          className="w-full h-full"
          iframeClassName="w-full h-full"
        />
      </div>

      {/* Custom Thumbnail Overlay */}
      {!hasStarted && (
        <div className="absolute inset-0 z-10 bg-black cursor-pointer flex items-center justify-center" onClick={togglePlay}>
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          )}
          <button className="z-20 p-5 rounded-full bg-purple-600/80 hover:bg-purple-600 backdrop-blur-sm text-white transition-transform hover:scale-110 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            <PlayCircle className="w-16 h-16" />
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 z-20 ${!isPlaying || !hasStarted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer group/progress">
          <input 
             type="range" 
             min={0} 
             max={duration || 100}
             value={currentTime}
             onChange={handleSeek}
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
          <div 
             className="absolute top-0 left-0 h-full bg-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] rounded-full transition-all duration-100"
             style={{ width: `${progressPercentage}%` }}
          />
          {/* Thumb indicator on hover */}
          <div 
             className="absolute top-1/2 -mt-2 w-4 h-4 rounded-full bg-white shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity z-10"
             style={{ left: `calc(${progressPercentage}% - 8px)` }}
          />
        </div>

        {/* Bottom Controls Area */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-purple-400 transition-colors">
              {isPlaying ? <PauseCircle className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
            </button>
            <div className="flex items-center gap-2">
               <button onClick={toggleMute} className="hover:text-purple-400 transition-colors">
                 {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
               </button>
            </div>
            <div className="text-sm font-medium tabular-nums px-2">
               {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowSettings(!showSettings)} className="hover:text-purple-400 transition-colors p-2">
               <Settings className="w-6 h-6" />
            </button>
            
            {showSettings && (
               <div className="absolute bottom-12 right-12 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl min-w-[120px]">
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-2 font-semibold">Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                     <button 
                        key={rate} 
                        onClick={() => changePlaybackRate(rate)}
                        className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${playbackRate === rate ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-white'}`}
                     >
                       {rate}x {rate === 1 ? '(Normal)' : ''}
                     </button>
                  ))}
               </div>
            )}
            
            <button onClick={toggleFullscreen} className="hover:text-purple-400 transition-colors p-2">
               <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
