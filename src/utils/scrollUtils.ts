// Utility functions for enhanced scrolling behavior

interface ScrollConfig {
  behavior?: 'auto' | 'smooth';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
  offset?: number;
}

export const scrollToElementById = (
  elementId: string, 
  config: ScrollConfig = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with ID "${elementId}" not found`);
      resolve();
      return;
    }

    const { behavior = 'smooth', block = 'start', inline = 'nearest', offset = 0 } = config;

    // Calculate position with offset
    if (offset !== 0) {
      const elementRect = element.getBoundingClientRect();
      const targetY = window.pageYOffset + elementRect.top - offset;
      
      window.scrollTo({
        top: targetY,
        behavior
      });
    } else {
      element.scrollIntoView({
        behavior,
        block,
        inline
      });
    }

    // Resolve promise when scroll is complete
    if (behavior === 'smooth') {
      let lastScrollY = window.scrollY;
      let stationaryCount = 0;
      
      const checkScroll = () => {
        if (Math.abs(window.scrollY - lastScrollY) < 1) {
          stationaryCount++;
          if (stationaryCount > 3) {
            resolve();
            return;
          }
        } else {
          stationaryCount = 0;
        }
        
        lastScrollY = window.scrollY;
        requestAnimationFrame(checkScroll);
      };
      
      requestAnimationFrame(checkScroll);
    } else {
      resolve();
    }
  });
};

export const getScrollDirection = (() => {
  let lastScrollY = window.scrollY;
  
  return (): 'up' | 'down' | 'none' => {
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollY ? 'down' : 
                     currentScrollY < lastScrollY ? 'up' : 'none';
    lastScrollY = currentScrollY;
    return direction;
  };
})();

export const isElementInViewport = (
  element: HTMLElement, 
  threshold: number = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
};

export const getElementScrollProgress = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  if (rect.bottom < 0) return 100; // Completely above viewport
  if (rect.top > windowHeight) return 0; // Completely below viewport
  
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const totalHeight = rect.height;
  
  return Math.max(0, Math.min(100, (visibleHeight / totalHeight) * 100));
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};

// Smooth scroll polyfill for older browsers
export const initSmoothScrollPolyfill = (): void => {
  if (!('scrollBehavior' in document.documentElement.style)) {
    import('smoothscroll-polyfill').then(({ polyfill }) => {
      polyfill();
    }).catch(err => {
      console.warn('Could not load smooth scroll polyfill:', err);
    });
  }
};

// Enhanced scroll restoration
export const setupScrollRestoration = (): void => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
};

export default {
  scrollToElementById,
  getScrollDirection,
  isElementInViewport,
  getElementScrollProgress,
  throttle,
  debounce,
  initSmoothScrollPolyfill,
  setupScrollRestoration
};