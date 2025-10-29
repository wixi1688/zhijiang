import { useState, useEffect, useCallback } from 'react';

// 定义音乐状态类型
export type MusicState = 'playing' | 'paused' | 'stopped';

// 定义音乐配置接口
export interface MusicConfig {
  volume: number;
  isLooping: boolean;
  isMuted: boolean;
}

// 音乐轨道类型
export interface MusicTrack {
  id: string;
  name: string;
  duration: number; // 模拟的持续时间（秒）
  artist?: string;
}

export const useMusicPlayer = () => {
  // 音乐状态
  const [musicState, setMusicState] = useState<MusicState>('stopped');
  // 音乐配置
  const [config, setConfig] = useState<MusicConfig>({
    volume: 70,
    isLooping: true,
    isMuted: false
  });
  // 当前播放的曲目
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  // 模拟播放进度
  const [progress, setProgress] = useState(0);

  // 可用的音乐曲目
  const tracks: MusicTrack[] = [
    {
      id: 'farewell_song',
      name: '诀别歌',
      duration: 180, // 3分钟（模拟）
      artist: '游戏原声'
    }
  ];

  // 播放音乐
  const play = useCallback((trackId: string = 'farewell_song') => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;
    
    setCurrentTrack(track);
    setMusicState('playing');
    console.log(`开始播放音乐: ${track.name}`);
  }, [tracks]);

  // 暂停音乐
  const pause = useCallback(() => {
    if (musicState === 'playing') {
      setMusicState('paused');
      console.log('音乐已暂停');
    }
  }, [musicState]);

  // 停止音乐
  const stop = useCallback(() => {
    setMusicState('stopped');
    setProgress(0);
    console.log('音乐已停止');
  }, []);

  // 切换音乐播放状态
  const togglePlay = useCallback(() => {
    if (musicState === 'playing') {
      pause();
    } else {
      if (currentTrack) {
        play(currentTrack.id);
      } else {
        play();
      }
    }
  }, [musicState, currentTrack, play, pause]);

  // 设置音量
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    setConfig(prev => ({ ...prev, volume: clampedVolume }));
    console.log(`音量设置为: ${clampedVolume}%`);
  }, []);

  // 切换静音
  const toggleMute = useCallback(() => {
    setConfig(prev => {
      const newIsMuted = !prev.isMuted;
      console.log(`静音状态: ${newIsMuted}`);
      return { ...prev, isMuted: newIsMuted };
    });
  }, []);

  // 切换循环播放
  const toggleLoop = useCallback(() => {
    setConfig(prev => ({ ...prev, isLooping: !prev.isLooping }));
    console.log(`循环播放: ${!config.isLooping}`);
  }, [config.isLooping]);

  // 模拟音乐播放进度更新
  useEffect(() => {
    let interval: number;
    
    if (musicState === 'playing' && currentTrack) {
      interval = setInterval(() => {
        setProgress(prevProgress => {
          // 如果进度达到或超过100%，并且启用了循环播放，则重置进度
          if (prevProgress >= 100 && config.isLooping) {
            return 0;
          } 
          // 如果进度达到或超过100%，并且未启用循环播放，则停止播放
          else if (prevProgress >= 100 && !config.isLooping) {
            setMusicState('stopped');
            return 100;
          }
          // 否则更新进度
          const newProgress = prevProgress + (100 / currentTrack.duration) * 0.5; // 每0.5秒更新一次
          return newProgress;
        });
      }, 500);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [musicState, currentTrack, config.isLooping]);

  // 组件卸载时停止音乐
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    musicState,
    config,
    currentTrack,
    progress,
    tracks,
    play,
    pause,
    stop,
    togglePlay,
    setVolume,
    toggleMute,
    toggleLoop
  };
};