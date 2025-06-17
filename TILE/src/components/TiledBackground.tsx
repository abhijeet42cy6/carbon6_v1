import React, { useState, useEffect, useRef } from 'react';
import type { ReactNode, JSX } from 'react';
import './TiledBackground.css';

interface TiledBackgroundProps {
  children: ReactNode;
}

const TiledBackground: React.FC<TiledBackgroundProps> = ({ children }) => {
  const [tiles, setTiles] = useState<JSX.Element[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createTiles = () => {
      if (!wrapperRef.current) return;

      const style = getComputedStyle(document.documentElement);
      const tileWidth = parseInt(style.getPropertyValue('--tile-width')) || 100;
      const tileHeight = parseInt(style.getPropertyValue('--tile-height')) || 30;
      
      const { width, height } = wrapperRef.current.getBoundingClientRect();
      
      const cols = Math.ceil(width / tileWidth);
      const rows = Math.ceil(height / tileHeight);
      const numTiles = cols * rows;

      setTiles(
        Array.from({ length: numTiles }).map((_, i) => {
          const r = Math.random();
          let classes = 'tile';
          if (r < 0.08) {
            classes += ' tile--pulsing'; // full glow (bg + border)
          } else if (r < 0.19) {
            classes += ' tile--border-pulse'; // border only glow
          }
          return (
            <div
              key={i}
              className={classes}
              style={{ animationDelay: `${Math.random() * 10}s` }}
            />
          );
        })
      );
    };
    
    createTiles();

    window.addEventListener('resize', createTiles);
    return () => window.removeEventListener('resize', createTiles);
  }, []);

  // const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (wrapperRef.current) {
  //     const rect = wrapperRef.current.getBoundingClientRect();
  //     const x = e.clientX - rect.left;
  //     const y = e.clientY - rect.top;
  //     wrapperRef.current.style.setProperty('--mouse-x', `${x}px`);
  //     wrapperRef.current.style.setProperty('--mouse-y', `${y}px`);
  //   }
  // };

  return (
    <div
      className="tiled-background-wrapper"
      ref={wrapperRef}
      // onMouseMove={handleMouseMove}
    >
      <div className="tiles-container">{tiles}</div>
      {children}
    </div>
  );
};

export default TiledBackground; 