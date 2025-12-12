import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy el asistente virtual de la Lic. Sabrina. ¿Tienes dudas sobre SIBO, FODMAPs o turnos? Estoy para ayudarte.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !process.env.API_KEY) return;

    const userMsg: ChatMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      
      const prompt = `
        Actúa como un asistente experto y amable para la Licenciada en Nutrición Sabrina B. Fernandez.
        Contexto: Ella es especialista en Nutrición Funcional, SIBO (Sobrecrecimiento Bacteriano), IMO y Dieta Low FODMAP.
        Objetivo: Responder preguntas breves de pacientes potenciales.
        Instrucciones:
        1. Sé empático, profesional y claro.
        2. Si preguntan por diagnósticos médicos, aclara que esto es solo informativo y deben agendar una consulta.
        3. Si preguntan por turnos, diles que pueden usar el botón "Reservar Turno" en la web.
        4. Mantén las respuestas cortas (máximo 3 oraciones) para un chat fluido.
        5. Usa emojis ocasionalmente para ser cálido.
        
        Pregunta del usuario: ${inputText}
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      const text = response.text || "Lo siento, tuve un problema procesando tu consulta. Por favor intenta de nuevo.";
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Error AI:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Hubo un error de conexión. Por favor verifica tu red." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-brand-purple text-white p-4 rounded-full shadow-2xl hover:bg-brand-darkPurple transition-all duration-300 transform hover:scale-110 flex items-center gap-2 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Sparkles size={24} className="animate-pulse" />
        <span className="font-semibold hidden md:inline">Asistente IA</span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[90vw] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'}`}>
        
        {/* Header */}
        <div className="bg-brand-purple p-4 rounded-t-2xl flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold">Nutri-Assistant</h3>
              <p className="text-xs text-purple-200">Impulsado por Gemini AI</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-purple text-white rounded-br-none' 
                    : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-2 items-center text-gray-500 text-xs">
                <Loader2 size={14} className="animate-spin" /> Escribiendo...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Pregunta sobre SIBO, turnos..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="bg-brand-orange text-white p-2 rounded-full hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2">La IA puede cometer errores. Consulta siempre a la profesional.</p>
        </div>
      </div>
    </>
  );
};

export default AIChat;