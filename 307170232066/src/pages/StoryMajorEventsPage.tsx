import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

// 定义重大事件类型
interface MajorEvent {
  id: string;
  title: string;
  time: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  icon: string;
}

const StoryMajorEventsPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  // 重大事件数据
  const majorEvents: MajorEvent[] = [
    {
      id: 'event-1',
      title: '光明大陆的诞生',
      time: '创世之初',
      description: '在宇宙诞生的混沌之中，两股强大的力量相互交织——光明与暗影。它们既相互对立，又相互依存，共同维持着宇宙的平衡。在这两股力量的交汇处，诞生了一片美丽的世界——光明大陆。',
      importance: 'high',
      icon: 'fa-globe'
    },
    {
      id: 'event-2',
      title: '守护者的出现',
      time: '远古时代',
      description: '光明大陆诞生的同时，从世界本源之力中自然孕育出了两位守护者——清鸢与宿槐。她们本为同源一体，如同双生姐妹，清鸢代表着光明与生命，宿槐代表着自然与平衡。',
      importance: 'high',
      icon: 'fa-user-shield'
    },
    {
      id: 'event-3',
      title: '人类文明的崛起',
      time: '古代时期',
      description: '随着时间的推移，人类文明逐渐发展壮大。他们开始在光明大陆上建立自己的家园，发展出独特的文化和魔法体系。人类与自然和谐相处，受到守护者的祝福。',
      importance: 'medium',
      icon: 'fa-city'
    },
    {
      id: 'event-4',
      title: '环境失衡与宿槐的质疑',
      time: '近代早期',
      description: '人类开始过度开发自然，砍伐森林，污染河流，破坏了大陆的生态平衡。宿槐对此感到无比痛心，多次向人类发出警告，但都被置若罔闻。她开始质疑自己守护人类的意义。',
      importance: 'high',
      icon: 'fa-exclamation-triangle'
    },
    {
      id: 'event-5',
      title: '宿槐的堕落',
      time: '近代中期',
      description: '在无尽的痛苦与愤怒中，宿槐的内心逐渐被黑暗所吞噬。她改名为宿槐，决心用自己的方式守护这个世界——即使那意味着要与姐姐为敌。宿槐成为了暗影女王，率领着暗影大军开始了对光明大陆的入侵。',
      importance: 'high',
      icon: 'fa-ghost'
    },
    {
      id: 'event-6',
      title: '徐清岚的到来',
      time: '现代初期',
      description: '来自异世界的魔法少女徐清岚，在古老的魔法阵中启动了传送咒语，穿越到了光明大陆。她的到来为这场光暗之战带来了新的变数。',
      importance: 'high',
      icon: 'fa-wand-magic-sparkles'
    },
    {
      id: 'event-7',
      title: '善•猫教主的救赎',
      time: '现代中期',
      description: '清鸢用光明之力净化了被黑暗侵蚀的小猫，赋予它全新的生命形态。重生后的小猫获得了更加强大的光明之力，它决定用这份力量来弥补自己过去的过错，成为了善•猫教主。',
      importance: 'medium',
      icon: 'fa-cat'
    },
    {
      id: 'event-8',
      title: '星界之门的危机',
      time: '现代后期',
      description: '在季灾的精心策划下，徐清岚（暗）带着暗影大军突然出现在星界山顶，发动了对青玄的突袭。尽管青玄展现出了惊人的实力，但最终还是因为寡不敌众而坠落，星界之门的平衡被打破。',
      importance: 'high',
      icon: 'fa-gate-open'
    },
    {
      id: 'event-9',
      title: '徐清岚的觉醒',
      time: '当代',
      description: '在与宿槐的最终决战中，徐清岚为了保护清鸢和善•猫教主，激发了体内沉睡的星界之力，完成了前所未有的神化觉醒。神化后的徐清岚获得了无与伦比的力量，成为了对抗暗影的关键。',
      importance: 'high',
      icon: 'fa-star'
    },
    {
      id: 'event-10',
      title: '明渊的秘密',
      time: '当代',
      description: '在光明大陆的最边缘，有一个被称为"明渊"的神秘地方。这里是光明与暗影的交汇之处，也是通往星界之门的最后关键。一个名为慕容言风的神秘人类居住在这里，他的存在为光暗之战增添了更多变数。',
      importance: 'medium',
      icon: 'fa-mountain'
    }
  ];
  
  // 过滤事件
  const filteredEvents = activeFilter === 'all' 
    ? majorEvents 
    : majorEvents.filter(event => event.importance === activeFilter);
  
  // 获取事件重要性样式
  const getImportanceClass = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-900/50 text-red-400';
      case 'medium':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'low':
        return 'bg-green-900/50 text-green-400';
      default:
        return 'bg-gray-700/50 text-gray-400';
    }
  };
  
  // 获取时间线图标样式
  const getTimelineIconClass = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-500 text-white border-red-400';
      case 'medium':
        return 'bg-yellow-500 text-white border-yellow-400';
      case 'low':
        return 'bg-green-500 text-white border-green-400';
      default:
        return 'bg-gray-500 text-white border-gray-400';
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} text-gray-900 dark:text-white transition-colors duration-300 p-4 relative overflow-hidden`}>
      {/* 背景动态光效 */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-indigo-500/5 rounded-full blur-3xl"
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
            onClick={() => navigate(-1)}
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            重大事件
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            探索游戏中发生的重大事件时间线，了解光明与暗影之战的关键转折点和重要历史事件。
          </p>
        </motion.div>
      </header>
      
      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto pb-16 relative z-10">
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            所有事件
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeFilter === 'high' ? 'bg-red-900/50 text-red-400' : 'bg-red-900/20 text-red-400/70 hover:bg-red-900/50 hover:text-red-400'
            }`}
            onClick={() => setActiveFilter('high')}
          >
            <i className="fa-solid fa-exclamation-circle mr-1"></i>重要事件
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeFilter === 'medium' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-900/20 text-yellow-400/70 hover:bg-yellow-900/50 hover:text-yellow-400'
            }`}
            onClick={() => setActiveFilter('medium')}
          >
            <i className="fa-solid fa-circle-info mr-1"></i>一般事件
          </button>
        </div>
        
        {/* 时间线 */}
        <div className="relative">
          {/* 中央线 */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 transform md:-translate-x-1/2"></div>
          
          {/* 事件列表 */}
          <div className="space-y-12">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* 时间线图标 */}
                <div className="absolute left-0 md:left-1/2 top-0 transform -translate-y-1/2 md:-translate-x-1/2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTimelineIconClass(event.importance)} border-4 border-gray-800 shadow-lg`}>
                    <i className={`fa-solid ${event.icon} text-sm`}></i>
                  </div>
                </div>
                
                {/* 左侧内容 (偶数行) / 右侧内容 (奇数行) */}
                <div className={`flex-1 md:pr-12 ${index % 2 === 0 ? 'md:text-right md:pr-12 md:pl-0' : 'md:pl-12 md:pr-0'} mt-6 md:mt-0`}>
                  <div className={`inline-block mb-2 text-xs font-medium px-2 py-0.5 rounded-full ${getImportanceClass(event.importance)}`}>
                    {event.time}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{event.title}</h2>
                  <p className="text-gray-300">{event.description}</p>
                </div>
                
                {/* 右侧空间 (偶数行) / 左侧空间 (奇数行) */}
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* 历史地图 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden"
        >
          {/* 装饰元素 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-xl font-bold mb-4 text-white flex items-center relative z-10">
            <i className="fa-solid fa-map-location-dot text-blue-400 mr-2"></i>
            光明大陆历史地图
          </h2>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500 text-center p-8">
                <i className="fa-solid fa-map-location-dot text-4xl mb-4"></i>
                <p>光明大陆地图正在加载中...</p>
                <p className="text-sm mt-2">显示重大事件发生的地理位置</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            此地图展示了光明大陆的主要区域和重大事件发生的地理位置。随着您探索更多剧情，地图将逐渐解锁更多区域和细节。
          </p>
        </motion.div>
        
        {/* 历史人物关系图 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-8 bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden"
        >
          {/* 装饰元素 */}
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-xl font-bold mb-4 text-white flex items-center relative z-10">
            <i className="fa-solid fa-network-wired text-purple-400 mr-2"></i>
            主要人物关系
          </h2>
          <div className="aspect-square md:aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500 text-center p-8">
                <i className="fa-solid fa-users text-4xl mb-4"></i>
                <p>人物关系图正在加载中...</p>
                <p className="text-sm mt-2">展示主要角色之间的关联</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800/90 backdrop-blur-sm text-gray-300 py-6 text-center relative z-10 border-t border-gray-700">
        <p>© 2025 光明与暗影之战 - 历史大事件</p>
      </footer>
    </div>
  );
};

export default StoryMajorEventsPage;