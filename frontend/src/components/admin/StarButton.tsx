import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface StarButtonProps {
  isStarred: boolean;
  onToggle: () => void;
  className?: string;
}

export const StarButton: React.FC<StarButtonProps> = ({ isStarred, onToggle, className }) => {
  return (
    <Button
      variant="secondary"
      onClick={onToggle}
      className={className}
      aria-label={isStarred ? 'Unstar' : 'Star'}
    >
      <Star
        size={20}
        fill={isStarred ? 'currentColor' : 'none'}
        style={{ color: isStarred ? 'var(--color-warning)' : 'currentColor' }}
      />
    </Button>
  );
};
