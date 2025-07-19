import React, { useState, useEffect } from 'react';

const StartupAnimation = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const steps = [
    {
      icon: "🤖",
      text: "Memulai IT Helper Bot...",
      color: "text-blue-400",
      delay: 1000
    },
    {
      icon: "👨‍💻",
      text: "Dibuat oleh: Firdaus Yusuf",
      color: "text-green-400",
      delay: 800
    },
    {
      icon: "🧠",
      text: "AI Models: Mistral 7B → DeepSeek R1",
      color: "text-purple-400",
      delay: 1000
    },
    {
      icon: "⚡",
      text: "Strategy: Cepat untuk ringan, Dalam untuk kompleks",
      color: "text-yellow-400",
      delay: 1200
    },
    {
      icon: "📱",
      text: "Berhasil terhubung ke WhatsApp!",
      color: "text-green-500",
      delay: 800
    },
    {
      icon: "✅",
      text: "Bot Status: Aktif",
      color: "text-green-500",
      delay: 600
    },
    {
      icon: "👤",
      text: "Owner: 628131914634",
      color: "text-cyan-400",
      delay: 600
    },
    {
      icon: "🚀",
      text: "Sistem siap digunakan!",
      color: "text-green-400",
      delay: 1000
    }
  ];

  const typeText = (text, stepIndex) => {
    setIsTyping(true);
    let currentText = '';
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        currentText += text[charIndex];
        setDisplayedText(prev => {
          const newArray = [...prev];
          newArray[stepIndex] = currentText;
          return newArray;
        });
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setTimeout(() => {
          if (stepIndex < steps.length - 1) {
            setCurrentStep(stepIndex + 1);
          } else {
            setTimeout(() => {
              onComplete && onComplete();
            }, 2000);
          }
        }, steps[stepIndex].delay);
      }
    }, 50 + Math.random() * 50);
  };

  useEffect(() => {
    if (currentStep < steps.length) {
      setTimeout(() => {
        typeText(steps[currentStep].text, currentStep);
      }, 500);
    }
  }, [currentStep]);

  const getGradientBackground = () => {
    return {
      background: `
        linear-gradient(135deg, 
          #0f0f23 0%, 
          #1a1a3e 25%, 
          #2d1b69 50%, 
          #1a1a3e 75%, 
          #0f0f23 100%
        )
      `
    };
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
      style={getGradientBackground()}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Matrix rain effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500 opacity-20 text-sm font-mono animate-bounce"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '2s'
            }}
          >
            {String.fromCharCode(48 + Math.random() * 10)}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
            🤖 IT HELPER BOT 🤖
          </h1>
          <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full animate-pulse"></div>
        </div>

        {/* Terminal Window */}
        <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden backdrop-blur-sm bg-opacity-90">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-6 py-3 flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-gray-300 text-sm font-mono">firdaus@daus: ~/AI_IT_helpdesk/Main-project$</span>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-8 font-mono text-lg leading-relaxed min-h-[400px]">
            <div className="mb-4">
              <span className="text-green-400">$ </span>
              <span className="text-white">npm start</span>
            </div>
            
            <div className="mb-6">
              <span className="text-blue-400">&gt; </span>
              <span className="text-gray-300">whatsapp-bot-deepseek@1.0.0 start</span>
            </div>
            
            <div className="mb-6">
              <span className="text-blue-400">&gt; </span>
              <span className="text-gray-300">node index.js</span>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 mb-8">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-4 mb-4 transition-all duration-500 ${
                    index <= currentStep ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'
                  }`}
                >
                  <span className="text-2xl animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                    {step.icon}
                  </span>
                  <span className={`${step.color} text-lg`}>
                    {displayedText[index] || ''}
                    {index === currentStep && isTyping && (
                      <span className="inline-block w-2 h-6 bg-green-400 ml-1 animate-pulse"></span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Loading bar */}
            {currentStep < steps.length && (
              <div className="mt-8">
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2 text-gray-400 text-sm">
                  Initializing... {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </div>
              </div>
            )}

            {/* Completion message */}
            {currentStep >= steps.length - 1 && !isTyping && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 bg-green-900 bg-opacity-50 px-6 py-3 rounded-full border border-green-500">
                  <span className="text-green-400 text-xl animate-spin">⚙️</span>
                  <span className="text-green-400 font-semibold">Sistem berhasil diinisialisasi!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Powered by <span className="text-blue-400 font-semibold">AI Technology</span> • 
            Made with <span className="text-red-500">❤️</span> by <span className="text-green-400 font-semibold">Firdaus Yusuf</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartupAnimation;