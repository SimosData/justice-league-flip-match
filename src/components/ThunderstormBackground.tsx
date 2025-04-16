
import React, { useEffect, useRef, useState } from 'react';
import { Cloud, Zap, Star, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import WeatherEffectsControl, { WeatherEffect } from './WeatherEffectsControl';
import audioManager from '@/utils/audioManager';

interface ThunderstormBackgroundProps {
  enabled: boolean;
}

const ThunderstormBackground: React.FC<ThunderstormBackgroundProps> = ({ enabled }) => {
  const [lightning, setLightning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [weatherEffect, setWeatherEffect] = useState<WeatherEffect>('thunder');
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    // Play sounds based on weather effect
    if (weatherEffect === 'rain' || weatherEffect === 'thunder' || weatherEffect === 'all') {
      audioManager.loop('rain', true);
    } else {
      audioManager.loop('rain', false);
    }
    
    // Generate lightning at random intervals if thunder or all is active
    let lightningInterval: NodeJS.Timeout | null = null;
    
    if (weatherEffect === 'thunder' || weatherEffect === 'all') {
      lightningInterval = setInterval(() => {
        const shouldStrike = Math.random() > 0.7;
        if (shouldStrike) {
          setLightning(true);
          setTimeout(() => setLightning(false), 200);
          
          // Play thunder sound with slight delay
          setTimeout(() => {
            if (!muted) {
              audioManager.play('thunder');
            }
          }, 300);
        }
      }, 4000);
    }
    
    return () => {
      if (lightningInterval) {
        clearInterval(lightningInterval);
      }
      audioManager.loop('rain', false);
    };
  }, [enabled, muted, weatherEffect]);
  
  const toggleMute = () => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    audioManager.setMuted(newMutedState);
  };
  
  const handleEffectChange = (effect: WeatherEffect) => {
    setWeatherEffect(effect);
  };
  
  if (!enabled) return null;
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[-1] overflow-hidden perspective-[1000px] pointer-events-none"
      style={{ transform: 'preserve-3d' }}
    >
      {/* Weather effect controls - making this interactive */}
      <div className="pointer-events-auto absolute top-4 left-4 z-50 flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMute}
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        <div className="mt-2">
          <WeatherEffectsControl
            currentEffect={weatherEffect}
            onChange={handleEffectChange}
          />
        </div>
      </div>
      
      {/* Lightning flash overlay */}
      {(weatherEffect === 'thunder' || weatherEffect === 'all') && (
        <div 
          className={`absolute inset-0 bg-white/30 z-50 transition-opacity duration-100 ${
            lightning ? 'opacity-100' : 'opacity-0'
          }`} 
        />
      )}
      
      {/* Animated realistic clouds */}
      {weatherEffect !== 'off' && (
        <div className="absolute inset-0">
          {Array(25).fill(0).map((_, i) => {
            const size = 50 + Math.random() * 120;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const depth = Math.random() * 500;
            const duration = 20 + Math.random() * 60; // Slower, more realistic clouds
            const opacity = 0.5 + Math.random() * 0.5;
            
            return (
              <div 
                key={i}
                className={`absolute text-white/20 blur-sm`}
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  transform: `translateZ(${-depth}px)`,
                  animation: `float-cloud ${duration}s linear infinite`,
                  animationDelay: `${-Math.random() * duration}s`,
                  filter: 'blur(8px)',
                  opacity
                }}
              >
                <Cloud size={size} strokeWidth={0.5} fill="currentColor" />
              </div>
            );
          })}
        </div>
      )}
      
      {/* Enhanced rain effect */}
      {(weatherEffect === 'rain' || weatherEffect === 'all') && (
        <div className="absolute inset-0">
          {Array(200).fill(0).map((_, i) => { // More rain drops
            const size = 1 + Math.random() * 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 0.5 + Math.random() * 1;
            
            return (
              <div 
                key={i}
                className="absolute bg-blue-300/40 rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size * 12}px`,
                  left: `${left}%`,
                  top: '-10%',
                  animation: `rain ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                  filter: 'blur(1px)'
                }}
              />
            );
          })}
        </div>
      )}

      {/* Snow effect */}
      {(weatherEffect === 'snow' || weatherEffect === 'all') && (
        <div className="absolute inset-0">
          {Array(150).fill(0).map((_, i) => {
            const size = 2 + Math.random() * 5;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 5 + Math.random() * 10; // Slower falling snow
            
            return (
              <div 
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: '-5%',
                  opacity: 0.7,
                  animation: `snow ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                  filter: 'blur(0.5px)'
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Enhanced lightning bolts - more realistic and frequent */}
      {lightning && (weatherEffect === 'thunder' || weatherEffect === 'all') && (
        <>
          {Array(3).fill(0).map((_, i) => {
            const top = 5 + Math.random() * 30;
            const left = Math.random() * 100;
            const rotate = -20 + Math.random() * 40;
            const size = 80 + Math.random() * 120;
            
            return (
              <div 
                key={i}
                className="absolute"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  transform: `rotate(${rotate}deg)`,
                  filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9))'
                }}
              >
                <Zap 
                  size={size} 
                  className="text-white" 
                  strokeWidth={1} 
                />
              </div>
            );
          })}
        </>
      )}
      
      {/* Stars for depth */}
      {weatherEffect !== 'off' && (
        <>
          {Array(80).fill(0).map((_, i) => {
            const size = 1 + Math.random() * 2;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const opacity = 0.2 + Math.random() * 0.3;
            
            return (
              <div 
                key={i}
                className="absolute text-white"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  opacity,
                  animation: `twinkle 5s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              >
                <Star size={size} fill="currentColor" />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ThunderstormBackground;
