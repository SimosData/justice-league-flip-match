
import React from 'react';
import { Skull, Users, RotateCw, Bomb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface Boss {
  id: number;
  name: string;
  image: string;
  difficulty: number;
  description: string;
}

interface GameModeSelectorProps {
  onSelectBossMode: (bossId: number) => void;
  onToggle3DMode: () => void;
  is3DModeActive: boolean;
}

const BOSSES: Boss[] = [
  {
    id: 1,
    name: "Darkseid",
    image: "https://images.unsplash.com/photo-1608501857571-31a43311e342?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400",
    difficulty: 5,
    description: "The ruler of Apokolips, wielding the Omega Force."
  },
  {
    id: 2,
    name: "Reverse Flash",
    image: "https://images.unsplash.com/photo-1550684848-86a5d8727436?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400",
    difficulty: 4,
    description: "Eobard Thawne, the time-traveling nemesis of The Flash."
  },
  {
    id: 3,
    name: "Doomsday",
    image: "https://images.unsplash.com/photo-1518893063132-36e46dbe2428?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400",
    difficulty: 5,
    description: "The monster who killed Superman, evolving after every defeat."
  },
  {
    id: 4,
    name: "Omni-Man",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400", 
    difficulty: 4,
    description: "Viltrumite warrior with Superman-like powers and ruthless tactics."
  },
  {
    id: 5,
    name: "Brainiac",
    image: "https://images.unsplash.com/photo-1635002952476-bb74d9d5fba7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400",
    difficulty: 3,
    description: "Collector of worlds with 12th-level intellect and advanced technology."
  }
];

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  onSelectBossMode,
  onToggle3DMode,
  is3DModeActive
}) => {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-hero-batman/80 text-white hover:bg-hero-batman/60 border-hero-batman"
          >
            <Skull className="w-4 h-4 mr-2" />
            Boss Battle
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gradient-to-br from-hero-batman to-hero-superman/70 text-white border-hero-flash">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-hero-superman">Boss Battle Mode</DialogTitle>
            <DialogDescription className="text-white/80">
              Choose a boss to challenge. Each boss has unique abilities and difficulty.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {BOSSES.map(boss => (
              <div 
                key={boss.id}
                className="boss-card bg-black/40 rounded-lg overflow-hidden border border-hero-superman/30 hover:border-hero-superman transition-all cursor-pointer"
                onClick={() => {
                  onSelectBossMode(boss.id);
                  toast.info(`Boss Battle: ${boss.name} selected! Prepare for an epic challenge!`);
                }}
              >
                <div className="h-32 overflow-hidden">
                  <img 
                    src={boss.image} 
                    alt={boss.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-hero-flash">{boss.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-white/70 mr-2">Difficulty:</span>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Bomb 
                          key={i} 
                          className={`w-3 h-3 ${i < boss.difficulty ? 'text-hero-wonderwoman' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-white/80">{boss.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Button
        variant="outline"
        className={`${is3DModeActive ? 'bg-hero-flash/80' : 'bg-gray-800/80'} text-white hover:bg-hero-flash/60 border-hero-flash/50`}
        onClick={onToggle3DMode}
      >
        <RotateCw className="w-4 h-4 mr-2" />
        3D Mode {is3DModeActive ? 'ON' : 'OFF'}
      </Button>
      
      <Button
        variant="outline"
        className="bg-hero-wonderwoman/80 text-white hover:bg-hero-wonderwoman/60 border-hero-wonderwoman/50"
        onClick={() => toast.info("Standard mode: Find matching heroes!")}
      >
        <Users className="w-4 h-4 mr-2" />
        Standard Mode
      </Button>
    </div>
  );
};

export default GameModeSelector;
