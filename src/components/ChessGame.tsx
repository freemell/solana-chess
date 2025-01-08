import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { GameStatus } from './GameStatus';
import { ChessBoard } from './ChessBoard';
import { useChessGame } from '../hooks/useChessGame';
import { useRatingStats } from '../hooks/useRatingStats';

export const ChessGame: React.FC = () => {
  const [game] = useState(new Chess());
  const { stats, updateStats } = useRatingStats();
  const { gameState, handleMove } = useChessGame(game);

  return (
    <div className="flex flex-col items-center gap-8">
      <GameStatus 
        stats={stats}
        result={gameState.result}
        gameInProgress={!game.isGameOver() && game.moveNumber() > 0}
      />
      <div className="chess-board-container glow-effect">
        <ChessBoard 
          position={gameState.fen}
          onPieceDrop={handleMove}
        />
      </div>
    </div>
  );
};