import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = '', 
  fallback,
  size = 'md',
  className = '' 
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  const showFallback = !src || imageError;
  
  return (
    <div className={`avatar avatar--${size} ${className}`}>
      {showFallback ? (
        <span className="avatar-fallback">
          {fallback || alt.charAt(0).toUpperCase()}
        </span>
      ) : (
        <img 
          src={src} 
          alt={alt}
          onError={() => setImageError(true)}
          className="avatar-image"
        />
      )}
    </div>
  );
};
