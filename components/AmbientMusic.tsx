
import React, { useState, useRef } from 'react';
import { Play, Pause, Music, AlertCircle } from 'lucide-react';

export const AmbientMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setHasError(false);
        audioRef.current.play().catch(err => {
          console.error("Error al intentar reproducir:", err);
          setHasError(true);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioError = (e: any) => {
    console.error("Error en el elemento de audio:", e);
    setHasError(true);
    setIsPlaying(false);
  };

  return (
    <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          hasError ? 'bg-red-50' : isPlaying ? 'bg-blue-500 shadow-lg shadow-blue-200 animate-pulse' : 'bg-blue-100'
        }`}>
          {hasError ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <Music className={`w-5 h-5 ${isPlaying ? 'text-white' : 'text-blue-500'}`} />
          )}
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${hasError ? 'text-red-700' : 'text-gray-700'}`}>
            {hasError ? 'Frecuencia No Disponible' : 'Frecuencia de Calma'}
          </h3>
          <p className={`text-[10px] font-medium uppercase tracking-widest ${hasError ? 'text-red-400' : 'text-blue-400'}`}>
            {hasError ? 'Intenta reconectar' : '432Hz Sintonía Zen'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isPlaying && !hasError && (
          <div className="flex gap-1 items-end h-3">
            <div className="w-1 bg-blue-300 rounded-full animate-[bounce_1s_infinite_0.1s]" style={{ height: '60%' }} />
            <div className="w-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_0.3s]" style={{ height: '100%' }} />
            <div className="w-1 bg-blue-300 rounded-full animate-[bounce_1s_infinite_0.5s]" style={{ height: '80%' }} />
          </div>
        )}
        
        <button 
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full bg-white border flex items-center justify-center transition-all shadow-sm ${
            hasError 
            ? 'border-red-100 text-red-300 hover:bg-red-50' 
            : 'border-blue-50 text-blue-500 hover:bg-blue-50 hover:scale-105 active:scale-95'
          }`}
        >
          {isPlaying && !hasError ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
      </div>

      {/* Audio con fuentes alternativas y configuración de CORS */}
      <audio 
        ref={audioRef} 
        loop 
        crossOrigin="anonymous"
        onPlay={() => setHasError(false)}
        onError={handleAudioError}
      >
        <source src="https://luan.xyz/files/audio/ambient_c_motion.mp3" type="audio/mpeg" />
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        <source src="https://codeskulptor-demos.commondatastorage.googleapis.com/descent/background%20music.mp3" type="audio/mpeg" />
        Tu navegador no soporta la sintonía auditiva.
      </audio>
    </div>
  );
};
