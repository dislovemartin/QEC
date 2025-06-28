import React, { useEffect, useState } from 'react';

interface ScrollProgressIndicatorProps {
  className?: string;
  color?: string;
}

const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({ 
  className = '',
  color = 'var(--accent)'
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    const handleScroll = () => {
      requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`scroll-progress ${className}`}
      style={{ 
        transform: `scaleX(${scrollProgress / 100})`,
        background: color
      }}
    />
  );
};

export default ScrollProgressIndicator;