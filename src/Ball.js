// Ball.js
import React from 'react';

function Ball({ position }) {
  return (
    <div className="absolute bg-black w-10 h-10 rounded-full border-2 border-white" style={{ left: position.x, top: position.y }}></div>
  );
}

export default Ball;