import React,  { useState, useEffect } from 'react'

function KeyboardConfig({arrowKeyPressed, setArrowKeyPressed}) {
  
  

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          setArrowKeyPressed(event.key);
          break;
        default:
          break;
      }
    };
  
    const handleKeyUp = () => {
      setArrowKeyPressed(null);
    };
  
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);
  
    return (
        <>
        
        </>
    );
  };


export default KeyboardConfig