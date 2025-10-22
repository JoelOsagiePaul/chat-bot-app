import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * FAB positioning constants
 */
export const FAB_CONFIG = {
  size: 56, // Default FAB size
  smallSize: 40, // Small FAB size
  spacing: 20, // Distance from edges
  chatWindowOffset: 16, // Spacing between FAB and chat window
} as const;

export interface FabPosition {
  bottom: number;
  right: number;
}

export interface ChatWindowPosition {
  bottom: number;
  right: number;
}

/**
 * Custom hook for managing FAB positioning and chat window placement
 */
export const useFabPosition = () => {
  const [fabPosition, setFabPosition] = useState<FabPosition>({
    bottom: FAB_CONFIG.spacing,
    right: FAB_CONFIG.spacing,
  });

  const fabRef = useRef<HTMLButtonElement>(null);

  /**
   * Calculate chat window position based on FAB position
   */
  const chatWindowPosition = useMemo((): ChatWindowPosition => {
    return {
      bottom: fabPosition.bottom + FAB_CONFIG.size + FAB_CONFIG.chatWindowOffset,
      right: fabPosition.right,
    };
  }, [fabPosition]);

  /**
   * Update FAB position from DOM element
   */
  const updateFabPosition = useCallback(() => {
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect();
      const bottom = window.innerHeight - rect.bottom;
      const right = window.innerWidth - rect.right;
      
      setFabPosition({ bottom, right });
    }
  }, []);

  /**
   * Handle window resize
   */
  useEffect(() => {
    updateFabPosition();
    
    const handleResize = () => {
      updateFabPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateFabPosition]);

  return {
    fabRef,
    fabPosition,
    chatWindowPosition,
    updateFabPosition,
    FAB_SIZE: FAB_CONFIG.size,
    FAB_SPACING: FAB_CONFIG.spacing,
  };
};

/**
 * Hook for calculating responsive chat window dimensions
 */
export const useChatWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: 400,
    height: 600,
    isMobile: false,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 600;
      
      setDimensions({
        width: isMobile ? window.innerWidth - 32 : 400,
        height: isMobile ? window.innerHeight - 100 : 600,
        isMobile,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};
