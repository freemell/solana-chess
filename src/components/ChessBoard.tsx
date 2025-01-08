import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';

interface ChessBoardProps {
  position: string;
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ position, onPieceDrop }) => {
  return (
    <div className="mt-6 glass-card backdrop-blur-sm border border-[#14F195]/20 p-6 rounded-xl relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
      <div className="matrix-grid absolute inset-0 opacity-10"></div>
      <div className="relative">
        <ReactChessboard 
          position={position}
          onPieceDrop={onPieceDrop}
          customDarkSquareStyle={{ 
            backgroundColor: '#1a2b22',
            background: 'linear-gradient(45deg, #1a2b22 0%, #0a1f1a 100%)'
          }}
          customLightSquareStyle={{ 
            backgroundColor: '#2d4439',
            background: 'linear-gradient(45deg, #2d4439 0%, #1a2b22 100%)'
          }}
          customBoardStyle={{
            borderRadius: '0.75rem',
            boxShadow: '0 0 30px rgba(20, 241, 149, 0.2)',
            border: '2px solid rgba(20, 241, 149, 0.2)',
            transform: 'perspective(1000px) rotateX(2deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};