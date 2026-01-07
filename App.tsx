
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, RefreshCw, BookOpen, Download, Zap, ChevronDown, Sparkles } from 'lucide-react';
import { Message } from './types';
import { getMotivationalResponse, generateVibrationalImage } from './services/geminiService';
import { AmbientMusic } from './components/AmbientMusic';
import { GratitudeJournal } from './components/GratitudeJournal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bienvenida/o, alma valiente. Soy tu Guía Vibracional. Estoy aquí para recordarte que tú diriges a tu mente. ¿Cómo te sientes en este momento?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGratitude, setShowGratitude] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    const lastBotMsgWithImages = [...messages].reverse().find(m => m.role === 'assistant' && m.energyData?.currentImageUrl);
    if (lastBotMsgWithImages && lastBotMsgWithImages.energyData) {
      if (lastBotMsgWithImages.energyData.currentImageUrl) {
        downloadImage(lastBotMsgWithImages.energyData.currentImageUrl, `Estado_Actual_${lastBotMsgWithImages.energyData.name}`);
      }
      if (lastBotMsgWithImages.energyData.idealImageUrl) {
        downloadImage(lastBotMsgWithImages.energyData.idealImageUrl, 'Estado_Ideal_Meta');
      }
    } else {
      alert("Aún estamos sintonizando tus imágenes. Por favor, espera un momento.");
    }
    setShowMenu(false);
  };

  const sendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const aiData = await getMotivationalResponse(text, history);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiData.text,
        timestamp: new Date(),
        energyData: {
          level: aiData.currentLevel,
          name: aiData.levelName,
          currentImagePrompt: aiData.currentImagePrompt,
          idealImagePrompt: aiData.idealImagePrompt
        }
      };
      
      setMessages(prev => [...prev, botMsg]);

      // Generate images in background concurrently
      Promise.all([
        generateVibrationalImage(aiData.currentImagePrompt),
        generateVibrationalImage(aiData.idealImagePrompt)
      ]).then(([currentImg, idealImg]) => {
        setMessages(prev => prev.map(m => 
          m.id === botMsg.id 
            ? { 
                ...m, 
                energyData: { 
                  ...m.energyData!, 
                  currentImageUrl: currentImg || undefined, 
                  idealImageUrl: idealImg || undefined 
                } 
              } 
            : m
        ));
      }).catch(err => {
        console.error("Delayed Image Generation error:", err);
      });

    } catch (error) {
      console.error("Send Message catch block:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Ha habido un pequeño desajuste en la frecuencia cósmica. Respira y sintoniza de nuevo. Estás sostenido por la vida.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto bg-slate-50 shadow-2xl overflow-hidden font-sans border-x border-slate-200">
      {/* Header */}
      <header className="p-4 bg-white/95 backdrop-blur-md border-b flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-100 transform -rotate-2">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-none mb-0.5">Guía Vibracional</h1>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Sintonizando Realidad</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="group flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black transition-all border border-indigo-100 active:scale-95 shadow-sm"
          >
            OPCIONES
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right">
              <div className="px-4 py-1.5 mb-1">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em]">Gestión Energética</p>
              </div>
              <button 
                onClick={handleDownloadAll}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-3 transition-colors"
              >
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Download className="w-4 h-4" />
                </div>
                DESCARGAR ESTADO
              </button>
              <button 
                onClick={() => { setShowGratitude(!showGratitude); setShowMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <div className="p-1.5 bg-slate-100 rounded-lg">
                  <BookOpen className="w-4 h-4" />
                </div>
                Diario de Gratitud
              </button>
              <div className="h-px bg-slate-100 my-2 mx-3"></div>
              <div className="px-4 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
                  <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest">IA Sincronizada 432Hz</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chat area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 bg-slate-50/50">
        {showGratitude && (
          <GratitudeJournal onSave={(items) => {
            sendMessage(`Hoy elijo agradecer por: ${items.join(", ")}`);
            setShowGratitude(false);
          }} isLoading={isLoading} />
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-400`}>
            <div className={`max-w-[92%] rounded-3xl shadow-sm border ${
              msg.role === 'user' ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
            }`}>
              <div className="p-5">
                <div className={`flex items-center gap-2 mb-3 ${msg.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {msg.role === 'assistant' ? <Zap className="w-3.5 h-3.5 fill-indigo-100" /> : <User className="w-3.5 h-3.5" />}
                  <span className="text-[10px] uppercase font-black tracking-widest">
                    {msg.role === 'assistant' ? 'Mentor Vibracional' : 'Tu Intención'}
                  </span>
                </div>
                
                <div className={`leading-relaxed font-semibold tracking-tight ${msg.role === 'assistant' ? 'text-lg italic text-slate-800' : 'text-sm'}`}>
                  {msg.content}
                </div>

                {msg.energyData && (
                  <div className="mt-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-black text-[10px]">
                          {msg.energyData.level}
                        </div>
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">Frecuencia Actual: {msg.energyData.name}</span>
                      </div>
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      {/* Current Energy State */}
                      <div className="space-y-2.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block text-center">Tu Pregunta</span>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-md group border-2 border-white">
                          {msg.energyData.currentImageUrl ? (
                            <>
                              <img src={msg.energyData.currentImageUrl} alt="Energía Actual" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <button 
                                onClick={() => downloadImage(msg.energyData!.currentImageUrl!, `Frecuencia_Actual_${msg.energyData!.name}`)}
                                className="absolute bottom-2 right-2 p-2 bg-white/95 backdrop-blur rounded-xl shadow-lg text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                              <span className="text-[8px] font-bold text-indigo-400 uppercase">Sintonizando...</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ideal Energy State */}
                      <div className="space-y-2.5">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] block text-center">Tu Destino</span>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-md group border-2 border-indigo-100">
                          {msg.energyData.idealImageUrl ? (
                            <>
                              <img src={msg.energyData.idealImageUrl} alt="Energía Ideal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <button 
                                onClick={() => downloadImage(msg.energyData!.idealImageUrl!, 'Frecuencia_Ideal_Manifestada')}
                                className="absolute bottom-2 right-2 p-2 bg-indigo-600/95 backdrop-blur rounded-xl shadow-lg text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-center text-slate-400 italic leading-tight font-medium">
                      "Utiliza estas imágenes como anclas visuales. Al descargarlas y verlas, colapsas la función de onda hacia tu estado ideal."
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/90 backdrop-blur px-5 py-2.5 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Codificando Luz...</span>
            </div>
          </div>
        )}

        <div className="pt-4">
           <AmbientMusic />
        </div>
      </main>

      {/* Input area */}
      <footer className="p-4 bg-white border-t sticky bottom-0 z-20 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 bg-slate-50 rounded-[1.5rem] p-1.5 shadow-inner border border-slate-200">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="¿Qué deseas transformar hoy?"
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-4 text-sm font-bold text-slate-700 placeholder:text-slate-400 max-h-32"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3.5 rounded-[1.25rem] transition-all duration-300 ${
              !input.trim() || isLoading 
                ? 'bg-slate-200 text-slate-400' 
                : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
