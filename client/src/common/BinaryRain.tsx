import React, { useEffect, useRef } from 'react';

const BinaryRain = () => {
  const binaryRainRef = useRef(null);
  const chars = "01";
  const columns = 50;

  useEffect(() => {
    const binaryRain = binaryRainRef.current;
    
    // Clear any existing columns (useful if component re-renders)
    binaryRain.innerHTML = '';

    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div');
      column.className = 'binary-column';
      column.style.left = `${Math.random() * 100}%`;
      
      // Set random animation duration (8-18 seconds)
      const duration = 8 + Math.random() * 10;
      column.style.animationDuration = `${duration}s`;
      
      // Set random delay (0-5 seconds)
      column.style.animationDelay = `${Math.random() * 5}s`;
      
      let binaryText = "";
      const lines = 20;
      for (let j = 0; j < lines; j++) {
        binaryText += chars[Math.floor(Math.random() * chars.length)] + "<br>";
      }
      
      column.innerHTML = binaryText;
      binaryRain.appendChild(column);
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div 
      ref={binaryRainRef} 
      id="binaryRain"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

export default BinaryRain;