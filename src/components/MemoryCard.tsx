
import React, { useRef, useEffect } from 'react';
import audioManager from '@/utils/audioManager';

interface MemoryCardProps {
  imageUrl: string;
  heroId: number;
  isFlipped: boolean;
  isDisabled: boolean;
  onClick: () => void;
  speed?: number;
  enable3DMotion?: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ 
  imageUrl, 
  heroId, 
  isFlipped, 
  isDisabled, 
  onClick,
  speed = 1.0,
  enable3DMotion = false
}) => {
  const cardSpeed = 0.6 / (speed || 1.0);
  const cardRef = useRef<HTMLDivElement>(null);
  const prevFlippedState = useRef<boolean>(isFlipped);

  useEffect(() => {
    if (isFlipped !== prevFlippedState.current) {
      if (isFlipped) {
        audioManager.play('cardFlip');
        audioManager.play('roulette');
      }
      prevFlippedState.current = isFlipped;
    }
  }, [isFlipped]);

  useEffect(() => {
    if (!enable3DMotion || !cardRef.current) return;

    const card = cardRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 15; // max 15 degrees
      const rotateX = ((centerY - y) / centerY) * 15; // max 15 degrees
      
      card.style.transform = `rotateY(${isFlipped ? 180 : 0}deg) perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
      card.style.transition = `transform ${cardSpeed}s ease-in-out`;
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enable3DMotion, isFlipped, cardSpeed]);
  
  return (
    <div 
      className={`relative group cursor-pointer perspective-[1000px] transform-3d w-full aspect-square`}
      onClick={!isDisabled ? onClick : undefined}
      ref={cardRef}
    >
      <div 
        className={`absolute inset-0 w-full h-full transform-3d transition-transform preserve-3d hover:scale-[1.02] ${
          isDisabled ? 'pointer-events-none opacity-90' : 'cursor-pointer'
        }`}
        style={{ 
          transition: `transform ${cardSpeed}s ease-in-out`,
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Card Back */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full rounded-lg border-2 border-hero-batman/30 bg-gradient-to-br from-hero-batman via-hero-superman to-hero-wonderwoman shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white transform-3d opacity-80 hero-text">
              JL
            </span>
          </div>
        </div>
        
        {/* Card Front */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full rounded-lg border-2 border-hero-flash shadow-xl overflow-hidden bg-white transform-3d"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <img 
            src={imageUrl} 
            alt={`Hero ${heroId}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
