// HangmanFigure.jsx
import React from 'react';
import './index.css';

export default function HangmanFigure({ attempts }) {
  const visibleParts = 6 - attempts;

  return (
    <div className="hangman-figure">
      {/* Gallows */}
      <div className="pole base" />
      <div className="pole vertical" />
      <div className="pole top" />
      <div className="pole rope" />

      {/* Body Parts */}
      <div className={`body-part head ${visibleParts > 0 ? 'visible' : ''}`} />
      <div className={`body-part body ${visibleParts > 1 ? 'visible' : ''}`} />
      <div className={`body-part left-arm ${visibleParts > 2 ? 'visible' : ''}`} />
      <div className={`body-part right-arm ${visibleParts > 3 ? 'visible' : ''}`} />
      <div className={`body-part left-leg ${visibleParts > 4 ? 'visible' : ''}`} />
      <div className={`body-part right-leg ${visibleParts > 5 ? 'visible' : ''}`} />
    </div>
  );
}
