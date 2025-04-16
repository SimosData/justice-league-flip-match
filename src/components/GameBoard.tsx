
import React, { useState, useEffect, useCallback, useRef } from 'react';
import MemoryCard from './MemoryCard';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import GridSizeSelector from './GridSizeSelector';
import Scoreboard, { ScoreRecord } from './Scoreboard';
import GameControls from './GameControls';
import GameModeSelector from './GameModeSelector';
import { toast } from 'sonner';
import { RefreshCw, Heart, Plus, Minus, ThumbsUp, Skull, Crown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import audioManager from '@/utils/audioManager';
import MatchedCardsPanel from './MatchedCardsPanel';

// Justice League character images
const HEROES = [
  { id: 1, name: "Superman", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400" },
  { id: 2, name: "Batman", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400" },
  // ... keep existing code (the rest of the heroes array)
];

// Special cards with higher point values
const SPECIAL_HEROES = [
  { id: 101, name: "Super Saiyan God Goku", image: "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400", pointValue: 10000 },
  { id: 102, name: "Supreme God Godzilla", image: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400", pointValue: 20000 },
  { id: 103, name: "Celestial God", image: "https://images.unsplash.com/photo-1605379399843-5870eea9b74e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400", pointValue: 30000 },
  { id: 104, name: "Overlord Ainz Ooal Gown", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400", pointValue: 50000 },
];

interface CardType {
  id: number;
  heroId: number;
  isFlipped: boolean;
  isMatched: boolean;
  heroName: string;
  image: string;
  isSpecial?: boolean;
  pointValue?: number;
}

interface MatchedCardDisplay {
  id: number;
  heroId: number;
  heroName: string;
  image: string;
  isSpecial?: boolean;
  pointValue?: number;
}

interface GameBoardProps {
  is3DModeActive?: boolean;
  onToggle3DMode?: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  is3DModeActive = false,
  onToggle3DMode = () => {}
}) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [matchedHeroes, setMatchedHeroes] = useState<MatchedCardDisplay[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<number>(4);
  const [strikes, setStrikes] = useState<number>(0);
  const [maxStrikes, setMaxStrikes] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameTimer, setGameTimer] = useState<number>(300);
  const [remainingTime, setRemainingTime] = useState<number>(300);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameSpeed, setGameSpeed] = useState<number>(1.0);
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [showWinAnimation, setShowWinAnimation] = useState<boolean>(false);
  const [showLoseAnimation, setShowLoseAnimation] = useState<boolean>(false);
  const [activeBossId, setActiveBossId] = useState<number | null>(null);
  const [foundSpecialCard, setFoundSpecialCard] = useState<CardType | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const TOTAL_CARDS = gridSize * gridSize;
  const PAIRS_NEEDED = TOTAL_CARDS / 2;

  const initializeGame = useCallback(() => {
    // Determine how many special cards to include based on grid size
    const maxSpecialCards = Math.min(4, Math.floor(gridSize / 2));
    const specialCardsToUse = Math.min(maxSpecialCards, SPECIAL_HEROES.length);
    
    const heroPairs: number[] = [];
    const specialHeroPairs: { index: number, heroIndex: number }[] = [];
    
    // Add special hero pairs first
    for (let i = 0; i < specialCardsToUse; i++) {
      specialHeroPairs.push({ index: i, heroIndex: i });
      specialHeroPairs.push({ index: i, heroIndex: i });
    }
    
    // Fill the rest with regular heroes
    const remainingPairs = PAIRS_NEEDED - specialCardsToUse;
    for (let i = 0; i < remainingPairs; i++) {
      const heroIndex = i % HEROES.length;
      heroPairs.push(heroIndex);
      heroPairs.push(heroIndex);
    }
    
    // Shuffle both arrays
    const shuffledSpecialHeroes = [...specialHeroPairs].sort(() => Math.random() - 0.5);
    const shuffledHeroes = [...heroPairs].sort(() => Math.random() - 0.5);
    
    // Create cards array with both special and regular heroes
    const newCards: CardType[] = [];
    
    // Add special heroes first
    shuffledSpecialHeroes.forEach((hero, index) => {
      const specialHero = SPECIAL_HEROES[hero.heroIndex];
      newCards.push({
        id: index,
        heroId: specialHero.id,
        isFlipped: false,
        isMatched: false,
        heroName: specialHero.name,
        image: specialHero.image,
        isSpecial: true,
        pointValue: specialHero.pointValue
      });
    });
    
    // Add regular heroes
    shuffledHeroes.forEach((heroIndex, index) => {
      const hero = HEROES[heroIndex];
      newCards.push({
        id: shuffledSpecialHeroes.length + index,
        heroId: hero.id,
        isFlipped: false,
        isMatched: false,
        heroName: hero.name,
        image: hero.image
      });
    });
    
    // Shuffle the combined array
    const finalShuffledCards = [...newCards].sort(() => Math.random() - 0.5);
    
    setCards(finalShuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMatchedHeroes([]);
    setGameOver(false);
    setScore(0);
    setStrikes(0);
    setIsGameStarted(true);
    setIsPaused(false);
    setRemainingTime(gameTimer);
    setStartTime(Date.now());
    setElapsedTime(0);
    setFoundSpecialCard(null);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (gameTimer !== Infinity) {
      startTimer();
    }
    
    toast.success(`Game started with ${gridSize}×${gridSize} grid! Find matching Justice League heroes!`);
  }, [gridSize, PAIRS_NEEDED, gameTimer]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (gameTimer === Infinity) {
      setRemainingTime(Infinity);
      return;
    }
    
    const endTime = Date.now() + remainingTime * 1000;
    
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      
      setRemainingTime(remaining);
      setElapsedTime(now - startTime);
      
      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        setGameOver(true);
        showLoseScreen();
        toast.error(`Time's up! Game Over! Press Restart to play again!`);
      }
    }, 1000);
  }, [gameTimer, remainingTime, startTime]);

  useEffect(() => {
    if (isGameStarted && !isPaused && !gameOver) {
      if (gameTimer !== Infinity) {
        startTimer();
      }
    } else if (isPaused && timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameStarted, isPaused, gameOver, startTimer, gameTimer]);

  useEffect(() => {
    if (isGameStarted) {
      initializeGame();
    }
  }, [gridSize, initializeGame, isGameStarted, gameTimer]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  useEffect(() => {
    document.documentElement.style.setProperty('--game-speed', `${1 / gameSpeed}`);
  }, [gameSpeed]);

  useEffect(() => {
    if (score === PAIRS_NEEDED && !gameOver) {
      setGameOver(true);
      showWinScreen();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast.success(`Congratulations! You've matched all heroes!`);
    }
  }, [score, PAIRS_NEEDED, gameOver]);

  const showWinScreen = () => {
    setShowWinAnimation(true);
    audioManager.play('win');
    
    setTimeout(() => {
      setShowWinAnimation(false);
    }, 5000);
  };

  const showLoseScreen = () => {
    setShowLoseAnimation(true);
    audioManager.play('lose');
    
    setTimeout(() => {
      setShowLoseAnimation(false);
    }, 5000);
  };

  const handleCardClick = (id: number) => {
    if (
      isProcessing ||
      flippedCards.includes(id) ||
      matchedCards.includes(id) ||
      gameOver ||
      isPaused
    ) {
      return;
    }

    // Play roulette sound for card flip
    audioManager.play('roulette');

    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    
    setCards(updatedCards);
    
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      if (firstCard && secondCard) {
        const matchCheckDelay = 750 / gameSpeed;
        
        if (firstCard.heroId === secondCard.heroId) {
          audioManager.play('match');
          
          setTimeout(() => {
            setMatchedCards(prevMatched => [...prevMatched, firstCardId, secondCardId]);
            
            // Add matched hero to the side panel
            const heroToAdd: MatchedCardDisplay = {
              id: firstCard.id,
              heroId: firstCard.heroId,
              heroName: firstCard.heroName,
              image: firstCard.image,
              isSpecial: firstCard.isSpecial,
              pointValue: firstCard.pointValue
            };
            
            setMatchedHeroes(prev => [...prev, heroToAdd]);
            
            // Add points based on card type
            const pointsToAdd = firstCard.isSpecial ? (firstCard.pointValue || 0) : 1;
            
            setScore(prevScore => prevScore + pointsToAdd);
            setFlippedCards([]);
            
            // Show special notification for special cards
            if (firstCard.isSpecial) {
              setFoundSpecialCard(firstCard);
              toast.success(`Special card found! ${firstCard.heroName} (+${firstCard.pointValue} points)`, {
                duration: 3000,
                position: 'top-center',
                icon: '👑'
              });
              
              // If it's the highest value special card, show crown animation
              if (firstCard.pointValue === 50000) {
                showWinScreen();
              }
              
              setTimeout(() => {
                setFoundSpecialCard(null);
              }, 5000);
            } else {
              toast.success(`Match found! ${firstCard.heroName}`);
            }
            
            setIsProcessing(false);
          }, matchCheckDelay);
        } else {
          audioManager.play('noMatch');
          
          setTimeout(() => {
            const newStrikes = strikes + 1;
            setStrikes(newStrikes);
            
            if (newStrikes >= maxStrikes) {
              setGameOver(true);
              showLoseScreen();
              
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
              toast.error(`Game Over! You've used all ${maxStrikes} strikes. Press Restart to play again!`);
            } else {
              const resetCards = cards.map(card => {
                if (card.id === firstCardId || card.id === secondCardId) {
                  return { ...card, isFlipped: false };
                }
                return card;
              });
              
              setCards(resetCards);
              
              toast.warning(`No match! Strike ${newStrikes}/${maxStrikes}. Be careful!`);
            }
            
            setFlippedCards([]);
            setIsProcessing(false);
          }, matchCheckDelay);
        }
      }
    }
  };

  const handleRestart = () => {
    initializeGame();
  };

  const handleGridSizeChange = (size: number) => {
    if (size !== gridSize) {
      setGridSize(size);
      toast.info(`Grid size changed to ${size}×${size}. Game will restart with new size.`);
    }
  };

  const handleLifeCountChange = (change: number) => {
    const newMaxStrikes = Math.max(1, Math.min(50, maxStrikes + change));
    
    if (newMaxStrikes !== maxStrikes) {
      setMaxStrikes(newMaxStrikes);
      toast.info(`Lives changed to ${newMaxStrikes}. Game will restart with new life count.`);
      setTimeout(initializeGame, 100);
    }
  };
  
  const handlePauseToggle = () => {
    setIsPaused(prev => !prev);
    if (isPaused) {
      toast.info("Game resumed!");
    } else {
      toast.info("Game paused!");
    }
  };
  
  const handleTimerSet = (seconds: number) => {
    setGameTimer(seconds);
    setRemainingTime(seconds);
    toast.info(`Timer set to ${seconds === Infinity ? "unlimited" : `${seconds} seconds`}. Game will restart.`);
    setTimeout(initializeGame, 100);
  };
  
  const handleSaveScore = (playerName: string) => {
    const newScore: ScoreRecord = {
      id: uuidv4(),
      playerName,
      score,
      gridSize,
      lives: maxStrikes,
      timestamp: Date.now(),
      duration: elapsedTime
    };
    
    const savedScores = localStorage.getItem('memoryGameScores');
    let scores: ScoreRecord[] = [];
    
    if (savedScores) {
      try {
        scores = JSON.parse(savedScores);
      } catch (e) {
        console.error('Failed to parse saved scores:', e);
      }
    }
    
    scores.push(newScore);
    localStorage.setItem('memoryGameScores', JSON.stringify(scores));
    
    toast.success(`Score saved for ${playerName}!`);
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    
    switch(newDifficulty) {
      case "Easy":
        setMaxStrikes(5);
        setGridSize(4);
        break;
      case "Medium":
        setMaxStrikes(4);
        setGridSize(6);
        break;
      case "Hard":
        setMaxStrikes(3);
        setGridSize(8);
        break;
      case "Expert":
        setMaxStrikes(2);
        setGridSize(8);
        break;
      case "Legendary":
        setMaxStrikes(1);
        setGridSize(10);
        break;
    }
    
    toast.info(`Difficulty set to ${newDifficulty}. Game will restart.`);
    setTimeout(initializeGame, 100);
  };
  
  const handleSpeedChange = (speed: number) => {
    setGameSpeed(speed);
    toast.info(`Game speed set to ${speed}x`);
  };

  const handleBossMode = (bossId: number) => {
    setActiveBossId(bossId);
    setDifficulty("Boss");
    setMaxStrikes(3);
    setGridSize(8);
    toast.info(`Boss battle mode activated! Challenge accepted!`);
    setTimeout(initializeGame, 100);
  };

  const getRemainingPairs = PAIRS_NEEDED - score;

  const getGridColumnsClass = () => {
    switch (gridSize) {
      case 4:
        return 'grid-cols-4';
      case 6:
        return 'grid-cols-6';
      case 8:
        return 'grid-cols-8';
      case 10:
        return 'grid-cols-10';
      default:
        return 'grid-cols-4';
    }
  };

  const renderLives = () => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(maxStrikes - strikes)].map((_, i) => (
          <Heart 
            key={i} 
            className="h-5 w-5 text-hero-wonderwoman" 
            fill="#e11d48" 
          />
        ))}
        {[...Array(strikes)].map((_, i) => (
          <Heart 
            key={i + maxStrikes} 
            className="h-5 w-5 text-slate-500" 
          />
        ))}
      </div>
    );
  };

  const formatTime = (seconds: number): string => {
    if (seconds === Infinity) return "∞";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 transform-3d">
      {showWinAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce text-center">
            <ThumbsUp size={120} className="text-red-600 mx-auto filter drop-shadow-glow animate-pulse" />
            <h2 className="text-4xl font-bold text-white mt-4 text-shadow-glow animate-pulse">
              YOU WIN!
            </h2>
          </div>
        </div>
      )}
      
      {showLoseAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/50">
          <div className="animate-rise text-center">
            <Skull size={120} className="text-red-600 mx-auto filter drop-shadow-glow animate-pulse" />
            <h2 className="text-4xl font-bold text-white mt-4 text-shadow-glow animate-pulse">
              YOU LOST!
            </h2>
          </div>
        </div>
      )}
      
      {foundSpecialCard && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 relative">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-lg animate-scale-in"></div>
            <Crown size={60} className="text-yellow-500 mx-auto filter drop-shadow-glow animate-pulse relative z-10" />
            <h3 className="text-2xl font-bold text-white mt-2 text-shadow-glow animate-pulse relative z-10">
              {foundSpecialCard.heroName}
            </h3>
            <p className="text-yellow-400 text-lg font-bold relative z-10">
              +{foundSpecialCard.pointValue} points!
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-secondary/10 p-4 rounded-lg backdrop-blur-sm border border-hero-wonderwoman/20">
        <div className="space-y-1 text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-hero-superman glow-text">
            Justice League Memory Match
          </h2>
          <p className="text-hero-wonderwoman text-sm md:text-base glow-text">
            {gameOver 
              ? `Game Over! You've used all ${maxStrikes} strikes.` 
              : `Find matching heroes! ${getRemainingPairs} pairs remaining`}
          </p>
          <div className="mt-2 flex items-center gap-3">
            {renderLives()}
            <div className="flex items-center w-32 bg-muted/20 px-2 py-1 rounded-md justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleLifeCountChange(-1)}
                className="h-6 w-6 text-hero-batman flex-shrink-0"
                disabled={maxStrikes <= 1 || gameOver}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium text-hero-wonderwoman whitespace-nowrap glow-text">Lives: {maxStrikes}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleLifeCountChange(1)}
                className="h-6 w-6 text-hero-batman flex-shrink-0"
                disabled={maxStrikes >= 50 || gameOver}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center md:justify-end">
          <GameControls 
            isGameStarted={isGameStarted}
            gameOver={gameOver}
            isPaused={isPaused}
            onPauseToggle={handlePauseToggle}
            onRestart={handleRestart}
            onTimerSet={handleTimerSet}
            gameTimer={gameTimer}
            remainingTime={remainingTime}
            formattedTime={formatTime(remainingTime)}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            gameSpeed={gameSpeed}
            onSpeedChange={handleSpeedChange}
          />
          
          <GameModeSelector
            onSelectBossMode={handleBossMode}
            onToggle3DMode={onToggle3DMode}
            is3DModeActive={is3DModeActive}
          />
          
          <GridSizeSelector 
            selectedSize={gridSize} 
            onSelectSize={handleGridSizeChange} 
          />
          
          <Scoreboard
            onSaveScore={handleSaveScore}
            currentScore={score}
            gridSize={gridSize}
            lives={maxStrikes}
            gameTime={elapsedTime / 1000}
          />
          
          <div className="bg-muted/30 px-4 py-2 rounded-md backdrop-blur-sm">
            <p className="text-sm font-medium text-hero-wonderwoman glow-text">Score</p>
            <p className="text-2xl font-bold text-hero-flash">{score}</p>
          </div>
          
          <Button 
            variant="outline"
            onClick={handleRestart}
            className="bg-hero-batman text-white hover:bg-hero-batman/80"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4">
          <ScrollArea className="scene-wrapper h-full">
            <div 
              ref={sceneRef}
              className="scene relative w-full aspect-square bg-secondary/5 rounded-lg overflow-hidden backdrop-blur-sm p-1 md:p-2 world-container"
              style={{
                transition: `all ${1/gameSpeed}s ease`
              }}
            >
              <div 
                ref={boardRef}
                className={`grid ${getGridColumnsClass()} gap-1 w-full h-full transition-transform duration-300 float-animation transform-3d`}
                style={{ 
                  transformStyle: 'preserve-3d', 
                  transition: `transform ${0.3 / gameSpeed}s ease`,
                  animation: is3DModeActive ? 'float-animation 6s ease-in-out infinite' : 'none'
                }}
              >
                {cards.map((card) => (
                  <MemoryCard
                    key={card.id}
                    imageUrl={card.image}
                    heroId={card.heroId}
                    isFlipped={card.isFlipped || matchedCards.includes(card.id)}
                    isDisabled={
                      gameOver ||
                      isPaused ||
                      matchedCards.includes(card.id) ||
                      flippedCards.length === 2
                    }
                    onClick={() => handleCardClick(card.id)}
                    speed={gameSpeed}
                    enable3DMotion={is3DModeActive}
                    isSpecial={card.isSpecial}
                  />
                ))}
              </div>
              
              {(gameOver || isPaused) && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="text-center p-6 bg-secondary/30 rounded-lg backdrop-blur-lg border border-hero-wonderwoman max-w-md transform-3d ui-modal">
                    <h3 className="text-3xl font-bold text-hero-superman mb-4 glow-text">
                      {gameOver ? "Game Over!" : "Game Paused"}
                    </h3>
                    {gameOver && (
                      <>
                        <p className="text-white mb-2 glow-text">
                          {remainingTime === 0 
                            ? "Time's up!" 
                            : `You've used all ${maxStrikes} strikes!`}
                        </p>
                        <p className="text-white mb-6 glow-text">Your final score: {score} points</p>
                      </>
                    )}
                    <Button 
                      onClick={gameOver ? handleRestart : handlePauseToggle}
                      className="bg-hero-wonderwoman text-white hover:bg-hero-wonderwoman/80"
                    >
                      {gameOver ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Play Again
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resume
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="w-full md:w-1/4">
          <MatchedCardsPanel matchedCards={matchedHeroes} score={score} />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
