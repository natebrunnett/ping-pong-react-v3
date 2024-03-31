import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PingPongGame from './PingPongGame';

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log("root render")

root.render(
    <PingPongGame />
);
