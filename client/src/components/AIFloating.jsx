// components/nairawise/AIFloatingButton.jsx
import { useState } from "react";
import { Bot, X, MessageCircle } from "lucide-react";

export default function NairaWiseAIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating AI Button – Always Visible – Naira-Wise Theme */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-4">
        
        {/* Chat Bubble – GRAY BACKGROUND + WHITE TEXT */}
        {isOpen && (
          <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm border border-gray-600">
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full flex items-center justify-center text-gray-900 font-black text-2xl shadow-lg ring-4 ring-white/20">
                  AI
                </div>
                <div>
                  <p className="font-bold text-white text-xl">Naira-Wise AI Assistant</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online • Powered By Codequor
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Message */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-5 border border-white/10">
              <p className="text-white font-semibold leading-relaxed text-lg">
                Hello! I'm your Naira-Wise AI
              </p>
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                Ask me anything about budgeting, saving, expense tracking, investment tips, or how to grow your money in Nigeria.
              </p>
            </div>

            {/* CTA Button */}
            <a 
              href="https://ai.codequor.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900 font-bold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-gray-500/50 transition-all transform hover:scale-105 shadow-xl text-lg"
            >
              Start Money Chat Now
            </a>
          </div>
        )}

        {/* Main Floating Button – GRAY GLASS */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative bg-gray-800/90 backdrop-blur-3xl text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-gray-600/60 transition-all duration-300 hover:scale-110 flex items-center justify-center border-4 border-gray-500/60"
        >
          <Bot className="w-10 h-10 drop-shadow-2xl" />
          
          {/* Pulse Rings – Gray Theme */}
          <span className="absolute inset-0 rounded-full bg-gray-400 opacity-80 animate-ping"></span>
          <span className="absolute inset-0 rounded-full bg-gray-500 opacity-60 animate-ping animation-delay-300"></span>
          <span className="absolute inset-0 rounded-full bg-gray-600 opacity-40 animate-ping animation-delay-600"></span>
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl border border-gray-500/50 font-medium">
            Chat with Naira-Wise AI
          </span>
        </button>
      </div>

      {/* Animation Delays */}
      <style jsx>{`
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-600 { animation-delay: 600ms; }
      `}</style>
    </>
  );
}