import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { STORY_CHAPTERS, SIDE_STORIES } from '../data/storyData';

const StoryIcon: React.FC = () => {
  const [showChapterList, setShowChapterList] = useState(false);
  // 检查是否需要添加新的故事线 - 已添加灵汐植物
  useEffect(() => {
    // 检查是否有新解锁的故事
    const checkNewStories = () => {
      // 可以在这里添加任何与故事解锁相关的逻辑
    };
    
    checkNewStories();
  }, []);
  const [storyType, setStoryType] = useState<'main' | 'side'>('main');
  const navigate = useNavigate();

  // 检查用户是否已阅读过剧情
  const hasStartedStory = localStorage.getItem('has_started_story') === 'true';
  
  // 获取用户最后阅读的章节ID
  const getLastReadChapterId = (): string => {
    // 尝试查找有阅读进度的章节
    for (const chapter of STORY_CHAPTERS) {
      const progressKey = `story_progress_${chapter.id}`;
      const progress = localStorage.getItem(progressKey);
      if (progress && parseInt(progress) > 0) {
        return chapter.id;
      }
    }
    
    // 如果没有阅读进度，返回第一个章节
    return STORY_CHAPTERS[0].id;
  };

  // 选择章节并跳转到剧情页面
  const toggleStoryViewer = (chapterId?: string, isSideStory: boolean = false) => {
    if (chapterId) {
      setShowChapterList(false);
      // 标记用户已开始阅读剧情
      localStorage.setItem('has_started_story', 'true');
      // 根据是否为番外剧情跳转到不同页面
      if (isSideStory) {
        navigate(`/side-stories?storyId=${chapterId}&isSideStory=true`);
      } else {
        navigate(`/story?chapterId=${chapterId}`);
      }
    }
  };

  // 切换章节列表显示
  const toggleChapterList = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowChapterList(!showChapterList);
  };

  // 快速继续上次阅读
  const continueReading = () => {
    const lastReadChapterId = getLastReadChapterId();
    toggleStoryViewer(lastReadChapterId);
  };

  return (
    <div className="relative">
      {/* 剧情图标 */}
      <button
        className="group relative bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg shadow-purple-900/50 flex flex-col items-center justify-center transition-all duration-300 border-2 border-purple-500/30 hover:border-purple-400"
        onClick={toggleChapterList}
        title="查看剧情"
        aria-label="查看剧情"
      >
        {/* 图标动画效果 */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* 书籍图标 */}
        <div className="relative">
          <i className="fa-solid fa-book text-2xl mb-1 group-hover:scale-110 transition-transform duration-300"></i>
          
          {/* 新书标记 */}
          {!hasStartedStory && (
            <motion.div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        
        {/* 文字标签 */}
        <span className="text-xs font-medium group-hover:text-white transition-colors duration-300">剧情</span>
        
        {/* 鼠标悬停时的效果 */}
        <div className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-30"></div>
        </div>
      </button>

      {/* 章节列表弹出菜单 */}
      <AnimatePresence>
        {showChapterList && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 z-40 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* 菜单头部 */}
             <div className="p-3 border-b border-gray-700 bg-gray-800 rounded-t-xl">
             <h3 className="text-white font-bold flex items-center">
               <i className="fa-solid fa-book mr-2 text-purple-400"></i>
               剧情选择
             </h3>
           </div>
           
           {/* 剧情类型切换选项卡 */}
           <div className="flex border-b border-gray-700 overflow-x-auto scrollbar-hide">
             <button
               className={`px-4 py-2 flex-1 text-sm font-medium transition-colors duration-200 ${storyType === 'main' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
               onClick={() => setStoryType('main')}
             >
               游戏剧情
             </button>
             <button
               className={`px-4 py-2 flex-1 text-sm font-medium transition-colors duration-200 ${storyType === 'side' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
               onClick={() => setStoryType('side')}
             >
               番外剧情
             </button>
           </div>
            
            {/* 继续阅读按钮 */}
            {hasStartedStory && (
              <motion.button
                className="w-full text-left p-3 bg-purple-900/30 border-b border-gray-700 flex items-center"
                onClick={continueReading}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(147, 51, 234, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <i className="fa-solid fa-play-circle text-purple-400 mr-3 text-xl"></i>
                <div>
                  <h4 className="text-white font-medium">继续阅读</h4>
                  <p className="text-gray-400 text-xs">上次看到的位置</p>
                </div>
              </motion.button>
            )}
            
              {/* 章节列表 */}
              <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {storyType === 'main' ? (
                  // 游戏剧情章节列表
                  STORY_CHAPTERS.map((chapter, index) => {
                    // 检查章节是否有阅读进度
                    const progressKey = `story_progress_${chapter.id}`;
                    const progress = localStorage.getItem(progressKey);
                    const hasProgress = progress && parseInt(progress) > 0;
                    const progressPercent = hasProgress ? Math.round((parseInt(progress) / chapter.content.length) * 100) : 0;
                    
                      return (
                        <motion.button
                          key={chapter.id}
                          className={`w-full text-left p-3 hover:bg-gray-800 transition-all duration-300 flex items-center ${
                            hasProgress ? 'border-l-2 border-purple-500' : ''
                          }`}
                          onClick={() => toggleStoryViewer(chapter.id)}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          aria-label={`查看章节：${chapter.title}`}
                        >
                          {/* 章节缩略图 */}
                          <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 flex-shrink-0 border border-gray-700">
                            <motion.img 
                              src={chapter.thumbnail} 
                              alt={chapter.title} 
                              className="w-full h-full object-cover"
                              loading="lazy"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          
                          {/* 章节信息 */}
                          <div className="flex-grow">
                            <h4 className="text-white font-medium line-clamp-1">{chapter.title}</h4>
                            <p className="text-gray-400 text-xs line-clamp-1">{chapter.description}</p>
                            
                            {/* 阅读进度条 */}
                            {hasProgress && (
                              <div className="mt-1">
                                <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                                  <motion.div 
                                    className="bg-purple-500 h-full rounded-full"
                                    style={{ width: `${progressPercent}%` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                  />
                                </div>
                                <div className="text-right text-xs text-gray-500 mt-0.5">{progressPercent}%</div>
                              </div>
                            )}
                          </div>
                          
                          {/* 阅读进度标记 */}
                          {hasProgress && (
                            <motion.div 
                              className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full"
                              whileHover={{ scale: 1.1 }}
                            >
                              {progressPercent}%
                            </motion.div>
                          )}
                        </motion.button>
                      );
                  })
                ) : (
                  // 番外剧情列表 - 改进版
                  <>
                    {/* 按角色类型分组显示 */}
                    <div className="px-3 py-2 bg-gray-800/70 text-xs text-gray-400">
                      按角色类型浏览
                    </div>
                    
                    {/* 植物角色番外 */}
                    <div className="mb-4">
                      <div className="px-3 py-2 bg-green-900/20 text-green-400 text-sm font-medium flex items-center">
                        <i className="fa-solid fa-seedling mr-2"></i>植物角色
                      </div>
                      
                      {SIDE_STORIES.filter(story => story.characterType === 'plant').map((story, index) => {
                        // 检查故事是否有阅读进度
                        const progressKey = `side_story_progress_${story.id}`;
                        const progress = localStorage.getItem(progressKey);
                        const hasProgress = progress && parseInt(progress) > 0;
                        const progressPercent = hasProgress ? Math.round((parseInt(progress) / story.content.length) * 100) : 0;
                        
                        return (
                          <motion.button
                            key={story.id}
                            className={`w-full text-left p-3 hover:bg-gray-800 transition-all duration-300 flex items-center ${
                              hasProgress ? 'border-l-2 border-green-500' : ''
                            }`}
                            onClick={() => toggleStoryViewer(story.id, true)}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            aria-label={`查看番外：${story.title}`}
                          >
                            {/* 角色头像 */}
                            <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-green-500/50 relative">
                              <motion.img 
                                src={story.thumbnail} 
                                alt={story.title} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                              />
                              {/* 植物标识 */}
                              <div className="absolute -top-1 -right-1 bg-green-500 text-xs px-1.5 py-0.5 rounded-full text-black font-bold">
                                <i className="fa-solid fa-leaf"></i>
                              </div>
                            </div>
                            
                            {/* 故事信息 */}
                            <div className="flex-grow">
                              <h4 className="text-white font-medium line-clamp-1">{story.title}</h4>
                              <p className="text-gray-400 text-xs line-clamp-2">{story.description}</p>
                              
                              {/* 阅读进度条 */}
                              {hasProgress && (
                                <div className="mt-1">
                                  <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                                    <motion.div 
                                      className="bg-green-500 h-full rounded-full"
                                      style={{ width: `${progressPercent}%` }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progressPercent}%` }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                  </div>
                                  <div className="text-right text-xs text-gray-500 mt-0.5">{progressPercent}%</div>
                                </div>
                              )}
                            </div>
                            
                            {/* 阅读进度标记 */}
                            {hasProgress && (
                              <motion.div 
                                className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full"
                                whileHover={{ scale: 1.1 }}
                              >
                                {progressPercent}%
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    {/* 僵尸角色番外 */}
                    <div className="mb-4">
                      <div className="px-3 py-2 bg-red-900/20 text-red-400 text-sm font-medium flex items-center">
                        <i className="fa-solid fa-skull mr-2"></i>僵尸角色
                      </div>
                      
                      {SIDE_STORIES.filter(story => story.characterType === 'zombie').map((story, index) => {
                        // 检查故事是否有阅读进度
                        const progressKey = `side_story_progress_${story.id}`;
                        const progress = localStorage.getItem(progressKey);
                        const hasProgress = progress && parseInt(progress) > 0;
                        const progressPercent = hasProgress ? Math.round((parseInt(progress) / story.content.length) * 100) : 0;
                        
                        return (
                          <motion.button
                            key={story.id}
                            className={`w-full text-left p-3 hover:bg-gray-800 transition-all duration-300 flex items-center ${
                              hasProgress ? 'border-l-2 border-red-500' : ''
                            }`}
                            onClick={() => toggleStoryViewer(story.id, true)}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            aria-label={`查看番外：${story.title}`}
                          >
                            {/* 角色头像 */}
                            <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-red-500/50 relative">
                              <motion.img 
                                src={story.thumbnail} 
                                alt={story.title} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                              />
                              {/* 僵尸标识 */}
                              <div className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 py-0.5 rounded-full text-black font-bold">
                                <i className="fa-solid fa-ghost"></i>
                              </div>
                            </div>
                            
                            {/* 故事信息 */}
                            <div className="flex-grow">
                              <h4 className="text-white font-medium line-clamp-1">{story.title}</h4>
                              <p className="text-gray-400 text-xs line-clamp-2">{story.description}</p>
                              
                              {/* 阅读进度条 */}
                              {hasProgress && (
                                <div className="mt-1">
                                  <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                                    <motion.div 
                                      className="bg-red-500 h-full rounded-full"
                                      style={{ width: `${progressPercent}%` }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progressPercent}%` }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                  </div>
                                  <div className="text-right text-xs text-gray-500 mt-0.5">{progressPercent}%</div>
                                </div>
                              )}
                            </div>
                            
                            {/* 阅读进度标记 */}
                            {hasProgress && (
                              <motion.div 
                                className="ml-2 text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full"
                                whileHover={{ scale: 1.1 }}
                              >
                                {progressPercent}%
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    {/* 未解锁的番外剧情提示 */}
                    <div className="px-3 py-4 text-center text-gray-500 text-sm">
                      <p className="flex flex-col items-center">
                        <i className="fa-solid fa-lock text-2xl mb-2"></i>
                        <span>完成更多游戏关卡解锁更多番外剧情</span>
                        <span className="mt-2 text-xs">探索每个角色不为人知的故事</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            
            {/* 菜单底部 */}
            <div className="p-3 border-t border-gray-700 bg-gray-800 rounded-b-xl flex justify-between items-center">
              <div className="text-xs text-gray-400">
                {STORY_CHAPTERS.length} 个章节
              </div>
              <button
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center"
                onClick={() => setShowChapterList(false)}
              >
                <i className="fa-solid fa-times mr-1"></i> 关闭
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

  {/* 不再需要内联的StoryViewer，已经改为页面跳转 */}
    </div>
  );
};

export default StoryIcon;