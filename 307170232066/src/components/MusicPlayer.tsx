import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

const MusicPlayer: React.FC = () => {
  const {
    musicState,
    config,
    currentTrack,
    progress,
    togglePlay,
    toggleMute,
    setVolume,
    play
  } = useMusicPlayer();

  // 当组件加载时，自动初始化并选择"诀别歌"
  useEffect(() => {
    // 检查本地存储是否有用户偏好设置
    const hasAutoPlayDisabled = localStorage.getItem('autoPlayDisabled') === 'true';
    
    // 如果用户没有明确禁用自动播放，并且当前没有曲目，则播放默认曲目
    if (!hasAutoPlayDisabled && !currentTrack) {
      // 使用setTimeout确保DOM已加载完成
      const timeoutId = setTimeout(() => {
        play('farewell_song');
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentTrack, play]);

  // 格式化时间
  const formatTime = (duration: number, percentage: number) => {
    const seconds = Math.floor((duration * percentage) / 100);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // 如果没有当前曲目，显示默认的"诀别歌"信息
  const displayTrack = currentTrack || {
    id: 'farewell_song',
    name: '诀别歌',
    duration: 180,
    artist: '游戏原声'
  };

  return (
    <motion.div 
      className="fixed bottom-4 right-4 z-50 bg-gray-800/90 backdrop-blur-md rounded-full shadow-lg border border-gray-700 p-2 flex items-center space-x-3 transition-all duration-300 hover:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 播放/暂停按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`w-10 h-10 flex items-center justify-center rounded-full ${
          musicState === 'playing' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}
      >
        {musicState === 'playing' ? (
          <i className="fa-solid fa-pause"></i>
        ) : (
          <i className="fa-solid fa-play"></i>
        )}
      </motion.button>

      {/* 歌曲信息 - 只在悬停时显示 */}
      <motion.div 
        className="hidden md:flex items-center max-w-[150px] overflow-hidden"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="ml-2 mr-3">
          <div className="text-xs font-medium text-white truncate">{displayTrack.name}</div>
          <div className="text-xs text-gray-400 truncate">{displayTrack.artist}</div>
        </div>
      </motion.div>

      {/* 进度条 - 只在悬停时显示 */}
      <motion.div 
        className="hidden md:block w-32 h-1 bg-gray-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </motion.div>

      {/* 时间显示 - 只在悬停时显示 */}
      <motion.div 
        className="hidden md:text-xs text-gray-400 min-w-[35px] text-center"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {formatTime(displayTrack.duration, progress)} / {formatTime(displayTrack.duration, 100)}
      </motion.div>

      {/* 音量控制 */}
      <motion.div 
        className="flex items-center"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <button 
          onClick={toggleMute}
          className="text-gray-400 hover:text-white p-1"
        >
          {config.isMuted || config.volume === 0 ? (
            <i className="fa-solid fa-volume-xmark"></i>
          ) : config.volume < 50 ? (
            <i className="fa-solid fa-volume-low"></i>
          ) : (
            <i className="fa-solid fa-volume-high"></i>
          )}
        </button>
        <div className="hidden md:block w-20 h-1 bg-gray-700 rounded-full overflow-hidden mx-2">
          <div 
            className="h-full bg-gray-400 rounded-full"
            style={{ width: `${config.isMuted ? 0 : config.volume}%` }}
          />
        </div>
      </motion.div>

      {/* 音乐图标 - 播放时动画 */}
      {musicState === 'playing' && (
        <motion.div 
          className="absolute -top-16 -left-16 w-32 h-32 bg-green-500 rounded-full opacity-10 pointer-events-none"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      )}
    </motion.div>
  );
};

export default MusicPlayer;