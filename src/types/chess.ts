export interface GameState {
  fen: string;
  lastMove: string | null;
  gameOver: boolean;
  playerRating: number;
  result: string | null;
}