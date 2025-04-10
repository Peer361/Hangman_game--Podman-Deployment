import React, { useState, useEffect } from 'react';
import { TowerControl as GameController, Skull } from 'lucide-react';
import axios from 'axios';
import './index.css';

function App() {
  const [display, setDisplay] = useState("");
  const [attempts, setAttempts] = useState(6);
  const [letter, setLetter] = useState("");
  const [guessed, setGuessed] = useState([]);
  const [shake, setShake] = useState(false);
  const [lastGuessCorrect, setLastGuessCorrect] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [repeatLetter, setRepeatLetter] = useState(false);

  const startGame = async () => {
    try {
      const res = await axios.get('http://localhost:8000/start/');
      setDisplay(res.data.display);
      setAttempts(res.data.attempts);
      setGuessed([]);
      setLastGuessCorrect(null);
      setGameWon(false);
      setGameLost(false);
      setRepeatLetter(false);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const guessLetter = async () => {
    if (!letter || guessed.includes(letter.toLowerCase())) {
      setShake(true);
      setRepeatLetter(true);
      setLetter('');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/guess/${letter}/`);
      const previousDisplay = display;
      setDisplay(res.data.display);
      setAttempts(res.data.attempts);
      setGuessed(res.data.guessed_letters);
      setLetter('');
      setRepeatLetter(false);
      
      const wasCorrect = res.data.display !== previousDisplay;
      setLastGuessCorrect(wasCorrect);
      
      if (!wasCorrect) {
        setShake(true);
      }
      
      if (res.data.display.indexOf('_') === -1) {
        setGameWon(true);
      }
      if (res.data.attempts === 0) {
        setGameLost(true);
      }
    } catch (error) {
      console.error('Error guessing letter:', error);
    }
  };

  useEffect(() => {
    if (shake || repeatLetter) {
      const timer = setTimeout(() => {
        setShake(false);
        setRepeatLetter(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shake, repeatLetter]);

  const renderWord = () => {
    return display.split('').map((char, index) => (
      <span 
        key={index} 
        className={`letter-space ${lastGuessCorrect && char !== '_' ? 'letter-reveal' : ''} ${gameWon ? 'word-success' : ''}`}
      >
        {char === '_' ? '' : char}
      </span>
    ));
  };

  return (
    <div className={`app-container ${gameLost ? 'game-lost' : ''} ${gameWon ? 'game-won' : ''}`}>
      <div className="game-box">
        <div className="text-center">
          <h1 className="game-title">
            <GameController className="icon" />
            Hangman Game
          </h1>
          
          <div className="hangman-container">
            <svg className="hangman-svg" viewBox="0 0 200 200">
              {/* Gallows */}
              <line className="gallows" x1="20" y1="180" x2="100" y2="180" />
              <line className="gallows" x1="60" y1="180" x2="60" y2="20" />
              <line className="gallows" x1="60" y1="20" x2="140" y2="20" />
              <line className="gallows" x1="140" y1="20" x2="140" y2="40" />
              
              {/* Rope */}
              <line 
                className={`rope ${attempts === 0 ? 'snap' : ''}`} 
                x1="140" 
                y1="40" 
                x2="140" 
                y2="55" 
              />
              
              {/* Hangman parts */}
              <circle className={`hangman-part ${attempts < 6 ? 'visible' : ''}`} cx="140" cy="55" r="15" />
              <line className={`hangman-part ${attempts < 5 ? 'visible' : ''}`} x1="140" y1="70" x2="140" y2="110" />
              <line className={`hangman-part ${attempts < 4 ? 'visible' : ''}`} x1="140" y1="80" x2="120" y2="70" />
              <line className={`hangman-part ${attempts < 3 ? 'visible' : ''}`} x1="140" y1="80" x2="160" y2="70" />
              <line className={`hangman-part ${attempts < 2 ? 'visible' : ''}`} x1="140" y1="110" x2="120" y2="130" />
              <line className={`hangman-part ${attempts < 1 ? 'visible' : ''}`} x1="140" y1="110" x2="160" y2="130" />
              
              {/* Face */}
              <g className={`hangman-face ${gameLost ? 'visible' : ''}`}>
                <line x1="135" y1="50" x2="145" y2="60" />
                <line x1="145" y1="50" x2="135" y2="60" />
                <path d="M130,65 Q140,75 150,65" />
              </g>
            </svg>
          </div>

          <button onClick={startGame} className="btn-start">
            New Game
          </button>

          <div className="word-box">
            <div className="letters">{renderWord()}</div>
            
            <div className="input-group">
              <input
                type="text"
                value={letter}
                onChange={(e) => setLetter(e.target.value.toLowerCase())}
                maxLength={1}
                className={`guess-input ${shake ? 'shake' : ''}`}
                onKeyPress={(e) => e.key === 'Enter' && guessLetter()}
                disabled={gameWon || gameLost}
              />
              <button 
                onClick={guessLetter} 
                className="btn-guess"
                disabled={gameWon || gameLost}
              >
                Guess
              </button>
            </div>

            <div className="attempts">
              <Skull className={`icon skull ${attempts < 6 ? 'red' : ''}`} />
              <span className="attempt-count">
                Attempts: <span className="highlight">{attempts}</span>
              </span>
            </div>

            {gameWon && (
              <div className="game-message success-message">
                Success!
              </div>
            )}
            {gameLost && (
              <div className="game-message oops-message">
                Oops! Game Over
              </div>
            )}
            {repeatLetter && (
              <div className="game-message repeat-message">
                Letter already used!
              </div>
            )}
          </div>

          <div className="guessed-section">
            <h3 className="guessed-title">Guessed:</h3>
            <div className="guessed-letters">
              {guessed.map((g, index) => (
                <span key={index} className="guessed-letter">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;