
import React, { useState, useEffect } from 'react';
import { Wind } from 'lucide-react';

export const BreathExercise: React.FC = () => {
  const [phase, setPhase] = useState<'Inhala' | 'Exhala' | 'Espera'>('Espera');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (phase === 'Inhala' && timer >= 4) {
      setPhase('Exhala');
      setTimer(0);
    } else if (phase === 'Exhala' && timer >= 6) {
      setPhase('Inhala');
      setTimer(0);
    }
  }, [timer, phase]);

  const toggle = () => {
    if (!isActive) {
      setPhase('Inhala');
      setTimer(0);
    }
    setIsActive(!isActive);
  };

  return (
    <div className="p-4 bg-white/50 rounded-2xl border border-blue-100 flex flex-col items-center gap-3 transition-all">
      <div className="flex items-center gap-2 text-blue-600 font-medium">
        <Wind className="w-5 h-5" />
        <span>Desactiva el ruido fisiológico</span>
      </div>
      
      {isActive ? (
        <div className="flex flex-col items-center">
          <div className={`text-2xl font-bold transition-all duration-700 ${phase === 'Inhala' ? 'scale-125 text-blue-500' : 'scale-100 text-teal-500'}`}>
            {phase}... {timer}s
          </div>
          <div className="mt-2 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400 transition-all duration-1000"
              style={{ width: `${(timer / (phase === 'Inhala' ? 4 : 6)) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center">Inhala en 4, exhala en 6 para calmar tu sistema.</p>
      )}

      <button 
        onClick={toggle}
        className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        {isActive ? 'Detener' : 'Comenzar Ejercicio'}
      </button>
    </div>
  );
};
