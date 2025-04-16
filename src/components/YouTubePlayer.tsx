
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import audioManager from '@/utils/audioManager';
import { Badge } from '@/components/ui/badge';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const playlists = [
  // Rock/Metal playlists
  'PL6bPxvf5dW5clc3y9wAqMJR-rP5cetKn3', // Rock classics
  'PL6Lt9p1oIZU50GgAFVMAYhSUDcBDVEx9L', // Metal classics
  'PLhQCJTkrHOwSX8LUnIMgaTq3chP1tiTut', // Epic music
];

const YouTubePlayer: React.FC = () => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [playlistName, setPlaylistName] = useState("Rock Classics");

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        setIsApiLoaded(true);
      };
    } else {
      setIsApiLoaded(true);
    }
    
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isApiLoaded && playerRef.current) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '0',
        width: '0',
        playerVars: {
          listType: 'playlist',
          list: playlists[playlistIndex],
          autoplay: 1,
          loop: 1,
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            audioManager.setYoutubePlayer(event.target);
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
          onError: (event: any) => {
            console.error("YouTube player error:", event.data);
          }
        }
      });
    }
  }, [isApiLoaded, playlistIndex]);

  useEffect(() => {
    switch(playlistIndex) {
      case 0:
        setPlaylistName("Rock Classics");
        break;
      case 1:
        setPlaylistName("Metal Classics");
        break;
      case 2:
        setPlaylistName("Epic Music");
        break;
      default:
        setPlaylistName("Game Music");
    }
  }, [playlistIndex]);

  const togglePlayPause = () => {
    audioManager.toggleYoutubePlayback();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioManager.setMuted(newMutedState);
  };

  const toggleSfxMute = () => {
    const newSfxMutedState = !isSfxMuted;
    setIsSfxMuted(newSfxMutedState);
    audioManager.setSfxMuted(newSfxMutedState);
  };

  const changePlaylist = () => {
    const nextIndex = (playlistIndex + 1) % playlists.length;
    setPlaylistIndex(nextIndex);
  };

  return (
    <div className="youtube-player fixed top-4 right-4 z-50">
      <div ref={playerRef} className="hidden"></div>
      
      <TooltipProvider>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 bg-black/40 p-1 rounded-lg backdrop-blur-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayPause}
                  className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlaying ? "Pause Music" : "Play Music"}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute Music" : "Mute Music"}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSfxMute}
                  className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                >
                  <Music className={`h-4 w-4 ${isSfxMuted ? "text-red-500" : "text-green-500"}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSfxMuted ? "Enable Sound Effects" : "Disable Sound Effects"}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={changePlaylist}
                  className="bg-black/50 border-white/20 text-white hover:bg-black/70 text-xs"
                >
                  Change Playlist
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Switch to next playlist</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {isPlaying && !isMuted && (
            <Badge variant="outline" className="bg-black/30 text-white border-white/10 self-center px-2 py-1 text-xs backdrop-blur-sm">
              Now Playing: {playlistName}
            </Badge>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default YouTubePlayer;
