// WindowSizeContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WindowSizeContextType {
  size: { width: number; height: number };
  isHorizontal: boolean;
}

const WindowSizeContext = createContext<WindowSizeContextType | undefined>(undefined);

export const WindowSizeProvider = ({ children }: { children: ReactNode }) => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isHorizontal, setIsHorizontal] = useState(window.innerWidth >= 768); // 根据需要调整断点
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setIsHorizontal(window.innerWidth >= 768)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={{size,isHorizontal}}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export const useWindowSize = (): WindowSizeContextType => {
  const context = useContext(WindowSizeContext);
  if (!context) {
    throw new Error('useWindowSize must be used within a WindowSizeProvider');
  }
  return context;
};