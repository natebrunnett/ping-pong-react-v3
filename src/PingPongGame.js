import React, { useState, useEffect } from 'react';
import Ball from './Ball';

function PingPongGame() {

  // Ball position and velocity
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 300 });
  const [ballVelocity, setBallVelocity] = useState({ vx: 5, vy: 5 });
  let SCREEN_HEIGHT = 0;
  if (window.innerHeight<= 900) SCREEN_HEIGHT = window.innerHeight
  else SCREEN_HEIGHT = 900
  let SCREEN_WIDTH = 0;
  if (window.innerWidth<= 900) SCREEN_WIDTH = window.innerWidth
  else SCREEN_HEIGHT = 900

  // Paddle positions
  const [paddlePosition, setPaddlePosition] = useState(50);
  const [aiPaddlePosition, setAIPaddlePosition] = useState(50);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Update ball position
      setBallPosition(prevPosition => ({
        x: prevPosition.x + ballVelocity.vx,
        y: prevPosition.y + ballVelocity.vy,
      }));

      // Update AI paddle position based on ball velocity
      setAIPaddlePosition(prevPosition => {
        let newPosition = prevPosition;
        if (ballVelocity.vx > 0) {
          newPosition = Math.min(prevPosition + 1, 75);
        } else if (ballVelocity.vx < 0) {
          newPosition = Math.max(prevPosition - 1, 0);
        }
        return newPosition;
      });

      // Collision detection logic
      // Ball hits paddle
      if (
        ballPosition.y >= SCREEN_HEIGHT - 100 && // ball may collide with paddle at 90% from the top of screenHeight
        ballPosition.x >= (SCREEN_WIDTH * paddlePosition) / 100 &&
        ballPosition.x <= (SCREEN_WIDTH * paddlePosition) / 100 + 128 &&
        ballVelocity.vy === 5
      ) {
        setBallVelocity(prev => ({ ...prev, vy: -5 }));
      }

      // Ball hits AI paddle
      if (
        ballPosition.y <= 100 && // Ball may collide with AI paddle at 10% from the top of the screen
        ballPosition.x >= (SCREEN_WIDTH * aiPaddlePosition) / 100 &&
        ballPosition.x <= (SCREEN_WIDTH * aiPaddlePosition) / 100 + 128 &&
        ballVelocity.vy === -5
      ) {
        setBallVelocity(prev => ({ ...prev, vy: 5 }));
      }

      // Ball hits bottom
      if (ballPosition.y >= SCREEN_HEIGHT - 50) {
        setBallVelocity(prev => ({ vy: -5, vx: prev.vx }));
      }
      // Ball hits top
      if (ballPosition.y <= 10) {
        setBallVelocity(prev => ({ vy: 5, vx: prev.vx }));
      }
      // Ball hits right wall
      if (ballPosition.x >= SCREEN_WIDTH - 50) {
        setBallVelocity(prev => ({ vy: prev.vy, vx: -5 }));
      }
      // Ball hits left wall
      if (ballPosition.x <= 5) {
        setBallVelocity(prev => ({ vy: prev.vy, vx: 5 }));
      }
      
    }, 5);

    window.addEventListener('keydown', handleKeyDown);

    return () => {clearInterval(interval); window.removeEventListener('keydown', handleKeyDown);}
  }, [ballPosition, ballVelocity, paddlePosition, aiPaddlePosition]);

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    if (touch.clientX < window.innerWidth / 2) {
      // Touch is on the left side of the screen
      setPaddlePosition(prev => Math.max(prev - 2, 0));
    } else {
      // Touch is on the right side of the screen
      setPaddlePosition(prev => Math.min(prev + 2, 100));
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        if(paddlePosition >=8 ) setPaddlePosition(prev => Math.max(prev - 8, 0));
        break;
      case 'ArrowRight':
        if(paddlePosition <= 68) setPaddlePosition(prev => Math.min(prev + 8, 100));
        break;
      default:
        break;
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-black'>
      <div
        style={{ height: window.innerHeight, width: window.innerWidth }}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute bg-slate-600" style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
          <div className="absolute bg-black border-2 border-white w-32 h-10" style={{ left: `${paddlePosition}%`, top: '90%' }}></div>
          <div className="absolute bg-black border-2 border-white w-32 h-10" style={{ left: `${aiPaddlePosition}%`, top: '10%' }}></div>
          <Ball position={ballPosition} />
        </div>
      </div>
    </div>
  );
}

export default PingPongGame;
