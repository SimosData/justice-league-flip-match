
import React, { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import ThunderstormBackground from '@/components/ThunderstormBackground';
import YouTubePlayer from '@/components/YouTubePlayer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import audioManager from '@/utils/audioManager';
import WeatherEffectsControl, { WeatherEffect } from '@/components/WeatherEffectsControl';

const Index = () => {
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [is3DModeActive, setIs3DModeActive] = useState(false);
  const [weatherEffect, setWeatherEffect] = useState<WeatherEffect>('thunder');
  
  // Disable audio on unmount
  useEffect(() => {
    return () => {
      audioManager.stopAll();
    };
  }, []);

  const handleWeatherEffectChange = (effect: WeatherEffect) => {
    setWeatherEffect(effect);
    
    // Play appropriate sound based on weather effect
    audioManager.stopAllSfx();
    
    if (effect === 'thunder') {
      audioManager.loop('thunder', true);
    } else if (effect === 'rain') {
      audioManager.loop('rain', true);
    } else if (effect === 'all') {
      audioManager.loop('thunder', true);
      audioManager.loop('rain', true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A1F2C] to-[#0f172a] text-white pb-10 world-container" style={{ transformStyle: 'preserve-3d' }}>
      {effectsEnabled && <ThunderstormBackground enabled={effectsEnabled} weatherEffect={weatherEffect} />}
      <YouTubePlayer />
      
      <header className="w-full py-6 border-b border-hero-batman/20 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-hero-superman via-hero-wonderwoman to-hero-flash bg-clip-text text-transparent game-title glow-text">
            Justice League Memory Challenge
          </h1>
          <p className="text-center text-hero-wonderwoman/80 mt-2 glow-text">
            Choose your difficulty and find matching heroes
          </p>
          
          <div className="flex flex-wrap items-center justify-center mt-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="effects" 
                checked={effectsEnabled}
                onCheckedChange={(checked) => {
                  setEffectsEnabled(checked);
                  if (!checked) {
                    audioManager.stopAllSfx();
                  } else if (weatherEffect === 'thunder') {
                    audioManager.loop('thunder', true);
                  } else if (weatherEffect === 'rain') {
                    audioManager.loop('rain', true);
                  } else if (weatherEffect === 'all') {
                    audioManager.loop('thunder', true);
                    audioManager.loop('rain', true);
                  }
                }}
              />
              <Label 
                htmlFor="effects" 
                className="text-hero-wonderwoman/80 text-sm cursor-pointer glow-text"
              >
                3D Storm Effects
              </Label>
            </div>
            
            {effectsEnabled && (
              <WeatherEffectsControl 
                currentEffect={weatherEffect} 
                onChange={handleWeatherEffectChange} 
              />
            )}
          </div>
        </div>
      </header>
      
      <ScrollArea className="flex-1 w-full overflow-auto">
        <main className="container mx-auto px-4 pt-6 relative z-10 overflow-x-hidden">
          <GameBoard is3DModeActive={is3DModeActive} onToggle3DMode={() => setIs3DModeActive(!is3DModeActive)} />
        </main>
      </ScrollArea>
      
      <footer className="w-full py-4 border-t border-hero-batman/20 mt-10 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="glow-text">Justice League characters and all related elements © DC Comics</p>
          <p className="mt-2 text-xs text-hero-batman/80 glow-text">
            This game was created by Simos Michail software developer
          </p>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="mt-4 bg-hero-batman/20 border-hero-batman/50 hover:bg-hero-batman/40 mx-auto block"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#1A1F2C]/95 border-hero-wonderwoman/30 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-hero-superman to-hero-flash bg-clip-text text-transparent">
                Contact the Developer
              </h3>
              <p className="text-gray-300 mb-6">
                Have feedback or suggestions for the Justice League Memory Challenge? 
                Feel free to get in touch!
              </p>
              <div className="flex items-center p-4 bg-black/20 rounded-md border border-hero-wonderwoman/20">
                <Mail className="text-hero-wonderwoman mr-4 h-5 w-5" />
                <a 
                  href="mailto:simosmichail176@gmail.com" 
                  className="text-white hover:text-hero-superman transition-colors"
                >
                  simosmichail176@gmail.com
                </a>
              </div>
              <p className="text-gray-400 text-sm mt-6">
                This game was created by Simos Michail software developer
              </p>
            </SheetContent>
          </Sheet>
        </div>
      </footer>
    </div>
  );
};

export default Index;
