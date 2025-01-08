import { RatingStats, RatingChange } from '../types/rating';

export const calculateNewRating = (
  playerRating: number,
  aiRating: number,
  result: number // 1 for win, 0.5 for draw, 0 for loss
): RatingChange => {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (aiRating - playerRating) / 400));
  const newRating = Math.round(playerRating + K * (result - expectedScore));
  
  return {
    oldRating: playerRating,
    newRating,
    change: newRating - playerRating
  };
};

export const getAiRating = (level: number): number => {
  return 800 + level * 200;
};

export const getRatingTitle = (rating: number): string => {
  if (rating < 1200) return 'Novice';
  if (rating < 1400) return 'Amateur';
  if (rating < 1600) return 'Club Player';
  if (rating < 1800) return 'Expert';
  if (rating < 2000) return 'Master';
  if (rating < 2200) return 'Grandmaster';
  return 'Elite Grandmaster';
};