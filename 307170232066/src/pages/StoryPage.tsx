import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { STORY_CHAPTERS, SIDE_STORIES, StoryCharacter, characterAvatars, characterNames, characterColors, getUnlockedChapters, unlockChapter } from '../data/storyData';

const StoryPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});
  const [isDarkOverlay, setIsDarkOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 加载已解锁章节和阅读进度
  useEffect(() => {
    const loadStoryData = () => {
      // 获取已解锁章节
      const unlocked = getUnlockedChapters();
      setUnlockedChapters(unlocked);
      
      // 加载阅读进度
      const progress: Record<string, number> = {};
      STORY_CHAPTERS.forEach(chapter => {
        const progressKey = `story_progress_${chapter.id}`;
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
          progress[chapter.id] = parseInt(savedProgress);
        } else {
          progress[chapter.id] = 0;
        }
      });
      setReadingProgress(progress);
      setIsLoading(false);
    };
    
    loadStoryData();
    
    // 添加监听，以便在其他地方更新了剧情进度时能及时刷新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('story_progress_')) {
        loadStoryData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 检查章节是否已解锁
  const isChapterUnlocked = (chapterId: string): boolean => {
    return unlockedChapters.includes(chapterId);
  };

  // 获取章节阅读进度百分比
  const getChapterProgress = (chapterId: string): number => {
    const content = STORY_CHAPTERS.find(c => c.id === chapterId);
    
    if (!content) return 0;
    
    const progressKey = `story_progress_${chapterId}`;
    const savedProgress = localStorage.getItem(progressKey);
    const progress = savedProgress ? parseInt(savedProgress) : 0;
    
    return Math.round((progress / content.content.length) * 100);
  };

  // 解锁新章节
  const handleUnlockChapter = (chapterId: string): void => {
    unlockChapter(chapterId);
    setUnlockedChapters(prev => [...prev, chapterId]);
    
    // 显示解锁动画和提示
    const content = STORY_CHAPTERS.find(c => c.id === chapterId);
    if (content) {
      showUnlockNotification(content.title);
    }
  };

  // 显示解锁通知
  const showUnlockNotification = (chapterTitle: string): void => {
    // 创建视觉反馈元素
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-float';
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="text-2xl mr-3 animate-pulse">✨</div>
        <div>
          <div class="font-bold text-lg">新剧情解锁!</div>
          <div class="text-sm opacity-90">${chapterTitle}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-x-full', 'transition-all', 'duration-500');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  // 查看章节详情
  const handleViewChapter = (chapterId: string): void => {
    if (isChapterUnlocked(chapterId)) {
      setSelectedChapterId(chapterId);
      setIsDarkOverlay(true);
    }
  };
  
  // 从URL参数中获取章节ID
  useEffect(() => {
    const chapterId = searchParams.get('chapterId');
    const isSideStory = searchParams.get('isSideStory') === 'true';
    
    if (chapterId) {
      if (isSideStory) {
        // 如果是番外剧情，跳转到番外剧情页面
        navigate(`/side-stories?storyId=${chapterId}&isSideStory=true`);
      } else {
        // 检查章节是否已解锁
        const unlocked = getUnlockedChapters();
        if (unlocked.includes(chapterId)) {
          setSelectedChapterId(chapterId);
          setIsDarkOverlay(true);
        }
      }
    }
  }, [searchParams, navigate]);

  // 关闭章节详情
  const handleCloseChapter = (): void => {
    setSelectedChapterId(null);
    setIsDarkOverlay(false);
  };

  // 渲染章节卡片
  const renderChapterCard = (chapter: any, index: number) => {
    const isUnlocked = isChapterUnlocked(chapter.id);
    const progressPercentage = getChapterProgress(chapter.id);
    const hasProgress = progressPercentage > 0;

    return (
      <motion.div
        key={chapter.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`
          relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300
          ${isUnlocked 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-xl hover:shadow-purple-900/20 border border-gray-700 hover:border-purple-500/50 group' 
            : 'bg-gray-800/50 border border-gray-700 opacity-60'
          }
        `}
        onClick={() => handleViewChapter(chapter.id)}
        whileHover={isUnlocked ? { scale: 1.02 } : undefined}
        whileTap={isUnlocked ? { scale: 0.98 } : undefined}
      >
        {/* 章节封面图 */}
        <div className="h-48 overflow-hidden relative">
          {/* 装饰光晕 */}
          {isUnlocked && (
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl z-0"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          
          <img 
            src={chapter.thumbnail} 
            alt={chapter.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 z-10 relative"
            loading="lazy"
          />
          
          {/* 动态遮罩层 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-20"></div>
          
          {/* 章节标题 */}
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <motion.h3 
              className="text-xl font-bold text-white drop-shadow-lg"
              initial={{ y: 10, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {chapter.title}
            </motion.h3>
            <motion.p 
              className="text-gray-300 text-sm mt-1 line-clamp-1"
              initial={{ y: 10, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {chapter.description}
            </motion.p>
          </div>
          
          {/* 锁图标 */}
          {!isUnlocked && (
            <motion.div 
              className="absolute top-4 right-4 bg-black/70 p-2 rounded-full text-white z-30"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <i className="fa-solid fa-lock"></i>
            </motion.div>
          )}
          
          {/* 阅读进度指示器 */}
          {hasProgress && (
            <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-white text-sm flex items-center z-30">
              <i className="fa-solid fa-book-open mr-1"></i>
              {progressPercentage}%
            </div>
          )}
          
          {/* 点击提示 */}
          {isUnlocked && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
                <i className="fa-solid fa-book-open mr-1"></i> 点击阅读
              </div>
            </motion.div>
          )}
        </div>
        
        {/* 章节详情 */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold mr-2">
                {index + 1}
              </div>
              <span className="text-gray-400 text-sm">剧情章节</span>
            </div>
            
            {/* 阅读时长估计 */}
            <span className="text-gray-400 text-sm flex items-center">
              <i className="fa-regular fa-clock mr-1"></i>
              {Math.round(chapter.content.length * 0.5)}分钟
            </span>
          </div>
          
          {/* 阅读进度条 */}
          {hasProgress && (
            <div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">阅读进度: {progressPercentage}%</div>
            </div>
          )}
          
          {/* 未解锁提示 */}
          {!isUnlocked && (
            <div className="mt-3 text-center text-gray-400 text-sm">
              <i className="fa-solid fa-key mr-1"></i>
              完成前置章节解锁
            </div>
          )}
        </div>
        
        {/* 装饰元素 */}
        {isUnlocked && (
          <motion.div 
            className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    );
  };

  // 渲染章节详情
  const renderChapterDetail = () => {
    if (!selectedChapterId) return null;
    
    // 获取章节内容
    const content = STORY_CHAPTERS.find(c => c.id === selectedChapterId);
    
    if (!content) return null;
    
    // 获取进度键名
    const progressKey = `story_progress_${selectedChapterId}`;
    
    // 从localStorage获取进度
    const savedProgress = localStorage.getItem(progressKey);
    const currentProgress = savedProgress ? parseInt(savedProgress) : 0;
    
    return (
      <AnimatePresence>
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseChapter}
        >
          {/* 背景图像 */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={content.thumbnail} 
              alt={content.title} 
              className="w-full h-full object-cover object-center brightness-20"
              loading="lazy"
            />
            
            {/* 动态渐变覆盖层 */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20"
              animate={{ opacity: [0.7, 0.9, 0.7] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* 深色覆盖层 */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
          </div>

          {/* 主要内容容器 */}
          <motion.div 
            className="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl bg-gray-900/95 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部控制栏 */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 flex justify-between items-center border-b border-gray-800 relative overflow-hidden">
              {/* 装饰元素 */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <h2 className="text-xl font-bold text-white flex items-center relative z-10">
                <i className="fa-solid fa-book-open mr-2"></i>
                {content.title}
              </h2>
              <motion.button
                className="text-gray-300 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
                onClick={handleCloseChapter}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fa-solid fa-times text-xl"></i>
              </motion.button>
            </div>

            {/* 剧情内容区域 */}
            <div className="flex-grow p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900" style={{ scrollBehavior: 'smooth' }}>
              {/* 章节标题与描述 */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-3 drop-shadow-lg">
                  {content.title}
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto">{content.description}</p>
              </motion.div>

              {/* 角色列表 */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {Array.from(new Set(content.content.map((dialogue: any) => dialogue.character))).map((character: StoryCharacter) => (
                  <motion.div 
                    key={character} 
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-900/20 mb-2 relative">
                      <img 
                        src={characterAvatars[character]} 
                        alt={characterNames[character]}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* 角色光环 */}
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${character === 'narrator' ? 'text-gray-400' : `bg-gradient-to-r ${characterColors[character]} bg-clip-text text-transparent`}`}>
                      {characterNames[character]}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* 剧情内容 */}
              <div className="max-w-2xl mx-auto space-y-6">
                {content.content.map((dialogue: any, index: number) => (
                  <motion.div 
                    key={dialogue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className={`
                      p-5 rounded-xl border shadow-lg backdrop-blur-sm relative overflow-hidden
                      ${dialogue.character === 'narrator' 
                        ? 'bg-gray-800/90 border-gray-700' 
                        : `bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-${characterColors[dialogue.character].split(' ')[1].split('-')[0]}-700/60`
                      }
                    `}
                  >
                    {/* 对话气泡装饰 */}
                    {dialogue.character !== 'narrator' && (
                      <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 transform rotate-45 
                        ${dialogue.character === 'narrator' ? 'bg-gray-800/90' : `bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-l border-t border-${characterColors[dialogue.character].split(' ')[1].split('-')[0]}-700/60`}
                      `}></div>
                    )}
                    
                    {/* 装饰背景元素 */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-3xl"></div>
                    </div>
                    
                    {/* 角色名称 */}
                    {dialogue.character !== 'narrator' && (
                      <div className={`
                        font-bold text-sm mb-2 inline-block px-3 py-1 rounded-full relative z-10
                        ${dialogue.character === 'narrator' 
                          ? 'text-gray-400 bg-gray-700/50' 
                          : `bg-gradient-to-r ${characterColors[dialogue.character]} bg-clip-text text-transparent bg-gray-800/70`
                        }
                      `}>
                        {characterNames[dialogue.character]}
                      </div>
                    )}
                    
                    {/* 对话文本 */}
                    <p className={`leading-relaxed ${dialogue.character === 'narrator' ? 'text-gray-300 italic' : 'text-white'} relative z-10`}>
                      {dialogue.text}
                    </p>
                    
                    {/* 情感标签 */}
                    {dialogue.character !== 'narrator' && dialogue.emotion && (
                      <div className={`mt-2 text-xs inline-block px-2 py-1 rounded-full bg-opacity-30 relative z-10
                        ${dialogue.emotion === 'happy' ? 'bg-yellow-500 text-yellow-200' :
                          dialogue.emotion === 'sad' ? 'bg-blue-500 text-blue-200' :
                          dialogue.emotion === 'angry' ? 'bg-red-500 text-red-200' :
                          dialogue.emotion === 'surprised' ? 'bg-purple-500 text-purple-200' :
                          'bg-gray-500 text-gray-200'
                        }
                      `}>
                        {dialogue.emotion === 'happy' && '😊 开心'}
                        {dialogue.emotion === 'sad' && '😢 难过'}
                        {dialogue.emotion === 'angry' && '😠 愤怒'}
                        {dialogue.emotion === 'surprised' && '😮 惊讶'}
                        {dialogue.emotion === 'calm' && '😌 平静'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* 完成标记 */}
              {currentProgress >= content.content.length - 1 && (
                <motion.div 
                  className="mt-10 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className="inline-block p-4 bg-gradient-to-r from-green-600 to-green-400 rounded-full mb-3 shadow-lg shadow-green-500/30">
                    <i className="fa-solid fa-check text-2xl text-white"></i>
                  </div>
                  <p className="text-lg font-bold text-green-400">
                    恭喜您完成了这个章节！
                  </p>
                  <p className="text-gray-400 mt-2">
                    下一个章节已经解锁，继续探索光明与暗影的故事吧！
                  </p>
                </motion.div>
              )}
            </div>

            {/* 底部进度条 */}
            <div className="bg-gray-900 p-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">阅读进度</span>
                <span className="text-gray-300 text-sm">{Math.round((currentProgress / content.content.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentProgress / content.content.length) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {/* 进度条闪光效果 */}
                  <motion.div 
                    className="absolute inset-y-0 left-0 w-20 bg-white/30 blur-sm"
                    animate={{ 
                      x: ['-20px', '100%'],
                      opacity: [0, 0.7, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      ease: "easeInOut",
                      repeatDelay: 1
                    }}
                  />
                </motion.div>
              </div>
              
              {/* 快速导航按钮 */}
              <div className="flex justify-center mt-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(75, 85, 99, 0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
                  onClick={() => {
                    // 滚动到顶部
                    const contentElement = document.querySelector('.max-h-\\[90vh\\] .overflow-y-auto');
                    if (contentElement) {
                      contentElement.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  <i className="fa-solid fa-arrow-up mr-2"></i>
                  返回顶部
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(75, 85, 99, 0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
                  onClick={handleCloseChapter}
                >
                  <i className="fa-solid fa-times mr-2"></i>
                  关闭
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        {/* 背景动态光效 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-5xl mb-4 relative z-10"
        >
          <i className="fa-solid fa-book"></i>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2 relative z-10">正在加载剧情数据...</h2>
        <p className="text-gray-400 relative z-10">探索光明与暗影的故事</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} text-gray-900 dark:text-white transition-colors duration-300 p-4 relative overflow-hidden`}>
      {/* 背景动态光效 */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <motion.div 
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      {/* 页面头部 */}
      <header className="max-w-6xl mx-auto mb-8 relative z-10">
        <div className="absolute top-0 left-0 z-20">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 rounded-full border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 shadow-lg flex items-center justify-center"
            onClick={() => window.history.back()}
            aria-label="返回上一页"
          >
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </motion.button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center pt-12 pb-4"
        >
          {/* 标题装饰 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            光明与暗影的故事
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            探索光明大陆与暗影世界之间的史诗传说，了解这场永恒之战的起源与未来。
          </p>
          
          {/* 剧情进度统计 */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-2xl">
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg w-full md:w-1/2 border border-gray-200 dark:border-gray-700 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* 装饰元素 */}
              <motion.div 
                className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-1 relative z-10">已解锁章节</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 relative z-10">
                {unlockedChapters.length} / {STORY_CHAPTERS.length}
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlockedChapters.length / STORY_CHAPTERS.length) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full relative"
                >
                  {/* 进度条闪光效果 */}
                  <motion.div 
                    className="absolute inset-y-0 left-0 w-10 bg-white/30 blur-sm"
                    animate={{ 
                      x: ['-10px', '100%'],
                      opacity: [0, 0.7, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      ease: "easeInOut",
                      repeatDelay: 1
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg w-full md:w-1/2 border border-gray-200 dark:border-gray-700 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* 装饰元素 */}
              <motion.div 
                className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-1 relative z-10">总阅读进度</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 relative z-10">
                {Math.round(
                  Object.values(readingProgress).reduce((total, progress, index) => {
                    const chapter = STORY_CHAPTERS[index];
                    if (!chapter) return total;
                    return total + (progress / chapter.content.length);
                  }, 0) / STORY_CHAPTERS.length * 100
                )}%
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${
                      Object.values(readingProgress).reduce((total, progress, index) => {
                        const chapter = STORY_CHAPTERS[index];
                        if (!chapter) return total;
                        return total + (progress / chapter.content.length);
                      }, 0) / STORY_CHAPTERS.length * 100
                    }%` 
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full rounded-full relative"
                >
                  {/* 进度条闪光效果 */}
                  <motion.div 
                    className="absolute inset-y-0 left-0 w-10 bg-white/30 blur-sm"
                    animate={{ 
                      x: ['-10px', '100%'],
                      opacity: [0, 0.7, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      ease: "easeInOut",
                      repeatDelay: 1,
                      delay: 0.5
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </header>
      
      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto pb-16 relative z-10">
        {/* 章节列表 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <i className="fa-solid fa-book-open mr-2 text-purple-400"></i>
            游戏剧情
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORY_CHAPTERS.map((chapter, index) => renderChapterCard(chapter, index))}
          </div>
        </div>
        
        {/* 番外剧情部分 - 链接到新页面 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-xl p-6 shadow-xl border border-blue-800/50 relative overflow-hidden group cursor-pointer"
          onClick={() => navigate('/side-stories')}
        >
          {/* 装饰元素 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white text-2xl mr-4 shadow-lg shadow-blue-900/30">
                <i className="fa-solid fa-star"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">探索角色的秘密故事</h2>
                <p className="text-gray-300">了解"宿槐的传说"、"清鸢的回忆"等角色背后的故事</p>
              </div>
            </div>
            <motion.div 
              className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              前往番外剧情
              <motion.span 
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </motion.span>
            </motion.div>
          </div>
          
          {/* 角色缩略图预览 */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {SIDE_STORIES.slice(0, 4).map((story, index) => (
              <motion.div 
                key={story.id}
                className="w-full aspect-square rounded-lg overflow-hidden border border-blue-500/30 shadow-lg"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <img 
                  src={story.thumbnail} 
                  alt={story.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
          
          {/* 底部装饰 */}
          <div className="mt-4 text-center text-blue-400 text-sm">
            共 {SIDE_STORIES.length} 个角色故事 · 点击查看更多
          </div>
        </motion.div>
        
        {/* 阅读提示 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden"
          whileHover={{ y: -5 }}
        >
          {/* 装饰元素 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-xl font-bold mb-4 flex items-center relative z-10">
            <i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>
            阅读提示</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300 relative z-10">
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>完成游戏关卡可以解锁新的剧情章节</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>在游戏中收集特殊物品也可能解锁隐藏剧情</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>阅读进度会自动保存，您可以随时继续上次的阅读</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>部分剧情内容可能揭示游戏中的隐藏机制和策略</span>
            </li>
          </ul>
        </motion.div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800/90 backdrop-blur-sm text-gray-300 py-6 text-center relative z-10 border-t border-gray-700">
        <p>© 2025 光明与暗影之战 - 探索完整的故事线</p>
      </footer>
      
      {/* 章节详情弹窗 */}
      {selectedChapterId && renderChapterDetail()}
      
      {/* 全局深色覆盖层 */}
      <AnimatePresence>
        {isDarkOverlay && (
          <motion.div 
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseChapter}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryPage;