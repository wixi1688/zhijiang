import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

// 定义介绍分类类型
interface IntroductionCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const StoryIntroductionPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('world');
  
  // 介绍分类
  const categories: IntroductionCategory[] = [
    {
      id: 'world',
      title: '世界观',
      description: '了解光明大陆与暗影世界的起源、地理环境和生态系统',
      icon: 'fa-globe-asia',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'characters',
      title: '主要角色',
      description: '深入了解游戏中重要角色的背景故事和性格特点',
      icon: 'fa-users',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'magic',
      title: '魔法体系',
      description: '探索游戏中独特的魔法体系和技能设定',
      icon: 'fa-wand-sparkles',
      color: 'from-amber-600 to-orange-600'
    },
    {
      id: 'history',
      description: '了解光明与暗影之间的历史冲突和重要战役',
      icon: 'fa-book',
      color: 'from-green-600 to-teal-600',
      title: '历史冲突'
    },
    {
      id: 'locations',
      title: '重要地点',
      description: '探索光明大陆上的关键地点和它们的重要性',
      icon: 'fa-map-marker-alt',
      color: 'from-red-600 to-rose-600'
    },
    {
      id: 'organizations',
      title: '势力组织',
      description: '了解光明大陆上的各种势力和组织',
      icon: 'fa-landmark',
      color: 'from-indigo-600 to-violet-600'
    }
  ];

  // 获取标签样式
  const getTabClass = (tabId: string) => {
    return tabId === activeTab 
      ? 'bg-gray-800 text-white' 
      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white';
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} text-gray-900 dark:text-white transition-colors duration-300 p-4 relative overflow-hidden`}>
      {/* 背景动态光效 */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-pink-500/5 rounded-full blur-3xl"
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            相关介绍
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            深入了解游戏世界的设定、角色背景和世界观介绍，探索光明与暗影之战的精彩细节。
          </p>
        </motion.div>
      </header>
      
      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto pb-16 relative z-10">
        {/* 介绍分类标签页 */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {categories.map(category => (
            <motion.button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${getTabClass(category.id)}`}
              onClick={() => setActiveTab(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fa-solid ${category.icon} mr-1.5`}></i>
              {category.title}
            </motion.button>
          ))}
        </div>
        
        {/* 内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧内容 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden h-full"
          >
            {/* 装饰元素 */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            {/* 标题 */}
            <h2 className="text-2xl font-bold text-white mb-4 relative z-10 flex items-center">
              {categories.find(c => c.id === activeTab) && (
                <>
                  <i className={`fa-solid ${categories.find(c => c.id === activeTab)?.icon} text-purple-400 mr-2`}></i>
                  {categories.find(c => c.id === activeTab)?.title}
                </>
              )}
            </h2>
            
            {/* 内容 */}
            <div className="space-y-4 relative z-10">
              {activeTab === 'world' && (
                <>
                  <h3 className="text-xl font-semibold text-purple-400">世界起源</h3>
                  <p className="text-gray-300">
                    在宇宙诞生的混沌之中，两股强大的力量相互交织——光明与暗影。它们既相互对立，又相互依存，共同维持着宇宙的平衡。在这两股力量的交汇处，诞生了一片美丽的世界——光明大陆。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">地理环境</h3>
                  <p className="text-gray-300">
                    光明大陆由多个不同的区域组成，包括茂密的精灵森林、广阔的人类王国、神秘的星界山脉、危险的暗影边界等。每个区域都有其独特的生态系统和居民。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">生态系统</h3>
                  <p className="text-gray-300">
                    光明大陆的生态系统丰富多样，包括各种神奇的植物和生物。这些生物与环境和谐共生，形成了复杂而稳定的生态链。然而，随着暗影力量的侵蚀，这一平衡正在被打破。
                  </p>
                </>
              )}
              
              {activeTab === 'characters' && (
                <>
                  <h3 className="text-xl font-semibold text-purple-400">主要角色介绍</h3>
                  <p className="text-gray-300">
                    光明与暗影之战中涌现出许多重要角色，他们各自有着独特的背景故事和动机。清鸢代表着光明与生命，宿槐代表着自然与平衡（后来堕落为暗影女王），徐清岚是来自异世界的魔法少女，还有善•猫教主、青玄、慕容言风等众多角色。
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-pink-400 mb-2">清鸢</div>
                      <p className="text-sm text-gray-400">光明大陆的守护者，代表光明与生命的力量。她温柔善良，始终相信生命的美好。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-red-400 mb-2">宿槐</div>
                      <p className="text-sm text-gray-400">曾经是清鸢的妹妹，现在的暗影女王。她对人类失望，决心用自己的方式守护世界。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-purple-400 mb-2">徐清岚</div>
                      <p className="text-sm text-gray-400">来自异世界的魔法少女，拥有强大的魔法天赋。她的到来为光暗之战带来了新的变数。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-blue-400 mb-2">善•猫教主</div>
                      <p className="text-sm text-gray-400">被清鸢净化的小猫，获得了光明之力。它决定用这份力量来弥补自己过去的过错。</p>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'magic' && (
                <>
                  <h3 className="text-xl font-semibold text-purple-400">魔法体系</h3>
                  <p className="text-gray-300">
                    光明大陆的魔法体系主要分为光明魔法、暗影魔法、自然魔法和元素魔法四大类。每种魔法都有其独特的特点和用途。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">光明魔法</h3>
                  <p className="text-gray-300">
                    光明魔法是最纯净的魔法能量，主要用于治疗、净化和保护。清鸢是光明魔法的代表人物。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">暗影魔法</h3>
                  <p className="text-gray-300">
                    暗影魔法是黑暗的能量，主要用于破坏、腐蚀和控制。宿槐是暗影魔法的代表人物。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">自然魔法</h3>
                  <p className="text-gray-300">
                    自然魔法是与自然力量共鸣的魔法，主要用于操控植物、动物和天气。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">元素魔法</h3>
                  <p className="text-gray-300">
                    元素魔法是操控基本元素（火、水、风、土）的魔法，具有强大的攻击力和防御力。
                  </p>
                </>
              )}
              
              {activeTab === 'history' && (
                <>
                  <h3 className="text-xl font-semibold text-purple-400">历史冲突</h3>
                  <p className="text-gray-300">
                    光明与暗影之间的冲突由来已久。从最初的平衡共存，到后来的对立冲突，这段历史充满了曲折和悲剧。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">早期平衡</h3>
                  <p className="text-gray-300">
                    在远古时代，光明与暗影力量保持着相对平衡的状态。清鸢和宿槐作为守护者，共同维护着光明大陆的和平与繁荣。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">人类的崛起</h3>
                  <p className="text-gray-300">
                    随着人类文明的发展，他们开始过度开发自然，破坏了大陆的生态平衡。这引起了宿槐的不满和愤怒。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">宿槐的堕落</h3>
                  <p className="text-gray-300">
                    在无尽的痛苦与愤怒中，宿槐的内心逐渐被黑暗所吞噬。她成为了暗影女王，率领着暗影大军开始了对光明大陆的入侵。
                  </p>
                  
                  <h3 className="text-xl font-semibold text-purple-400 mt-6">现代战争</h3>
                  <p className="text-gray-300">
                    当前的光暗之战已经持续了数百年，双方互有胜负。徐清岚的到来为这场战争带来了新的希望。
                  </p>
                </>
              )}
              
              {activeTab === 'locations' && (
                <>
                  <h3 className="text-xl font-semibold text-purple-400">重要地点</h3>
                  <p className="text-gray-300">
                    光明大陆上有许多重要的地点，它们在光暗之战中发挥着关键作用。
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-green-400 mb-2">精灵森林</div>
                      <p className="text-sm text-gray-400">清鸢和宿槐的诞生地，也是自然魔法最强大的地方。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-red-400 mb-2">暗影边界</div>
                      <p className="text-sm text-gray-400">光明大陆与暗影世界的交界处，是暗影大军入侵的主要通道。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-blue-400 mb-2">星界山脉</div>
                      <p className="text-sm text-gray-400">光明大陆最高的山脉，山顶有通往星界之门的入口。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-purple-400 mb-2">明渊</div>
                      <p className="text-sm text-gray-400">光明大陆的边缘地带，是光明与暗影的交汇之处，住着神秘的慕容言风。</p>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'organizations' && (
                <>
                  <h3 className="text-xl font-semibold text-purple-400">势力组织</h3>
                  <p className="text-gray-300">
                    光明大陆上存在着许多不同的势力和组织，它们在光暗之战中扮演着不同的角色。
                  </p>
                  
                  <div className="space-y-4 mt-4">
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-blue-400 mb-2">光明守护者</div>
                      <p className="text-sm text-gray-400">由清鸢领导的组织，致力于保护光明大陆免受暗影力量的侵蚀。成员包括各种光明生物和正义的人类。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-red-400 mb-2">暗影军团</div>
                      <p className="text-sm text-gray-400">由宿槐领导的黑暗军队，由各种被暗影侵蚀的生物组成。他们的目标是将整个光明大陆置于暗影的统治之下。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-yellow-400 mb-2">人类王国</div>
                      <p className="text-sm text-gray-400">光明大陆上的人类城邦联盟，在光暗之战中保持中立，但近年来逐渐倾向于支持光明守护者。</p>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                      <div className="text-lg font-semibold text-green-400 mb-2">精灵议会</div>
                      <p className="text-sm text-gray-400">由森林精灵组成的古老组织，负责守护精灵森林和自然平衡。</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
          
          {/* 右侧内容 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            {/* 相关图片展示 */}
            <div className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden">
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
              
              <h2 className="text-xl font-bold text-white mb-4 relative z-10 flex items-center">
                <i className="fa-solid fa-images text-pink-400 mr-2"></i>
                相关视觉
              </h2>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="rounded-lg overflow-hidden aspect-square">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=ancient%20fantasy%20world%20landscape%20anime%20style%20beautiful%20nature%20scenery%20forest%20mountain%20castle&sign=2e82ef7c0872d4bf587b6a613077879d" 
                    alt="光明大陆风景" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden aspect-square">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=dark%20fantasy%20world%20shadow%20landscape%20anime%20style%20mystical%20atmosphere%20gloomy%20forest%20purple%20sky&sign=1e950066114357cbc3cb5c156e0f0635" 
                    alt="暗影世界" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            
            {/* 相关角色快速链接 */}
            <div className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
              
              <h2 className="text-xl font-bold text-white mb-4 relative z-10 flex items-center">
                <i className="fa-solid fa-user-friends text-purple-400 mr-2"></i>
                主要角色快速链接
              </h2>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center p-3 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-purple-700 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 mr-3">
                    <i className="fa-solid fa-user-shield"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">清鸢</div>
                    <div className="text-xs text-gray-400">光明守护者</div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300">
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-red-700 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center text-red-400 mr-3">
                    <i className="fa-solid fa-ghost"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">宿槐</div>
                    <div className="text-xs text-gray-400">暗影女王</div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300">
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-purple-700 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center text-purple-400 mr-3">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">徐清岚</div>
                    <div className="text-xs text-gray-400">魔法少女</div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300">
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-blue-700 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 mr-3">
                    <i className="fa-solid fa-cat"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">善•猫教主</div>
                    <div className="text-xs text-gray-400">光明使者</div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300">
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
            
            {/* 重要概念 */}
            <div className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden">
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              
              <h2 className="text-xl font-bold text-white mb-4 relative z-10 flex items-center">
                <i className="fa-solid fa-lightbulb text-yellow-400 mr-2"></i>
                重要概念
              </h2>
              
              <div className="flex flex-wrap gap-2 relative z-10">
                <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">光明之力</span>
                <span className="px-3 py-1 bg-red-900/30 text-red-300 rounded-full text-sm">暗影之力</span>
                <span className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">自然平衡</span>
                <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm">魔法能量</span>
                <span className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-sm">命运之轮</span>
                <span className="px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-sm">星界之门</span>
                <span className="px-3 py-1 bg-pink-900/30 text-pink-300 rounded-full text-sm">时间法则</span>
                <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-sm">空间扭曲</span>
                <span className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-sm">元素之力</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* 补充说明 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden"
        >
          {/* 装饰元素 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-xl font-bold mb-4 text-white flex items-center relative z-10">
            <i className="fa-solid fa-info-circle text-yellow-400 mr-2"></i>
            探索提示
          </h2>
          <ul className="space-y-3 text-gray-300 relative z-10">
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>随着游戏的进行，您将解锁更多的剧情内容和角色背景故事</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>完成特定任务或收集特殊物品可以解锁隐藏的剧情内容</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>与NPC对话可以获取更多关于游戏世界的信息和背景故事</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>探索游戏中的各个角落，您可能会发现一些隐藏的历史痕迹和线索</span>
            </li>
          </ul>
        </motion.div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800/90 backdrop-blur-sm text-gray-300 py-6 text-center relative z-10 border-t border-gray-700">
        <p>© 2025 光明与暗影之战 - 世界观介绍</p>
      </footer>
    </div>
  );
};

export default StoryIntroductionPage;