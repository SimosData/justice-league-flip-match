
// Audio files
const SOUNDS = {
  cardFlip: "https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3",
  match: "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3",
  noMatch: "https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3",
  win: "https://assets.mixkit.co/active_storage/sfx/1964/1964-preview.mp3",
  lose: "https://assets.mixkit.co/active_storage/sfx/1791/1791-preview.mp3",
  thunder: "https://assets.mixkit.co/active_storage/sfx/2053/2053-preview.mp3",
  rain: "https://assets.mixkit.co/active_storage/sfx/2523/2523-preview.mp3",
  roulette: "https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3"
};

class AudioManager {
  private static instance: AudioManager;
  private sounds: Record<string, HTMLAudioElement> = {};
  private isMuted: boolean = false;
  private isSfxMuted: boolean = false;
  private bgMusic: HTMLAudioElement | null = null;
  private bgVolume: number = 0.3;
  private sfxVolume: number = 0.7;
  private youtubePlayer: any = null;

  private constructor() {
    // Preload all sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.volume = this.sfxVolume;
      this.sounds[key] = audio;
    });
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public play(soundName: keyof typeof SOUNDS): void {
    if (this.isMuted || this.isSfxMuted) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      // Always reset to start for immediate playback
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Audio play prevented:", e));
    }
  }

  public loop(soundName: keyof typeof SOUNDS, shouldLoop: boolean = true): void {
    if ((this.isMuted || this.isSfxMuted) && shouldLoop) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.loop = shouldLoop;
      if (shouldLoop) {
        sound.play().catch(e => console.log("Audio loop prevented:", e));
      } else {
        sound.pause();
        sound.currentTime = 0;
      }
    }
  }

  public stopAll(): void {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  public stopAllSfx(): void {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    
    if (muted) {
      this.stopAll();
      if (this.youtubePlayer && this.youtubePlayer.pauseVideo) {
        this.youtubePlayer.pauseVideo();
      }
    } else if (this.youtubePlayer && this.youtubePlayer.playVideo) {
      this.youtubePlayer.playVideo();
    }
  }

  public setSfxMuted(muted: boolean): void {
    this.isSfxMuted = muted;
    
    if (muted) {
      this.stopAllSfx();
    }
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }

  public isSfxMutedState(): boolean {
    return this.isSfxMuted;
  }

  public setYoutubePlayer(player: any): void {
    this.youtubePlayer = player;
    if (player) {
      player.setVolume(this.bgVolume * 100);
      if (!this.isMuted) {
        player.playVideo();
      }
    }
  }

  public toggleYoutubePlayback(): void {
    if (!this.youtubePlayer) return;
    
    if (this.youtubePlayer.getPlayerState() === 1) { // Playing
      this.youtubePlayer.pauseVideo();
    } else {
      this.youtubePlayer.playVideo();
    }
  }

  public isYoutubePlaying(): boolean {
    return this.youtubePlayer && this.youtubePlayer.getPlayerState() === 1;
  }
}

export default AudioManager.getInstance();
