import React from 'react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { getRatingTitle } from '../utils/ratings';
import type { RatingStats } from '../types/rating';

interface RatingBadgeProps {
  stats: RatingStats;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ stats }) => {
  const title = getRatingTitle(stats.rating);
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="glass-card p-4 rounded-xl space-y-3 transform hover:scale-105 transition-all duration-300 w-full max-w-md">
      <div className="flex items-center justify-center gap-4">
        <Trophy className="w-8 h-8 text-[#14F195]" />
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.rating}</div>
          <div className="text-sm font-medium text-[#14F195]/80">{title}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-[#14F195]/60">Games</div>
          <div className="font-medium">{stats.gamesPlayed}</div>
        </div>
        <div className="text-center">
          <div className="text-[#14F195]/60">Win Rate</div>
          <div className="font-medium">{winRate}%</div>
        </div>
        <div className="text-center">
          <div className="text-[#14F195]/60">Win Streak</div>
          <div className="font-medium">{stats.winStreak}</div>
        </div>
        <div className="text-center">
          <div className="text-[#14F195]/60">Peak Rating</div>
          <div className="font-medium">{stats.highestRating}</div>
        </div>
      </div>

      {stats.lastGameResult && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="text-[#14F195]/60">Last Game:</div>
          {stats.lastGameResult === 'win' && (
            <div className="flex items-center gap-1 text-green-400">
              <TrendingUp className="w-4 h-4" />
              Win
            </div>
          )}
          {stats.lastGameResult === 'loss' && (
            <div className="flex items-center gap-1 text-red-400">
              <TrendingDown className="w-4 h-4" />
              Loss
            </div>
          )}
          {stats.lastGameResult === 'draw' && (
            <div className="text-yellow-400">Draw</div>
          )}
        </div>
      )}
    </div>
  );
};