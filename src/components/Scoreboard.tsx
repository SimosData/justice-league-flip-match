
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Trophy, Save } from 'lucide-react';

export interface ScoreRecord {
  id: string;
  playerName: string;
  score: number;
  gridSize: number;
  lives: number;
  timestamp: number;
  duration: number;
}

interface ScoreboardProps {
  onSaveScore: (playerName: string) => void;
  currentScore: number;
  gridSize: number;
  lives: number;
  gameTime: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ 
  onSaveScore, 
  currentScore,
  gridSize,
  lives,
  gameTime
}) => {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Load scores from localStorage
    const savedScores = localStorage.getItem('memoryGameScores');
    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores));
      } catch (e) {
        console.error('Failed to parse saved scores:', e);
      }
    }
  }, [isOpen]);
  
  const handleSaveScore = () => {
    if (playerName.trim()) {
      onSaveScore(playerName.trim());
      setPlayerName('');
      setShowInput(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="relative overflow-hidden group bg-hero-batman text-white hover:bg-hero-batman/80"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-hero-superman/20 to-hero-flash/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Trophy className="mr-2 h-4 w-4" />
          Scoreboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1A1F2C]/95 border border-hero-wonderwoman/30 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-hero-superman via-hero-wonderwoman to-hero-flash bg-clip-text text-transparent animate-pulse">
            Justice League Scoreboard
          </DialogTitle>
        </DialogHeader>
        
        {showInput ? (
          <div className="flex items-center gap-2 mb-4">
            <Input
              className="bg-secondary/20 border-hero-wonderwoman/30 text-white"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
            <Button 
              variant="outline" 
              onClick={handleSaveScore}
              className="bg-hero-wonderwoman text-white hover:bg-hero-wonderwoman/80"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setShowInput(true)}
            className="mb-4 bg-hero-wonderwoman text-white hover:bg-hero-wonderwoman/80"
          >
            Save Current Score
          </Button>
        )}
        
        <div className="overflow-y-auto max-h-[400px] rounded-md border border-hero-batman/30">
          <Table>
            <TableHeader className="bg-hero-batman/20">
              <TableRow>
                <TableHead className="text-white">Player</TableHead>
                <TableHead className="text-white text-right">Score</TableHead>
                <TableHead className="text-white text-right">Grid</TableHead>
                <TableHead className="text-white text-right">Lives</TableHead>
                <TableHead className="text-white text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.length > 0 ? (
                scores
                  .sort((a, b) => b.score - a.score)
                  .map((record) => (
                    <TableRow key={record.id} className="hover:bg-hero-wonderwoman/10">
                      <TableCell className="font-medium text-white">{record.playerName}</TableCell>
                      <TableCell className="text-right text-hero-superman">{record.score}</TableCell>
                      <TableCell className="text-right text-hero-wonderwoman">{record.gridSize}x{record.gridSize}</TableCell>
                      <TableCell className="text-right text-hero-flash">{record.lives}</TableCell>
                      <TableCell className="text-right text-gray-400">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-4">
                    No scores saved yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Scoreboard;
