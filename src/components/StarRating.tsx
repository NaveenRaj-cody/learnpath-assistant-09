
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg' | number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  className = "",
  showNumber = true,
  size = 'sm'
}) => {
  const getSizeClass = () => {
    if (typeof size === 'number') {
      return `h-[${size}px] w-[${size}px]`;
    }
    
    switch(size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  };
  
  const getTextSize = () => {
    if (typeof size === 'number') {
      const textSize = size <= 16 ? 'text-sm' : size <= 20 ? 'text-base' : 'text-lg';
      return textSize;
    }
    
    switch(size) {
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      default: return 'text-sm';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(maxRating)].map((_, i) => (
        <Star 
          key={i} 
          className={`${getSizeClass()} ${i < Math.floor(rating) ? 'fill-amber-500 text-amber-500' : 'fill-none text-amber-500'}`} 
          size={typeof size === 'number' ? size : undefined}
        />
      ))}
      {showNumber && <span className={`ml-1 ${getTextSize()} font-medium`}>{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
