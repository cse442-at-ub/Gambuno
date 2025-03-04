// src/hooks/useDeviceDetect.js
import { useMediaQuery } from 'react-responsive';

export const useDeviceDetect = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Standard mobile breakpoint
  return { isMobile };
};
