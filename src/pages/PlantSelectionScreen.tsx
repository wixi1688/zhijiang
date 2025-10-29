import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AttackRangeType, TargetSelectionStrategy, plantImages as gamePlantImages } from '../data/gameData';

// 自定义cn工具函数，用于条件性组合类名
const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

   // 从游戏数据中导入植物类型定义和配置，确保类型一致性
  import { PlantType, PLANTS_CONFIG } from '../data/gameData';


// 植物配置接口
interface PlantConfig {
  name: string;
  cost: number;
  cooldown: number;
  health: number;
  damage?: number;
  attackRange?: number;
  attackSpeed?: number;
  specialEffect?: string;
  description: string;
  category: string;
  rarity: string;
}

/**
 * 从gameData.ts导入的植物配置已包含了所有最新的植物数据，
 * 这里不再需要重复定义，直接使用导入的配置即可。
 * 这种方式可以确保所有页面使用相同的植物数据，避免数据不一致的问题。
 */

  // 从游戏数据中导入植物图片映射，确保数据一致性
  import { plantImages, getPlantWorldview } from '../data/gameData';

interface PlantSelectionScreenProps {
  level: number;
  onConfirm: (selectedPlants: PlantType[]) => void;
  onCancel: () => void;
  isCustomLevel?: boolean;
  isHighIntensity?: boolean;
}

export default function PlantSelectionScreen({ level, onConfirm, onCancel, isCustomLevel = false, isHighIntensity = false }: PlantSelectionScreenProps) {
  const [selectedPlants, setSelectedPlants] = useState<PlantType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [showPlantDetails, setShowPlantDetails] = useState<PlantType | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 获取所有植物分类（只有清鸢一种）
  const categories = ['全部', ...Array.from(new Set(Object.values(PLANTS_CONFIG).map(plant => plant.category)))];
  
  // 过滤植物 - 增加安全检查，确保plantType有效
   const filteredPlants = Object.entries(PLANTS_CONFIG).filter(([plantType, plant]) => {
    if (!plant) return false; // 添加安全检查
    const matchesCategory = selectedCategory === '全部' || plant.category === selectedCategory;
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         plant.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 选择/取消选择植物 - 使用console.log替代toast提示
  const togglePlantSelection = (plantType: PlantType) => {
    if (!selectedPlants.includes(plantType)) {
      // 添加新植物到已选择列表
      setSelectedPlants([...selectedPlants, plantType]);
      console.log(`已选择 ${PLANTS_CONFIG[plantType].name}`);
    } else {
      // 移除已选择的植物（但至少保留一种）
      if (selectedPlants.length > 1) {
        setSelectedPlants(selectedPlants.filter(type => type !== plantType));
        console.log(`已取消选择 ${PLANTS_CONFIG[plantType].name}`);
      } else {
        console.log('至少需要选择一种植物！');
      }
    }
  };

  // 确认选择 - 使用console.log替代toast提示
  const confirmSelection = () => {
    // 如果没有选择植物，则默认选择清鸢
    if (selectedPlants.length === 0) {
      setSelectedPlants(['qingyuan']);
    }
    onConfirm(selectedPlants);
  };

  // 根据稀有度获取对应的样式
  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case '普通': return 'bg-green-500';
      case '稀有': return 'bg-blue-500';
      case '史诗': return 'bg-purple-500';
      case '传说': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // 重置选择 - 使用console.log替代toast提示
  const resetSelection = () => {
    setSelectedPlants(['qingyuan']);
    console.log('已重置植物选择');
  };

  // 确保默认选中清鸢
  useEffect(() => {
    if (selectedPlants.length === 0) {
      setSelectedPlants(['qingyuan']);
    }
  }, []);

  // 动画变体
   // 使用CSS过渡替代motion组件的变体
  
   // 直接在CSS类中使用过渡效果

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-30 flex flex-col items-center justify-start p-4 overflow-y-auto">
      {/* 顶部导航 */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <button 
          onClick={onCancel}
          className="text-white text-xl hover:text-green-400 transition-colors duration-200"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        
         <div className="text-center">
          <h2 className="text-2xl font-bold text-green-400">
            {isHighIntensity 
              ? '高强度自定义关卡 - 选择植物' 
              : isCustomLevel 
                ? '自定义关卡 - 选择植物' 
                : '选择上阵植物'
            }
          </h2>
          <p className="text-gray-400">
            关卡 {level} 
            {isCustomLevel && ' (植物选择后将继续选择僵尸)'}
            {isHighIntensity && ' (游戏难度大幅提升，建议选择强力植物组合)'}
          </p>
        </div>
        
        <div className="w-6"></div> {/* 占位元素，保持平衡 */}
      </div>

       {/* 选择计数提示 */}
      <div className={`w-full max-w-5xl rounded-lg p-4 mb-6 ${
        isHighIntensity ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-800' : 'bg-gray-800'
      }`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <i className={`fa-solid ${isHighIntensity ? 'fa-fire text-orange-400' : 'fa-seedling text-green-400'} mr-2`}></i>
            <span className="text-white">已选择 {selectedPlants.length} 种植物</span>
          </div>
            <div className={`text-sm font-medium px-3 py-1 rounded-full ${
             selectedPlants.length >= 1 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
           }`}>
             {selectedPlants.length < 1 ? `${1 - selectedPlants.length} 种植物才能开始` : `已选择 ${selectedPlants.length} 种植物`}
           </div>
        </div>
        
        {/* 进度条 */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(selectedPlants.length / 10 * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={cn("h-2 rounded-full", {
               "bg-red-500": selectedPlants.length < 1,
              "bg-yellow-500": selectedPlants.length >= 1 && selectedPlants.length < 5,
              "bg-green-500": selectedPlants.length >= 5
            })}
          ></motion.div>
        </div>
        
         {/* 选择提示 */}
        <div className="text-xs text-gray-400 mt-2 flex justify-between">
           <span>至少选择1种植物</span>
           <span>最多选择8种植物</span>
        </div>
        
        {/* 高强度模式提示 */}
        {isHighIntensity && (
          <div className="flex items-center mt-2 text-xs text-orange-400">
            <i className="fa-solid fa-exclamation-triangle mr-1"></i>
            <span>高强度模式下，推荐选择高伤害和控制型植物组合</span>
          </div>
        )}
      </div>

      {/* 已选择的植物预览 */}
      {selectedPlants.length > 0 && (
        <div className="w-full max-w-5xl mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white flex items-center">
              <i className="fa-solid fa-check-circle text-green-400 mr-2"></i>
              已选择的植物
            </h3>
            <button 
              onClick={resetSelection}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
            >
              <i className="fa-solid fa-rotate-left mr-1"></i> 重置选择
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPlants.map((plantType, index) => (
              <motion.div
                key={plantType}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center bg-gray-800 rounded-full px-3 py-1"
              >
        <img 
          src={gamePlantImages[plantType]} 
          alt={PLANTS_CONFIG[plantType].name} 
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-white text-sm">{PLANTS_CONFIG[plantType].name}</span>
                <button 
                  onClick={() => togglePlantSelection(plantType)}
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
            placeholder="搜索植物..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 植物列表 */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filteredPlants.map(([plantType, plant]) => {
            const isSelected = selectedPlants.includes(plantType as PlantType);
            return (
              <div 
                key={plantType}
                className={`bg-gradient-to-br ${isSelected ? 'from-green-900/50 to-green-800/20' : 'from-gray-900/50 to-gray-800/20'} rounded-xl overflow-hidden shadow-lg border ${isSelected ? 'border-green-500' : 'border-gray-700'} flex flex-col h-full transition-all duration-300 hover:scale-103 hover:shadow-[0_20px_25px_-5px_rgba(34,139,34,0.3)] hover:z-10 ${selectedPlants.length >= 8 && !isSelected ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => (selectedPlants.length < 8 || isSelected) && togglePlantSelection(plantType as PlantType)}
              >
                <div className="h-32 overflow-hidden relative">
                 <img 
                    src={gamePlantImages[plantType as PlantType]} 
                    alt={plant.name} 
                   className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                   loading="lazy"
                 />
                <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getRarityClass(plant.rarity)} shadow-md`}>
                  {plant.rarity}
                </div>
                {isSelected && (
                  <div className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-green-600 text-white shadow-md">
                    已选择
                  </div>
                )}
                 <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
              </div>
               <div className="p-3 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="text-base font-bold text-white">{plant.name}</h3>
                  <span className="bg-yellow-500 text-black font-bold px-2 py-1 rounded-full flex items-center">
                    <i className="fa-solid fa-sun mr-1"></i> {plant.cost}
                  </span>
                </div>
                 <p className="text-gray-300 text-xs mb-2 line-clamp-2 flex-grow">{plant.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-800/80 p-2 rounded-lg">
                    <span className="text-gray-400 block">生命值</span>
                    <span className="font-bold text-white">{plant.health}</span>
                  </div>
                  <div className="bg-gray-800/80 p-2 rounded-lg">
                    <span className="text-gray-400 block">冷却时间</span>
                    <span className="font-bold text-white">{plant.cooldown / 1000}秒</span>
                  </div>
                  {plant.damage && (
                    <div className="bg-gray-800/80 p-2 rounded-lg">
                      <span className="text-gray-400 block">攻击力</span>
                      <span className="font-bold text-white">{plant.damage}</span>
                    </div>
                  )}
                  {plant.attackSpeed && (
                    <div className="bg-gray-800/80 p-2 rounded-lg">
                      <span className="text-gray-400 block">攻击速度</span>
                      <span className="font-bold text-white">{plant.attackSpeed / 1000}秒/次</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowPlantDetails(plantType as PlantType)}
                  className="mt-3 w-full bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-medium py-1.5 rounded-lg transition-all duration-300 text-sm flex items-center justify-center"
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
         disabled={selectedPlants.length < 1}
        className={`w-full max-w-5xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg mb-8 ${
          selectedPlants.length < 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-green-500/30'
        }`}
      >
         <div className="flex items-center justify-center">
           <i className={`fa-solid ${isHighIntensity ? 'fa-bolt text-orange-300' : 'fa-play-circle'} mr-2 text-xl`}></i>
           {isHighIntensity ? '准备迎接高强度挑战！' : '确认选择并开始战斗'}
         </div>
      </motion.button>

       {/* 植物详情模态框 */}
      {showPlantDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4 opacity-100 transition-opacity duration-300"
          onClick={() => setShowPlantDetails(null)}
        >
          <div
            className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transform translate-y-0 opacity-100 transition-all duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowPlantDetails(null)}
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
                        src={gamePlantImages[showPlantDetails]} 
                        alt={PLANTS_CONFIG[showPlantDetails].name} 
                       className="w-full h-full object-cover"
                     />
                    <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getRarityClass(PLANTS_CONFIG[showPlantDetails].rarity)} shadow-md`}>
                      {PLANTS_CONFIG[showPlantDetails].rarity}
                    </div>
                  </div>
                </div>
                
                {/* 右侧详情 */}
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-400">{PLANTS_CONFIG[showPlantDetails].name}</h2>
                    <span className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-full flex items-center">
                      <i className="fa-solid fa-sun mr-1"></i> {PLANTS_CONFIG[showPlantDetails].cost}
                    </span>
                  </div>
                   
                   <div className="mb-6">
                     <div className={`relative transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-24'}`}>
                       <p className="text-gray-300">{PLANTS_CONFIG[showPlantDetails].description}</p>
                       
                       {/* 渐变遮罩 - 仅在收起状态显示 */}
                       {!isExpanded && (
                         <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800 via-gray-800/80 to-transparent"></div>
                       )}
                     </div>
                     
                     {/* 展开/收起按钮 */}
                     <motion.button
                       onClick={() => setIsExpanded(!isExpanded)}
                       className="mt-2 mx-auto block px-3 py-1.5 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-full shadow-lg transition-all duration-300 flex items-center text-sm"
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
                      <span className="font-bold text-white text-lg">{PLANTS_CONFIG[showPlantDetails].health}</span>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <span className="text-gray-400 block text-sm">冷却时间</span>
                      <span className="font-bold text-white text-lg">{PLANTS_CONFIG[showPlantDetails].cooldown / 1000}秒</span>
                    </div>
                    {PLANTS_CONFIG[showPlantDetails].damage && (
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <span className="text-gray-400 block text-sm">攻击力</span>
                        <span className="font-bold text-white text-lg">{PLANTS_CONFIG[showPlantDetails].damage}</span>
                      </div>
                    )}
                    {PLANTS_CONFIG[showPlantDetails].attackRange && (
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <span className="text-gray-400 block text-sm">攻击范围</span>
                        <span className="font-bold text-white text-lg">
                          {PLANTS_CONFIG[showPlantDetails].attackRange === 99 ? '全图' : `前方 ${PLANTS_CONFIG[showPlantDetails].attackRange} 格`}
                        </span>
                      </div>
                    )}
                    {PLANTS_CONFIG[showPlantDetails].attackSpeed && (
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <span className="text-gray-400 block text-sm">攻击速度</span>
                        <span className="font-bold text-white text-lg">{PLANTS_CONFIG[showPlantDetails].attackSpeed / 1000}秒/次</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 特殊效果 */}
                  {PLANTS_CONFIG[showPlantDetails].specialEffect && (
                    <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg mb-6">
                      <span className="text-blue-300 font-medium flex items-center">
                        <i className="fa-solid fa-star mr-2"></i> 特殊效果
                      </span>
                      <p className="text-blue-200 mt-2">{PLANTS_CONFIG[showPlantDetails].specialEffect}</p>
                    </div>
                  )}
                  
                  {/* 分类 */}
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">分类：</span>
                    <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                      {PLANTS_CONFIG[showPlantDetails].category}
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
          <p>选择合适的植物组合是获胜的关键！</p>
        </div>
      </div>
    </div>
  );
}