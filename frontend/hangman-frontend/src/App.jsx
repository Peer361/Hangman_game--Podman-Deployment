// App.jsx
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
      }, 1000); // Increased to 1000ms to give users time to read the message
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
    <div className="app-container">
      <div className="game-box">
        <div className="text-center">
          <h1 className="game-title">
            <GameController className="icon" />
            Hangman
          </h1>
          
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