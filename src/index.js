import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PingPong from './components/PingPong';

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log("root render")

root.render(
    <PingPong />
);
