
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Difficulty, GuessRecord, AICommentary } from './types';
import { DIFFICULTY_CONFIG, INITIAL_AI_MESSAGE } from './constants';
import { getAIFeedback } from './services/geminiService';
import GuessHistory from './components/GuessHistory';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [status, setStatus] = useState<GameStatus>(GameStatus.STARTING);
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [aiMessage, setAiMessage] = useState<AICommentary>({ 
    message: INITIAL_AI_MESSAGE, 
    mood: 'neutral' 
  });
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    const config = DIFFICULTY_CONFIG[diff];
    const newTarget = Math.floor(Math.random() * config.max) + 1;
    setTargetNumber(newTarget);
    setDifficulty(diff);
    setStatus(GameStatus.PLAYING);
    setHistory([]);
    setCurrentGuess('');
    setAiMessage({ message: INITIAL_AI_MESSAGE, mood: 'neutral' });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [difficulty]);

  useEffect(() => {
    startNewGame(Difficulty.MEDIUM);
  }, []);

  const handleGuess = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const val = parseInt(currentGuess);
    if (isNaN(val) || status !== GameStatus.PLAYING) return;

    const config = DIFFICULTY_CONFIG[difficulty];
    if (val < 1 || val > config.max) {
      setAiMessage({ message: `¡Oye! El número está entre 1 y ${config.max}. Concéntrate.`, mood: 'sarcastic' });
      return;
    }

    const direction = val === targetNumber ? 'correct' : val < targetNumber ? 'higher' : 'lower';
    const newRecord: GuessRecord = {
      value: val,
      timestamp: Date.now(),
      direction
    };

    const newHistory = [...history, newRecord];
    setHistory(newHistory);
    setCurrentGuess('');

    if (val === targetNumber) {
      setStatus(GameStatus.WON);
    }

    setIsLoadingAI(true);
    const feedback = await getAIFeedback(val, targetNumber, newHistory.length, difficulty);
    setAiMessage(feedback);
    setIsLoadingAI(false);
    
    inputRef.current?.focus();
  };

  const getMoodColor = (mood: AICommentary['mood']) => {
    switch (mood) {
      case 'happy': return 'text-green-400';
      case 'sarcastic': return 'text-purple-400';
      case 'helpful': return 'text-blue-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#0f172a]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>
      
      <header className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter gradient-text mb-2">
          HyperGuess <span className="text-white">AI</span>
        </h1>
        <p className="text-slate-400 font-medium">El juego de adivinanzas definitivo impulsado por Gemini</p>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        
        {/* AI Character Card */}
        <div className="w-full glass rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg className="w-24 h-24 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm11 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isLoadingAI ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Master Guess AI v3.0</span>
          </div>
          
          <p className={`text-xl md:text-2xl font-semibold leading-tight min-h-[4rem] transition-all duration-500 ${getMoodColor(aiMessage.mood)}`}>
            {isLoadingAI ? 'Analizando tu jugada...' : `"${aiMessage.message}"`}
          </p>
        </div>

        {/* Game Interface */}
        <div className="w-full glass rounded-3xl p-8 flex flex-col items-center">
          
          {status === GameStatus.WON ? (
            <div className="text-center animate-bounce py-6">
              <h2 className="text-4xl font-black text-green-400 mb-4">¡VICTORIA!</h2>
              <p className="text-slate-300 mb-6">Lo lograste en {history.length} intentos.</p>
              <button 
                onClick={() => startNewGame()}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
              >
                Jugar de nuevo
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-8 bg-slate-800/50 p-1 rounded-2xl">
                {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => startNewGame(d)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      difficulty === d 
                        ? 'bg-white text-slate-900 shadow-xl scale-105' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <form onSubmit={handleGuess} className="w-full flex flex-col items-center gap-6">
                <div className="relative w-full max-w-xs group">
                  <input
                    ref={inputRef}
                    type="number"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    placeholder="???"
                    className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-3xl py-6 text-center text-5xl font-black text-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-800"
                    disabled={isLoadingAI}
                  />
                  <div className="absolute inset-0 rounded-3xl bg-indigo-500/5 group-focus-within:bg-transparent pointer-events-none transition-all"></div>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingAI || !currentGuess}
                  className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold text-lg shadow-xl shadow-indigo-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoadingAI ? (
                    <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : 'ADIVINAR'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Stats & History */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Rango Actual</span>
             <span className="text-3xl font-black text-white">1 - {DIFFICULTY_CONFIG[difficulty].max}</span>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Intentos</span>
             <span className="text-3xl font-black text-indigo-400">{history.length}</span>
          </div>
        </div>

        <GuessHistory history={history} />
        
      </main>

      <footer className="mt-12 text-slate-600 text-sm">
        Diseñado con ❤️ por el Senior Frontend Engine • Impulsado por Gemini 3
      </footer>
    </div>
  );
};

export default App;
