import React, { useState, useEffect } from 'react';

const StartupAnimation = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMatrix, setShowMatrix] = useState(true);

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
              setShowMatrix(false);
              setTimeout(() => {
                onComplete && onComplete();
              }, 1000);
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

  const MatrixRain = () => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500 opacity-60 text-sm font-mono leading-none"
            style={{
              left: `${i * 3.33}%`,
              animation: `matrix-fall ${3 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            {[...Array(20)].map((_, j) => (
              <div key={j} className="block">
                {chars[Math.floor(Math.random() * chars.length)]}
              </div>
            ))}
          </div>
        ))}
        <style jsx>{`
          @keyframes matrix-fall {
            0% { transform: translateY(-100vh); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
      style={getGradientBackground()}
    >
      {/* Matrix Rain Effect */}
      {showMatrix && <MatrixRain />}

      {/* Animated background particles */}
      <div className="absolute inset-0 z-0">
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

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-blue-500 opacity-20 animate-spin"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
            🤖 IT HELPER BOT 🤖
          </h1>
          <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
          <p className="text-gray-300 mt-4 text-lg font-light">Advanced AI Assistant for Technical Support</p>
        </div>

        {/* Terminal Window */}
        <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden backdrop-blur-sm bg-opacity-90 hover:shadow-blue-500/20 transition-all duration-500">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-6 py-3 flex items-center space-x-2 border-b border-gray-700">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse cursor-pointer hover:bg-red-400"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse cursor-pointer hover:bg-yellow-400"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse cursor-pointer hover:bg-green-400"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-gray-300 text-sm font-mono bg-gray-700 px-3 py-1 rounded">
                firdaus@daus: ~/AI_IT_helpdesk/Main-project$
              </span>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-8 font-mono text-lg leading-relaxed min-h-[500px]">
            <div className="mb-4 flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <span className="text-white">npm start</span>
              <span className="ml-2 animate-pulse text-green-400">|</span>
            </div>
            
            <div className="mb-6 flex items-center">
              <span className="text-blue-400 mr-2">&gt;</span>
              <span className="text-gray-300">whatsapp-bot-deepseek@1.0.0 start</span>
            </div>
            
            <div className="mb-6 flex items-center">
              <span className="text-blue-400 mr-2">&gt;</span>
              <span className="text-gray-300">node index.js</span>
            </div>

            <div className="border-l-4 border-blue-500 pl-6 mb-8 bg-gray-800 bg-opacity-30 rounded-r-lg py-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-4 mb-4 transition-all duration-700 transform ${
                    index <= currentStep 
                      ? 'opacity-100 translate-x-0 scale-100' 
                      : 'opacity-30 translate-x-8 scale-95'
                  }`}
                >
                  <span 
                    className="text-2xl animate-bounce" 
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animationDuration: '2s' 
                    }}
                  >
                    {step.icon}
                  </span>
                  <span className={`${step.color} text-lg font-medium`}>
                    {displayedText[index] || ''}
                    {index === currentStep && isTyping && (
                      <span className="inline-block w-2 h-6 bg-green-400 ml-1 animate-pulse"></span>
                    )}
                  </span>
                  {index < currentStep && (
                    <span className="text-green-400 ml-auto animate-ping">✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Loading bar */}
            {currentStep < steps.length && (
              <div className="mt-8">
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center mt-3 text-gray-400 text-sm">
                  <span className="animate-pulse">Initializing system components...</span>
                  <span className="ml-2 font-bold text-green-400">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Completion message */}
            {currentStep >= steps.length - 1 && !isTyping && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-3 bg-green-900 bg-opacity-50 px-8 py-4 rounded-full border border-green-500 shadow-lg shadow-green-500/30 animate-pulse">
                  <span className="text-green-400 text-2xl animate-spin">⚙️</span>
                  <span className="text-green-400 font-bold text-lg">Sistem berhasil diinisialisasi!</span>
                  <span className="text-green-400 text-2xl animate-bounce">🚀</span>
                </div>
                <p className="text-gray-400 mt-4 text-sm animate-pulse">
                  Redirecting to dashboard in 3 seconds...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Powered by <span className="text-blue-400 font-semibold">AI Technology</span> • 
            Made with <span className="text-red-500 animate-pulse">❤️</span> by <span className="text-green-400 font-semibold">Firdaus Yusuf</span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2025 IT Helper Bot - Advanced Technical Support Assistant
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartupAnimation;