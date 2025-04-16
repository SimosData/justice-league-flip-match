
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Music,
  Timer,
  Play,
  Pause,
  Clock,
  RotateCcw,
  Volume2,
  VolumeX,
  Youtube,
  Gauge
} from 'lucide-react';
import { toast } from 'sonner';

interface GameControlsProps {
  isGameStarted: boolean;
  gameOver: boolean;
  isPaused: boolean;
  onPauseToggle: () => void;
  onRestart: () => void;
  onTimerSet: (seconds: number) => void;
  gameTimer: number;
  remainingTime: number;
  difficulty?: string;
  onDifficultyChange?: (difficulty: string) => void;
  gameSpeed?: number;
  onSpeedChange?: (speed: number) => void;
}

const DIFFICULTY_LEVELS = [
  "Easy",
  "Medium",
  "Hard",
  "Expert",
  "Legendary"
];

const GAME_SPEEDS = [
  { label: "0.5x", value: 0.5 },
  { label: "1.0x", value: 1.0 },
  { label: "1.5x", value: 1.5 },
  { label: "2.0x", value: 2.0 },
  { label: "2.5x", value: 2.5 },
  { label: "3.0x", value: 3.0 },
  { label: "3.5x", value: 3.5 },
  { label: "4.0x", value: 4.0 },
];

const SONGS = [
  { 
    title: "Epic Battle", 
    artist: "Rock Legend", 
    url: "https://cdn.freesound.org/previews/451/451420_4142475-lq.mp3" 
  },
  { 
    title: "Heroes Unite", 
    artist: "Metal Masters", 
    url: "https://cdn.freesound.org/previews/324/324259_5804746-lq.mp3" 
  },
  { 
    title: "Power Surge", 
    artist: "Steel Heroes", 
    url: "https://cdn.freesound.org/previews/276/276644_5324223-lq.mp3" 
  }
];

// YouTube playlist IDs for metal/rock music
const YOUTUBE_PLAYLISTS = [
  { name: "Heavy Metal Classics", id: "PLhQCJTkrHOwSX8LUnIMgaTq3chP1tiTut" },
  { name: "Rock Anthems", id: "PL7v1FHGMOadDquJiGS73po9K8Txft7LoV" },
  { name: "Metal Workout", id: "PL9NMEBQcQqlzwlwLWRz5DMowimCk88FJk" }
];

const formatTime = (seconds: number): string => {
  if (seconds === Infinity) return "∞";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const GameControls: React.FC<GameControlsProps> = ({
  isGameStarted,
  gameOver,
  isPaused,
  onPauseToggle,
  onRestart,
  onTimerSet,
  gameTimer,
  remainingTime,
  difficulty = "Easy",
  onDifficultyChange = () => {},
  gameSpeed = 1.0,
  onSpeedChange = () => {}
}) => {
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
  const [isMusicDialogOpen, setIsMusicDialogOpen] = useState(false);
  const [isSpeedDialogOpen, setIsSpeedDialogOpen] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(gameTimer);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [useYoutube, setUseYoutube] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const youtubeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const handleTimerChange = (value: number) => {
    // Convert slider value (0-100) to seconds (60 - 86400)
    // With special value 101 for infinity
    let seconds;
    
    if (value >= 100) {
      seconds = Infinity;
    } else {
      // Exponential scale: 60 seconds to 24 hours (86400 seconds)
      const minLog = Math.log(60);
      const maxLog = Math.log(86400);
      const scale = (maxLog - minLog) / 100;
      seconds = Math.round(Math.exp(minLog + scale * value));
    }
    
    setSelectedTimer(seconds);
  };
  
  const handleTimerSet = () => {
    onTimerSet(selectedTimer);
    setIsTimerDialogOpen(false);
  };
  
  const togglePlay = () => {
    if (useYoutube) {
      // YouTube playback logic would go here, but iframe doesn't expose API easily
      toast.info("YouTube playback controls are managed within the player");
      return;
    }
    
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play()
          .catch(e => {
            console.log("Audio play prevented:", e);
            toast.error("Failed to play audio. Please try clicking the play button again.");
          });
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };
  
  const changeSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsMusicPlaying(true);
    
    // Small delay to ensure the src has updated
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .catch(e => {
            console.log("Audio play prevented:", e);
            toast.error("Failed to play audio. Please try clicking the song again.");
          });
      }
    }, 50);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleMusicSource = () => {
    setUseYoutube(!useYoutube);
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };
  
  const handleSpeedChange = (newSpeed: number) => {
    onSpeedChange(newSpeed);
    setIsSpeedDialogOpen(false);
    toast.success(`Game speed set to ${newSpeed}x`);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Timer display */}
      <div className={`relative overflow-hidden rounded-md border border-hero-batman px-3 py-1.5 flex items-center gap-2 ${
        remainingTime < 30 && remainingTime > 0 && !isPaused ? 'animate-pulse bg-red-600/20' : 'bg-hero-batman/20'
      }`}>
        <Clock className="h-4 w-4 text-hero-wonderwoman" />
        <span className={`text-lg font-mono ${
          remainingTime < 30 && remainingTime > 0 && !isPaused ? 'text-red-400' : 'text-white'
        }`}>
          {formatTime(remainingTime)}
        </span>
      </div>
      
      {/* Timer settings dialog */}
      <Dialog open={isTimerDialogOpen} onOpenChange={setIsTimerDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-hero-batman/30 border-hero-batman text-white hover:bg-hero-batman/50"
          >
            <Timer className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1F2C]/95 border border-hero-wonderwoman/30 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-hero-superman to-hero-flash bg-clip-text text-transparent">
              Set Game Timer
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Choose how much time you have to complete the game
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-hero-wonderwoman">1 minute</span>
                <span className="text-hero-wonderwoman">24 hours</span>
                <span className="text-hero-wonderwoman">∞</span>
              </div>
              <Slider 
                defaultValue={[50]} 
                max={101}
                step={1}
                onValueChange={(values) => handleTimerChange(values[0])}
                className="mb-4"
              />
              <div className="text-center text-2xl font-bold text-white mb-4">
                {formatTime(selectedTimer)}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleTimerSet}
                className="bg-hero-superman text-white hover:bg-hero-superman/80"
              >
                Set Timer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Play/Pause button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onPauseToggle}
        disabled={!isGameStarted || gameOver}
        className={`${
          isPaused ? 'bg-hero-flash/30' : 'bg-hero-batman/30'
        } border-hero-batman text-white hover:bg-hero-batman/50`}
      >
        {isPaused ? (
          <Play className="h-4 w-4" />
        ) : (
          <Pause className="h-4 w-4" />
        )}
      </Button>
      
      {/* Restart button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onRestart}
        className="bg-hero-batman/30 border-hero-batman text-white hover:bg-hero-batman/50"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      {/* Game speed button */}
      <Dialog open={isSpeedDialogOpen} onOpenChange={setIsSpeedDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-hero-batman/30 border-hero-batman text-white hover:bg-hero-batman/50"
            title="Game Speed"
          >
            <Gauge className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1F2C]/95 border border-hero-wonderwoman/30 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-hero-superman to-hero-flash bg-clip-text text-transparent">
              Game Speed
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Adjust the speed of the game
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {GAME_SPEEDS.map((speed) => (
              <Button
                key={speed.value}
                variant={gameSpeed === speed.value ? "default" : "outline"}
                onClick={() => handleSpeedChange(speed.value)}
                className={gameSpeed === speed.value ? "bg-hero-wonderwoman" : ""}
              >
                {speed.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Difficulty selector */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-hero-batman/30 border-hero-batman text-white hover:bg-hero-batman/50 hidden sm:flex"
          >
            <span className="mr-2">Difficulty: {difficulty}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1F2C]/95 border border-hero-wonderwoman/30 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-hero-superman to-hero-flash bg-clip-text text-transparent">
              Select Difficulty
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-2 py-4">
            {DIFFICULTY_LEVELS.map((level) => (
              <Button
                key={level}
                variant={difficulty === level ? "default" : "outline"}
                onClick={() => onDifficultyChange(level)}
                className={difficulty === level ? "bg-hero-wonderwoman" : ""}
              >
                {level}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Music player */}
      <Dialog open={isMusicDialogOpen} onOpenChange={setIsMusicDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-hero-batman/30 border-hero-batman text-white hover:bg-hero-batman/50"
          >
            <Music className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-[#1A1F2C]/95 border border-hero-wonderwoman/30 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-hero-superman to-hero-flash bg-clip-text text-transparent">
              Justice League Soundtrack
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-center space-x-2 mb-4">
            <Button
              variant={!useYoutube ? "default" : "outline"}
              onClick={() => setUseYoutube(false)}
              className={!useYoutube ? "bg-hero-wonderwoman" : ""}
            >
              Game Music
            </Button>
            <Button
              variant={useYoutube ? "default" : "outline"}
              onClick={() => setUseYoutube(true)}
              className={useYoutube ? "bg-hero-wonderwoman" : ""}
            >
              YouTube
            </Button>
          </div>
          
          {!useYoutube ? (
            <>
              <audio
                ref={audioRef}
                src={SONGS[currentSongIndex].url}
                loop
              />
              
              <div className="py-4">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-hero-wonderwoman font-medium">
                        {SONGS[currentSongIndex].title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {SONGS[currentSongIndex].artist}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlay}
                      className="bg-hero-batman/30 border-hero-batman text-white hover:bg-hero-batman/50"
                    >
                      {isMusicPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4 mb-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      onValueChange={(values) => setVolume(values[0] / 100)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm text-gray-400 mb-2">Select Track:</h3>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2 pr-4">
                      {SONGS.map((song, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-md cursor-pointer transition-colors ${
                            currentSongIndex === index
                              ? 'bg-hero-wonderwoman/20 border border-hero-wonderwoman/30'
                              : 'hover:bg-hero-batman/20'
                          }`}
                          onClick={() => changeSong(index)}
                        >
                          <h4 className="text-white font-medium">{song.title}</h4>
                          <p className="text-sm text-gray-400">{song.artist}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </>
          ) : (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="text-sm text-gray-400 mb-2">Select Playlist:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {YOUTUBE_PLAYLISTS.map((playlist, index) => (
                    <Button
                      key={index}
                      variant={selectedPlaylist === index ? "default" : "outline"}
                      onClick={() => setSelectedPlaylist(index)}
                      className={selectedPlaylist === index ? "bg-hero-wonderwoman justify-start" : "justify-start"}
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      {playlist.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-hero-batman/30">
                <iframe
                  ref={youtubeRef}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLISTS[selectedPlaylist].id}&autoplay=0`}
                  title="YouTube music player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Control playback using the YouTube player controls
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
