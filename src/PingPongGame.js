// PingPongGame.js
import React, { useState, useEffect } from 'react';
import OpponentPaddle from './OpponentPaddle';
import Ball from './Ball';
import KeyboardConfig from './KeyboardConfig';

function PingPongGame() {
  // State for ball position and velocity
  const SCREEN_HEIGHT = 900;
  const SCREEN_WIDTH = 900;
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 300 });
  const [ballVelocity, setBallVelocity] = useState({ vx: 5, vy: 5 });
  const [paddlePosition, setPaddlePosition] = useState(50);
  const [arrowKeyPressed, setArrowKeyPressed] = useState(null);
  const BALL_RADIUS = 10;
  // ai opponent
  const [opponentPaddlePosition, setOpponentPaddlePosition] = useState(50);
  const [ballDirection, setBallDirection] = useState('right');

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBallPosition((prevPosition) => ({
        x: prevPosition.x + ballVelocity.vx,
        y: prevPosition.y + ballVelocity.vy,
      }));

      let newX = ballPosition.x;
      let newY = ballPosition.y;
      console.log(newX)

      //ai
       if (ballDirection === 'right') {
        newX += 5;
        if (newX <= SCREEN_WIDTH / 2) {
          setBallDirection('left');
        }
      } else {
        newX -= 5;
        if (newX >= SCREEN_WIDTH / 2) {
          setBallDirection('right');
        }
      }

      // AI opponent follows the ball
      if (newY >= 10) {
        const distance = Math.abs(newX - opponentPaddlePosition);
        if (distance < 2) {
          // Do nothing if ball is too close
        } else if (newX > opponentPaddlePosition) {
          if (opponentPaddlePosition < 60) {setOpponentPaddlePosition(opponentPaddlePosition + 2);}
        } else {
          if (opponentPaddlePosition > 0) {setOpponentPaddlePosition(opponentPaddlePosition - 2);}
        }
      }

      // Add collision detection logic here

      // Ball hits paddle
      if (
      ballPosition.y >= SCREEN_HEIGHT - 100 && // ball may collide with paddle at 90% from the top of screenHeight
      ballPosition.x >= parseFloat(SCREEN_WIDTH) * parseFloat(paddlePosition) /100 &&
      ballPosition.x <= parseFloat(SCREEN_WIDTH) * parseFloat(paddlePosition) /100 + 320
      && ballVelocity.vy === 5
      ) {
        setBallVelocity((prev) => ({ ...prev, vy: -5 }));
        //setScore(score + 1);
      }

      //if ball hits top
      if(ballPosition.y >= SCREEN_HEIGHT - 40)
      {
        setBallVelocity((e) => ({
            vy: -5, vx: e.vx
        }))
      }
      //if ball hits bottom 
      if (ballPosition.y <= 0){
        setBallVelocity((e) => ({
            vy: 5, vx: e.vx
        }))
      }
      //if ball hits right wall
      if(ballPosition.x >= SCREEN_WIDTH - 40) {
        setBallVelocity((e) => ({
            vy: e.vy, vx: -5
        }))
      } 
      //if ball hits left wall
      if (ballPosition.x <= 0){
        setBallVelocity((e) => ({
            vy: e.vy, vx: 5
        }))
      }

      const handleKeyPress = (e) => {
        if (e === 'ArrowLeft' && paddlePosition > 0) {
          setPaddlePosition(paddlePosition - 2);
          console.log(parseFloat(SCREEN_WIDTH) * parseFloat(paddlePosition) /100)
          console.log(paddlePosition)
        } else if (e === 'ArrowRight' && paddlePosition < 63) {
          setPaddlePosition(paddlePosition + 2);
          console.log(parseFloat(SCREEN_WIDTH) * parseFloat(paddlePosition) /100)
          console.log(paddlePosition)
        }
      }

      handleKeyPress(arrowKeyPressed)

    }, 5);

    return () => clearInterval(interval);
  }, [ballPosition, ballVelocity]);

  return (
    <>
    <KeyboardConfig arrowKeyPressed={arrowKeyPressed} setArrowKeyPressed={setArrowKeyPressed}/>
    <div className="relative bg-slate-600" style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>
      <div className="absolute bg-black border-2 border-white w-80 h-10" style={{ left: `${opponentPaddlePosition}%`, top: '10%' }}></div>
      <div className="absolute bg-black border-2 border-white w-80 h-10" style={{ left: `${paddlePosition}%`, top: '90%' }}></div>
      <Ball position={ballPosition} />
    </div>
    </>
  );
}

export default PingPongGame;