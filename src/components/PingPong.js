import React, { useState, useEffect } from 'react';

function PingPong() {

  // Ball position and velocity
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 300 });
  const [ballVelocity, setBallVelocity] = useState({ vx: 5, vy: 5 });

  /* GET SCREEN DIMENSIONS, FIX DIMENSIONS FOR MOBILE USE */
  let SCREEN_HEIGHT = 0;
  if (window.innerHeight<= 900) SCREEN_HEIGHT = window.innerHeight
  else SCREEN_HEIGHT = 900
  let SCREEN_WIDTH = 0;
  if (window.innerWidth<= 500) SCREEN_WIDTH = window.innerWidth
  else SCREEN_WIDTH = 500

  /* SCORE */
  const [score, setScore] = useState(0);
  const [aiScore, setAIScore] = useState(0);


  // Paddle positions
  const [paddlePosition, setPaddlePosition] = useState(50);
  const [aiPaddlePosition, setAIPaddlePosition] = useState(50);

  // Dynamic paddle color
  const [paddleColor, setPaddleColor] = useState('black');
  const [aiPaddleColor, setAIPaddleColor] = useState('black');

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
        if(ballPosition.y < 350){
          if (ballVelocity.vx > 0) {
            newPosition = Math.min(prevPosition + 1, 75);
          } else if (ballVelocity.vx < 0) {
            newPosition = Math.max(prevPosition - 1, 0);
          }
        }
        return newPosition;
      });

      /**********  MAIN COLLISION LOGIC **********/

      // USER PADDLE
      if (
        ballPosition.y >= SCREEN_HEIGHT - 100 && ballPosition.y <= SCREEN_HEIGHT - 80 &&
        ballPosition.x >= (SCREEN_WIDTH * paddlePosition) / 100 &&
        ballPosition.x <= (SCREEN_WIDTH * paddlePosition) / 100 + 118 &&
        ballVelocity.vy === 5
      ) {
        setBallVelocity(prev => ({ ...prev, vy: -5 }));
        setPaddleColor('lime');
        setScore(prevScore => prevScore + 1);
        setTimeout(() => {
          setPaddleColor('black');
        }, 125)
      }

      // AI PADDLE
      if (
        ballPosition.y <= 50 && ballPosition.y >= 30 &&
        ballPosition.x >= (SCREEN_WIDTH * aiPaddlePosition) / 100 &&
        ballPosition.x <= (SCREEN_WIDTH * aiPaddlePosition) / 100 + 118 &&
        ballVelocity.vy === -5
      ) {
        setBallVelocity(prev => ({ ...prev, vy: 5 }));
        setAIPaddleColor('red');
        setAIScore(prevScore => prevScore + 1);
        setTimeout(() => {
          setAIPaddleColor('black');
        }, 125)
      }

      /******************************** */

      /* WALL COLLISION LOGIC */

      // Ball hits bottom
      if (ballPosition.y >= SCREEN_HEIGHT - 50) {
        setBallVelocity(prev => ({ vy: -5, vx: prev.vx }));
        setScore(0);
      }
      // Ball hits top
      if (ballPosition.y <= 10) {
        setBallVelocity(prev => ({ vy: 5, vx: prev.vx }));
        setAIScore(0)
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

  /* END USE EFFECT */

  // CONTROLS

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
        style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute bg-slate-600" style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
          <div className="absolute border-2 border-white w-32 h-10 rounded-2xl" style={{ left: `${paddlePosition}%`, top: '90%', backgroundColor: paddleColor}}></div>
          <div className="absolute border-2 border-white w-32 h-10 rounded-2xl" style={{ left: `${aiPaddlePosition}%`, top: '5%', backgroundColor: aiPaddleColor}}></div>
          <div className="absolute bg-black w-10 h-10 rounded-full border-2 border-white" style={{ left: ballPosition.x, top: ballPosition.y }}></div>
          <h1 className='absolute text-6xl pl-1'>{aiScore}</h1>
          <h1 className='absolute text-6xl pl-1' style={{ bottom: '1%'}}>{score}</h1>
        </div>
      </div>
    </div>
  );
}

export default PingPong;
