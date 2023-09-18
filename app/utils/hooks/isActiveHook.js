import { useState, useEffect } from 'react';

const useIsActive = (timeout) => {
  const [isActive, setIsActive] = useState(true);
  let time;
  const resetTimeout = () => {
    setIsActive(true);
    clearTimeout(time);
    time = setTimeout(() => setIsActive(false), timeout);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    window.addEventListener('scroll', resetTimeout);

    return () => {
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      window.removeEventListener('scroll', resetTimeout);
    };
  }, []);

  return isActive;
};

export default useIsActive;
