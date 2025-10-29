import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  STORY_CHAPTERS, 
  StoryCharacter,
  characterAvatars,
  characterNames,
  characterColors 
} from '../data/storyData';

interface StoryViewerProps {
  chapterId: string;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ chapterId, onClose }) => {
  const [currentChapter, setCurrentChapter] = useState(STORY_CHAPTERS.find(chapter => chapter.id === chapterId) || STORY_CHAPTERS[0]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [isDarkOverlay, setIsDarkOverlay] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [autoRead, setAutoRead] = useState(false);
  const [autoReadSpeed, setAutoReadSpeed] = useState(2000); // 默认自动阅读速度(ms)
  const typingIntervalRef = useRef<number | null>(null);
  const autoReadTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogueAreaRef = useRef<HTMLDivElement>(null);
  
  // 检查对话是否为旁白
  const isNarrator = (character: StoryCharacter) => character === 'narrator';

  // 存储阅读进度的键
  const getProgressKey = (chapterId: string) => `story_progress_${chapterId}`;

  // 加载章节并恢复阅读进度
  useEffect(() => {
    const chapter = STORY_CHAPTERS.find(chapter => chapter.id === chapterId);
    if (chapter) {
      // 尝试恢复保存的阅读进度
      const savedProgress = localStorage.getItem(getProgressKey(chapterId));
      const savedIndex = savedProgress ? parseInt(savedProgress) : 0;
      
      setCurrentChapter(chapter);
      setCurrentDialogueIndex(savedIndex);
      setDisplayText('');
      setIsTyping(false);
      setShowChoices(false);
      setShowChapterList(false);
      
      // 滚动到顶部
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [chapterId]);

  // 显示当前对话并更新阅读进度
  useEffect(() => {
    if (currentDialogueIndex < currentChapter.content.length) {
      const dialogue = currentChapter.content[currentDialogueIndex];
      typeText(dialogue.text);
      
      // 保存阅读进度
      localStorage.setItem(getProgressKey(currentChapter.id), currentDialogueIndex.toString());
      
      // 更新进度条
      setReadingProgress((currentDialogueIndex / currentChapter.content.length) * 100);
      
      // 根据角色控制深色覆盖层
      setIsDarkOverlay(!isNarrator(dialogue.character));
    }
  }, [currentChapter, currentDialogueIndex]);
  
  // 自动阅读效果
  useEffect(() => {
    if (!autoRead || isTyping || showChoices || currentDialogueIndex >= currentChapter.content.length - 1) {
      // 如果关闭了自动阅读，或正在打字，或有选项，或已是最后一段对话，则清除计时器
      if (autoReadTimeoutRef.current) {
        clearTimeout(autoReadTimeoutRef.current);
        autoReadTimeoutRef.current = null;
      }
      return;
    }
    
    // 设置自动阅读计时器
    autoReadTimeoutRef.current = window.setTimeout(() => {
      handleNext();
    }, autoReadSpeed);
    
  }, [autoRead, autoReadSpeed, isTyping, showChoices, currentDialogueIndex, currentChapter]);

  // 打字效果
  const typeText = (text: string) => {
    setIsTyping(true);
    setDisplayText('');
    setShowChoices(false);
    let currentIndex = 0;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = window.setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingIntervalRef.current as number);
        
        // 检查是否有选项
        const dialogue = currentChapter.content[currentDialogueIndex];
        if (dialogue.choices && dialogue.choices.length > 0) {
          setShowChoices(true);
        }
      }
    }, 30);
  };

  // 跳过打字效果或显示下一段对话
  const handleNext = () => {
    // 清除自动阅读计时器
    if (autoReadTimeoutRef.current) {
      clearTimeout(autoReadTimeoutRef.current);
      autoReadTimeoutRef.current = null;
    }
    
    if (isTyping) {
      clearInterval(typingIntervalRef.current as number);
      setDisplayText(currentChapter.content[currentDialogueIndex].text);
      setIsTyping(false);
      
      // 检查是否有选项
      const dialogue = currentChapter.content[currentDialogueIndex];
      if (dialogue.choices && dialogue.choices.length > 0) {
        setShowChoices(true);
      } else if (autoRead) {
        // 如果启用了自动阅读，设置下一段对话的计时器
        autoReadTimeoutRef.current = window.setTimeout(() => {
          handleNext();
        }, autoReadSpeed);
      }
    } else if (showChoices) {
      // 如果有选项，不自动跳转到下一段对话
      return;
    } else if (currentDialogueIndex < currentChapter.content.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
      
      // 滚动到对话区域
      if (dialogueAreaRef.current) {
        dialogueAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // 章节结束，提示完成并返回
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  // 选择对话选项
  const handleChoice = (nextDialogueId: string) => {
    const nextIndex = currentChapter.content.findIndex(dialogue => dialogue.id === nextDialogueId);
    if (nextIndex !== -1) {
      setCurrentDialogueIndex(nextIndex);
    } else {
      // 如果找不到指定的对话，默认显示下一段
      setCurrentDialogueIndex(prev => prev + 1);
    }
    setShowChoices(false);
  };

  // 切换章节列表
  const toggleChapterList = () => {
    setShowChapterList(!showChapterList);
  };

  // 切换到指定章节
  const switchToChapter = (chapterId: string) => {
    // 保存当前进度
    localStorage.setItem(getProgressKey(currentChapter.id), currentDialogueIndex.toString());
    
    // 加载新章节
    const newChapter = STORY_CHAPTERS.find(chapter => chapter.id === chapterId);
    if (newChapter) {
      // 尝试恢复保存的阅读进度
      const savedProgress = localStorage.getItem(getProgressKey(chapterId));
      const savedIndex = savedProgress ? parseInt(savedProgress) : 0;
      
      setCurrentChapter(newChapter);
      setCurrentDialogueIndex(savedIndex);
      setDisplayText('');
      setIsTyping(false);
      setShowChoices(false);
      setShowChapterList(false);
    }
  };

  // 清理函数
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (autoReadTimeoutRef.current) {
        clearTimeout(autoReadTimeoutRef.current);
      }
    };
  }, []);

  // 获取当前对话的角色
  const currentCharacter: StoryCharacter = currentChapter.content[currentDialogueIndex]?.character || 'narrator';

  // 获取对话角色的情感状态
  const currentEmotion = currentChapter.content[currentDialogueIndex]?.emotion || 'calm';
  
  // 获取角色对话框样式类
  const getDialogueBoxClass = (character: StoryCharacter) => {
    if (isNarrator(character)) {
      return 'bg-gray-800/90 border-gray-700 text-white';
    }
    
    const color = characterColors[character].split(' ')[1].split('-')[0];
    return `bg-${color}-900/40 border-${color}-700/60 text-white`;
  };
  
  // 获取角色名称样式类
  const getCharacterNameClass = (character: StoryCharacter) => {
    if (isNarrator(character)) {
      return 'text-gray-400';
    }
    
    return `bg-gradient-to-r ${characterColors[character]} bg-clip-text text-transparent`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* 背景图像 */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={currentChapter.thumbnail} 
          alt={currentChapter.title} 
          className="w-full h-full object-cover object-center brightness-30"
          loading="lazy"
        />
        
        {/* 动态渐变覆盖层 */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20"
          animate={{ opacity: [0.7, 0.9, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* 根据角色切换的深色覆盖层 */}
        <AnimatePresence>
          {isDarkOverlay && (
            <motion.div 
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 主要内容容器 */}
      <motion.div 
        className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
        ref={containerRef}
      >
        {/* 顶部进度条 */}
        <motion.div 
          className="h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500"
          style={{ width: `${readingProgress}%` }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* 顶部控制栏 - 增强版 */}
        <div className="bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-md p-6 border-b border-gray-800 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center">
            <button
              className="text-gray-400 hover:text-white transition-all duration-300 flex items-center mr-6 bg-gray-900/50 hover:bg-gray-800 px-5 py-2.5 rounded-full border border-gray-700 hover:border-gray-500 text-lg"
              onClick={onClose}
            >
              <i className="fa-solid fa-arrow-left mr-2 text-xl"></i> 返回
            </button>
            <h2 className="text-2xl font-bold text-white line-clamp-1 flex items-center">
              <i className="fa-solid fa-book-open text-purple-400 mr-3 text-xl"></i>
              {currentChapter.title}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 阅读进度指示器 */}
            <div className="hidden sm:flex items-center bg-gray-900/50 rounded-full px-4 py-2.5 border border-gray-700">
              <i className="fa-solid fa-clock text-blue-400 mr-2 text-xl"></i>
              <span className="text-gray-300 text-base font-medium">
                {Math.round(readingProgress)}%
              </span>
            </div>
            
            {/* 自动阅读切换按钮 */}
            <button
              className="text-gray-400 hover:text-white transition-all duration-300 flex items-center px-5 py-2.5 rounded-full border border-gray-700 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800 text-lg"
              onClick={() => setAutoRead(!autoRead)}
            >
              <i className={`fa-solid ${autoRead ? 'fa-pause' : 'fa-play'} mr-2 text-xl`}></i>
              {autoRead ? '暂停' : '自动'}
            </button>
            
            {/* 章节列表按钮 */}
            <button
              className="text-gray-400 hover:text-white transition-all duration-300 flex items-center px-5 py-2.5 rounded-full border border-gray-700 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800 text-lg"
              onClick={toggleChapterList}
            >
              <i className="fa-solid fa-list-ul mr-2 text-xl"></i> 章节
            </button>
          </div>
        </div>

        {/* 剧情内容区域 */}
        <div className="flex-grow p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900" style={{ scrollBehavior: 'smooth' }}>
          {/* 章节标题与描述 */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-3 drop-shadow-lg">
              {currentChapter.title}
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">{currentChapter.description}</p>
          </motion.div>

          {/* 角色立绘 */}
          {!isNarrator(currentCharacter) && (
            <motion.div 
              className="flex justify-center mb-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                {/* 角色立绘 */}
                <motion.img 
                  src={characterAvatars[currentCharacter]} 
                  alt={characterNames[currentCharacter]}
                  className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-white/20 shadow-2xl shadow-purple-900/20"
                  loading="lazy"
                  animate={{ 
                    y: [0, -5, 0],
                    filter: ['drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))', 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))', 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))']
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                
                {/* 角色名称标签 */}
                <div className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full font-bold ${getCharacterNameClass(currentCharacter)}`}>
                  {characterNames[currentCharacter]}
                </div>
                
                {/* 情感指示器 */}
                <motion.div 
                  className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center bg-${characterColors[currentCharacter].split(' ')[1].split('-')[0]}-500`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <i className={`fa-solid ${
                    currentEmotion === 'happy' ? 'fa-smile' :
                    currentEmotion === 'sad' ? 'fa-frown' :
                    currentEmotion === 'angry' ? 'fa-angry' :
                    currentEmotion === 'surprised' ? 'fa-surprise' :
                    'fa-meh'
                  }`}></i>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* 对话区域 */}
          <motion.div 
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            ref={dialogueAreaRef}
          >
            {/* 对话文本 - 增强版 */}
            <motion.div 
              className={`p-6 rounded-xl border ${getDialogueBoxClass(currentCharacter)} text-lg leading-relaxed shadow-xl backdrop-blur-sm min-h-[120px] relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleNext}
            >
              {/* 装饰气泡效果 */}
              {!isNarrator(currentCharacter) && (
                <div className="absolute top-0 -left-8 w-8 h-16 transform rotate-45" style={{ backgroundColor: `var(--${characterColors[currentCharacter].split(' ')[1].split('-')[0]}-900/60)`, borderTopLeftRadius: '2px' }}></div>
              )}
              
              {/* 对话文本内容 */}
              <div className="relative z-10">
                {/* 情感标签 */}
                {!isNarrator(currentCharacter) && currentEmotion && (
                  <div className={`inline-block px-2 py-1 mb-2 text-xs font-medium rounded-full ${
                    currentEmotion === 'happy' ? 'bg-yellow-900/60 text-yellow-300' :
                    currentEmotion === 'sad' ? 'bg-blue-900/60 text-blue-300' :
                    currentEmotion === 'angry' ? 'bg-red-900/60 text-red-300' :
                    currentEmotion === 'surprised' ? 'bg-purple-900/60 text-purple-300' :
                    'bg-gray-900/60 text-gray-300'
                  }`}>
                    {currentEmotion === 'happy' && '😊 开心'}
                    {currentEmotion === 'sad' && '😢 难过'}
                    {currentEmotion === 'angry' && '😠 愤怒'}
                    {currentEmotion === 'surprised' && '😮 惊讶'}
                    {currentEmotion === 'calm' && '😌 平静'}
                  </div>
                )}
                
                {/* 旁白对话样式特殊处理 */}
                {isNarrator(currentCharacter) ? (
                  <p className="italic text-gray-300 leading-relaxed">
                    {displayText}
                    {isTyping && (
                      <motion.span 
                        className="inline-block w-2 h-5 bg-white ml-1 rounded-full align-middle"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </p>
                ) : (
                  <p className="leading-relaxed">
                    {displayText}
                    {isTyping && (
                      <motion.span 
                        className="inline-block w-2 h-5 bg-white ml-1 rounded-full align-middle"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </p>
                )}
              </div>
              
              {/* 底部装饰效果 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* 点击提示效果 */}
              {!isTyping && !showChoices && currentDialogueIndex < currentChapter.content.length - 1 && (
                <motion.div 
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                  animate={{ 
                    y: [0, -5, 0],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-xs text-white/70">点击继续</div>
                  <div className="w-4 h-4 border-t-2 border-white/70 rounded-t-full mt-1"></div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* 对话选项 */}
          <AnimatePresence>
            {showChoices && (
              <motion.div 
                className="max-w-md mx-auto space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentChapter.content[currentDialogueIndex].choices?.map((choice, index) => (
                  <motion.button
                    key={index}
                    className={`w-full text-left ${
                      index === 0 
                        ? 'bg-gradient-to-r from-purple-900/90 to-indigo-900/90 hover:from-purple-800/90 hover:to-indigo-800/90 border-purple-700/80' 
                        : 'bg-gray-800/90 hover:bg-gray-700/90 border-gray-700'
                    } text-white p-4 rounded-lg border transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-900/20 hover:translate-x-1`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(choice.nextLineId)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <span className={`mr-2 ${
                      index === 0 ? 'text-purple-400' : 'text-gray-400'
                    }`}>{index + 1}.</span> {choice.text}
                    
                    {/* 装饰箭头 */}
                    <motion.span 
                      className="inline-block ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <i className={`fa-solid ${index === 0 ? 'fa-arrow-right text-purple-400' : 'fa-chevron-right text-gray-400'}`}></i>
                    </motion.span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
            {/* 进度指示器 - 增强版 */}
            <div className="max-w-2xl mx-auto mt-10 text-center text-gray-400 text-sm">
              <div className="flex items-center justify-center mb-1 space-x-4">
                <motion.button
                  className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentDialogueIndex > 0) {
                      setCurrentDialogueIndex(prev => prev - 1);
                    }
                  }}
                  disabled={currentDialogueIndex === 0}
                >
                  <i className="fa-solid fa-chevron-left mr-1"></i> 上一段
                </motion.button>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span>{currentDialogueIndex + 1} / {currentChapter.content.length}</span>
                  <div className="w-3 h-3 rounded-full bg-purple-500 ml-2"></div>
                </div>
                
                <motion.button
                  className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentDialogueIndex < currentChapter.content.length - 1) {
                      setCurrentDialogueIndex(prev => prev + 1);
                    }
                  }}
                  disabled={currentDialogueIndex === currentChapter.content.length - 1}
                >
                  下一段 <i className="fa-solid fa-chevron-right ml-1"></i>
                </motion.button>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden mt-4 shadow-inner">
                <motion.div 
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 h-full rounded-full"
                  style={{ width: `${readingProgress}%` }}
                  animate={{ width: `${readingProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <motion.div 
                  className="absolute h-full w-8 bg-white/30 blur-sm"
                  animate={{ 
                    x: [0, '100%'],
                    opacity: [0, 0.7, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5, 
                    ease: "easeInOut",
                    repeatDelay: 1
                  }}
                  style={{ pointerEvents: 'none' }}
                />
                
                {/* 完成标记 */}
                {currentDialogueIndex >= currentChapter.content.length - 1 && (
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
                      {currentChapter.id.startsWith('side-') ? '恭喜您完成了这个番外故事！' : '恭喜您完成了这个章节！'}
                    </p>
                    <p className="text-gray-400 mt-2">
                      {currentChapter.id.startsWith('side-') 
                        ? '继续探索其他角色的背景故事，了解更多光明与暗影的秘密吧！' 
                        : '下一个章节已经解锁，继续探索光明与暗影的故事吧！'
                      }
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
        </div>

         {/* 底部控制栏 - 增强版 */}
        <div className="bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-md p-4 border-t border-gray-700">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
            {/* 自动阅读速度控制 */}
            <div className="flex items-center bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-800">
              <i className="fa-solid fa-tachometer-alt text-blue-400 mr-2"></i>
              <span className="text-gray-300 text-sm mr-2">阅读速度:</span>
              <div className="flex space-x-1">
                {[1000, 1500, 2000, 2500, 3000].map((speed) => (
                  <button
                    key={speed}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      autoReadSpeed === speed 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                    onClick={() => {
                      setAutoReadSpeed(speed);
                    }}
                    title={`${speed}ms`}
                  >
                    {speed === 1000 && <i className="fa-solid fa-bolt text-xs"></i>}
                    {speed > 1000 && speed < 2000 && <i className="fa-solid fa-wind text-xs"></i>}
                    {speed === 2000 && <i className="fa-solid fa-walking text-xs"></i>}
                    {speed > 2000 && speed < 3000 && <i className="fa-solid fa-snail text-xs"></i>}
                    {speed === 3000 && <i className="fa-solid fa-hourglass-half text-xs"></i>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 进度百分比 */}
            <div className="flex items-center bg-gray-900/50 rounded-full px-3 py-2 border border-gray-800">
              <span className="text-gray-300 text-sm">
                {Math.round(readingProgress)}% 完成
              </span>
            </div>
          </div>
          
          <button
            className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg ${
              isTyping ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
            onClick={handleNext}
          >
            {isTyping ? (
              <>
                <i className="fa-solid fa-forward-fast mr-2"></i> 快速跳过
              </>
            ) : (
              <>
                {showChoices ? (
                  <>
                    <i className="fa-solid fa-hand-pointer mr-2"></i> 选择选项
                  </>
                ) : (
                  <>
                    {autoRead ? (
                      <>
                        <i className="fa-solid fa-pause mr-2"></i> 暂停自动阅读
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-chevron-right mr-2"></i> 继续阅读
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* 章节列表弹窗 */}
      <AnimatePresence>
        {showChapterList && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleChapterList}
          >
            <motion.div 
              className="relative w-full max-w-2xl max-h-[80vh] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗标题栏 */}
              <div className="bg-gradient-to-r from-purple-900 to-purple-700 p-4 text-white">
                <h2 className="text-xl font-bold flex items-center">
                  <i className="fa-solid fa-list-ul mr-2"></i> 章节列表
                </h2>
              </div>

              {/* 章节列表 */}
              <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 max-h-[calc(80vh-120px)]">
                {STORY_CHAPTERS.map((chapter, index) => {
                  // 获取章节阅读进度
                  const progressKey = getProgressKey(chapter.id);
                  const savedProgress = localStorage.getItem(progressKey);
                  const progressPercent = savedProgress 
                    ? Math.round((parseInt(savedProgress) / chapter.content.length) * 100) 
                    : 0;
                  const hasProgress = progressPercent > 0;
                  
                  return (
                    <motion.div
                      key={chapter.id}
                      className={`p-4 rounded-lg mb-3 transition-all duration-300 cursor-pointer ${
                        chapter.id === currentChapter.id 
                          ? 'bg-purple-900/50 border border-purple-700' 
                          : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                      }`}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => switchToChapter(chapter.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold mr-3">
                          {index + 1}
                        </div>
                        <h3 className={`text-lg font-bold ${
                          chapter.id === currentChapter.id 
                            ? 'text-purple-400' 
                            : 'text-white'
                        }`}>
                          {chapter.title}
                        </h3>
                        {hasProgress && (
                          <div className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">
                            {progressPercent}%
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 ml-11">{chapter.description}</p>
                      
                      {/* 显示章节阅读进度 */}
                      {hasProgress && (
                        <div className="mt-2 ml-11">
                          <div className="text-xs text-gray-500 mb-1">阅读进度</div>
                          <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                            <motion.div 
                              className="bg-purple-500 h-full rounded-full"
                              style={{ width: `${progressPercent}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* 章节缩略图预览 */}
                      <div className="mt-2 ml-11 w-20 h-12 rounded overflow-hidden border border-gray-700">
                        <img 
                          src={chapter.thumbnail} 
                          alt={chapter.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 弹窗底部 */}
              <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  共 {STORY_CHAPTERS.length} 个章节
                </div>
                <button
                  className="py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors duration-200 flex items-center"
                  onClick={toggleChapterList}
                >
                  <i className="fa-solid fa-times mr-2"></i> 关闭
                </button>
              </div>
              
              {/* 剧情收藏按钮 */}
              <motion.div 
                className="absolute bottom-4 left-4 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <button
                   className="bg-purple-700/70 hover:bg-purple-600 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center transition-all duration-300"
                   onClick={() => {
                     // 在实际应用中，这里可以实现收藏功能
                     console.log(`Chapter ${currentChapter.id} favorited`);
                     toast('已收藏此章节！');
                   }}
                >
                  <i className="fa-solid fa-heart mr-2"></i>
                  <span>收藏</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryViewer;