import { useState, useEffect } from 'react';
import type { RatingStats } from '../types/rating';

const INITIAL_STATS: RatingStats = {
  rating: 1200,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winStreak: 0,
  highestRating: 1200
};

export const useRatingStats = () => {
  const [stats, setStats] = useState<RatingStats>(() => {
    const saved = localStorage.getItem('chess-stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem('chess-stats', JSON.stringify(stats));
  }, [stats]);

  const updateStats = (newRating: number, result: 'win' | 'loss' | 'draw') => {
    setStats(prev => {
      const newStats = {
        ...prev,
        rating: newRating,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (result === 'win' ? 1 : 0),
        losses: prev.losses + (result === 'loss' ? 1 : 0),
        draws: prev.draws + (result === 'draw' ? 1 : 0),
        winStreak: result === 'win' ? prev.winStreak + 1 : 0,
        highestRating: Math.max(prev.highestRating, newRating),
        lastGameResult: result
      };
      return newStats;
    });
  };

  return { stats, updateStats };
};