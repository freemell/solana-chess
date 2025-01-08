export interface RatingStats {
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  highestRating: number;
  lastGameResult?: 'win' | 'loss' | 'draw';
}

export interface RatingChange {
  oldRating: number;
  newRating: number;
  change: number;
}