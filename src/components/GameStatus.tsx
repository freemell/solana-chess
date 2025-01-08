import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { RatingBadge } from './RatingBadge';
import type { RatingStats } from '../types/rating';

interface GameStatusProps {
  stats: RatingStats;
  result: string | null;
  gameInProgress: boolean;
}

export const GameStatus: React.FC<GameStatusProps> = ({ 
  stats, 
  result,
  gameInProgress
}) => {
  return (
    <div className="glass-card rounded-xl relative overflow-hidden transition-all duration-500 hover:border-[#14F195]/40 max-w-2xl mx-auto w-full">
      <div className="matrix-grid absolute inset-0 opacity-20"></div>
      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4">
          <RatingBadge stats={stats} />
          
          <div className="flex flex-wrap items-center justify-center gap-4 w-full">
            <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-lg transform hover:scale-105 transition-all">
              <Zap className="w-5 h-5 text-[#9945FF]" />
              <span className="text-sm font-medium text-[#9945FF]">Neural Network Active</span>
            </div>
            {gameInProgress && (
              <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-lg transform hover:scale-105 transition-all">
                <Cpu className="w-5 h-5 text-[#14F195] animate-pulse" />
                <span className="text-sm font-medium text-[#14F195]">Processing</span>
              </div>
            )}
          </div>
          
          {result && (
            <div className="text-center font-bold text-2xl text-[#14F195] animate-pulse p-2">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};