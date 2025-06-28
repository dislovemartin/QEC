import { useState, useEffect, useCallback, useRef } from 'react';

interface InfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  rootMargin?: string;
  enabled?: boolean;
}

interface InfiniteScrollReturn<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  setItems: (items: T[]) => void;
  reset: () => void;
}

export const useInfiniteScroll = <T>(
  loadFunction: (page: number) => Promise<{ items: T[]; hasMore: boolean }>,
  options: InfiniteScrollOptions = {}
): InfiniteScrollReturn<T> => {
  const {
    threshold = 100,
    rootMargin = '0px',
    enabled = true
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !enabled) return;

    setIsLoading(true);
    try {
      const result = await loadFunction(page);
      setItems(prev => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadFunction, page, isLoading, hasMore, enabled]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(false);
  }, []);

  // Set up intersection observer
  useEffect(() => {
    if (!enabled || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin,
        threshold: 0.1
      }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, isLoading, hasMore, enabled, rootMargin]);

  // Alternative scroll-based infinite loading for better compatibility
  useEffect(() => {
    if (!enabled || !hasMore) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - threshold && !isLoading) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoading, hasMore, threshold, enabled]);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    setItems,
    reset
  };
};

export default useInfiniteScroll;