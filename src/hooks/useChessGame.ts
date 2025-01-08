import { useState, useCallback } from 'react';
import type { Chess } from 'chess.js';
import { calculateNewRating } from '../utils/ratings';
import type { GameState } from '../types/chess';
import { usePersistedState } from './usePersistedState';

const AI_RATING = 1600; // Fixed AI rating

export const useChessGame = (game: Chess) => {
  const [playerRating, setPlayerRating] = usePersistedState('chess-player-rating', 1200);
  const [gameState, setGameState] = useState<GameState>({
    fen: game.fen(),
    lastMove: null,
    gameOver: false,
    playerRating,
    result: null
  });

  const makeAiMove = useCallback(() => {
    const moves = game.moves();
    if (moves.length > 0 && !game.isGameOver()) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      game.move(move);
      
      const gameOver = game.isGameOver();
      if (gameOver) {
        const result = game.isCheckmate() ? 'Checkmate!' : 
                      game.isDraw() ? 'Draw!' : 
                      game.isStalemate() ? 'Stalemate!' : 'Game Over!';
        
        const gameResult = game.isCheckmate() ? 0 : 0.5;
        const newRating = calculateNewRating(playerRating, AI_RATING, gameResult);
        setPlayerRating(newRating);
        
        setGameState(prev => ({
          ...prev,
          fen: game.fen(),
          lastMove: move,
          gameOver: true,
          playerRating: newRating,
          result
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          fen: game.fen(),
          lastMove: move
        }));
      }
    }
  }, [game, playerRating, setPlayerRating]);

  const handleMove = useCallback((sourceSquare: string, targetSquare: string): boolean => {
    if (gameState.gameOver) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move === null) return false;

      const gameOver = game.isGameOver();
      if (gameOver) {
        const result = game.isCheckmate() ? 'Checkmate!' : 
                      game.isDraw() ? 'Draw!' : 
                      game.isStalemate() ? 'Stalemate!' : 'Game Over!';
        
        const gameResult = game.isCheckmate() ? 1 : 0.5;
        const newRating = calculateNewRating(playerRating, AI_RATING, gameResult);
        setPlayerRating(newRating);
        
        setGameState(prev => ({
          ...prev,
          fen: game.fen(),
          lastMove: move.san,
          gameOver: true,
          playerRating: newRating,
          result
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          fen: game.fen(),
          lastMove: move.san
        }));
        
        setTimeout(makeAiMove, 300);
      }

      return true;
    } catch (e) {
      return false;
    }
  }, [game, gameState.gameOver, playerRating, makeAiMove, setPlayerRating]);

  return {
    gameState,
    handleMove
  };
};