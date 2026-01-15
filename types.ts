
export enum GameStatus {
  STARTING = 'STARTING',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface GuessRecord {
  value: number;
  timestamp: number;
  direction: 'higher' | 'lower' | 'correct';
}

export interface AICommentary {
  message: string;
  mood: 'happy' | 'sarcastic' | 'helpful' | 'neutral';
}
