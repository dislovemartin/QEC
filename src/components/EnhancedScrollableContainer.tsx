import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface EnhancedScrollableContainerProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  showScrollIndicators?: boolean;
  onScroll?: (scrollInfo: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void;
}

const EnhancedScrollableContainer: React.FC<EnhancedScrollableContainerProps> = ({
  children,
  className = '',
  maxHeight = '24rem',
  showScrollIndicators = true,
  onScroll
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollInfo, setScrollInfo] = useState({
    canScrollUp: false,
    canScrollDown: false,
    scrollProgress: 0
  });

  const updateScrollInfo = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const canScrollUp = scrollTop > 0;
    const canScrollDown = scrollTop < scrollHeight - clientHeight;
    const scrollProgress = scrollHeight > clientHeight 
      ? (scrollTop / (scrollHeight - clientHeight)) * 100 
      : 100;

    setScrollInfo({ canScrollUp, canScrollDown, scrollProgress });
    
    onScroll?.({ scrollTop, scrollHeight, clientHeight });
  }, [onScroll]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    updateScrollInfo();
  }, [updateScrollInfo]);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    updateScrollInfo();
    
    // Update on resize
    const handleResize = () => updateScrollInfo();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollInfo]);

  // Keyboard navigation for container
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    switch (event.key) {
      case 'ArrowUp':
        if (event.shiftKey) {
          event.preventDefault();
          container.scrollBy({ top: -50, behavior: 'smooth' });
        }
        break;
      case 'ArrowDown':
        if (event.shiftKey) {
          event.preventDefault();
          container.scrollBy({ top: 50, behavior: 'smooth' });
        }
        break;
      case 'PageUp':
        event.preventDefault();
        container.scrollBy({ top: -container.clientHeight * 0.8, behavior: 'smooth' });
        break;
      case 'PageDown':
        event.preventDefault();
        container.scrollBy({ top: container.clientHeight * 0.8, behavior: 'smooth' });
        break;
      case 'Home':
        if (event.ctrlKey) {
          event.preventDefault();
          scrollToTop();
        }
        break;
      case 'End':
        if (event.ctrlKey) {
          event.preventDefault();
          scrollToBottom();
        }
        break;
    }
  };

  return (
    <div className="relative">
      {/* Scroll Indicators */}
      {showScrollIndicators && (
        <>
          {scrollInfo.canScrollUp && (
            <button
              onClick={scrollToTop}
              className="absolute top-2 right-2 z-10 p-1 bg-surface-2 border border-gray-600 rounded hover:bg-surface-1 transition-colors"
              title="Scroll to top"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
          )}
          
          {scrollInfo.canScrollDown && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-2 right-2 z-10 p-1 bg-surface-2 border border-gray-600 rounded hover:bg-surface-1 transition-colors"
              title="Scroll to bottom"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
          
          {/* Progress Bar */}
          {(scrollInfo.canScrollUp || scrollInfo.canScrollDown) && (
            <div className="absolute right-1 top-8 bottom-8 w-1 bg-gray-700 rounded">
              <div 
                className="w-full bg-accent rounded transition-all duration-200"
                style={{ height: `${scrollInfo.scrollProgress}%` }}
              />
            </div>
          )}
        </>
      )}
      
      {/* Scrollable Content */}
      <div
        ref={containerRef}
        className={`overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 ${className}`}
        style={{ maxHeight }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Scrollable content"
      >
        {children}
      </div>
    </div>
  );
};

export default EnhancedScrollableContainer;