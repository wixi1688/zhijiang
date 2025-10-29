import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZOMBIES_CONFIG as GAME_ZOMBIES_CONFIG, zombieImages } from '../data/gameData';

// 自定义cn工具函数，用于条件性组合类名
const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

  // 定义僵尸类型
    type ZombieType = 'su_huai' | 'cat_leader' | 'ji_zai' | 'li_huo' | 'vexithra' | 'xuqinglan_dark' | 'xia' | 'alibi' | 'qiuyue' | 'shantao' | 'xian' | 'shilie_lingxi' | 'longzunjiyan' | 'xingtianzhenyang' | 'xuanye';

// 僵尸配置接口
interface ZombieConfig {
  name: string;
  health: number;
  speed: number;
  damage: number;
  reward?: number;
  armor?: number;
  specialAbility?: string;
  description: string;
  difficulty: string;
  weakness: string[];
  category: string;
  type: 'normal' | 'tank' | 'fast' | 'flying' | 'special'; // 新增：僵尸类型
}

  // 为选择屏幕提供本地配置，同时保持与游戏数据一致
  const SELECTION_ZOMBIES_CONFIG: Record<ZombieType, ZombieConfig> = {
    su_huai: {
      ...GAME_ZOMBIES_CONFIG.su_huai,
    // 保持与游戏数据一致的名称
      name: "宿槐"
    },
    cat_leader: {
      ...GAME_ZOMBIES_CONFIG.cat_leader,
      // 保持选择屏幕显示的名称不变以避免混淆
      name: "猫教主"
    },
    ji_zai: {
      ...GAME_ZOMBIES_CONFIG.ji_zai,
      name: "季灾"
    },
    li_huo: {
      ...GAME_ZOMBIES_CONFIG.li_huo,
      name: "离火"
    },
    vexithra: {
      ...GAME_ZOMBIES_CONFIG.vexithra,
      name: "Vexithra"
    },
    xuqinglan_dark: {
      ...GAME_ZOMBIES_CONFIG.xuqinglan_dark,
      name: "徐清岚（暗）"
    },
     xia: {
       ...GAME_ZOMBIES_CONFIG.xia,
       name: "霞"
     },
      alibi: {
        ...GAME_ZOMBIES_CONFIG.alibi,
        name: "Alibi"
      },
       qiuyue: {
        ...GAME_ZOMBIES_CONFIG.qiuyue,
        name: "秋月"
      },
      shantao: {
        ...GAME_ZOMBIES_CONFIG.shantao,
        name: "山桃"
      },
      shilie_lingxi: {
        ...GAME_ZOMBIES_CONFIG.shilie_lingxi,
        name: "时裂·灵汐"
      }
,
      longzunjiyan: {
        ...GAME_ZOMBIES_CONFIG.longzunjiyan,
      name: "龙尊忌炎"
    },
    xingtianzhenyang: {
      ...GAME_ZOMBIES_CONFIG.xingtianzhenyang,
      name: "刑天真阳"
    },
    xuanye: {
      ...GAME_ZOMBIES_CONFIG.xuanye,
      name: "玄夜"
    }
   } as Record<ZombieType, ZombieConfig>;

interface ZombieSelectionScreenProps {
  onConfirm: (selectedZombies: ZombieType[]) => void;
  onCancel: () => void;
  isHighIntensity?: boolean;
}

export default function ZombieSelectionScreen({ onConfirm, onCancel, isHighIntensity = false }: ZombieSelectionScreenProps) {
  const [selectedZombies, setSelectedZombies] = useState<ZombieType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [showZombieDetails, setShowZombieDetails] = useState<ZombieType | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 获取所有僵尸分类
  const categories = ['全部'];
  
  // 过滤僵尸
  const filteredZombies = Object.entries(SELECTION_ZOMBIES_CONFIG).filter(([_, zombie]) => {
    if (!zombie) return false; // 添加安全检查
    const matchesCategory = selectedCategory === '全部' || zombie.category === selectedCategory;
    const matchesSearch = zombie.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         zombie.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 选择/取消选择僵尸 - 使用console.log替代toast提示
  const toggleZombieSelection = (zombieType: ZombieType) => {
    if (selectedZombies.includes(zombieType)) {
      setSelectedZombies(selectedZombies.filter(type => type !== zombieType));
      console.log(`已取消选择 ${SELECTION_ZOMBIES_CONFIG[zombieType].name}`);
    } else {
      // 检查选择数量上限
      if (selectedZombies.length >= 8) {
        console.log('最多只能选择8种僵尸！');
        return;
      }
      setSelectedZombies([...selectedZombies, zombieType]);
      console.log(`已选择 ${SELECTION_ZOMBIES_CONFIG[zombieType].name}`);
    }
  };

  // 确认选择 - 使用console.log替代toast提示
  const confirmSelection = () => {
    if (selectedZombies.length < 3) {
      console.log('请至少选择3种僵尸！');
      return;
    }
    onConfirm(selectedZombies);
  };

  // 根据难度获取对应的样式
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return 'bg-green-500';
      case '中等': return 'bg-yellow-500';
      case '较难': return 'bg-orange-500';
      case '极难': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // 重置选择 - 使用console.log替代toast提示
  const resetSelection = () => {
    setSelectedZombies([]);
    console.log('已重置僵尸选择');
  };

  // 动画变体
   // 使用CSS过渡替代motion组件的变体
  
   // 直接在CSS类中使用过渡效果

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-30 flex flex-col items-center justify-start p-4 overflow-y-auto">
      {/* 顶部导航 */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <button 
          onClick={onCancel}
          className="text-white text-xl hover:text-red-400 transition-colors duration-200"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
         <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400">
            {isHighIntensity ? '高强度自定义关卡 - 选择出场僵尸' : '选择出场僵尸'}
          </h2>
          <p className="text-gray-400">
            自定义关卡 - 选择后将开始游戏
            {isHighIntensity && ' (僵尸属性将获得全面增强)'}
          </p>
        </div>
        
        <div className="w-6"></div> {/* 占位元素，保持平衡 */}
      </div>

       {/* 选择计数提示 */}
      <div className={`w-full max-w-5xl rounded-lg p-4 mb-6 ${
        isHighIntensity ? 'bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-800' : 'bg-gray-800'
      }`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <i className={`fa-solid ${isHighIntensity ? 'fa-fire text-red-400' : 'fa-skull text-red-400'} mr-2`}></i>
            <span className="text-white">已选择 {selectedZombies.length} 种僵尸</span>
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${
            selectedZombies.length >= 3 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {selectedZombies.length < 3 ? `${3 - selectedZombies.length} 种僵尸才能开始` : '可以开始战斗了！'}
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(selectedZombies.length / 8 * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={cn("h-2 rounded-full", {
              "bg-red-500": selectedZombies.length < 3,
              "bg-yellow-500": selectedZombies.length >= 3 && selectedZombies.length < 6,
              "bg-green-500": selectedZombies.length >= 6
            })}
          ></motion.div>
        </div>
        
        {/* 选择提示 */}
        <div className="text-xs text-gray-400 mt-2 flex justify-between">
          <span>至少选择3种僵尸</span>
          <span>最多选择8种僵尸</span>
        </div>
        
        {/* 高强度模式提示 */}
        {isHighIntensity && (
          <div className="flex items-center mt-2 text-xs text-orange-400">
            <i className="fa-solid fa-exclamation-triangle mr-1"></i>
            <span>高强度模式下，僵尸属性将获得全面增强</span>
          </div>
        )}
      </div>

      {/* 已选择的僵尸预览 */}
      {selectedZombies.length > 0 && (
        <div className="w-full max-w-5xl mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white flex items-center">
              <i className="fa-solid fa-check-circle text-green-400 mr-2"></i>
              已选择的僵尸
            </h3>
            <button 
              onClick={resetSelection}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
            >
              <i className="fa-solid fa-rotate-left mr-1"></i> 重置选择
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedZombies.map((zombieType, index) => (
              <motion.div
                key={zombieType}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center bg-gray-800 rounded-full px-3 py-1"
              >
                <img 
                  src={zombieImages[zombieType]} 
                  alt={SELECTION_ZOMBIES_CONFIG[zombieType].name} 
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-white text-sm">{SELECTION_ZOMBIES_CONFIG[zombieType].name}</span>
                <button 
                  onClick={() => toggleZombieSelection(zombieType)}
                  className="ml-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <i className="fa-solid fa-times-circle"></i>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 搜索和分类筛选 */}
      <div className="w-full max-w-5xl mb-6">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="搜索僵尸..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
          />
          <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <i className="fa-solid fa-times-circle"></i>
            </button>
          )}
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 僵尸列表 */}
       <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
         {filteredZombies.map(([zombieType, zombie]) => {
          const isSelected = selectedZombies.includes(zombieType as ZombieType);
          return (
            <div 
              key={zombieType}
              className={`bg-gradient-to-br ${isSelected ? 'from-red-900/50 to-red-800/20' : 'from-gray-900/50 to-gray-800/20'} rounded-xl overflow-hidden shadow-lg border ${isSelected ? 'border-red-500' : 'border-gray-700'} flex flex-col h-full transition-all duration-300 hover:scale-103 hover:shadow-[0_20px_25px_-5px_rgba(220,20,60,0.3)] hover:z-10`}
              onClick={() => toggleZombieSelection(zombieType as ZombieType)}
            >
                <div className="h-32 overflow-hidden relative">
                  <img 
                    src={zombieImages[zombieType as ZombieType]} 
                    alt={zombie.name} 
                    className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getDifficultyClass(zombie.difficulty)} shadow-md`}>
                    {zombie.difficulty}
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-red-600 text-white shadow-md">
                      已选择
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
                <div className="p-3 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-bold text-white">{zombie.name}</h3>
                    <span className="bg-yellow-500 text-black font-bold px-2 py-1 rounded-full flex items-center">
                      <i className="fa-solid fa-sun mr-1"></i> {zombie.reward || 0}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs mb-2 line-clamp-2 flex-grow">{zombie.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-800/80 p-2 rounded-lg">
                      <span className="text-gray-400 block">生命值</span>
                      <span className="font-bold text-white">{zombie.health}</span>
                    </div>
                    <div className="bg-gray-800/80 p-2 rounded-lg">
                       <span className="text-gray-400 block">移动速度</span>
                       <span className="font-bold text-white">{typeof zombie.speed === 'number' ? zombie.speed.toFixed(1) : '未知'}</span>
                     </div>
                    <div className="bg-gray-800/80 p-2 rounded-lg">
                      <span className="text-gray-400 block">攻击力</span>
                      <span className="font-bold text-white">{zombie.damage}</span>
                    </div>
                    {zombie.armor && (
                      <div className="bg-gray-800/80 p-2 rounded-lg">
                        <span className="text-gray-400 block">护甲值</span>
                        <span className="font-bold text-white">{zombie.armor}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowZombieDetails(zombieType as ZombieType)}
                    className="mt-3 w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-medium py-1.5 rounded-lg transition-all duration-300 text-sm flex items-center justify-center"
                  >
                    <i className="fa-solid fa-info-circle mr-1"></i> 查看详情
                  </button>
                </div>
            </div>
          );
        })}
      </div>

      {/* 确认按钮 */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={confirmSelection}
        disabled={selectedZombies.length < 3}
        className={`w-full max-w-5xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg mb-8 ${
          selectedZombies.length < 3 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-red-500/30'
        }`}
      >
         <div className="flex items-center justify-center">
           <i className={`fa-solid ${isHighIntensity ? 'fa-bolt text-orange-300' : 'fa-play-circle'} mr-2 text-xl`}></i>
           {isHighIntensity ? '准备释放强化僵尸大军！' : '确认选择并开始战斗'}
         </div>
      </motion.button>

       {/* 僵尸详情模态框 */}
      {showZombieDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4 opacity-100 transition-opacity duration-300"
          onClick={() => setShowZombieDetails(null)}
        >
          <div
            className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transform translate-y-0 opacity-100 transition-all duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowZombieDetails(null)}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 z-10"
            >
              <i className="fa-solid fa-times"></i>
            </button>
            
            {/* 详细内容 */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* 左侧图片 */}
                <div className="w-full md:w-1/3">
                  <div className="relative overflow-hidden rounded-xl aspect-square">
                     <img 
                       src={zombieImages[showZombieDetails]} 
                      alt={SELECTION_ZOMBIES_CONFIG[showZombieDetails].name} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getDifficultyClass(SELECTION_ZOMBIES_CONFIG[showZombieDetails].difficulty)} shadow-md`}>
                      {SELECTION_ZOMBIES_CONFIG[showZombieDetails].difficulty}
                    </div>
                  </div>
                </div>
                
                {/* 右侧详情 */}
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl font-bold text-red-400 mb-4">{SELECTION_ZOMBIES_CONFIG[showZombieDetails].name}</h2>
                   
                   <div className="mb-6">
                     <div className={`relative transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-24'}`}>
                       <p className="text-gray-300">{SELECTION_ZOMBIES_CONFIG[showZombieDetails].description}</p>
                       
                       {/* 渐变遮罩 - 仅在收起状态显示 */}
                       {!isExpanded && (
                         <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800 via-gray-800/80 to-transparent"></div>
                       )}
                     </div>
                     
                     {/* 展开/收起按钮 */}
                     <motion.button
                       onClick={() => setIsExpanded(!isExpanded)}
                       className="mt-2 mx-auto block px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium rounded-full shadow-lg transition-all duration-300 flex items-center text-sm"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <i className={`fa-solid mr-1 ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                       {isExpanded ? '收起简介' : '展开阅读更多'}
                     </motion.button>
                   </div>
                   
                  {/* 基本属性 */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <span className="text-gray-400 block text-sm">生命值</span>
                      <span className="font-bold text-white text-lg">{SELECTION_ZOMBIES_CONFIG[showZombieDetails].health}</span>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <span className="text-gray-400 block text-sm">移动速度</span>
                      <span className="font-bold text-white text-lg">{SELECTION_ZOMBIES_CONFIG[showZombieDetails].speed.toFixed(1)}</span>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <span className="text-gray-400 block text-sm">攻击力</span>
                      <span className="font-bold text-white text-lg">{SELECTION_ZOMBIES_CONFIG[showZombieDetails].damage}</span>
                    </div>
                    {SELECTION_ZOMBIES_CONFIG[showZombieDetails].reward && (
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <span className="text-gray-400 block text-sm">阳光奖励</span>
                        <span className="font-bold text-white text-lg">{SELECTION_ZOMBIES_CONFIG[showZombieDetails].reward}</span>
                      </div>
                    )}
                    {SELECTION_ZOMBIES_CONFIG[showZombieDetails].armor && (
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <span className="text-gray-400 block text-sm">护甲值</span>
                        <span className="font-bold text-white text-lg">{SELECTION_ZOMBIES_CONFIG[showZombieDetails].armor}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 特殊能力 */}
                  {SELECTION_ZOMBIES_CONFIG[showZombieDetails].specialAbility && (
                    <div className="p-4 bg-purple-900/30 border border-purple-800 rounded-lg mb-6">
                      <span className="text-purple-300 font-medium flex items-center">
                        <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> 特殊能力
                      </span>
                      <p className="text-purple-200 mt-2">{SELECTION_ZOMBIES_CONFIG[showZombieDetails].specialAbility}</p>
                    </div>
                  )}
                  
                  {/* 弱点 */}
                  <div className="mb-6">
                    <span className="text-green-300 font-medium flex items-center mb-3">
                      <i className="fa-solid fa-shield-halved mr-2"></i> 弱点
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SELECTION_ZOMBIES_CONFIG[showZombieDetails].weakness.map((weakness, i) => (
                        <span key={i} className="bg-green-900/30 text-green-200 px-3 py-1.5 rounded-lg">
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 分类 */}
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">分类：</span>
                    <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                      {SELECTION_ZOMBIES_CONFIG[showZombieDetails].category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 底部装饰元素 */}
      <div className="w-full max-w-5xl h-16 flex justify-center items-center">
        <div className="text-center text-xs text-gray-500">
          <p>选择合适的僵尸组合来挑战植物防线！</p>
        </div>
      </div>
    </div>
  );
}