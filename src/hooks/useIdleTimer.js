import { useEffect, useRef } from 'react';

const useIdleTimer = (timeout = 300000, onIdle) => {
  const idleTimerRef = useRef(null);

  const resetTimers = () => {
    // Clear existing timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    // Set new logout timer (5 minutes)
    idleTimerRef.current = setTimeout(() => {
      console.log('Auto logout due to inactivity');
      if (onIdle) onIdle();
    }, timeout);
  };

  const handleEvent = () => {
    resetTimers();
  };

  useEffect(() => {
    // Events to track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown'];
    
    events.forEach(event => {
      document.addEventListener(event, handleEvent, { passive: true });
    });

    // Start timer initially
    resetTimers();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleEvent);
      });
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [timeout, onIdle]);

  // No need to return anything
};

export default useIdleTimer;