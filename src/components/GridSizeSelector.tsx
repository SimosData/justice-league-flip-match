
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Grid2x2, Grid3x3, LayoutGrid } from 'lucide-react';

export type GridSizeOption = {
  name: string;
  size: number;
  icon: React.ReactNode;
};

interface GridSizeSelectorProps {
  selectedSize: number;
  onSelectSize: (size: number) => void;
}

const GridSizeSelector: React.FC<GridSizeSelectorProps> = ({ 
  selectedSize, 
  onSelectSize 
}) => {
  // Define grid size options from easiest to hardest
  const gridSizeOptions: GridSizeOption[] = [
    { name: "Easy (4×4)", size: 4, icon: <Grid2x2 className="h-4 w-4" /> },
    { name: "Medium (6×6)", size: 6, icon: <Grid3x3 className="h-4 w-4" /> },
    { name: "Hard (8×8)", size: 8, icon: <LayoutGrid className="h-4 w-4" /> },
    { name: "Expert (10×10)", size: 10, icon: <LayoutGrid className="h-4 w-4" /> },
  ];

  // Find the currently selected option
  const selectedOption = gridSizeOptions.find(option => option.size === selectedSize) || gridSizeOptions[3];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-secondary/30 text-white border-hero-batman/30 hover:bg-secondary/40"
        >
          {selectedOption.icon}
          <span>{selectedOption.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 bg-secondary/80 backdrop-blur-sm border-hero-batman/50">
        <div className="grid gap-2">
          {gridSizeOptions.map((option) => (
            <Button
              key={option.size}
              variant={option.size === selectedSize ? "default" : "outline"}
              className={`justify-start ${
                option.size === selectedSize 
                  ? "bg-hero-superman text-white" 
                  : "bg-secondary/30 text-white hover:bg-secondary/50"
              }`}
              onClick={() => onSelectSize(option.size)}
            >
              {option.icon}
              <span className="ml-2">{option.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GridSizeSelector;
