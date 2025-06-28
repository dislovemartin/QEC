import React from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  show: boolean;
  onClick: () => void;
  className?: string;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ 
  show, 
  onClick, 
  className = '' 
}) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 p-3 bg-accent text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 ${className}`}
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTopButton;