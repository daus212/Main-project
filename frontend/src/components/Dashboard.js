import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    messagesProcessed: 0,
    activeUsers: 0,
    systemUptime: 0,
    aiResponses: 0
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulate real-time stats
    const interval = setInterval(() => {
      setStats(prev => ({
        messagesProcessed: prev.messagesProcessed + Math.floor(Math.random() * 3),
        activeUsers: 15 + Math.floor(Math.random() * 10),
        systemUptime: prev.systemUptime + 1,
        aiResponses: prev.aiResponses + Math.floor(Math.random() * 2)
      }));
    }, 3000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🤖 IT Helper Bot Dashboard
            </h1>
            <p className="text-gray-300 mt-2">Monitoring & Control Center</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm">Current Time</p>
            <p className="text-xl font-mono text-green-400">
              {currentTime.toLocaleTimeString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Messages Processed</p>
              <p className="text-3xl font-bold text-blue-400">{stats.messagesProcessed}</p>
            </div>
            <div className="text-blue-400 text-3xl">📱</div>
          </div>
          <div className="mt-4 bg-blue-500 bg-opacity-20 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-green-400">{stats.activeUsers}</p>
            </div>
            <div className="text-green-400 text-3xl">👥</div>
          </div>
          <div className="mt-4 bg-green-500 bg-opacity-20 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-4/5 animate-pulse"></div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">System Uptime</p>
              <p className="text-lg font-bold text-yellow-400">{formatUptime(stats.systemUptime)}</p>
            </div>
            <div className="text-yellow-400 text-3xl">⏱️</div>
          </div>
          <div className="mt-4 bg-yellow-500 bg-opacity-20 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full w-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">AI Responses</p>
              <p className="text-3xl font-bold text-purple-400">{stats.aiResponses}</p>
            </div>
            <div className="text-purple-400 text-3xl">🧠</div>
          </div>
          <div className="mt-4 bg-purple-500 bg-opacity-20 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bot Status */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            Bot Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">WhatsApp Connection</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400 font-semibold">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">AI Model Status</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Database</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400 font-semibold">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Endpoints</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400 font-semibold">Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">⚙️</span>
            System Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Developer</span>
              <span className="text-blue-400 font-semibold">Firdaus Yusuf</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">AI Model</span>
              <span className="text-purple-400 font-semibold">Mistral 7B → DeepSeek R1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Strategy</span>
              <span className="text-yellow-400 font-semibold">Fast & Deep</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Owner ID</span>
              <span className="text-cyan-400 font-semibold">628131914634</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { time: '10:45:32', action: 'User query processed', type: 'success', icon: '✅' },
              { time: '10:44:18', action: 'AI response generated', type: 'info', icon: '🧠' },
              { time: '10:43:05', action: 'New user connected', type: 'success', icon: '👤' },
              { time: '10:42:22', action: 'System health check', type: 'warning', icon: '⚡' },
              { time: '10:41:15', action: 'Database backup completed', type: 'success', icon: '💾' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-50 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{activity.icon}</span>
                  <div>
                    <span className="text-white font-medium">{activity.action}</span>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activity.type === 'success' ? 'bg-green-900 text-green-300' :
                  activity.type === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-blue-900 text-blue-300'
                }`}>
                  {activity.type.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          🚀 IT Helper Bot • Made with ❤️ by Firdaus Yusuf • Powered by AI Technology
        </p>
      </div>
    </div>
  );
};

export default Dashboard;