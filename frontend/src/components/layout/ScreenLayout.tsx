import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

interface ScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  bottomAction?: React.ReactNode;
  className?: string;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  title,
  showBack = false,
  showMenu = false,
  onBack,
  onMenu,
  bottomAction,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="screen-layout">
      {(title || showBack || showMenu) && (
        <header className="screen-header">
          <div className="screen-header-left">
            {showBack && (
              <button className="screen-header-button" onClick={handleBack}>
                <ArrowLeft size={24} />
              </button>
            )}
          </div>
          {title && <h1 className="screen-title">{title}</h1>}
          <div className="screen-header-right">
            {showMenu && (
              <button className="screen-header-button" onClick={onMenu}>
                <Menu size={24} />
              </button>
            )}
          </div>
        </header>
      )}

      <main className={`screen-content ${className}`}>
        {children}
      </main>

      {bottomAction && (
        <div className="screen-bottom-action">
          {bottomAction}
        </div>
      )}
    </div>
  );
};
