import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PlantType, 
  ZombieType, 
  PLANTS_CONFIG, 
  ZOMBIES_CONFIG, 
  plantImages, 
  zombieImages,
  GAME_UPDATES 
} from "../data/gameData";

export default function GuideBook() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"plants" | "zombies">("plants");
    const [selectedCategory, setSelectedCategory] = useState<string>("全部");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItem, setSelectedItem] = useState<PlantType | ZombieType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showUpdateHistory, setShowUpdateHistory] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [categoryMode, setCategoryMode] = useState<'type' | 'worldview'>('type'); // 新增：分类模式切换

  // 数据持久化状态
  const [localDataLoaded, setLocalDataLoaded] = useState<boolean>(false);
  const [plantsData, setPlantsData] = useState<typeof PLANTS_CONFIG>(PLANTS_CONFIG);
  const [zombiesData, setZombiesData] = useState<typeof ZOMBIES_CONFIG>(ZOMBIES_CONFIG);

  // 初始化数据：先尝试从localStorage加载，失败则使用默认数据
  useEffect(() => {
    try {
      // 尝试从localStorage加载数据
      const savedPlants = localStorage.getItem("pvzPlants");
      const savedZombies = localStorage.getItem("pvzZombies");
      
      if (savedPlants) {
        setPlantsData(JSON.parse(savedPlants));
      }
      
      if (savedZombies) {
        setZombiesData(JSON.parse(savedZombies));
      }
      
      setLocalDataLoaded(true);
    } catch (error) {
      console.error("加载本地数据失败，使用默认数据:", error);
      setLocalDataLoaded(true);
    }
  }, []);

  // 定期保存数据到localStorage，防止内容丢失
  useEffect(() => {
    if (localDataLoaded) {
      try {
        localStorage.setItem("pvzPlants", JSON.stringify(plantsData));
        localStorage.setItem("pvzZombies", JSON.stringify(zombiesData));
      } catch (error) {
        console.error("保存游戏数据失败:", error);
      }
    }
  }, [localDataLoaded, plantsData, zombiesData]);

  // 添加定时自动保存，增强数据安全性
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (localDataLoaded) {
        try {
          localStorage.setItem("pvzPlants", JSON.stringify(plantsData));
          localStorage.setItem("pvzZombies", JSON.stringify(zombiesData));
          console.log("图鉴数据已自动保存");
        } catch (error) {
          console.error("自动保存失败:", error);
        }
      }
    }, 30000); // 每30秒自动保存一次

    // 组件卸载时清除定时器
    return () => clearInterval(autoSaveInterval);
  }, [localDataLoaded, plantsData, zombiesData]);

    const plantCategories = ["全部", "光明守护者", "光明使者", "防御型植物"];
    const plantRarities = ["全部", "传说", "史诗"];
    const zombieCategories = ["全部", "BOSS级僵尸", "终极BOSS级僵尸"];
    const zombieAppearLevels = ["全部", "1", "2", "3", "4", "5", "6", "7", "8"];
   // 新增：世界观分类
  const worldviewCategories = ["全部", "人类世界", "光明大陆", "暗影大陆", "时空城", "冥界", "洪荒", "命运神殿", "未知"];

  // 安全获取数据的辅助函数
  const getSafeData = () => {
    // 确保数据结构完整
    return {
      plants: { ...PLANTS_CONFIG, ...plantsData },
      zombies: { ...ZOMBIES_CONFIG, ...zombiesData }
    };
  };
  
  // 为植物分配世界观的辅助函数
  const getWorldviewForPlant = (plant: typeof PLANTS_CONFIG[PlantType]): string => {
    if (!plant) return "未知"; // 添加安全检查
    
    if (plant.name.includes("徐清岚") && !plant.name.includes("（神）") && !plant.name.includes("（梦）") || 
        plant.name === "屹九" || 
        plant.name.includes("Vexithra") ||
        plant.name === "羽尘") {
      return "人类世界";
    } else if (plant.name === "清鸢" || plant.name === "善•猫教主" || plant.name === "青玄" || plant.name === "奈奈生" || plant.name === "晓月") {
      return "光明大陆";
    } else if (plant.name === "慕容言风" || plant.name === "沐沐") {
      return "暗影大陆";
    } else if (plant.name === "冥界三使" || plant.name === "筱燊傀") {
      return "冥界";
    } else if (plant.name === "凌" || plant.name === "星褶" || plant.name === "灵•瑶凝" || plant.name === "离火双生•长离" || plant.name === "镜花水月·灵汐" || plant.name === "苍玄" || plant.name === "青芜" || plant.name === "双生花仙•灵汐" || plant.name === "凝霜" || plant.name === "玄霜" || plant.name === "灵汐与赤瞳" || plant.name === "星轨三司") {
      return "洪荒";
    } else if (plant.name === "云璃•时光裁决者") {
      return "命运神殿";
    } else if (plant.name === "灵汐") {
      return "时空城";
    }
    return "未知";
  };

  // 为僵尸分配世界观的辅助函数
  const getWorldviewForZombie = (zombieType: ZombieType, zombie: typeof ZOMBIES_CONFIG[ZombieType]): string => {
    if (zombieType === "xuqinglan_dark" || zombieType === "vexithra" || zombieType === "xian") {
      return "人类世界";
    } else if (zombieType === "su_huai" || zombieType === "cat_leader" || zombieType === "ji_zai" || 
               zombieType === "li_huo" || zombieType === "xia" || zombieType === "alibi" || zombieType === "qiuyue") {
      return "暗影大陆";
    } else if (zombieType === "shantao" || zombieType === "shilie_lingxi") {
      return "时空城";
    } else if (zombieType === "longzunjiyan" || zombieType === "xingtianzhenyang" || zombieType === "xuanye") {
      return "洪荒";
    }
    return "未知";
  };

    // 过滤植物 - 使用共享数据
    const filteredPlants = Object.values(getSafeData().plants).filter(plant => {
      if (!plant) return false; // 添加安全检查
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (plant.description && plant.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (categoryMode === 'type') {
        if (selectedCategory === "全部") {
          return matchesSearch;
        }
        const matchesCategory = plant.category === selectedCategory;
        return matchesCategory && matchesSearch;
      } else {
           // 按世界观分类
          if (selectedCategory === "全部") {
            return matchesSearch;
          }
          
          const worldview = getWorldviewForPlant(plant);
          return worldview === selectedCategory && matchesSearch;
        }
    });

      // 过滤僵尸 - 使用共享数据
      const filteredZombies = Object.entries(getSafeData().zombies).filter(([zombieType, zombie]) => {
        if (!zombie) return false; // 添加安全检查
        const matchesSearch = zombie.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (zombie.description && zombie.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (categoryMode === 'type') {
          if (selectedCategory === "全部") {
            return matchesSearch;
          } else if (selectedCategory === "BOSS级僵尸" || selectedCategory === "终极BOSS级僵尸") {
            return ["su_huai", "vexithra", "xuqinglan_dark", "qiuyue", "shantao", "ji_zai", "li_huo", "cat_leader", "alibi", "xian", "xia"].includes(zombieType) && matchesSearch;
          }

          const matchesDifficulty = zombie.difficulty === selectedCategory;
          return matchesDifficulty && matchesSearch;
        } else {
           // 按世界观分类
          if (selectedCategory === "全部") {
            return matchesSearch;
          }
          
          const worldview = getWorldviewForZombie(zombieType as ZombieType, zombie);
          
          // 确保即使没有明确分类的角色也能在"未知"分类下显示
          return worldview === selectedCategory && matchesSearch;
        }
    }).map(([_, zombie]) => zombie);

    // 不需要这个函数，因为只有一种植物
    const filterByRarity = () => {
        setSelectedCategory("全部");
    };

    const filterByLevel = (level: string) => {
        setSearchTerm(level === "全部" ? "" : `关卡 ${level}`);
    };

    const getRarityClass = (rarity: string) => {
        switch (rarity) {
        case "普通":
            return "bg-green-500";
        case "稀有":
            return "bg-blue-500";
        case "史诗":
            return "bg-purple-500";
        case "传说":
            return "bg-orange-500";
        case "神秘":
            return "bg-gradient-to-r from-cyan-500 to-blue-500";
        case "古神":
            return "bg-gradient-to-r from-blue-700 to-indigo-800";
        default:
            return "bg-gray-500";
        }
    };

    const getRarityGradient = (rarity: string) => {
        switch (rarity) {
        case "普通":
            return "from-green-900/50 to-green-800/20";
        case "稀有":
            return "from-blue-900/50 to-blue-800/20";
        case "史诗":
            return "from-purple-900/50 to-purple-800/20";
        case "传说":
            return "from-orange-900/50 to-orange-800/20";
         case "神秘":
            return "from-cyan-900/50 to-blue-800/20";
        case "古神":
            return "from-blue-900/50 to-indigo-800/20";
        default:
            return "from-gray-900/50 to-gray-800/20";
        }
    };

    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty) {
        case "简单":
            return "bg-green-500";
        case "中等":
            return "bg-yellow-500";
        case "较难":
            return "bg-orange-500";
        case "极难":
            return "bg-red-500";
        default:
            return "bg-gray-500";
        }
    };

    const viewDetails = (itemType: PlantType | ZombieType) => {
        // 优化选中项设置，确保在"按世界观"分类下也能正确显示详情
        const safeData = getSafeData();
        
        // 检查这个itemType是否存在于当前激活的标签中
        let isValidItem = false;
        if (activeTab === "plants") {
          isValidItem = !!safeData.plants[itemType as PlantType];
        } else {
          isValidItem = !!safeData.zombies[itemType as ZombieType];
        }
        
        // 如果在当前标签中不存在，仍然设置，因为可能是跨标签的
        setSelectedItem(itemType);
        setShowDetailModal(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedItem(null);
    };

    const isUnlocked = (unlockLevel?: number) => {
        return unlockLevel && unlockLevel <= 3;
    };

    const containerVariants = {
        hidden: {
            opacity: 0
        },

        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {
            y: 20,
            opacity: 0
        },

        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

  const viewRecentUpdates = () => {
    setShowUpdateHistory(true);
    // 添加显示动画的类名到body
    document.body.classList.add('overflow-hidden');
  };

  const closeUpdateHistory = () => {
    setShowUpdateHistory(false);
    // 移除body的overflow-hidden类
    document.body.classList.remove('overflow-hidden');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDetailModal) {
          closeDetailModal();
        } else if (showUpdateHistory) {
          closeUpdateHistory();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDetailModal, showUpdateHistory]);

  // 获取最新的更新
  const getLatestUpdate = () => {
    return GAME_UPDATES.length > 0 ? GAME_UPDATES[0] : null;
  };

  // 获取更新时间的格式化显示
  const formatUpdateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "今天";
    } else if (diffDays === 1) {
      return "昨天";
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 获取当前游戏版本信息
  const getGameVersion = () => {
    return {
      version: `v${GAME_UPDATES.length}.0`,
      lastUpdated: getLatestUpdate() ? formatUpdateTime(getLatestUpdate()!.date) : '未知',
      updateCount: GAME_UPDATES.length
    };
  };

  // 数据恢复功能
  // 创建统一的角色卡片组件配置
  const getItemCardConfig = (item: any, itemType: PlantType | ZombieType, isPlant: boolean) => {
    // 安全获取配置，确保config存在
    const config = isPlant ? getSafeData().plants[itemType as PlantType] : getSafeData().zombies[itemType as ZombieType];
    
    // 如果配置不存在，返回默认空配置
    if (!config) {
      return {
        item: {
          name: '未知角色',
          description: '数据加载失败',
          rarity: '普通'
        },
        itemType,
        config: null,
        isPlant,
        categoryTag: isPlant ? '特殊类' : 'BOSS级僵尸',
        uniqueKey: `${isPlant ? 'plant' : 'zombie'}_unknown_${itemType}`
      };
    }
    
    let categoryTag = "";
    if (isPlant) {
      const plant = config as typeof PLANTS_CONFIG[PlantType];
      if (plant.damage !== undefined) {
        categoryTag = "攻击类";
      } else if (plant.health >= 1000 || (plant.category && plant.category.includes("防御"))) {
        categoryTag = "防御类";
      } else if ((plant.category && plant.category.includes("资源")) || 
                (plant.specialEffect && plant.specialEffect.includes("阳光")) || 
                plant.name.includes("阳光")) {
        categoryTag = "资源类";
      } else if ((plant.specialEffect && (plant.specialEffect.includes("减速") || plant.specialEffect.includes("定住"))) || 
                (plant.category && plant.category.includes("控制"))) {
        categoryTag = "控制类";
      } else {
        categoryTag = "特殊类";
      }
    } else {
      categoryTag = "BOSS级僵尸";
    }
    
    return {
      item,
      itemType,
      config,
      isPlant,
      categoryTag,
      uniqueKey: `${isPlant ? 'plant' : 'zombie'}_${item.name || 'unknown'}_${itemType}`
    };
  };
  
  const restoreDefaultData = () => {
    if (window.confirm("确定要恢复默认数据吗？这将清除所有本地修改。")) {
      try {
        setPlantsData(PLANTS_CONFIG);
        setZombiesData(ZOMBIES_CONFIG);
        localStorage.setItem("pvzPlants", JSON.stringify(PLANTS_CONFIG));
        localStorage.setItem("pvzZombies", JSON.stringify(ZOMBIES_CONFIG));
        console.log("数据已恢复为默认值");
      } catch (error) {
        console.error("恢复数据失败:", error);
      }
    }
  };

  // 在组件顶层使用 useMemo 预处理数据
  const combinedItemsData = useMemo(() => {
    // 合并植物和僵尸并添加唯一标识符
    const combinedItems = [];
    
    // 确保 filteredPlants 和 filteredZombies 是数组
    if (Array.isArray(filteredPlants)) {
      // 处理植物数据
      filteredPlants.forEach((plant) => {
          if (!plant) return;
          
          // 找到对应的植物类型
          const plantType = Object.keys(getSafeData().plants).find(key => {
              const plantData = getSafeData().plants[key as PlantType];
              if (!plantData) return false;
              // 处理 Vexithra 名称不一致的问题
              if (plant.name.includes("Vexithra") && plantData.name.includes("Vexithra")) {
                  return true;
              }
              return plantData.name === plant.name;
          }) as PlantType;
          
          if (plantType) {
              const config = getItemCardConfig(plant, plantType, true);
              combinedItems.push(config);
          }
      });
    }
    
    if (Array.isArray(filteredZombies)) {
      // 处理僵尸数据
      filteredZombies.forEach((zombie) => {
          if (!zombie) return;
          
          // 找到对应的僵尸类型
          const zombieType = Object.keys(getSafeData().zombies).find(key => {
              const zombieData = getSafeData().zombies[key as ZombieType];
              if (!zombieData) return false;
              return zombieData.name === zombie.name;
          }) as ZombieType;
          
          if (zombieType) {
              const config = getItemCardConfig(zombie, zombieType, false);
              combinedItems.push(config);
          }
      });
    }
    
    // 确保 combinedItems 是数组再调用 map
    if (!Array.isArray(combinedItems)) {
      return null;
    }
    
    return combinedItems.map(({ item, itemType, config, isPlant, categoryTag, uniqueKey }) => {
         // 确保 item 和 config 存在
         if (!item || !config) {
           return null;
         }
         
         // 处理点击查看详情的函数，与"按类型"模式保持一致
         const handleViewDetails = (e: React.MouseEvent) => {
           e.preventDefault();
           e.stopPropagation();
           viewDetails(itemType as PlantType | ZombieType);
         };

        return (
            <motion.div
                key={uniqueKey}
                variants={itemVariants}
                whileHover={{
                    scale: 1.03,
                    boxShadow: `0 20px 25px -5px ${isPlant ? "rgba(34, 139, 34, 0.3)" : "rgba(220, 20, 60, 0.3)"}`,
                    zIndex: 10
                }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${isPlant ? getRarityGradient(item.rarity) : "from-red-900/50 to-red-800/20"} rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col h-full transition-all duration-300 cursor-pointer hover:cursor-pointer`}
                layoutId={`item-card-${uniqueKey}`}
                onClick={handleViewDetails}>
            <div className="h-48 overflow-hidden relative">
                <motion.img
                    src={isPlant ? plantImages[itemType as PlantType] : zombieImages[itemType as ZombieType]}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7 }} />
                {isPlant ? (
                    <div
                        className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getRarityClass(item.rarity)} shadow-md`}>
                        {item.rarity}
                    </div>
                ) : (
                    <div
                        className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getDifficultyClass((item as typeof ZOMBIES_CONFIG[ZombieType]).difficulty)} shadow-md`}>
                        {(item as typeof ZOMBIES_CONFIG[ZombieType]).difficulty}
                    </div>
                )}
                
                <div
                    className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-blue-600 text-white shadow-md">
                    {categoryTag}
                </div>
                <div
                    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>
             <div className="p-5 flex-grow flex flex-col">
                {/* 人物名言模块 */}
                {item.quote && (
                  <motion.div 
                    className="mb-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 italic text-gray-300 text-sm relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute top-0 left-0 w-8 h-8 text-3xl text-gray-700 opacity-30">"</div>
                    <div className="relative z-10 pl-4">{item.quote}</div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 text-3xl text-gray-700 opacity-30">"</div>
                  </motion.div>
                )}
                
                {isPlant ? (
                    <>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-green-400">{item.name}</h3>
                            <span
                                className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-full flex items-center">
                                <i className="fa-solid fa-sun mr-1"></i> {(item as typeof PLANTS_CONFIG[PlantType]).cost}
                            </span>
                        </div>
                        <p className="text-gray-300 mb-4 line-clamp-2 flex-grow">{item.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-gray-800/80 p-2 rounded-lg">
                                <span className="text-gray-400 block">生命值</span>
                                <span className="font-bold text-white">{(item as typeof PLANTS_CONFIG[PlantType]).health}</span>
                            </div>
                            <div className="bg-gray-800/80 p-2 rounded-lg">
                                <span className="text-gray-400 block">冷却时间</span>
                                <span className="font-bold text-white">{(item as typeof PLANTS_CONFIG[PlantType]).cooldown / 1000}秒</span>
                            </div>
                            {(item as typeof PLANTS_CONFIG[PlantType]).damage && (
                                <div className="bg-gray-800/80 p-2 rounded-lg">
                                    <span className="text-gray-400 block">攻击力</span>
                                    <span className="font-bold text-white">{(item as typeof PLANTS_CONFIG[PlantType]).damage}</span>
                                </div>
                            )}
                            {(item as typeof PLANTS_CONFIG[PlantType]).attackSpeed && (
                                <div className="bg-gray-800/80 p-2 rounded-lg">
                                    <span className="text-gray-400 block">攻击速度</span>
                                    <span className="font-bold text-white">{(item as typeof PLANTS_CONFIG[PlantType]).attackSpeed / 1000}秒/次</span>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-red-400 mb-3">{item.name}</h3>
                        <p className="text-gray-300 mb-4 line-clamp-2 flex-grow">{item.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-gray-800/80 p-2 rounded-lg">
                                <span className="text-gray-400 block">生命值</span>
                                <span className="font-bold text-white">{(item as typeof ZOMBIES_CONFIG[ZombieType]).health}</span>
                            </div>
                            <div className="bg-gray-800/80 p-2 rounded-lg">
                                  <span className="text-gray-400 block">移动速度</span>
                                  <span className="font-bold text-white">{typeof (item as typeof ZOMBIES_CONFIG[ZombieType]).speed === 'number' ? (item as typeof ZOMBIES_CONFIG[ZombieType]).speed.toFixed(1) : '未知'}</span>
                              </div>
                            <div className="bg-gray-800/80 p-2 rounded-lg">
                                <span className="text-gray-400 block">攻击力</span>
                                <span className="font-bold text-white">{(item as typeof ZOMBIES_CONFIG[ZombieType]).damage}</span>
                            </div>
                            {(item as typeof ZOMBIES_CONFIG[ZombieType]).armor && (
                                <div className="bg-gray-800/80 p-2 rounded-lg">
                                    <span className="text-gray-400 block">护甲值</span>
                                    <span className="font-bold text-white">{(item as typeof ZOMBIES_CONFIG[ZombieType]).armor}</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
                <button
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止按钮点击事件冒泡到卡片
                      viewDetails(itemType as PlantType | ZombieType);
                    }}
                    className={`mt-4 w-full bg-gradient-to-r ${isPlant ? 'from-green-600 to-green-500 hover:from-green-700 hover:to-green-600' : 'from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'} text-white font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center`}>
                    <i className="fa-solid fa-info-circle mr-2"></i>查看详情
                </button>
            </div>
        </motion.div>
    );
  });
}, [filteredPlants, filteredZombies, getSafeData, getItemCardConfig, getRarityClass, getDifficultyClass, getRarityGradient, itemVariants, plantImages, zombieImages, viewDetails]);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-green-900 via-gray-900 to-red-900 text-white p-4 md:p-8">
      <div className="relative overflow-hidden mb-8">
        {/* 背景故事简介卡片 - 可展开式 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-green-900/80 via-black/50 to-red-900/80 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 mb-8 overflow-hidden relative"
          >
            <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-400">
              光明与暗影的永恒之战
            </h2>
            
            <div className={`relative transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-36'}`}>
  <p className="text-gray-300 leading-relaxed">
      在遥远的时空之外，存在着两个相生相克的神秘维度：光明大陆与暗影世界。光明大陆沐浴在永恒的阳光下，万物生机盎然，由精灵和植物共同守护；而暗影世界则沉浸在永恒的黑暗中，充满了未知的危险与神秘的力量。两个世界曾通过一道名为"星界之门"的神秘通道保持着微妙的平衡，彼此互不干扰。
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      在这两个世界之间的混沌中，诞生了两位同源一体的守护者——清鸢与宿槐。她们本是同一存在的两面，清鸢代表着光明与生命，宿槐代表着停滞与永恒。在漫长的岁月里，她们共同守护着光明大陆的和平与繁荣，让这片土地上的生灵们过着幸福快乐的生活。
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      然而，随着时间的推移，清鸢与宿槐对生命本质的理解产生了根本性分歧。在一次对峙中，宿槐说出了她内心的真实想法："生命，只有在停滞不前的时间中，才能实现永恒的幸福。我，宿槐，将停止所有生命的时间。将一切生命转化为静止状态，实现永远的和平与安定。"
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      清鸢对此坚决反对："你错了，宿槐！正因为时间流逝，生命才有喜怒哀乐，才能诞生出珍贵的事物和回忆！将这一切都停止，根本不是和平，那只是单纯的'停滞'！"
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      宿槐却固执己见："吾之名为——宿槐！生命，因不断争斗、彼此伤害、心生怨恨，所以才会产生痛苦。这一切的元凶，就是'生命'本身，就是'时间'的流动！"
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      最终，这场理念之争导致了两人的彻底分裂。宿槐选择了拥抱暗影力量，成为了暗影女王，率领着僵尸大军对光明大陆发动了全面入侵。而清鸢则依然坚守着自己的信念，成为了植物世界的永恒守护者，誓言要保护光明大陆上的所有生命。
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      随着战争的持续，越来越多强大的存在被卷入这场光明与暗影的对决：
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      • 来自人类世界的魔法少女徐清岚，在一次冥想中与光明大陆的本源能量产生共鸣，毅然前往这个陌生而危险的异世界帮助清鸢对抗黑暗。
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      • 曾经是宿槐最宠爱的宠物"猫教主"，在清鸢的救赎下重生为"善•猫教主"，成为植物阵营的得力战将。
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      • 暗影世界的首席谋士"季灾"，通过神秘的星象占卜，预感到徐清岚的威胁，策划了对她的偷袭，导致徐清岚一度堕落为"徐清岚（暗）"。
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      • 星界之门的守护者青玄，在与徐清岚（暗）的战斗中重伤坠落，下落不明，成为了光明大陆的一大谜团。
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      • 明渊的神秘守护者慕容言风，虽然性格阴晴不定，但在关键时刻选择站在光明一方，用自己独特的力量帮助植物阵营抵御僵尸的进攻。
    </p>
    
    <p className="text-gray-300 leading-relaxed mt-3">
      现在，这场跨越维度的史诗之战正等待着你的加入。你将扮演人类的守护者，指挥清鸢和其他植物战士，运用你的智慧和策略，抵御宿槐及其僵尸大军的进攻，守护光明大陆的和平与安宁！每一次战斗都是一次考验，每一个决策都可能改变战争的走向。你，准备好迎接这场光明与暗影的终极对决了吗？
    </p>
            
            {/* 渐变遮罩 - 仅在收起状态显示 */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"></div>
            )}
          </div>
          
          {/* 展开/收起按钮 */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 mx-auto block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-full shadow-lg transition-all duration-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={`fa-solid mr-2 ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            {isExpanded ? '收起简介' : '展开阅读更多'}
          </motion.button>
        </motion.div>
        <div className="relative z-10 mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-900/30">
            <i className="fa-solid fa-arrow-left mr-2"></i>返回首页
          </Link>
          
          {/* 数据恢复按钮 */}
          <motion.button
            onClick={restoreDefaultData}
            className="inline-flex items-center ml-4 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-solid fa-undo mr-2"></i>恢复默认数据
          </motion.button>
        </div>
        <div
          className="absolute -top-24 -left-24 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div
          className="absolute -top-24 -right-24 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div
          className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 text-center mb-12">
        <motion.div
          initial={{
            y: -20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            duration: 0.6
          }}>
          <h1
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 mb-3 drop-shadow-lg">植物与僵尸图鉴
          </h1>
          <div
            className="h-1 w-32 bg-gradient-to-r from-green-400 to-red-400 mx-auto rounded-full"></div>
          
           {/* 查看最近更新按钮 - 增强版 */}
           <motion.button
             whileHover={{
               scale: 1.05
             }}
             whileTap={{
               scale: 0.95
             }}
             onClick={viewRecentUpdates}
             className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-900/50 relative overflow-hidden"
           >
                             {/* 背景光效动画 - 增强版 */}
                            <motion.div 
                              className="absolute inset-0 bg-white opacity-10"
                              animate={{ 
                                backgroundPosition: ['0% 0%', '100% 100%'],
                                backgroundSize: ['200% 200%']
                              }}
                              transition={{ 
                                duration: 3,
                                repeat: Infinity,
                                repeatType: 'reverse'
                              }}
                              style={{
                                background: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%)'
                              }}
                            />
                           
                           <i className="fa-solid fa-bell mr-2 animate-pulse"></i>
                           <span>查看最近更新</span>
                           <span className="ml-1 px-1.5 py-0.5 bg-red-500 rounded-full text-xs font-bold relative z-10">
                             {GAME_UPDATES.length}
                           </span>
                           
                           {/* 版本号显示 */}
                           <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-full text-xs font-bold relative z-10">
                             v{GAME_UPDATES.length}.0
                           </span>
                           
                           {/* 显示最新更新提示 - 增强版 */}
                           {getLatestUpdate() && (
                             <motion.div 
                               className="absolute -bottom-full left-1/2 transform -translate-x-1/2 bg-purple-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap mt-1 z-20 shadow-lg"
                               initial={{ opacity: 0, y: 10 }}
                               whileHover={{ opacity: 1, y: 0 }}
                               transition={{ duration: 0.2 }}
                             >
                               最新版本 v{GAME_UPDATES.length}.0: {getLatestUpdate()?.title} ({formatUpdateTime(getLatestUpdate()?.date || '')})
                             </motion.div>
                           )}
           </motion.button>
        </motion.div>
      </div>
            
            <motion.div
                className="max-w-2xl mx-auto mb-8 relative z-10"
                initial={{
                    y: 20,
                    opacity: 0
                }}
                animate={{
                    y: 0,
                    opacity: 1
                }}
                transition={{
                    duration: 0.6,
                    delay: 0.2
                }}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="搜索植物或僵尸..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-10 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 shadow-lg"
                        autoComplete="off" />
                    <i
                        className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    {searchTerm && <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200">
                        <i className="fa-solid fa-times-circle"></i>
                    </button>}
                </div>
                
                {searchTerm && <div
                    className="mt-2 bg-gray-800 rounded-lg shadow-xl max-h-60 overflow-y-auto border border-gray-700 z-50">
                    <div className="p-2 text-sm text-gray-400 font-medium">搜索建议</div>
                    {filteredPlants.concat(filteredZombies).slice(0, 5).map((item, index) => {
                      // 安全检查，确保item存在
                      if (!item) return null;
                      
                      return <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => {
                            setSearchTerm(item.name);

                            if ("rarity" in item) {
                                const plantType = Object.keys(getSafeData().plants).find(key => {
                                  const plant = getSafeData().plants[key as PlantType];
                                  // 处理 Vexithra 名称不一致的问题
                                  if (item.name.includes("Vexithra") && plant.name.includes("Vexithra")) {
                                      return true;
                                  }
                                  return plant.name === item.name;
                                }) as PlantType;
                                viewDetails(plantType);
                            } else {
                                const zombieType = Object.keys(getSafeData().zombies).find(key => {
                                  const zombie = getSafeData().zombies[key as ZombieType];
                                  return zombie.name === item.name;
                                }) as ZombieType;
                                viewDetails(zombieType);
                            }
                        }}>
                        <i
                            className={`fa-solid ${"rarity" in item ? "fa-seedling text-green-500" : "fa-skull text-red-500"} mr-2`}></i>
                        {item.name}
                        {item.description && <span className="ml-2 text-xs text-gray-400 truncate">{item.description.substring(0, 30)}...</span>}
                    </div>;
                  })}
                </div>}
            </motion.div>
            
             <motion.div
                className="flex flex-col items-center mb-8 relative z-10"
                initial={{
                    y: 20,
                    opacity: 0
                }}
                animate={{
                    y: 0,
                    opacity: 1
                }}
                transition={{
                    duration: 0.6,
                    delay: 0.3
                }}>
                {/* 新增：分类模式切换 */}
                <div className="mb-4 bg-gray-800 p-1 rounded-xl inline-flex shadow-lg">
                    <button
                        onClick={() => setCategoryMode('type')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${categoryMode === 'type' ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                        <i className={`fa-solid fa-layer-group mr-2 ${categoryMode === 'type' ? "text-white" : "text-purple-500"}`}></i>按类型
                    </button>
                    <button
                        onClick={() => setCategoryMode('worldview')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${categoryMode === 'worldview' ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                        <i className={`fa-solid fa-globe-asia mr-2 ${categoryMode === 'worldview' ? "text-white" : "text-blue-500"}`}></i>按世界观
                    </button>
                </div>
                
                {/* 类型分类切换（原有部分） */}
                {categoryMode === 'type' && (
                    <div className="bg-gray-800 p-1 rounded-xl inline-flex shadow-lg">
                        <button
                            onClick={() => setActiveTab("plants")}
                            className={`px-8 py-4 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${activeTab === "plants" ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                            {activeTab === "plants" && <motion.div
                                className="absolute inset-0 bg-white opacity-10"
                                animate={{
                                    backgroundPosition: ["0% 0%", "100% 100%"],
                                    backgroundSize: ["200% 200%"]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                style={{
                                    background: "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)"
                                }} />}
                            <i
                                className={`fa-solid fa-seedling mr-2 ${activeTab === "plants" ? "text-white" : "text-green-500"}`}></i>植物图鉴
                        </button>
                        <button
                            onClick={() => setActiveTab("zombies")}
                            className={`px-8 py-4 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${activeTab === "zombies" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                            {activeTab === "zombies" && <motion.div
                                className="absolute inset-0 bg-white opacity-10"
                                animate={{
                                    backgroundPosition: ["0% 0%", "100% 100%"],
                                    backgroundSize: ["200% 200%"]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                style={{
                                    background: "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)"
                                }} />}
                            <i
                                className={`fa-solid fa-skull mr-2 ${activeTab === "zombies" ? "text-white" : "text-red-500"}`}></i>僵尸图鉴
                        </button>
                    </div>
                )}
                
                {/* 世界观分类时的提示 */}
                {categoryMode === 'worldview' && (
                    <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 text-center shadow-lg">
                        <h3 className="text-xl font-bold text-blue-400 mb-2">世界观分类</h3>
                        <p className="text-blue-200">植物与僵尸将按照它们所属的世界进行混合分类展示</p>
                    </div>
                )}
            </motion.div>
            
             <div className="max-w-4xl mx-auto mb-6 overflow-x-auto relative z-10">
                <div className="bg-gray-800 p-1 rounded-xl inline-flex shadow-lg">
                    <button
                        onClick={() => setSelectedCategory("全部")}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${selectedCategory === "全部" ? (categoryMode === 'type' ? (activeTab === "plants" ? "bg-green-600 text-white" : "bg-red-600 text-white") : "bg-blue-600 text-white") + " text-white shadow-md" : "text-gray-300 hover:bg-gray-700"}`}>
                        全部
                    </button>
                    {categoryMode === 'type' ? (
                        // 按类型分类
                        (activeTab === "plants" ? plantCategories.filter(c => c !== "全部") : zombieCategories.filter(c => c !== "全部")).map(category => <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${selectedCategory === category ? (activeTab === "plants" ? "bg-green-600 text-white" : "bg-red-600 text-white") + " text-white shadow-md" : "text-gray-300 hover:bg-gray-700"}`}>
                            {category}
                        </button>)
                    ) : (
                        // 按世界观分类
                        worldviewCategories.filter(c => c !== "全部").map(category => <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${selectedCategory === category ? "bg-blue-600 text-white text-white shadow-md" : "text-gray-300 hover:bg-gray-700"}`}>
                            {category}
                        </button>)
                    )}
                </div>
            </div>
            
             <div className="max-w-7xl mx-auto relative z-10">
                {categoryMode === 'type' ? (
                    // 按类型分类显示
                    activeTab === "plants" ? <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPlants.map((plant, index) => {
                            // 安全检查，确保plant存在
                            if (!plant) return null;
                            
                             // 确保能找到对应的植物类型，防止点击跳转失败
                             const plantType = Object.keys(getSafeData().plants).find(key => {
                               const plantData = getSafeData().plants[key as PlantType];
                               return plantData && plantData.name === plant.name;
                             }) as PlantType || Object.keys(getSafeData().plants)[0] as PlantType;
                            
                            let plantCategoryTag = "";

                            if (plant.damage !== undefined) {
                                plantCategoryTag = "攻击类";
                            } else if (plant.health >= 1000 || (plant.category && plant.category.includes("防御"))) {
                                plantCategoryTag = "防御类";
                            } else if ((plant.category && plant.category.includes("资源")) || 
                                      (plant.specialEffect && plant.specialEffect.includes("阳光")) || 
                                      plant.name.includes("阳光")) {
                                plantCategoryTag = "资源类";
                            } else if ((plant.specialEffect && (plant.specialEffect.includes("减速") || plant.specialEffect.includes("定住"))) || 
                                      (plant.category && plant.category.includes("控制"))) {
                                plantCategoryTag = "控制类";
                            } else {
                                plantCategoryTag = "特殊类";
                            }

                             // 优化点击查看详情的函数，确保能正确触发
                             const handleViewDetails = (e: React.MouseEvent) => {
                               // 确保点击时能正确触发，不受按钮影响
                               e.preventDefault();
                               e.stopPropagation();
                               viewDetails(plantType);
                            };

                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: `0 20px 25px -5px ${activeTab === "plants" ? "rgba(34, 139, 34, 0.3)" : "rgba(220, 20, 60, 0.3)"}`,
                                        zIndex: 10
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`bg-gradient-to-br ${getRarityGradient(plant.rarity)} rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col h-full transition-all duration-300 cursor-pointer hover:cursor-pointer`}
                                    onClick={handleViewDetails}>
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={plantImages[plantType]}
                                            alt={plant.name}
                                            className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                                            loading="lazy" />
                                        <div
                                            className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getRarityClass(plant.rarity)} shadow-md`}>
                                            {plant.rarity}
                                        </div>
                                        
                                        <div
                                            className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-blue-600 text-white shadow-md">
                                            {plantCategoryTag}
                                        </div>
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                    </div>
                                     <div className="p-5 flex-grow flex flex-col">
                                        {/* 人物名言模块 */}
                                        {plant.quote && (
                                          <motion.div 
                                            className="mb-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 italic text-gray-300 text-sm relative overflow-hidden"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                          >
                                            <div className="absolute top-0 left-0 w-8 h-8 text-3xl text-gray-700 opacity-30">"</div>
                                            <div className="relative z-10 pl-4">{plant.quote}</div>
                                            <div className="absolute bottom-0 right-0 w-8 h-8 text-3xl text-gray-700 opacity-30">"</div>
                                          </motion.div>
                                        )}
                                        
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-bold text-green-400">{plant.name}</h3>
                                            <span
                                                className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-full flex items-center">
                                                <i className="fa-solid fa-sun mr-1"></i> {plant.cost}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-4 line-clamp-2 flex-grow">{plant.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="bg-gray-800/80 p-2 rounded-lg">
                                                <span className="text-gray-400 block">生命值</span>
                                                <span className="font-bold text-white">{plant.health}</span>
                                            </div>
                                            <div className="bg-gray-800/80 p-2 rounded-lg">
                                                <span className="text-gray-400 block">冷却时间</span>
                                                <span className="font-bold text-white">{plant.cooldown / 1000}秒</span>
                                            </div>
                                            {plant.damage && <div className="bg-gray-800/80 p-2 rounded-lg">
                                                <span className="text-gray-400 block">攻击力</span>
                                                <span className="font-bold text-white">{plant.damage}</span>
                                            </div>}
                                            {plant.attackSpeed && <div className="bg-gray-800/80 p-2 rounded-lg">
                                                <span className="text-gray-400 block">攻击速度</span>
                                                <span className="font-bold text-white">{plant.attackSpeed / 1000}秒/次</span>
                                            </div>}
                                        </div>
                                        <button
                                             onClick={(e) => {
                                               e.preventDefault();
                                               e.stopPropagation();
                                               viewDetails(plantType);
                                             }}
                                            className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center">
                                            <i className="fa-solid fa-info-circle mr-2"></i>查看详情
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div> : <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredZombies.map((zombie, index) => {
                            // 安全检查，确保zombie存在
                            if (!zombie) return null;
                            
                             // 确保能找到对应的僵尸类型，防止点击跳转失败
                             const zombieType = Object.keys(getSafeData().zombies).find(key => {
                               const zombieData = getSafeData().zombies[key as ZombieType];
                               return zombieData && zombieData.name === zombie.name;
                             }) as ZombieType || Object.keys(getSafeData().zombies)[0] as ZombieType;
                            
                            let zombieCategoryTag = "BOSS级僵尸";

                             // 优化点击查看详情的函数，确保能正确触发
                             const handleViewDetails = (e: React.MouseEvent) => {
                               // 确保点击时能正确触发，不受按钮影响
                               e.preventDefault();
                               e.stopPropagation();
                               viewDetails(zombieType);
                            };

                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: `0 20px 25px -5px ${activeTab === "plants" ? "rgba(34, 139, 34, 0.3)" : "rgba(220, 20, 60, 0.3)"}`,
                                        zIndex: 10
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-br from-red-900/50 to-red-800/20 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col h-full transition-all duration-300 cursor-pointer hover:cursor-pointer"
                                    onClick={handleViewDetails}>
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={zombieImages[zombieType]}
                                            alt={zombie.name}
                                            className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                                            loading="lazy" />
                                        <div
                                            className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getDifficultyClass(zombie.difficulty)} shadow-md`}>
                                            {zombie.difficulty}
                                        </div>
                                        
                                        <div
                                            className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-purple-600 text-white shadow-md">
                                            {zombieCategoryTag}
                                        </div>
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                    </div>
                                     <div className="p-5 flex-grow flex flex-col">
                                        {/* 人物名言模块 */}
                                        {zombie.quote && (
                                          <motion.div 
                                            className="mb-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 italic text-gray-300 text-sm relative overflow-hidden"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                          >
                                            <div className="absolute top-0 left-0 w-8 h-8 text-3xl text-gray-700 opacity-30">"</div>
                                            <div className="relative z-10 pl-4">{zombie.quote}</div>
                                            <div className="absolute bottom-0 right-0 w-8 h-8 text-3xl text-gray-700 opacity-30">"</div>
                                          </motion.div>
                                        )}
                                        
                                        <h3 className="text-xl font-bold text-red-400 mb-3">{zombie.name}</h3>
                                        <p className="text-gray-300 mb-4 line-clamp-2 flex-grow">{zombie.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
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
                                            {zombie.armor && <div className="bg-gray-800/80 p-2 rounded-lg">
                                                <span className="text-gray-400 block">护甲值</span>
                                                <span className="font-bold text-white">{zombie.armor}</span>
                                            </div>}
                                        </div>
                                        <button
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       viewDetails(zombieType);
                     }}
                                            className="mt-4 w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center">
                                            <i className="fa-solid fa-info-circle mr-2"></i>查看详情
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    // 按世界观混合显示植物和僵尸
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {/* 使用预处理好的数据进行渲染 */}
                           {combinedItemsData}
                    </motion.div>
                )}
                
                {(activeTab === "plants" && filteredPlants.length === 0 || activeTab === "zombies" && filteredZombies.length === 0) && <motion.div
                    className="text-center py-16"
                    initial={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    transition={{
                        duration: 0.5
                    }}>
                    <div className="text-8xl mb-6">
                        <i className="fa-solid fa-search text-gray-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-400 mb-3">未找到匹配的内容</h3>
                    <p className="text-gray-500 max-w-md mx-auto">请尝试使用其他关键词或分类进行搜索，或者查看我们的推荐内容。
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("全部");
                        }}
                        className="mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-900/30">
                        <i className="fa-solid fa-sync-alt mr-2"></i>重置筛选条件
                    </button>
                </motion.div>}
            </div>
            
              {showDetailModal && selectedItem && <motion.div
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                exit={{
                    opacity: 0
                }}
                transition={{
                    duration: 0.3
                }}
                className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClick={closeDetailModal}>
                <motion.div
                    initial={{
                        y: 50,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    exit={{
                        y: 50,
                        opacity: 0
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.1
                    }}
                    className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                    onClick={e => e.stopPropagation()}>
                    <button
                        onClick={closeDetailModal}
                        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 z-10">
                        <i className="fa-solid fa-times"></i>
                    </button>
                    
                    <div className="p-6">
                        {(() => {
                            // 优化配置获取逻辑，确保在activeTab变化时也能正确显示详情
                            let config = null;
                            const safeData = getSafeData();
                            
                            // 首先尝试从当前激活的标签中获取
                            if (activeTab === "plants") {
                              config = safeData.plants[selectedItem as PlantType];} else {
                              config = safeData.zombies[selectedItem as ZombieType];
                            }
                            
                            // 如果当前标签中没有找到，尝试从另一个标签中查找
                            if (!config) {
                              if (activeTab === "plants") {
                                config = safeData.zombies[selectedItem as ZombieType];
                              } else {
                                config= safeData.plants[selectedItem as PlantType];
                              }
                            }
                            
                            // 如果仍然没有找到，显示错误信息
                            if (!config) {
                                return (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400">无法加载此角色的详细信息</p>
                                        <button 
                                            onClick={closeDetailModal}
                                            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full transition-colors duration-200"
                                        >
                                            关闭
                                        </button>
                                    </div>
                                );
                            }
                            
                            // 确定是植物还是僵尸
                            const isPlant = "rarity" in config;
                            const itemConfig = isPlant ? config as typeof PLANTS_CONFIG[PlantType] : config as typeof ZOMBIES_CONFIG[ZombieType];
                            const itemImages = isPlant ? plantImages : zombieImages;
                            
                            if (isPlant) {
                                const plantConfig = itemConfig;
                                return (
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-1/3">
                                            <div className="relative overflow-hidden rounded-xl aspect-square">
                                                <motion.img
                                                    src={itemImages[selectedItem as PlantType]}
                                                    alt={plantConfig.name}
                                                    className="w-full h-full object-cover"
                                                    initial={{
                                                        scale: 1
                                                    }}
                                                    animate={{
                                                        scale: 1.05
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        repeatType: "reverse"
                                                    }} />
                                                <div
                                                    className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getRarityClass(plantConfig.rarity)} shadow-md`}>
                                                    {plantConfig.rarity}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-300">解锁信息</span>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full ${isUnlocked(plantConfig.unlockLevel) ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}`}>
                                                        {isUnlocked(plantConfig.unlockLevel) ? "已解锁" : `关卡 ${plantConfig.unlockLevel || 1} 解锁`}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-600 rounded-full h-1.5">
                                                    <div
                                                        className="bg-green-500 h-1.5 rounded-full"
                                                        style={{
                                                            width: `${isUnlocked(plantConfig.unlockLevel) ? 100 : 50}%`
                                                        }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full md:w-2/3">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-2xl font-bold text-green-400">{plantConfig.name}</h2>
                                                <span
                                                    className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-full flex items-center">
                                                        <i className="fa-solid fa-sun mr-1"></i> {plantConfig.cost}
                                                    </span>
                                            </div>
                                            <div className="mb-6">
                                              <div className={`relative transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-24'}`}>
                                                <p className="text-gray-300">{plantConfig.description}</p>
                                                 
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
                                            
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">生命值</span>
                                                    <span className="font-bold text-white text-lg">{plantConfig.health}</span>
                                                </div>
                                                <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">冷却时间</span>
                                                    <span className="font-bold text-white text-lg">{plantConfig.cooldown / 1000}秒</span>
                                                </div>
                                                {plantConfig.damage && <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">攻击力</span>
                                                    <span className="font-bold text-white text-lg">{plantConfig.damage}</span>
                                                </div>}
                                                {plantConfig.attackRange && <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">攻击范围</span>
                                                    <span className="font-bold text-white text-lg">
                                                        {plantConfig.attackRange === 99 ? "全图" : `前方 ${plantConfig.attackRange} 格`}
                                                    </span>
                                                </div>}
                                                {plantConfig.attackSpeed && <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">攻击速度</span>
                                                    <span className="font-bold text-white text-lg">{plantConfig.attackSpeed / 1000}秒/次</span>
                                                </div>}
                                            </div>
                                            
                                            {plantConfig.specialEffect && <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg mb-6">
                                                <span className="text-blue-300 font-medium flex items-center">
                                                    <i className="fa-solid fa-star mr-2"></i>特殊效果
                                                </span>
                                                <p className="text-blue-200 mt-2">{plantConfig.specialEffect}</p>
                                            </div>}
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg">
                                                    <span className="text-green-300 font-medium flex items-center">
                                                        <i className="fa-solid fa-thumbs-up mr-2"></i>最佳应对
                                                    </span>
                                                    <ul className="mt-2 space-y-1">
                                                        {(plantConfig.bestAgainst || []).map(
                                                            (item, index) => <li key={index} className="text-green-200 flex items-center">
                                                                <i className="fa-solid fa-check-circle mr-1 text-xs"></i> {item}
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                                <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
                                                    <span className="text-red-300 font-medium flex items-center">
                                                        <i className="fa-solid fa-thumbs-down mr-2"></i>最差应对
                                                    </span>
                                                    <ul className="mt-2 space-y-1">
                                                        {(plantConfig.worstAgainst || []).map(
                                                            (item, index) => <li key={index} className="text-red-200 flex items-center">
                                                                <i className="fa-solid fa-times-circle mr-1 text-xs"></i> {item}
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                const zombieConfig = itemConfig;
                                return (
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-1/3">
                                            <div className="relative overflow-hidden rounded-xl aspect-square">
                                                <motion.img
                                                    src={itemImages[selectedItem as ZombieType]}
                                                    alt={zombieConfig.name}
                                                    className="w-full h-full object-cover"
                                                    initial={{
                                                        scale: 1
                                                    }}
                                                    animate={{
                                                        scale: 1.05
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        repeatType: "reverse"
                                                    }} />
                                                <div
                                                    className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${getDifficultyClass(zombieConfig.difficulty)} shadow-md`}>
                                                    {zombieConfig.difficulty}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                                                <span className="text-gray-300 block mb-2">出现关卡</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {(zombieConfig.appearsIn || []).map(level => <span
                                                        key={level}
                                                        className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">关卡 {level}
                                                    </span>)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full md:w-2/3">
                                            <h2 className="text-2xl font-bold text-red-400 mb-4">{zombieConfig.name}</h2>
                                            <div className="mb-6">
                                              <div className={`relative transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-24'}`}>
                                                <p className="text-gray-300">{zombieConfig.description}</p>
                                                 
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
                                            
                                            <div className="grid grid-cols-2 gap-3 mb-6"><div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">生命值</span>
                                                    <span className="font-bold text-white text-lg">{zombieConfig.health}</span>
                                                </div>
                                                <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">移动速度</span>
                                                    <span className="font-bold text-white text-lg">{typeof zombieConfig.speed === 'number' ? zombieConfig.speed.toFixed(1) : '未知'}</span>
                                                </div>
                                                <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">攻击力</span>
                                                    <span className="font-bold text-white text-lg">{zombieConfig.damage}</span>
                                                </div>
                                                {zombieConfig.reward && <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">阳光奖励</span>
                                                    <span className="font-bold text-white text-lg">{zombieConfig.reward}</span>
                                                </div>}
                                                {zombieConfig.armor && <div className="bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-400 block text-sm">护甲值</span>
                                                    <span className="font-bold text-white text-lg">{zombieConfig.armor}</span>
                                                </div>}
                                            </div>
                                            
                                            {zombieConfig.specialAbility && <div className="p-4 bg-purple-900/30 border border-purple-800 rounded-lg mb-6">
                                                <span className="text-purple-300 font-medium flex items-center">
                                                    <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>特殊能力
                                                </span>
                                                <p className="text-purple-200 mt-2">{zombieConfig.specialAbility}</p>
                                            </div>}
                                            
                                            <div className="mb-6">
                                                <span className="text-green-300 font-medium flex items-center mb-3">
                                                    <i className="fa-solid fa-shield-halved mr-2"></i>弱点
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {(zombieConfig.weakness || []).map(
                                                        (weakness, i) => <span key={i} className="bg-green-900/30 text-green-200 px-3 py-1.5 rounded-lg">
                                                            {weakness}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {zombieConfig.strategy && (
                                                <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                                                    <span className="text-blue-300 font-medium flex items-center">
                                                        <i className="fa-solid fa-chess mr-2"></i>应对策略
                                                    </span>
                                                    <p className="text-blue-200 mt-2">{zombieConfig.strategy}</p>
                                                </div>
                                            )}
                                            
                                            {/* 查看关系图谱按钮 */}
                                            <button
                                              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center"
                                              onClick={() => {
                                                // 将当前角色ID作为参数传递
                                                const characterId = isPlant ? `plant_${selectedItem}` : `zombie_${selectedItem}`;
                                                navigate(`/character-relationships?focus=${characterId}`);
                                              }}
                                            >
                                              <i className="fa-solid fa-network-wired mr-2"></i> 查看关系图谱
                                            </button>
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                </motion.div>
            </motion.div>}
            
            <div className="mt-12 text-center text-gray-500 text-sm relative z-10">
                <p>植物保卫战图鉴 © 2025 - 掌握所有植物和僵尸的特性，才能取得最终胜利！</p>
                <p className="mt-2">使用 ↑ ↓ ← → 键可以浏览图鉴，空格键查看详情，ESC 键关闭详情</p>
        </div>

        {/* 更新历史模态框 - 实时版本更新 */}
        {showUpdateHistory && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeUpdateHistory}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-purple-900/50"
              onClick={(e) => e.stopPropagation()}
            >
               {/* 顶部栏 */}
               <div className="sticky top-0 z-10 bg-gray-900 p-4 rounded-t-xl border-b border-gray-700 flex justify-between items-center">
                 <h2 className="text-xl md:text-2xl font-bold text-purple-400 flex items-center">
                   <i className="fa-solid fa-chart-line mr-2"></i>
                   游戏更新历史
                 </h2>
                 <div className="flex items-center space-x-3">
                   {/* 版本信息 */}
                   <span className="bg-gradient-to-r from-blue-700 to-indigo-800 text-blue-100 rounded-full text-sm px-3 py-1 flex items-center font-bold">
                     当前版本: {getGameVersion().version}
                   </span>
                   {/* 更新计数 */}
                   <span className="bg-purple-900/50 text-purple-300 rounded-full text-sm px-3 py-1 flex items-center">
                     共 {GAME_UPDATES.length} 项更新
                   </span>
                  
                  {/* 关闭按钮 */}
                  <button
                    onClick={closeUpdateHistory}
                    className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* 最新更新高亮 */}
                {GAME_UPDATES.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative mb-8 overflow-hidden bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-xl p-6 border border-purple-700/50 shadow-lg"
                  >
                    {/* 高亮标记 */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                      <i className="fa-solid fa-bolt mr-1"></i> 最新
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 flex items-center">
                          <i className="fa-solid fa-star text-yellow-400 mr-2"></i>
                          {GAME_UPDATES[0].title}
                        </h3>
                        <p className="text-gray-400 text-sm">{GAME_UPDATES[0].date} ({formatUpdateTime(GAME_UPDATES[0].date)})</p>
                      </div>
                      <div className="mt-2 md:mt-0 px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">
                        更新 #{GAME_UPDATES[0].id}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-5">{GAME_UPDATES[0].description}</p>
                    
                    <div className="space-y-4">
                      {GAME_UPDATES[0].changes.map((change, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border ${
                            change.type === 'feature' ? 'bg-green-900/20 border-green-800' :
                            change.type === 'balance' ? 'bg-blue-900/20 border-blue-800' :
                            change.type === 'bugfix' ? 'bg-yellow-900/20 border-yellow-800' :
                            'bg-purple-900/20 border-purple-800'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`mt-1 mr-3 p-2 rounded-full ${
                              change.type === 'feature' ? 'bg-green-800' :
                              change.type === 'balance' ? 'bg-blue-800' :
                              change.type === 'bugfix' ? 'bg-yellow-800' :
                              'bg-purple-800'
                            }`}>
                              <i className={`fa-solid text-white ${
                                change.type === 'feature' ? 'fa-star' :
                                change.type === 'balance' ? 'fa-scale-balanced' :
                                change.type === 'bugfix' ? 'fa-wrench' :
                                'fa-paint-brush'
                              }`}></i>
                            </div>
                            <div>
                              <h4 className={`font-bold mb-1 ${
                                change.type === 'feature' ? 'text-green-400' :
                                change.type === 'balance' ? 'text-blue-400' :
                                change.type === 'bugfix' ? 'text-yellow-400' :
                                'text-purple-400'
                              }`}>
                                {change.title}
                              </h4>
                              <p className="text-gray-300 text-sm">{change.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 背景装饰 */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                  </motion.div>
                )}
                
                {/* 历史更新列表 */}
                {GAME_UPDATES.length > 1 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center">
                      <i className="fa-solid fa-history mr-2"></i>
                      历史更新
                    </h3>
                    
                    <div className="space-y-6">
                      {GAME_UPDATES.slice(1).map((update) => (
                        <motion.div
                          key={update.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * parseInt(update.id) }}
                          className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{update.title}</h3>
                              <p className="text-gray-400 text-sm">{update.date} ({formatUpdateTime(update.date)})</p>
                            </div>
                            <div className="mt-2 md:mt-0 px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">
                              更新 #{update.id}
                            </div>
                          </div>
                          
                          <p className="text-gray-300 mb-5">{update.description}</p>
                          
                          <div className="space-y-4">
                            {update.changes.map((change, index) => (
                              <div 
                                key={index} 
                                className={`p-4 rounded-lg border ${
                                  change.type === 'feature' ? 'bg-green-900/20 border-green-800' :
                                  change.type === 'balance' ? 'bg-blue-900/20 border-blue-800' :
                                  change.type === 'bugfix' ? 'bg-yellow-900/20 border-yellow-800' :
                                  'bg-purple-900/20 border-purple-800'
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className={`mt-1 mr-3 p-2 rounded-full ${
                                    change.type === 'feature' ? 'bg-green-800' :
                                    change.type === 'balance' ? 'bg-blue-800' :
                                    change.type === 'bugfix' ? 'bg-yellow-800' :
                                    'bg-purple-800'
                                  }`}>
                                    <i className={`fa-solid text-white ${
                                      change.type === 'feature' ? 'fa-star' :
                                      change.type === 'balance' ? 'fa-scale-balanced' :
                                      change.type === 'bugfix' ? 'fa-wrench' :'fa-paint-brush'
                                    }`}></i>
                                  </div>
                                  <div>
                                    <h4 className={`font-bold mb-1 ${
                                      change.type === 'feature' ? 'text-green-400' :
                                      change.type === 'balance' ? 'text-blue-400' :
                                      change.type === 'bugfix' ? 'text-yellow-400' :
                                      'text-purple-400'
                                    }`}>
                                      {change.title}
                                    </h4>
                                    <p className="text-gray-300 text-sm">{change.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 空状态处理 */}
                {GAME_UPDATES.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-4">📜</div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">暂无更新记录</h3>
                    <p className="text-gray-500">游戏将持续更新，敬请期待...</p>
                  </div>
                )}
                
                {/* 底部信息 */}
                <div className="mt-8 text-center">
                 <p className="text-gray-500 text-sm">植物保卫战 © 2025 - 持续更新中</p>
                 <p className="text-gray-600 text-xs mt-1">
                   版本: {getGameVersion().version} | 最近更新: {GAME_UPDATES.length > 0 ? formatUpdateTime(GAME_UPDATES[0].date) : '暂无更新'}
                 </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
            
            <div
                className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div
                    className="absolute top-1/4 left-10 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
                <div
                    className="absolute top-1/3 right-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
                <div
                    className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
            </div>
            
            <style jsx global>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0px, 0px); }
          33% { transform: scale(1.1) translate(30px, -50px); }
          66% { transform: scale(0.9) translate(-20px, 20px); }
          100% { transform: scale(1) translate(0px, 0px); }
        }
        .animate-blob {
                animation: blob 7s infinite;
              }
              .animate-pulse-glow {
                animation: pulse-glow 2s infinite;
              }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(30, 30, 30, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.5);
        }
      `}</style>
        </div>
    );
}