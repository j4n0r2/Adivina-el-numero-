
import React from 'react';
import { GuessRecord } from '../types';

interface Props {
  history: GuessRecord[];
}

const GuessHistory: React.FC<Props> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Historial de Intentos</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
        {[...history].reverse().map((record, index) => (
          <div 
            key={record.timestamp}
            className="flex items-center justify-between p-3 glass rounded-xl border-l-4 transition-all hover:translate-x-1"
            style={{ 
              borderLeftColor: record.direction === 'correct' ? '#22c55e' : 
                               record.direction === 'higher' ? '#3b82f6' : '#ef4444' 
            }}
          >
            <span className="font-bold text-lg">#{history.length - index}</span>
            <span className="text-xl font-mono text-white">{record.value}</span>
            <span className={`text-xs font-bold uppercase ${
              record.direction === 'correct' ? 'text-green-400' :
              record.direction === 'higher' ? 'text-blue-400' : 'text-red-400'
            }`}>
              {record.direction === 'correct' ? '¡Acertaste!' : 
               record.direction === 'higher' ? 'Más alto ↑' : 'Más bajo ↓'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuessHistory;
