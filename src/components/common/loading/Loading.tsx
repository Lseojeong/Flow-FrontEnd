import React from 'react';
import { Props } from './Loading.types';

export const Loading: React.FC<Props> = ({ size = 16, color = 'white' }) => {
  const dotSize = size * 0.25;
  const gap = size * 0.15;

  return (
    <>
      <style>{`
        @keyframes dotBounce {
          0%, 20% { 
            transform: scale(1) translateY(0); 
            opacity: 0.4; 
          }
          50% { 
            transform: scale(1.2) translateY(-${size * 0.25}px); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1) translateY(0); 
            opacity: 0.4; 
          }
        }

        .loading-dot {
          animation: dotBounce 1.4s ease-in-out infinite;
        }

        .loading-dot:nth-child(1) { animation-delay: 0s; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${gap}px`,
          height: `${size}px`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="loading-dot"
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              backgroundColor: color,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
    </>
  );
};
