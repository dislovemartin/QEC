import { useEffect, useCallback, useRef, useState } from 'react';

interface ScrollToOptions {
  top?: number;
  left?: number;
  behavior?: 'auto' | 'smooth';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
}

interface ScrollHookReturn {
  scrollToElement: (elementId: string, options?: ScrollToOptions) => void;
  scrollToTop: (options?: ScrollToOptions) => void;
  scrollTo: (position: { x?: number; y?: number }, options?: ScrollToOptions) => void;
  isScrolling: boolean;
  scrollPosition: { x: number; y: number };
  showScrollToTop: boolean;
}

export const useSmoothScroll = (): ScrollHookReturn => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const rafRef = useRef<number>();

  // Throttled scroll position tracking
  const updateScrollPosition = useCallback(() => {
    setScrollPosition({
      x: window.scrollX,
      y: window.scrollY
    });

    // Show scroll-to-top button after scrolling down 300px
    setShowScrollToTop(window.scrollY > 300);

    // Clear previous timeout and set new one
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    setIsScrolling(true);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // Optimized scroll event handler using RAF
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(updateScrollPosition);
  }, [updateScrollPosition]);

  // Enhanced scrollToElement with intersection observer for verification
  const scrollToElement = useCallback((elementId: string, options: ScrollToOptions = {}) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with ID "${elementId}" not found`);
      return;
    }

    const scrollOptions: ScrollIntoViewOptions = {
      behavior: options.behavior || 'smooth',
      block: options.block || 'start',
      inline: options.inline || 'nearest'
    };

    element.scrollIntoView(scrollOptions);

    // Verify scroll completion with intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is now visible, scroll completed
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    // Cleanup observer after timeout
    setTimeout(() => observer.disconnect(), 2000);
  }, []);

  // Smooth scroll to top
  const scrollToTop = useCallback((options: ScrollToOptions = {}) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: options.behavior || 'smooth'
    });
  }, []);

  // Generic scroll to position
  const scrollTo = useCallback((
    position: { x?: number; y?: number }, 
    options: ScrollToOptions = {}
  ) => {
    window.scrollTo({
      top: position.y || 0,
      left: position.x || 0,
      behavior: options.behavior || 'smooth'
    });
  }, []);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Only handle if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const scrollAmount = window.innerHeight * 0.8; // 80% of viewport height

      switch (event.key) {
        case 'PageDown':
          event.preventDefault();
          window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          break;
        case 'PageUp':
          event.preventDefault();
          window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
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
            window.scrollTo({ 
              top: document.documentElement.scrollHeight, 
              behavior: 'smooth' 
            });
          }
          break;
        case 'ArrowDown':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            window.scrollBy({ top: 100, behavior: 'smooth' });
          }
          break;
        case 'ArrowUp':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            window.scrollBy({ top: -100, behavior: 'smooth' });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [scrollToTop]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial position
    updateScrollPosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, updateScrollPosition]);

  return {
    scrollToElement,
    scrollToTop,
    scrollTo,
    isScrolling,
    scrollPosition,
    showScrollToTop
  };
};

export default useSmoothScroll;