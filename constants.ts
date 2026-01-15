
import { Difficulty } from './types';

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: { max: 50, label: 'Fácil (1-50)', color: 'text-green-400' },
  [Difficulty.MEDIUM]: { max: 100, label: 'Medio (1-100)', color: 'text-yellow-400' },
  [Difficulty.HARD]: { max: 500, label: 'Difícil (1-500)', color: 'text-red-400' },
};

export const INITIAL_AI_MESSAGE = "Soy tu anfitrión IA. He pensado en un número... ¿te atreves a intentar adivinarlo o me harás perder el tiempo?";
