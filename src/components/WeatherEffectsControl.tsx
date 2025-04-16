
import React from 'react';
import { CloudRain, CloudSnow, CloudLightning, SunMoon, Layers, Power } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type WeatherEffect = 'thunder' | 'rain' | 'snow' | 'clear' | 'all' | 'off';

interface WeatherEffectsControlProps {
  currentEffect: WeatherEffect;
  onChange: (effect: WeatherEffect) => void;
}

const WeatherEffectsControl: React.FC<WeatherEffectsControlProps> = ({ 
  currentEffect, 
  onChange 
}) => {
  return (
    <TooltipProvider>
      <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
        <ToggleGroup type="single" value={currentEffect} onValueChange={(value) => onChange(value as WeatherEffect)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="thunder" aria-label="Toggle Thunder" className="data-[state=on]:bg-hero-flash/70">
                <CloudLightning className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thunder</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="rain" aria-label="Toggle Rain" className="data-[state=on]:bg-hero-wonderwoman/70">
                <CloudRain className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rain</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="snow" aria-label="Toggle Snow" className="data-[state=on]:bg-white/70">
                <CloudSnow className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Snow</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="clear" aria-label="Clear Weather" className="data-[state=on]:bg-yellow-500/70">
                <SunMoon className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Weather</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="all" aria-label="All Effects" className="data-[state=on]:bg-purple-500/70">
                <Layers className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>All Effects</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="off" aria-label="Turn Off Effects" className="data-[state=on]:bg-red-500/70">
                <Power className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Turn Off Effects</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};

export default WeatherEffectsControl;
