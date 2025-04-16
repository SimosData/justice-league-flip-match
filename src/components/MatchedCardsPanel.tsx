
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Crown, Star } from 'lucide-react';

interface CardType {
  id: number;
  heroId: number;
  heroName: string;
  image: string;
  isSpecial?: boolean;
  pointValue?: number;
}

interface MatchedCardsPanelProps {
  matchedCards: CardType[];
  score: number;
}

const MatchedCardsPanel: React.FC<MatchedCardsPanelProps> = ({ matchedCards, score }) => {
  // Group cards by heroId to show each hero only once
  const uniqueHeroes = matchedCards.reduce<Record<number, CardType>>((acc, card) => {
    if (!acc[card.heroId]) {
      acc[card.heroId] = card;
    }
    return acc;
  }, {});

  const heroCards = Object.values(uniqueHeroes);
  
  // Separate special cards from regular cards
  const specialCards = heroCards.filter(card => card.isSpecial);
  const regularCards = heroCards.filter(card => !card.isSpecial);

  return (
    <Card className="bg-black/30 border-hero-wonderwoman/30 backdrop-blur-md h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md text-hero-superman">Matched Heroes</CardTitle>
        <CardDescription className="text-xs text-hero-wonderwoman">
          Found {heroCards.length} unique heroes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-2">
        <ScrollArea className="h-[400px] pr-4">
          {specialCards.length > 0 && (
            <>
              <div className="flex items-center mb-2">
                <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                <h4 className="text-sm font-bold text-hero-flash">Special Heroes</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mb-4">
                {specialCards.map(card => (
                  <div 
                    key={`special-${card.heroId}`}
                    className="relative rounded-md overflow-hidden border border-yellow-500/50 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <img 
                      src={card.image} 
                      alt={card.heroName}
                      className="w-full h-20 object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 z-20 flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{card.heroName}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="text-xs text-yellow-400">+{card.pointValue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {regularCards.length > 0 && (
            <>
              <h4 className="text-sm font-bold text-hero-wonderwoman mb-2">Regular Heroes</h4>
              <div className="grid grid-cols-2 gap-2">
                {regularCards.map(card => (
                  <div 
                    key={`regular-${card.heroId}`}
                    className="relative rounded-md overflow-hidden border border-hero-batman/30 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <img 
                      src={card.image} 
                      alt={card.heroName}
                      className="w-full h-16 object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-1 z-20">
                      <span className="text-xs text-white truncate block">{card.heroName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {heroCards.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <p className="text-gray-400 text-sm">No matches found yet</p>
              <p className="text-gray-500 text-xs mt-2">Flip cards to find matching heroes!</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pb-2">
        <span className="text-xs text-gray-400">Total Score:</span>
        <span className="text-md font-bold text-hero-flash">{score}</span>
      </CardFooter>
    </Card>
  );
};

export default MatchedCardsPanel;
