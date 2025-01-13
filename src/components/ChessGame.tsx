import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { GameStatus } from './GameStatus';
import { ChessBoard } from './ChessBoard';
import { useChessGame } from '../hooks/useChessGame';
import { useRatingStats } from '../hooks/useRatingStats';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const DIFFICULTY_MULTIPLIERS = {
  Easy: 1.5,
  Medium: 2,
  Hard: 3,
};

export const ChessGame: React.FC = () => {
  const [game] = useState(new Chess());
  const { stats } = useRatingStats(); // Removed unused `updateStats`
  const { gameState, handleMove } = useChessGame(game);
  const { publicKey, connected } = useWallet(); // Use `useWallet` directly

  const [amount, setAmount] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY_MULTIPLIERS>('Easy');
  const [message, setMessage] = useState<string | null>(null);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Wallet Connected:', connected);
    console.log('Public Key:', publicKey?.toBase58());
  }, [connected, publicKey]);

  const handlePlaceBet = async () => {
    if (!connected) {
      setMessage('Wallet not connected. Please connect your wallet to place a bet.');
      return;
    }
  
    if (!publicKey) {
      setMessage('Public key not found. Please reconnect your wallet.');
      return;
    }
  
    if (amount <= 0) {
      setMessage('Please enter a valid amount to bet.');
      return;
    }
  
    try {
      const multiplier = DIFFICULTY_MULTIPLIERS[difficulty];
      const calculatedStake = amount * multiplier;
  
      setLoading(true);
  
      // Send the bet details to the backend
      const response = await axios.post(`${BACKEND_URL}/bet`, {
        publicKey: publicKey.toBase58(),
        amount,
        difficulty,
        stake: calculatedStake,
      });
  
      setMessage(`Bet placed successfully! Stake: ${calculatedStake} SOL.`);
      console.log('Bet Response:', response.data);
    } catch (error) {
      console.error('Error placing bet:', error);
      setMessage('Failed to place the bet. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleGameEnd = async () => {
    if (!game.isGameOver()) return;

    const result = gameState.result === '1-0' ? 'win' : 'loss';

    if (!connected || !publicKey) {
      setGameOverMessage('Please connect your wallet to receive payout.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${BACKEND_URL}/payout`, {
        publicKey: publicKey.toBase58(),
        result,
      });

      const { message: payoutMessage } = response.data;
      setGameOverMessage(payoutMessage);
      console.log('Payout Response:', response.data);
    } catch (error) {
      console.error('Error processing payout:', error);
      setGameOverMessage('Failed to process payout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGameEnd();
  }, [game.isGameOver(), gameState.result]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Game Status */}
      <GameStatus
        stats={stats}
        result={gameState.result}
        gameInProgress={!game.isGameOver() && game.moveNumber() > 0}
      />

      {/* Chess Board */}
      <div className="chess-board-container glow-effect">
        <ChessBoard position={gameState.fen} onPieceDrop={handleMove} />
      </div>

      {/* Bet Controls */}
      <div className="bet-controls p-4 bg-black/40 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl text-[#14F195] font-bold mb-4">Place Your Bet</h2>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm text-[#14F195]/80 mb-2">
            Bet Amount (SOL):
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 rounded bg-[#1a2b22] border border-[#14F195]/40 text-[#14F195]"
            placeholder="Enter amount in SOL"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="difficulty" className="block text-sm text-[#14F195]/80 mb-2">
            Difficulty:
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as keyof typeof DIFFICULTY_MULTIPLIERS)}
            className="w-full p-2 rounded bg-[#1a2b22] border border-[#14F195]/40 text-[#14F195]"
          >
            {Object.keys(DIFFICULTY_MULTIPLIERS).map((level) => (
              <option key={level} value={level}>
                {level} (x{DIFFICULTY_MULTIPLIERS[level as keyof typeof DIFFICULTY_MULTIPLIERS]} Multiplier)
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePlaceBet}
          disabled={loading}
          className="w-full p-2 rounded bg-[#14F195] hover:bg-[#0ff1b5] transition text-black font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Placing Bet...' : 'Place Bet'}
        </button>

        {message && <p className="text-sm text-[#FFD700] mt-4">{message}</p>}
      </div>

      {/* Game Over Message */}
      {gameOverMessage && (
        <div className="p-4 bg-black/40 rounded-lg shadow-md max-w-md w-full text-center">
          <p className="text-[#FFD700] text-lg font-bold">{gameOverMessage}</p>
        </div>
      )}
    </div>
  );
};
