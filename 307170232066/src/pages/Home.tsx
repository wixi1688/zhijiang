import { useState, useEffect, useRef, useCallback } from 'react';
import PlantSelectionScreen from './PlantSelectionScreen';
import ZombieSelectionScreen from './ZombieSelectionScreen';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import StoryIcon from '../components/StoryIcon';
// 导入对话系统组件
import DialogueSystem from '../components/DialogueSystem';
import { 
  PlantType as GamePlantType, 
  ZombieType as GameZombieType,
  AttackRangeType,
  TargetSelectionStrategy,
  GAME_CONFIG as DataGameConfig
} from '../data/gameData';

  // 定义游戏中使用的类型
    type PlantType = GamePlantType | 'sunflower' | 'peashooter' | 'wallnut' | 'snowpea' | 'cherrybomb' | 'chomper' | 'repeater' | 'jalapeno' | 'tallnut' | 'cattail' | 'cobcannon' | 'wintermelon' | 'potatomine' | 'squash' | 'blover' | 'garlic' | 'pumpkin' | 'magnetshroom' | 'sunshroom' | 'fumeshroom' | 'gravebuster' | 'coffeebean' | 'starfruit' | 'kernelpult' | 'umbrellaleaf' | 'spikerock' | 'threepeater' | 'splitpea' | 'iceberglettuce' | 'doomshroom' | 'hypnoshroom' | 'lilypad' | 'plantern' | 'tanglekelp' | 'seaweed' | 'goldenflower' | 'spitfirepea' | 'explodeonut' | 'electricpea' | 'poisonivy' | 'laserbean' | 'goldmagnet' | 'shancatleader' | 'xuqinglan' | 'yijiu' | 'xuqinglan_god' | 'xuqinglan_dream' | 'mumu';

  // 定义僵尸类型
  type ZombieType = GameZombieType;

  // 定义植物技能类型
  type PlantAbilityType = 'holy_purification' | 'holy_wave' | 'holy_field' | 'holy_shield' | 'holy_explosion';

  type GameStatus = 'ready' | 'playing' | 'paused' | 'gameover' | 'victory';
  type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
  type AchievementType = 'light_awakening' | 'sun_avatar' | 'shadow_hunter' | 'unbreakable_light' | 'light_army_commander' | 'light_defender' | 'light_retribution' | 'life_force' | 'shadow_reaper' | 'light_combo' | 'light_barrier' | 'shadow_resister' | 'water_defender' | 'light_victory' | 'light_descend' | 'shancat_redemption' | 'su_huai_fall';
  type AutoAttackerType = 'ultraman_zero'; // 自动攻击角色类型
  // 天气类型
  type WeatherType = 'sunny' | 'rainy' | 'foggy' | 'sandstorm' | 'snowy';
  // 特殊事件类型
  type SpecialEvent = 'boss_battle' | 'sun_storm' | 'zombie_invasion';
  // 植物升级等级类型
  type PlantUpgradeLevel = 1 | 2 | 3;

// 植物配置接口
interface PlantConfig {
  name: string;
  cost: number;
  cooldown: number;
  health: number;
  damage?: number;
  attackRange?: number;
  attackRangeType: AttackRangeType;
  attackSpeed?: number;
  targetSelection: TargetSelectionStrategy;
  specialEffect?: string;
  description: string;
  category: string;
  rarity: string;
  bulletSpeed?: number;
  bulletPierce?: number;
  aoeRadius?: number;
}

  // 游戏配置常量（优化后平衡调整）
  const GAME_CONFIG = {
    gridSize: { rows: 6, cols: 15 }, // 保持地图大小
    cellSize: { width: 80, height: 80 },
    maxSun: 9999,
    initialSun: 200, // 增加开局阳光数量到200，让玩家能更快建立防线
    sunProductionRate: 1500, // 进一步缩短阳光自动生成间隔(ms)到1500，提升游戏节奏
    sunValue: 30, // 提高每个阳光的值到30，让阳光收集更有价值
    // 为不同难度设置不同的僵尸数量上限
    maxZombiesPerWave: {
      easy: 8,    // 简单难度每波最多8个僵尸
      medium: 10, // 中等难度每波最多10个僵尸
      hard: 12,   // 困难难度每波最多12个僵尸
      expert: 15  // 专家难度每波最多15个僵尸
    },
    waveInterval: 25000, // 略微缩短波次间隔，加快游戏节奏
    gameSpeed: 1,
    plantCooldownMultiplier: 0.7, // 略微缩短植物冷却时间，提升游戏流畅度
    zombieSpeedMultiplier: 0.75, // 略微调整僵尸速度平衡
    meteoriteCooldown: 10000, // 延长陨石冷却时间，减少自动清场能力，增加策略性
    gameTipsInterval: 15000, // 游戏提示间隔（毫秒）
    comboMultiplierThreshold: 3, // 连击奖励阈值
    comboMultiplier: 1.5, // 连击奖励倍数
    // 新增配置：僵尸生成权重系统
        zombieTypeWeights: {
          easy: {
            su_huai: 10
          },
          medium: {
            su_huai: 10
          },
          hard: {
            su_huai: 10
          },
          expert: {
            su_huai: 10
          }
        }
  };

  // 植物配置（参考官方平衡调整）
  const PLANTS: Record<PlantType, { 
  name: string; 
  cost: number; 
  cooldown: number; 
  health: number;
  damage?: number;
  attackRange?: number;
  attackSpeed?: number;
  specialEffect?: string;
  rarity?: string;
  category?: string;
}> = {
  shancatleader: {
      name: '善•猫教主',
      cost: 350, // 略微提高成本以匹配增强的能力
      cooldown: 2500, // 冷却时间缩短，提高可用性
      health: 15000, // 全面强化：生命值大幅提升
      damage: 2000, // 全面强化：攻击力大幅提升
      attackRange: 2, // 攻击范围扩大，从1格增加到2格
      attackSpeed: 600, // 全面强化：攻击速度大幅提升
      specialEffect: '可以移动的植物，每1秒向右移动一格，遇到僵尸时停止移动并进行战斗；对猫教主僵尸造成额外800%伤害；击杀僵尸后获得额外150阳光奖励；移动时免疫攻击和负面效果；受到致命伤害时会回到初始位置并恢复100%生命值，并且在接下来的5秒内获得无敌状态；每消灭1个僵尸后进入"圣猫形态"，持续12秒，移动速度提升150%，攻击力提升100%，且在形态期间免疫所有负面效果；普通攻击有60%几率触发"光明冲击"，对目标造成额外伤害并眩晕4秒；每8秒可以使用一次"光明冲刺"，立即向前移动8格并对路径上的所有僵尸造成伤害，且在冲刺过程中无敌；在场时，周围6格内的植物获得30%攻击速度加成和25%伤害提升；新增高级被动技能：光明之怒，每次攻击有40%几率召唤光明能量波，对前方3格内的所有僵尸造成伤害；新增终极技能：猫神降临，每消灭8个僵尸后，可以释放一次全屏AOE伤害并恢复自身70%生命值；新增被动技能：光明守护，每2秒恢复自身3%最大生命值；新增被动技能：灵魂净化，每次攻击有20%几率净化目标，使其受到的伤害增加20%，持续5秒；新增特性：在圣猫形态下，攻击范围扩大至3格。',
      rarity: '传说', // 稀有度提升至传说
      category: '光明使者'
    },
  qingyuan: {
      name: '清鸢',
      cost: 500,
      cooldown: 3000,
      health: 100000,
      damage: 1000,
      attackRange: 99,
      attackSpeed: 500,
      specialEffect: '每0.8秒产生80阳光；场上出现僵尸时，自动攻击，攻击数量为场上僵尸数+3；免疫减速、控制效果和所有负面状态；对特殊僵尸造成额外100%伤害；每消灭8个僵尸获得一个神圣护盾，可抵挡一次致命伤害；每10秒释放一次神圣光波，清除全屏负面效果；每30秒召唤一次神圣领域，持续5秒，期间所有植物攻击力提升50%；对所有类型僵尸造成额外伤害（巨人+30%、飞行+40%、潜水+50%、特殊+100%）；周围3格内的植物获得20%伤害减免；死亡时触发神圣爆发，对全屏僵尸造成3000点伤害并眩晕3秒；拥有自动瞄准系统，优先攻击血量最高的僵尸；受到攻击时有30%概率反弹50%伤害'
    },
  xuqinglan: {
      name: '徐清岚（魔法少女）',
      cost: 400,
      cooldown: 3000,
      health: 8000,
      damage: 1500,
      attackRange: 6,
      attackSpeed: 800,
      specialEffect: '成长型植物，拥有三级进化阶段：一级时通过笔墨写符咒攻击前方；二级时形成魔法阵，多只笔作宝剑和符咒一起攻击，攻击速度提升至原来的2倍，攻击范围扩大至周围1格，变为范围型攻击；三级时进化为法杖形态，继续多只笔一起成宝剑魔法阵攻击，进入终极阶段，大范围攻击（前方3x3区域），同时伴有增幅己方植物攻击力25%、削弱僵尸防御力20%的作用；对火属性僵尸造成额外150%伤害；每次攻击有30%几率触发"魔法连击"，额外发射一道符咒攻击；随着游戏时间推移，自动提升至更高等级，每20秒自动升级一级；达到三级后，每消灭5个僵尸可获得一次额外的魔法能量爆发，短暂提升所有能力（攻击速度+50%、伤害+30%，持续8秒）；免疫所有减速和控制效果；普通攻击有20%几率造成"魔法标记"，使目标受到的后续魔法伤害增加10%，持续5秒；三级形态时，每15秒释放一次"光明守护"，为周围3格内所有植物恢复10%最大生命值；与善•猫教主同时在场时，两人获得20%伤害减免和15%攻击速度提升，形成"光明搭档"效果。',
      rarity: '传说',
      category: '魔法使者'
    },
    xuqinglan_student: {
      name: '徐清岚（修习者）',
      cost: 450,
      cooldown: 3500,
      health: 6000,
      damage: 1800,
      attackRange: 7,
      attackSpeed: 700,
      specialEffect: '徐清岚的另一形态，拥有比"徐清岚（魔法少女）"更强的元素魔法，能将魔法发挥到极致；每次攻击有40%几率触发"元素爆发"，额外发射一道强大的元素魔法，对目标造成额外伤害；对黑暗魔法增强的僵尸造成额外200%伤害；受到攻击时有20%几率触发"魔法护盾"，免疫下一次伤害；每消灭3个僵尸获得一次魔法能量积累，达到3层时释放一次全屏魔法能量爆发，对所有僵尸造成当前伤害值的50%伤害；与善•猫教主同时在场时，两人获得25%伤害减免和20%攻击速度提升，形成"强化光明搭档"效果；三级形态时，每12秒释放一次"魔力守护"，为周围4格内所有植物恢复15%最大生命值；每10秒随机获得一种元素强化（火、水、风、土），持续15秒，各元素强化提供不同效果；拥有极高的魔法天赋，但血量较少，需要其他植物保护。',
      rarity: '传说',
      category: '魔法使者'
    },
    yijiu: {
      name: '屹九',
      cost: 150,
      cooldown: 1500,
      health: 500,
      damage: 30,
      attackRange: 3,
      attackSpeed: 2000,
      specialEffect: '来自于人类世界，喜欢吃糖葫芦，呆萌的形象让敌人对其的攻击减半；当受到攻击时，有30%几率使攻击者陷入迷惑状态，持续3秒；周围3格内的植物获得15%伤害减免；对巨人僵尸的攻击减半效果提升至70%；免疫所有控制效果；每消灭1个僵尸恢复自身5%最大生命值；受到致命伤害时会进入防御姿态，持续5秒，期间受到的伤害减少80%',
      rarity: '普通',
      category: '防御型植物'
   },
  mumu: {
    name: '沐沐',
    cost: 650,
    cooldown: 3500,
    health: 150000,
    damage: 2500,
    attackRange: 99,
    attackSpeed: 600,
    specialEffect: '冰属性攻击，对暗影属性敌人造成额外200%伤害；每次攻击有60%几率触发"冰之束缚"，使目标减速50%，持续3秒；每消灭1个僵尸获得一个"冰之护盾"，可抵挡一次伤害；每12秒释放一次"冰雪领域"，清除全屏负面效果并为所有植物提供15%伤害减免，持续8秒；在场时，周围8格内的所有植物受到的冰属性伤害提升20%；免疫减速和控制效果；受到攻击时有70%几率反弹50%伤害并减速攻击者；新增主动技能："冰之封锁"，可手动触发，立即对所有僵尸造成4000点伤害并附加冰冻效果，冷却时间30秒；新增被动技能："冰雪之心"，每秒恢复自身1.5%最大生命值；新增特性：当生命值低于30%时，获得"冰茧守护"，免疫所有伤害，持续5秒，每场战斗只能触发一次。',
    rarity: '史诗',
    category: '冰属性法师'
  }
  };

  // 僵尸配置（参考官方平衡调整）
  const ZOMBIES: Record<ZombieType, {
    name: string;
    health: number;
    speed: number;
    damage: number;
    reward?: number;
    armor?: number;
    specialAbility?: string;
    description?: string;
  }> = {
    // 只保留宿槐僵尸
    su_huai: {
      name: '宿槐',
      health: 50000, // 大幅提升生命值
      speed: 0.35, // 略微提升移动速度
      damage: 3000, // 大幅提升攻击力
      reward: 10000, // 大幅提升阳光奖励
      armor: 5000, // 大幅提升护甲值
      specialAbility: '1.成长型僵尸：随出现在场上的时间增加而增强，当出现时间达到3分钟时，“宿槐”属性达到最大，之后属性不在增长，在3分钟内，每次增强，“宿槐”状态均会恢复到最好;2.召唤僵尸：“宿槐”可以召唤其他种类僵尸加入战场;3.暗影护盾：每20秒生成一个暗影护盾，吸收3000点伤害;4.诅咒光环：周围5格内的植物攻击速度降低30%;5.生命吸取：每次攻击恢复自身20%造成的伤害',
        description: '宿槐是拥有神秘力量的成长型终极BOSS级僵尸，曾经是光明大陆备受尊崇的精灵公主。在被黑暗力量侵蚀后，她获得了操控暗影的强大能力，并成为暗影世界的绝对统治者。随着战斗时间的推移，她的力量会不断增强，同时还能召唤各种强大的随从僵尸为她作战。宿槐的出现预示着一场空前艰难的战斗即将开始，她强大的暗影护盾、诅咒光环和生命汲取能力使她成为所有植物的噩梦，只有最强大、最策略性的植物防线才能有希望抵挡她的进攻。'
    },
    ji_zai: {
      name: '季灾',
      health: 15000,
      speed: 0.5,
      damage: 1200,
      armor: 2000,
      reward: 3000,
      specialAbility: '暗影领域：每15秒生成一个暗影领域，范围内的植物攻击力降低40%，持续8秒；虚弱诅咒：每次攻击有30%概率使目标植物的防御力降低30%，持续5秒；生命汲取：每次攻击恢复自身10%造成的伤害；暗影之盾：免疫减速和控制效果；暗影亲和：当宿槐在场上时，季灾获得25%伤害减免和15%移动速度加成；极致的暗：对光明属性的植物造成额外120%伤害',
      description: '季灾是暗影大陆的顶级阴阳师，代表极致的暗。他与离火是双胞胎，两人在暗影大陆诞生时就已存在，但踪迹极少有人清楚。季灾拥有极强的削弱植物能力，能通过暗影领域和诅咒大幅降低植物的战斗能力，是宿槐进攻人类世界的重要助力。'
    },
    li_huo: {
      name: '离火',
      health: 12000,
      speed: 0.6,
      damage: 1000,
      armor: 1500,
      reward: 2500,
      specialAbility: '火焰领域：每20秒生成一个火焰领域，范围内的僵尸获得25%攻击力提升和15%移动速度提升，持续10秒；燃烧之魂：每次攻击使目标植物燃烧，每秒受到相当于自身攻击力15%的额外伤害，持续3秒；生命强化：每消灭一个植物，周围5格内的所有僵尸恢复20%最大生命值；火焰亲和：当宿槐在场上时，离火获得20%攻击力提升和20%生命恢复速度加成；极致的火：对冰系植物造成额外150%伤害',
      description: '离火是暗影大陆的顶级阴阳师，代表极致的火。他与季灾是双胞胎，两人在暗影大陆诞生时就已存在，但踪迹极少有人清楚。离火拥有极强的增益僵尸能力，能通过火焰领域和强化效果大幅提升僵尸的战斗能力，是宿槐进攻人类世界的重要助力。'
    }
  };

// 关卡配置
const LEVELS: Record<number, {
  waves: number;
  zombieTypes: ZombieType[];
  difficulty: GameDifficulty;
  isEndless?: boolean; // 标识是否为无尽模式
  isHighIntensityCustom?: boolean; // 标识是否为高强度自定义模式
}> = {
  1: {
    waves: 3,
    zombieTypes: ['su_huai'],
    difficulty: 'easy'
  },
  2: {
    waves: 5,
    zombieTypes: ['su_huai'],
    difficulty: 'medium'
  },
  3: {
    waves: 7,
    zombieTypes: ['su_huai'],
    difficulty: 'hard'
  },
  // 夜晚关卡（第4关）：阳光生成减少，僵尸速度加快
  4: {
    waves: 10,
    zombieTypes: ['su_huai'],
    difficulty: 'hard'
  },
  // 泳池关卡（第5关）：有水池格子限制，增加策略性
  5: {
    waves: 12,
    zombieTypes: ['su_huai'],
    difficulty: 'hard'
  },
  // 屋顶关卡（第6关）：需要先种植花盆才能种植植物
  6: {
    waves: 15,
    zombieTypes: ['su_huai'],
    difficulty: 'expert'
  },
  // 浓雾关卡（第7关）：视野受限，僵尸更难被发现
  7: {
    waves: 18,
    zombieTypes: ['su_huai'],
    difficulty: 'expert'
  },
  // 终极BOSS关卡（第8关）：有强大的僵尸王和随从僵尸出现
  8: {
    waves: 20,
    zombieTypes: ['su_huai'],
    difficulty: 'expert'
  },
  // 无尽模式（第9关）：无限波次，难度逐渐增加
  9: {
    waves: 999, // 很大的数字表示无限波次
    zombieTypes: ['su_huai'],
    difficulty: 'expert',
    isEndless: true
  },
  // 高强度自定义关卡（第10关）
  10: {
    waves: 15,
    zombieTypes: ['su_huai'],
    difficulty: 'expert',
    isHighIntensityCustom: true // 标记为高强度自定义模式
  },
  xuqinglan_god: {
    name: '徐清岚（神）',
    cost: 650,
    cooldown: 2000,
    health: 200000,
    damage: 2500,
    attackRange: 99,
    attackSpeed: 400,
    specialEffect: '神秘的终极形态，拥有超越常规的能力；每0.3秒产生150阳光；场上出现僵尸时，自动攻击，攻击数量为场上僵尸数+8；免疫减速、控制效果和所有负面状态；对所有类型的僵尸造成额外200%伤害；每消灭2个僵尸获得一个神圣护盾，可抵挡一次致命伤害；每8秒释放一次神秘光波，清除全屏负面效果并恢复所有植物10%最大生命值；每20秒召唤一次神秘领域，持续12秒，期间所有植物攻击力提升100%，防御力提升50%；对所有类型僵尸造成额外伤害（巨人+80%、飞行+90%、潜水+100%、特殊+250%）；周围8格内的植物获得60%伤害减免和20%攻击速度提升；死亡时触发神秘爆发，对全屏僵尸造成10000点伤害并眩晕10秒；受到攻击时有80%概率反弹100%伤害；新增主动技能：神秘净化，可手动触发，立即清除全屏负面效果并对所有僵尸造成5000点伤害，冷却时间30秒；新增被动技能：神秘守护，每秒恢复自身3%最大生命值',
    rarity: '传说',
    category: '神秘使者'
  }
};

// 游戏实体基类
class GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  
  constructor(x: number, y: number, width: number, height: number, health: number) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.maxHealth = health;
  }
  
  // 基础碰撞检测
  isColliding(other: GameObject): boolean {
    return this.x < other.x + other.width &&
           this.x + this.width > other.x &&
           this.y < other.y + other.height &&
           this.y + this.height > other.y;
  }
  
  // 受到伤害
  takeDamage(amount: number): boolean {
    this.health -= amount;
    return this.health <= 0;
  }
  
  // 渲染方法由子类实现
  render(ctx: CanvasRenderingContext2D): void {}
  
  // 更新方法由子类实现
  update(deltaTime: number): void {}
}

// 植物类
class Plant extends GameObject {
  type: PlantType;
  cost: number;
  cooldown: number;
  lastAttackTime: number;
  lastSunProductionTime: number;
  gridX: number;
  gridY: number;
  lastMoveTime: number; // 用于跟踪善•猫教主的移动时间
  
  constructor(type: PlantType, gridX: number, gridY: number) {
    const { width, height } = GAME_CONFIG.cellSize;
    const x = gridX * width;
    const y = gridY * height;
    super(x, y, width, height, PLANTS[type].health);
    
    this.type = type;
    this.cost = PLANTS[type].cost;
    this.cooldown = PLANTS[type].cooldown;
    this.lastAttackTime = 0;
    this.lastSunProductionTime = 0;
    this.gridX = gridX;
    this.gridY = gridY;
    this.lastMoveTime = Date.now(); // 初始化移动时间
  }
  
  // 检查是否可以攻击
  canAttack(currentTime: number): boolean {
    if (!PLANTS[this.type].attackSpeed) return false;
    return currentTime - this.lastAttackTime >= PLANTS[this.type].attackSpeed;
  }
  
  // 检查是否可以生产阳光
   canProduceSun(currentTime: number): boolean {
     if (this.type === 'sunflower') {
       return currentTime - this.lastSunProductionTime >= 8000;
     }
     // 阳光菇的特殊处理
     else if (this.type === 'sunshroom') {
       return currentTime - this.lastSunProductionTime >= 10000; // 阳光菇生产阳光间隔更长
     }
     return false;
  }
  
  // 攻击方法
  attack(): Bullet | null {
    if (this.type === 'peashooter' || this.type === 'snowpea' || this.type === 'cattail' || this.type === 'qingyuan') {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 4;
      const damage = PLANTS[this.type].damage || 0;
      const isFrozen = this.type === 'snowpea';
      
      return new Bullet(centerX, centerY, damage, isFrozen);
    }
    return null;
  }
  
  // 爆炸方法(用于樱桃炸弹)
  explode(): boolean {
    if (this.type === 'cherrybomb') {
      return true;
    }
    return false;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    // 使用动漫风格图片代替Canvas绘制
    ctx.save();
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    // 设置3D阴影效果
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
      // 植物图片映射 - 这些URL用于植物选择栏的图片显示
      // 在游戏画布中使用了占位绘制而非直接使用这些图片
      const plantImages: Record<PlantType, string> = {
        sunflower: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20sunflower%20magical%20girl%20yellow%20dress%20flower%20hat%20smiling%20cute%20big%20eyes%20chibi%20style&sign=a5ef4dc2f92c2d489618b68e7c3f699c",
        peashooter: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20peashooter%20green%20outfit%20peapod%20weapon%20smiling%20cute%20big%20eyes%20chibi%20style&sign=60927ea48d86beda8af15dd3912ac5c1",
        wallnut: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20nut%20defender%20brown%20outfit%20nut%20hat%20strong%20cute%20big%20eyes%20chibi%20style&sign=68ce72d463b91d52b23d9123c10e8c68",
        snowpea: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20ice%20magical%20girl%20blue%20dress%20snowflake%20weapon%20smiling%20cute%20big%20eyes%20chibi%20style&sign=3ccbae69a757ee008c31db76d6b4b95a",
        cherrybomb: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20cherry%20bomb%20pink%20dress%20explosive%20magic%20smiling%20cute%20big%20eyes%20chibi%20style&sign=4a2114b9bcf6be8d13df05c80d1f8b03",
        qingyuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/微信图片_20251016111846_103_92_20251016111910.jpg",
       chomper: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20big%20mouth%20green%20dress%20plant%20character%20smiling%20cute%20big%20eyes%20chibi%20style&sign=c5c4eed326f0abacb990a10dd8d4efc8",
       repeater: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20twin%20peashooters%20green%20dress%20twin%20weapons%20smiling%20cute%20big%20eyes%20chibi%20style&sign=2f8d0cd12c2ce4ecfc1208fd041e79e5",
       jalapeno: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20fire%20magical%20girl%20red%20dress%20flame%20weapon%20smiling%20cute%20big%20eyes%20chibi%20style&sign=f62cbd69bdd6a0f3cb3da7a7e5dc06b9",
       tallnut: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20tall%20nut%20defender%20brown%20outfit%20tall%20nut%20hat%20strong%20cute%20big%20eyes%20chibi%20style&sign=d854a3ac1cc7cb8827e41eb33f237fe4",
       cattail: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20purple%20wizard%20purple%20dress%20homing%20missile%20magic%20smiling%20cute%20big%20eyes%20chibi%20style&sign=f5d211a24b054f8c2293ae9415895e6c",
       cobcannon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20artillery%20cannon%20yellow%20dress%20cannon%20weapon%20smiling%20cute%20big%20eyes%20chibi%20style&sign=76b64a2a9bcdad707ee9b44bcedd6118",
       wintermelon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20ice%20melon%20blue%20dress%20aoe%20magic%20smiling%20cute%20big%20eyes%20chibi%20style&sign=f7defc18a8177fb09be001a777f8db1f",
       // 补全剩余的植物图片映射 - 这些将用于植物选择栏显示
       potatomine: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20potato%20mine%20brown%20outfit%20explosive%20magic%20cute%20big%20eyes%20chibi%20style&sign=e01f02a9c2a719d08a27b7a4e402e8ee",
       squash: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20squash%20orange%20dress%20heavy%20weight%20cute%20big%20eyes%20chibi%20style&sign=211b9f0e19790fdd93e2f62077f951bd",
       blover: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20clover%20green%20dress%20wind%20magic%20cute%20big%20eyes%20chibi%20style&sign=8a6aee0ec8470f76b65084f071735ef5",
       garlic: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20garlic%20white%20dress%20scent%20magic%20cute%20big%20eyes%20chibi%20style&sign=1b07197826255348262350f134c615eb",
       pumpkin: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20pumpkin%20orange%20dress%20protective%20magic%20cute%20big%20eyes%20chibi%20style&sign=ad601a7c09a7760936ae513ba06e2e71",
       magnetshroom: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20magnet%20purple%20dress%20magnetic%20magic%20cute%20big%20eyes%20chibi%20style&sign=a71da8630dab8c4497d6179725e4231c",
       sunshroom: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20sun%20mushroom%20yellow%20dress%20small%20cute%20big%20eyes%20chibi%20style&sign=67f17fb9bd446012284b6e86eecb9c97",
       fumeshroom: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20fume%20mushroom%20purple%20dress%20poison%20magic%20cute%20big%20eyes%20chibi%20style&sign=33fbfa1a2cd23569f24006799e2d32d6",
       doomshroom: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20doom%20mushroom%20black%20dress%20dark%20magic%20cute%20big%20eyes%20chibi%20style&sign=b838e6167afb0a5243def608804344e1",
       hypnoshroom: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20hypno%20mushroom%20purple%20dress%20mind%20control%20magic%20cute%20big%20eyes%20chibi%20style&sign=bb95e4233440ef8f7b589b7a405bcd04",
       lilypad: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20lily%20pad%20green%20dress%20water%20magic%20cute%20big%20eyes%20chibi%20style&sign=3579033884c104c99ee405a21a9e130d",
       plantern: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20lantern%20yellow%20dress%20light%20magic%20cute%20big%20eyes%20chibi%20style&sign=5599f762bff857457956f814cc5e9ea6",
       tanglekelp: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20tangle%20kelp%20blue%20dress%20seaweed%20magic%20cute%20big%20eyes%20chibi%20style&sign=fc8242786a81034205909b979ebcbee8",
       seaweed: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20seaweed%20blue%20dress%20ocean%20magic%20cute%20big%20eyes%20chibi%20style&sign=5e496bc4f74368846bd4800ba7621b9d",
       goldenflower: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20golden%20flower%20gold%20dress%20treasure%20magic%20cute%20big%20eyes%20chibi%20style&sign=ca3605135a40903fda7cf46a8cd7d6ea",
       spitfirepea: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20fire%20pea%20shooter%20red%20dress%20flame%20magic%20cute%20big%20eyes%20chibi%20style&sign=ed537720847c3c477a68c114201c818e",
       explodeonut: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20exploding%20nut%20brown%20dress%20explosive%20defense%20cute%20big%20eyes%20chibi%20style&sign=84e7630d2f1c1207d9939c22f348f6b8",
       electricpea: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20electric%20pea%20shooter%20blue%20dress%20electricity%20magic%20cute%20big%20eyes%20chibi%20style&sign=bc076d601c5d9e1b6abfa4acb9db3cf8",
       poisonivy: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20poison%20ivy%20green%20dress%20poison%20magic%20cute%20big%20eyes%20chibi%20style&sign=ac7c4d81852c214b6c160ae96c279c20",
       laserbean: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20laser%20bean%20cyan%20dress%20laser%20magic%20cute%20big%20eyes%20chibi%20style&sign=90e61b50922a5fbba0a098eb94a25cd1",
       goldmagnet: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20gold%20magnet%20yellow%20dress%20gold%20attraction%20magic%20cute%20big%20eyes%20chibi%20style&sign=3b16a8a0a356ff85c9b2d565af5b098b",
       // 添加善•猫教主的图片
       shancatleader: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/善•猫教主_20251018115946.jpg"
     };
    
    // 创建图片对象
    const img = new Image();
    img.src = plantImages[this.type];
    
     // 为了确保渲染，使用已加载的图片逻辑
    // 由于Canvas绘制限制，我们使用占位绘制，实际游戏中应该使用预加载的图片
    const drawPlantPlaceholder = () => {
      // 创建图片对象
      const img = new Image();
      img.src = plantImages[this.type];
      
      // 先绘制一个占位色块（当图片加载失败时显示）
      const colors: Record<PlantType, string> = {
        shancatleader: '#FFD700',
       sunflower: '#FFFACD',
       peashooter: '#98FB98',
       wallnut: '#D2691E',
       snowpea: '#87CEFA',
       cherrybomb: '#FFB6C1',
       chomper: '#228B22',
       repeater: '#98FB98',
       jalapeno: '#FFA07A',
       tallnut: '#D2691E',
       cattail: '#E6E6FA',
       cobcannon: '#FFF8DC',
       wintermelon: '#B0E0E6',
       potatomine: '#A0522D',
       squash: '#FFA500',
       blover: '#90EE90',
       garlic: '#FFFFF0',
       pumpkin: '#FF8C00',
       magnetshroom: '#9370DB',
       sunshroom: '#FFFFE0',
       fumeshroom: '#8A2BE2',
       doomshroom: '#4B0082',
       hypnoshroom: '#BA55D3',
       lilypad: '#7CFC00',
       plantern: '#FFD700',
       tanglekelp: '#0000CD',
       seaweed: '#006400',
       goldenflower: '#FFD700',
       spitfirepea: '#FF6347',
       explodeonut: '#A0522D',
       electricpea: '#00CED1',
       poisonivy: '#32CD32',
       laserbean: '#40E0D0',
       goldmagnet: '#DAA520',
        qingyuan: '#FF69B4'
      };
      
      // 绘制3D效果的植物底座
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 20, 30, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 尝试绘制图片
      if (img.complete) {
        try {
          // 保存当前上下文状态
          ctx.save();
          
          // 设置图片阴影效果
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          
          // 绘制植物图片
          ctx.drawImage(img, centerX - 30, centerY - 30, 60, 60);
          
          // 恢复上下文状态
          ctx.restore();
        } catch (error) {
          console.error(`Failed to draw plant image for ${this.type}:`, error);
          // 图片绘制失败时回退到占位色块
          ctx.fillStyle = colors[this.type] || '#808080';
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, 30, 40, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // 图片尚未加载完成，使用占位色块
        ctx.fillStyle = colors[this.type] || '#808080';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 30, 40, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 添加植物类型标识
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(PLANTS[this.type].name, centerX, centerY);
      
      // 添加3D高光效果
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.ellipse(centerX - 10, centerY - 10, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 根据植物类型添加特色效果
      switch (this.type) {
         case 'sunflower':
         // 向日葵光芒效果
         ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
         for (let i = 0; i < 8; i++) {
           const angle = (i * Math.PI) / 4;
           const x1 = centerX + Math.cos(angle) * 35;
           const y1 = centerY + Math.sin(angle) * 35;
           const x2 = centerX + Math.cos(angle) * 50;
           const y2 = centerY + Math.sin(angle) * 50;
           ctx.beginPath();
           ctx.moveTo(x1, y1);
           ctx.lineTo(x2, y2);ctx.lineWidth = 3;
           ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
           ctx.stroke();
         }
         break;
         
        case 'snowpea':
        // 冰雪效果
        ctx.strokeStyle = 'rgba(135, 206, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
       case 'jalapeno':
       // 火焰效果
       ctx.fillStyle = 'rgba(255, 69, 0, 0.3)';
       ctx.beginPath();
       ctx.ellipse(centerX, centerY, 45, 50, 0, 0, Math.PI * 2);
       ctx.fill();
       break;
       
      case 'wintermelon':
      // 冰西瓜冰雪效果
      ctx.strokeStyle = 'rgba(135, 206, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
      ctx.stroke();
      break;
      
     case 'goldenflower':
     // 金盏花金光效果
     ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
     ctx.beginPath();
     ctx.ellipse(centerX, centerY, 40, 40, 0, 0, Math.PI * 2);
     ctx.fill();
     break;
     
    case 'electricpea':
    // 电能豌豆电光效果
    ctx.strokeStyle = 'rgba(0, 206, 209, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.stroke();
    break;
    
   case 'poisonivy':
   // 毒藤毒素效果
   ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
   ctx.lineWidth = 2;
   ctx.beginPath();
   ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
   ctx.stroke();
   break;
   
  case 'laserbean':
  // 激光豆激光效果
  ctx.strokeStyle = 'rgba(64, 224, 208, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX + 30, centerY);
  ctx.lineTo(centerX + 60, centerY);
  ctx.stroke();
  break;
  
   case 'qingyuan':
   // 清鸢特效升级 - 更华丽的视觉效果
   // 神圣光环
   const haloGradient = ctx.createRadialGradient(
     centerX, centerY, 0,
     centerX, centerY, 60
   );
   haloGradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
   haloGradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.3)');
   haloGradient.addColorStop(1, 'rgba(255, 215, 0, 0.1)');
   
   ctx.fillStyle = haloGradient;
   ctx.beginPath();
   ctx.ellipse(centerX, centerY, 60, 60, 0, 0, Math.PI * 2);
   ctx.fill();
   
   // 动态脉动效果
   const pulseSize = 65 + Math.sin(Date.now() / 500) * 5;
   ctx.strokeStyle = 'rgba(255, 105, 180, 0.6)';
   ctx.lineWidth = 2;
   ctx.beginPath();
   ctx.ellipse(centerX, centerY, pulseSize, pulseSize, 0, 0, Math.PI * 2);
   ctx.stroke();
   
   // 强化攻击射线效果
   ctx.strokeStyle = 'rgba(255, 105, 180, 0.9)';
   ctx.lineWidth = 3;
   ctx.setLineDash([]);
   
   // 增加更多射线
   const rayCount = 5;
   for (let i = 0; i < rayCount; i++) {
     const angle = (i * Math.PI) / (rayCount - 1) - Math.PI / 2;
     const rayLength = 40 + Math.random() * 20;
     const startX = centerX + Math.cos(angle) * 35;
     const startY = centerY + Math.sin(angle) * 35;
     const endX = centerX + Math.cos(angle) * (35 + rayLength);
     const endY = centerY + Math.sin(angle) * (35 + rayLength);
     
     ctx.beginPath();
     ctx.moveTo(startX, startY);
     ctx.lineTo(endX, endY);
     ctx.stroke();
     
     // 射线末端的能量粒子
     ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
     ctx.beginPath();
     ctx.arc(endX, endY, 3, 0, Math.PI * 2);
     ctx.fill();
   }
   
   // 中心神圣光芒
   ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
   ctx.beginPath();
   ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
   ctx.fill();
   break;
          // 已在上面定义过，避免重复
        // 其他植物类型可以添加各自特色效果
      }
    };
    
    // 绘制植物占位符
    drawPlantPlaceholder();
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
     
    // 绘制生命值
    if (this.health < this.maxHealth) {
      // 创建血条容器的渐变背景
      const bgGradient = ctx.createLinearGradient(this.x, this.y - 12, this.x, this.y - 6);
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      
      // 绘制圆角血条背景
      ctx.fillStyle = bgGradient;
      ctx.beginPath();
      ctx.roundRect(this.x, this.y - 12, this.width, 8, 4);
      ctx.fill();
      
      // 计算血条颜色（根据剩余血量变化）
      const healthRatio = this.health / this.maxHealth;
      let healthColor;
      if (healthRatio > 0.7) {
        healthColor = '#4CAF50'; // 绿色
      } else if (healthRatio > 0.3) {
        healthColor = '#FFC107'; // 黄色
      } else {
        healthColor = '#F44336'; // 红色
      }
      
      // 创建血条渐变
      const healthGradient = ctx.createLinearGradient(this.x, this.y - 12, this.x, this.y - 6);
      healthGradient.addColorStop(0, healthColor);
      healthGradient.addColorStop(1, `${healthColor}AA`);
      
      // 绘制圆角血条
      ctx.fillStyle = healthGradient;
      const healthBarWidth = (this.health / this.maxHealth) * (this.width - 4);
      ctx.beginPath();
      ctx.roundRect(this.x + 2, this.y - 10, healthBarWidth, 4, 2);
      ctx.fill();
      
      // 添加血条边框
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(this.x, this.y - 12, this.width, 8, 4);
      ctx.stroke();
      
      // 添加血量百分比文本
      if (healthRatio < 0.7) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const percentage = Math.round(healthRatio * 100);
        ctx.fillText(`${percentage}%`, this.x + this.width / 2, this.y - 8);
      }
    }
    
    ctx.restore();
  }
  
  update(deltaTime: number): void {
    // 植物基本更新逻辑
    
    // 处理善•猫教主的移动特性
    if (this.type === 'shancatleader') {
      const currentTime = Date.now();
      
      // 检查是否应该移动（每3秒移动一次）
      if (currentTime - this.lastMoveTime >= 3000) {
        // 检查右侧是否有僵尸，如果没有则移动
        const gameEngine = gameEngineRef.current;
        if (gameEngine) {
          // 检查当前行前方是否有僵尸
          const hasZombieInFront = gameEngine.zombies.some(zombie => {
            const zombieRow = Math.floor(zombie.y / GAME_CONFIG.cellSize.height);
            return zombieRow === this.gridY && zombie.x < this.x + this.width;
          });
          
          // 检查右侧格子是否有植物
          const hasPlantInNextCell = gameEngine.plants.some(plant => 
            plant.gridX === this.gridX + 1 && plant.gridY === this.gridY
          );
          
          // 检查是否在地图范围内
          const canMove = !hasZombieInFront && 
                          !hasPlantInNextCell && 
                          this.gridX + 1 < GAME_CONFIG.gridSize.cols;
          
          if (canMove) {
            // 移动到右侧格子
            this.gridX += 1;
            this.x = this.gridX * GAME_CONFIG.cellSize.width;
            this.lastMoveTime = currentTime;
          }
        }
      }
    }
  }
}

   // 僵尸类
class Zombie extends GameObject {
  type: ZombieType;
  speed: number;
  damage: number;
  armor: number;
  isSlowed: boolean;
  slowDuration: number;
  slowTime: number;
  lastAttackTime: number;
  attackCooldown: number;
  isEating: boolean;
  animationOffset: { x: number; y: number }; // 用于动画效果的偏移量
  hitEffect: { active: boolean; time: number }; // 被击中效果
  
    constructor(type: ZombieType, lane: number) {
       const { width, height } = GAME_CONFIG.cellSize;
       const x = GAME_CONFIG.gridSize.cols * width;
       const y = lane * height;
       // 获取原始生命值，添加防御性检查
       const zombieConfig = ZOMBIES[type] || {
         health: 1000,
         speed: 1,
         damage: 100,
         armor: 0
       };
       const baseHealth = zombieConfig.health;
       
       // 对于高强度自定义关卡，增强僵尸属性
       let enhancedHealth = baseHealth;
       const gameEngine = gameEngineRef.current;
       if (gameEngine && gameEngine.currentLevel && LEVELS[gameEngine.currentLevel]?.isHighIntensityCustom) {
         // 高强度自定义模式下，僵尸生命值增加50%
         enhancedHealth = Math.floor(baseHealth * 1.5);
       }
       
       super(x, y, width, height, enhancedHealth);
       
       this.type = type;
       this.speed = zombieConfig.speed;
       this.damage = zombieConfig.damage;
       this.armor = zombieConfig.armor || 0;
      this.isSlowed = false;
      this.slowDuration = 0;
      this.slowTime = 0;
      this.lastAttackTime = 0;
      this.attackCooldown = 1500;
      this.isEating = false;
      this.animationOffset = { x: 0, y: 0 };
      this.hitEffect = { active: false, time: 0 };
      
      // 跟踪宿槐的召唤时间，用于实现召唤CD
      if (type === 'su_huai') {
        this.lastSummonTime = 0;
        this.summonCooldown = 15000; // 15秒召唤冷却
      }
   }
  
  // 检查是否可以攻击
  canAttack(currentTime: number): boolean {
    return currentTime - this.lastAttackTime >= this.attackCooldown;
  }
  
  // 宿槐特有属性
  lastSummonTime: number = 0;
  summonCooldown: number = 15000; // 15秒召唤冷却
  
  // 检查是否可以召唤其他僵尸（宿槐特有）
  canSummon(currentTime: number): boolean {
    if (this.type !== 'su_huai') return false;
    return currentTime - this.lastSummonTime >= this.summonCooldown;
  }
  
  // 召唤其他僵尸（宿槐特有）
  summonZombies(): ZombieType[] {
    const summonedZombies: ZombieType[] = [];
    
    // 根据当前生命值确定召唤概率
    const isLowHealth = this.health < this.maxHealth * 0.5;
    const summonCount = isLowHealth ? 3 : 1; // 低血量时召唤更多僵尸
    
    for (let i = 0; i < summonCount; i++) {
      let summonedType: ZombieType;
      const rand = Math.random();
      
      if (isLowHealth) {
        // 低血量状态：Vexithra和猫教主的召唤概率更高
        if (rand < 0.4) {
          summonedType = 'cat_leader'; // 猫教主 40%
        } else if (rand < 0.75) {
          summonedType = 'vexithra'; // Vexithra 35%
        } else if (rand < 0.90) {
          summonedType = 'ji_zai'; // 季灾 15%
        } else {
          summonedType = 'li_huo'; // 离火 10%
        }
      } else {
        // 正常状态：猫教主概率最高，Vexithra次之，季灾和离火概率较低
        if (rand < 0.5) {
          summonedType = 'cat_leader'; // 猫教主 50%
        } else if (rand < 0.80) {
          summonedType = 'vexithra'; // Vexithra 30%
        } else if (rand < 0.90) {
          summonedType = 'ji_zai'; // 季灾 10%
        } else {
          summonedType = 'li_huo'; // 离火 10%
        }
      }
      
      summonedZombies.push(summonedType);
    }
    
    // 更新最后召唤时间
    this.lastSummonTime = Date.now();
    
    return summonedZombies;
  }
  
   // 受到伤害(考虑护甲)
  takeDamage(amount: number, isFrozen: boolean = false): boolean {
    let damageToApply = amount;
    
    // 激活被击中效果
    this.hitEffect.active = true;
    this.hitEffect.time = Date.now();
    
    // 处理护甲
    if (this.armor > 0) {
      const armorDamage = Math.min(damageToApply, this.armor);
      this.armor -= armorDamage;
      damageToApply -= armorDamage;
    }
    
  // 应用剩余伤害
  this.health -= damageToApply;
  
  // Vexithra特有：当宿槐在场时，获得伤害减免
  if (this.type === 'vexithra') {
    // 查找场上是否有宿槐
    const gameEngine = gameEngineRef.current;
    if (gameEngine) {
      const hasSuHuai = gameEngine.zombies.some(z => z.type === 'su_huai');
      if (hasSuHuai) {
        // 受到伤害时触发伤害减免效果
        const damageReduction = Math.floor(damageToApply * 0.2); // 20%伤害减免
        this.health += damageReduction;
      }
    }
  }
  
  // 处理冰冻效果
    if (isFrozen && this.type !== 'giant') {
      this.isSlowed = true;
      this.slowDuration = 3000;
      this.slowTime = Date.now();
    }
    
    return this.health <= 0;
  }
  
  // 更新僵尸状态
  update(deltaTime: number, plants: Plant[]): void {
    // 检查减速效果
    if (this.isSlowed && Date.now() - this.slowTime > this.slowDuration) {
      this.isSlowed = false;
    }
    
    // 确定移动速度
    let currentSpeed = this.speed * GAME_CONFIG.zombieSpeedMultiplier;
    if (this.isSlowed) {
      currentSpeed *= 0.5;
    }
    
    // 检查是否有植物在前方
    let foundPlant = false;
    for (const plant of plants) {
      if (plant.gridY === Math.floor(this.y / GAME_CONFIG.cellSize.height) &&
          plant.x + plant.width >= this.x) {
        foundPlant = true;
        this.isEating = true;
        
        // 尝试攻击植物
        if (this.canAttack(Date.now())) {
          // 攻击动画效果：僵尸头部或身体轻微向前移动
          this.x += 5;
          setTimeout(() => {
            if (this.x) this.x -= 5; // 确保僵尸仍然存在
          }, 100);
          
          if (plant.takeDamage(this.damage)) {
            // 植物被消灭
            continue;
          }
          this.lastAttackTime = Date.now();
        }
        break;
      }
    }
    
    // 宿槐特有：召唤其他僵尸
    if (this.type === 'su_huai' && this.canSummon(Date.now())) {
      const summonedTypes = this.summonZombies();
      // 在GameEngine中实现召唤逻辑
      // 这里只是记录召唤事件，实际召唤由GameEngine处理
      console.log('宿槐召唤了:', summonedTypes);
      // 存储召唤的僵尸类型，供GameEngine处理
      (this as any).summonedZombies = summonedTypes;
      (this as any).lastSummonTime = Date.now();
    }
    
    if (!foundPlant) {
      this.isEating = false;
      // 移动僵尸
      this.x -= currentSpeed * deltaTime * 0.1;
      
      // 添加行走动画：根据时间计算摇摆角度
      const walkCycle = Math.sin(Date.now() / 300) * 3; // 周期和幅度
      this.animationOffset = {
        x: 0,
        y: walkCycle * (this.type === 'giant' ? 1.5 : 1) // 巨人僵尸摇摆更大
      };
    } else {
      // 吃植物动画：轻微的上下移动
      const eatCycle = Math.sin(Date.now() / 200) * 2;
      this.animationOffset = {
        x: 0,
        y: eatCycle
      };
    }
  }
  
   render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // 应用动画偏移
    ctx.translate(this.animationOffset.x, this.animationOffset.y);
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    // 检查被击中效果
    const currentTime = Date.now();
    if (this.hitEffect.active && currentTime - this.hitEffect.time < 200) {
      // 被击中时闪烁白色
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    // 设置3D阴影效果
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
    
     // 僵尸图片映射 - 这些URL用于游戏中僵尸的显示
const zombieImages: Record<ZombieType, string> = {
  // 添加宿槐僵尸图片
  su_huai: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/宿槐僵尸_20251017203937.jpg",
      normal: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20brown%20dress%20long%20black%20hair%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=db0af1699f179fd8804f68342b3f53d2",
      conehead: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20cone%20hat%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=ae8102749a1e061acf95b82c9ba135a7",
      buckethead: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20bucket%20hat%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=2afe17f251143ab72b3d0465d66b50db",
      flag: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20flag%20leader%20red%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=3d60eb09ac7590d106fd4d5b24cd2d1a",
      giant: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20giant%20zombie%20girl%20big%20size%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=9e40db829449d7d51fb73b3400d1a0d8",
      balloon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20balloon%20flying%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=e52a7907567e4a66ce13a9e677ca4c11",
      bungee: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20bungee%20hat%20gray%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=689a9dd43b75bcf36ff9b31a4c46600a",
      digger: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20miner%20hat%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=3a71b5644022a8e75da739413429413c",
      dolphinrider: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20dolphin%20rider%20blue%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=ff9cc0d7159c0c707e0d9af01a70242c",
      newspaper: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20newspaper%20reader%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=3401262367b5e08310fd8ec13bd8b0a1",
      screen: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20metal%20shield%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=b9ef3dad752527ceea82200251f6761d",
      polevaulter: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20pole%20vaulter%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=1a755691b0db205180de64806a15bea4",
      ladder: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20ladder%20carrier%20brown%20dress%20big%20eyes%20stitched%20mouth%20cute%20chibi%20style&sign=e4b8dd4d106efe59402575332435e1f4",
      // 补全剩余的僵尸图片映射
      backupdancer: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20dancer%20brown%20dress%20big%20eyes%20dancing%20cute%20chibi%20style&sign=47e079f83b3072a32f502ac8d19e65ad",
      imp: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20small%20size%20brown%20dress%20big%20eyes%20cute%20chibi%20style&sign=2bfb418c969eb9b19610e7062954693c",
      impmustache: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20small%20size%20mustache%20brown%20dress%20big%20eyes%20cute%20chibi%20style&sign=b8616bcf2f462253db77e6257b4229f7",
      jackinthebox: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20jack%20in%20box%20brown%20dress%20big%20eyes%20present%20box%20cute%20chibi%20style&sign=ad169c188f09507e5bccb85c4ef5feef",
      pogo: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20pogo%20stick%20brown%20dress%20big%20eyes%20jumping%20cute%20chibi%20style&sign=6a4a4457e9d8d2918874d817a05a343b",
      catapult: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20catapult%20operator%20brown%20dress%20big%20eyes%20cute%20chibi%20style&sign=2f41e284217da106818b7dfaa58091ad",
      football: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20football%20player%20brown%20uniform%20big%20eyes%20cute%20chibi%20style&sign=e9a370732f4b879265dc27bff81ad7a5",
      dancer: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20dancer%20leader%20brown%20dress%20big%20eyes%20dancing%20cute%20chibi%20style&sign=5abd5452cb87995b05d81b29d63873da",
      surfer: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20surfer%20blue%20dress%20surfboard%20big%20eyes%20cute%20chibi%20style&sign=e74175d9e4ef93450f78e3365b0d1bb3",
      zombiefish: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20fish%20blue%20dress%20fish%20tail%20big%20eyes%20cute%20chibi%20style&sign=d207c67f4b5410d192c8346ab7e2e367",
      snorkel: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20snorkel%20blue%20dress%20diving%20gear%20big%20eyes%20cute%20chibi%20style&sign=05720b3306bcfc2016f1b2391bc9ef50",
      gargantuar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20gargantuar%20giant%20size%20brown%20dress%20big%20eyes%20cute%20chibi%20style&sign=d5a235429cb72f1a88bd7710a904cca1",
      zombotany: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20plant%20brown%20dress%20flower%20on%20head%20big%20eyes%20cute%20chibi%20style&sign=dbe5fcd5df65bb87ac7bb9d25439e128",
      octozombie: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20octopus%20blue%20dress%20tentacles%20big%20eyes%20cute%20chibi%20style&sign=3ee0def538b19bc8859f5bbd3f711c07",
      glasses: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20glasses%20brown%20dress%20nerd%20big%20eyes%20cute%20chibi%20style&sign=44c75f9a0b8c8ee4680e152cf6b83783",
      mermaid: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20mermaid%20blue%20dress%20fish%20tail%20big%20eyes%20cute%20chibi%20style&sign=5ebeac624c49eeb8bdb0a32251c1b546",
      pirate: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20pirate%20brown%20dress%20pirate%20hat%20big%20eyes%20cute%20chibi%20style&sign=1e7996cab59e3f947ef2141429f4b5ef",
      captain: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20zombie%20girl%20captain%20pirate%20brown%20coat%20captain%20hat%20big%20eyes%20cute%20chibi%20style&sign=5e0ea24af97cfc1424613664f1cb8722",
      vexithra: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/Vexithra_20251018182402.jpg"
    };
    
    // 创建图片对象
    const img = new Image();
    img.src = zombieImages[this.type];
    
     // 为了确保渲染，使用已加载的图片逻辑
    // 由于Canvas绘制限制，我们使用占位绘制，实际游戏中应该使用预加载的图片
    const drawZombiePlaceholder = () => {
      // 创建图片对象
      const img = new Image();
      img.src = zombieImages[this.type];
      
      // 先绘制一个占位色块（当图片加载失败时显示）
      const colors: Record<ZombieType, string> = {
        normal: '#8B4513',
        conehead: '#8B4513',
        buckethead: '#8B4513',
        flag: '#DC143C',
        giant: '#6B4226',
        balloon: '#8B4513',
        bungee: '#708090',
        digger: '#A0522D',
        dolphinrider: '#4682B4',
        newspaper: '#8B4513',
        screen: '#8B4513',
        polevaulter: '#8B4513',
        ladder: '#8B4513',
        backupdancer: '#8B4513',
        imp: '#8B4513',
        impmustache: '#8B4513',
        jackinthebox: '#8B4513',
        pogo: '#8B4513',
        catapult: '#8B4513',
        football: '#8B4513',
        dancer: '#8B4513',
        surfer: '#4682B4',
        zombiefish: '#4682B4',
        snorkel: '#4682B4',
        gargantuar: '#6B4226',
        zombotany: '#8B4513',
        octozombie: '#4682B4',
        glasses: '#8B4513',
        mermaid: '#4682B4',
        pirate: '#8B4513',
        captain: '#8B4513'
      };
      
      // 绘制3D效果的僵尸底座
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 20, 35, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 尝试绘制图片
      if (img.complete) {
        try {
          // 保存当前上下文状态
          ctx.save();
          
          // 设置图片阴影效果
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 6;
          ctx.shadowOffsetY = 6;
          
          // 根据僵尸类型调整图片尺寸
          let size = 60; // 基础尺寸
          if (this.type === 'giant' || this.type === 'gargantuar') {
            size = 90; // 巨人僵尸更大
          } else if (this.type === 'imp') {
            size = 40; // 小鬼僵尸更小
          }
          
          // 绘制僵尸图片
          ctx.drawImage(img, centerX - size/2, centerY - size/2, size, size);
          
          // 恢复上下文状态
          ctx.restore();
        } catch (error) {
          console.error(`Failed to draw zombie image for ${this.type}:`, error);
          // 图片绘制失败时回退到占位色块
          ctx.fillStyle = colors[this.type] || '#8B4513';
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, 35, 45, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // 图片尚未加载完成，使用占位色块
        ctx.fillStyle = colors[this.type] || '#8B4513';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 35, 45, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 绘制僵尸标志性特征
      switch (this.type) {
        case 'normal':
          // 长发
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.moveTo(centerX - 40, centerY - 20);
          ctx.quadraticCurveTo(centerX - 50, centerY + 20, centerX - 25, centerY + 35);
          ctx.moveTo(centerX + 40, centerY - 20);
          ctx.quadraticCurveTo(centerX + 50, centerY + 20, centerX + 25, centerY + 35);
          ctx.fill();
          break;
          
        case 'conehead':
          // 路障头饰
          ctx.fillStyle = '#FF8C00';
          ctx.beginPath();
          ctx.moveTo(centerX - 30, centerY - 50);
          ctx.lineTo(centerX + 30, centerY - 50);
          ctx.lineTo(centerX + 20, centerY - 15);
          ctx.lineTo(centerX - 20, centerY - 15);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'buckethead':
          // 铁桶帽子
          ctx.fillStyle = '#4682B4';
          ctx.beginPath();
          ctx.arc(centerX, centerY - 40, 28, 0, Math.PI);
          ctx.fill();
          ctx.fillRect(centerX - 28, centerY - 40, 56, 30);
          break;
          
        case 'flag':
          // 旗帜
          ctx.strokeStyle = '#8B4513';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX + 30, centerY - 55);
          ctx.lineTo(centerX + 30, centerY + 20);
          ctx.stroke();
          
          // 旗帜布料
          ctx.fillStyle = '#DC143C';
          ctx.beginPath();
          ctx.moveTo(centerX + 30, centerY - 55);
          ctx.lineTo(centerX + 50, centerY - 50);
          ctx.lineTo(centerX + 30, centerY - 45);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'balloon':
          // 气球
          ctx.fillStyle = '#87CEEB';
          ctx.beginPath();
          ctx.arc(centerX, centerY - 60, 18, 0, Math.PI * 2);
          ctx.fill();
          
          // 气球线
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 42);
          ctx.lineTo(centerX, centerY - 20);
          ctx.stroke();
          break;
          
        case 'giant':
        case 'gargantuar':
          // 巨人特征
          ctx.strokeStyle = '#8B4513';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(centerX - 45, centerY + 25);
          ctx.lineTo(centerX + 45, centerY + 25);
          ctx.stroke();
          break;
          
        case 'imp':
        case 'impmustache':
          // 小鬼僵尸特征 - 更小的尺寸
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(centerX, centerY - 25, 10, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'mermaid':
          // 美人鱼僵尸特征 - 鱼尾
          ctx.fillStyle = '#4682B4';
          ctx.beginPath();
          ctx.moveTo(centerX - 20, centerY + 30);
          ctx.quadraticCurveTo(centerX, centerY + 60, centerX + 20, centerY + 30);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'pirate':
        case 'captain':
          // 海盗僵尸特征 - 眼罩
          ctx.fillStyle = 'black';
          ctx.beginPath();
          ctx.moveTo(centerX - 20, centerY - 15);1499|           ctx.lineTo(centerX - 5, centerY - 15);
          ctx.lineTo(centerX - 5, centerY - 5);
          ctx.lineTo(centerX - 20, centerY - 5);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      // 添加僵尸特征：缝嘴线
      ctx.strokeStyle = 'rgba(139, 0, 0, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 15, centerY + 10);
      ctx.lineTo(centerX + 15, centerY + 10);
      ctx.stroke();
      
      // 缝线结
      for (let i = 0; i < 4; i++) {
        const stitchX = centerX - 15 + i * 10;
        ctx.fillStyle = 'rgba(139, 0, 0, 0.9)';
        ctx.beginPath();
        ctx.arc(stitchX, centerY + 8, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(stitchX, centerY + 12, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 添加眼睛
      // 左眼
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(centerX - 15, centerY - 10, 12, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 右眼
      ctx.beginPath();
      ctx.ellipse(centerX + 15, centerY - 10, 12, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 瞳孔（向上看）
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.ellipse(centerX - 15, centerY - 15, 6, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(centerX + 15, centerY - 15, 6, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 瞳孔高光
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.ellipse(centerX - 12, centerY - 17, 2, 2, 0, 0, Math.PI * 2);
      ctx.ellipse(centerX + 18, centerY - 17, 2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 添加绿色斑点（僵尸特征）
      ctx.fillStyle = 'rgba(0, 100, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(centerX + 20, centerY, 5, 0, Math.PI * 2);
      ctx.arc(centerX - 10, centerY + 15, 4, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // 绘制僵尸占位符
    drawZombiePlaceholder();
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // 绘制护甲指示器
    if (this.armor > 0) {
      // 护甲条背景
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(this.x, this.y - 14, this.width, 6);
      
      // 护甲值
      ctx.fillStyle = '#C0C0C0'; // 银色
      const armorBarWidth = (this.armor / (ZOMBIES[this.type].armor || 0)) * this.width;
      ctx.fillRect(this.x, this.y - 14, armorBarWidth, 6);
      
      // 护甲条边框
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y - 14, this.width, 6);
    }
    
    // 绘制减速效果
    if (this.isSlowed) {
      // 减速光环
      ctx.strokeStyle = '#87CEFA';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 减速效果边框
      ctx.strokeStyle = '#87CEFA';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
    }
     
    // 绘制生命值
    if (this.health < this.maxHealth) {
      // 创建血条容器的渐变背景
      const bgGradient = ctx.createLinearGradient(this.x, this.y - 10, this.x, this.y - 4);
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      
      // 绘制圆角血条背景
      ctx.fillStyle = bgGradient;
      ctx.beginPath();
      ctx.roundRect(this.x, this.y - 10, this.width, 8, 4);
      ctx.fill();
      
      // 计算血条颜色（根据剩余血量变化）
      const healthRatio = this.health / this.maxHealth;
      let healthColor;
      if (healthRatio > 0.7) {
        healthColor = '#4CAF50'; // 绿色
      } else if (healthRatio > 0.3) {
        healthColor = '#FFC107'; // 黄色
      } else {
        healthColor = '#F44336'; // 红色
      }
      
      // 创建血条渐变
      const healthGradient = ctx.createLinearGradient(this.x, this.y - 10, this.x, this.y - 4);
      healthGradient.addColorStop(0, healthColor);
      healthGradient.addColorStop(1, `${healthColor}AA`);
      
      // 绘制圆角血条
      ctx.fillStyle = healthGradient;
      const healthBarWidth = (this.health / this.maxHealth) * (this.width - 4);
      ctx.beginPath();
      ctx.roundRect(this.x + 2, this.y - 8, healthBarWidth, 4, 2);
      ctx.fill();
      
      // 添加血条边框
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(this.x, this.y - 10, this.width, 8, 4);
      ctx.stroke();
      
      // 添加血量百分比文本
      if (healthRatio < 0.7) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const percentage = Math.round(healthRatio * 100);
        ctx.fillText(`${percentage}%`, this.x + this.width / 2, this.y - 6);
      }
    }
     
    // 重置全局Alpha
    ctx.globalAlpha = 1;
    
    ctx.restore();
  }
}

// 子弹类
class Bullet extends GameObject {
  damage: number;
  speed: number;
  isFrozen: boolean;
  targetZombie: Zombie | null; // 追踪目标
  isHoming: boolean; // 是否为追踪子弹
  
  constructor(x: number, y: number, damage: number, isFrozen: boolean = false, isHoming: boolean = false, targetZombie: Zombie | null = null) {
    super(x - 5, y - 5, 10, 10, 1);
    this.damage = damage;
    this.speed = isHoming ? 15 : 10; // 追踪子弹速度更快
    this.isFrozen = isFrozen;
    this.isHoming = isHoming;
    this.targetZombie = targetZombie;
  }
  
  update(deltaTime: number): void {
    if (this.isHoming && this.targetZombie) {
      // 追踪子弹逻辑
      const targetX = this.targetZombie.x + this.targetZombie.width / 2;
      const targetY = this.targetZombie.y + this.targetZombie.height / 2;
      const dx = targetX - (this.x + 5);
      const dy = targetY - (this.y + 5);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        // 向目标方向移动
        this.x += (dx / distance) * this.speed * deltaTime * 0.1;
        this.y += (dy / distance) * this.speed * deltaTime * 0.1;
      }
    } else {
      //普通子弹向前移动
      this.x += this.speed * deltaTime * 0.1;
    }
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // 设置子弹颜色和形状
    if (this.isHoming) {
      // 追踪子弹 - 香蒲的飞镖，增加真实感
      // 飞镖阴影
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // 飞镖主体
      ctx.fillStyle = '#8A2BE2'; // 紫色
      ctx.beginPath();
      ctx.moveTo(this.x + 5, this.y);
      ctx.lineTo(this.x + 10, this.y + 5);
      ctx.lineTo(this.x + 5, this.y + 10);
      ctx.lineTo(this.x, this.y + 5);
      ctx.closePath();
      ctx.fill();
      
      // 飞镖细节
      ctx.fillStyle = '#9932CC'; // 深紫色
      ctx.beginPath();
      ctx.moveTo(this.x + 5, this.y + 1);
      ctx.lineTo(this.x + 9, this.y + 5);
      ctx.lineTo(this.x + 5, this.y + 9);
      ctx.lineTo(this.x + 1, this.y + 5);
      ctx.closePath();
      ctx.fill();
      
      // 飞镖高光
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(this.x + 6, this.y + 3, 1, 0, Math.PI * 2);
      ctx.fill();
      
      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else {
      // 普通子弹，增加立体感和动态效果
      // 子弹阴影
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // 子弹主体
      const mainColor = this.isFrozen ? '#87CEFA' : '#7FFF00'; // 绿色或浅蓝色
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.arc(this.x + 5, this.y + 5, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // 子弹内部细节
      const innerColor = this.isFrozen ? '#4682B4' : '#228B22';
      ctx.fillStyle = innerColor;
      ctx.beginPath();
      ctx.arc(this.x + 5, this.y + 5, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 子弹高光
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(this.x + 3, this.y + 3, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 子弹尾部拖尾效果，增强速度感
      ctx.fillStyle = `${mainColor}66`; // 半透明颜色
      ctx.beginPath();
      ctx.moveTo(this.x + 5, this.y + 5);
      ctx.lineTo(this.x - 10, this.y + 5);
      ctx.lineTo(this.x - 5, this.y + 8);
      ctx.lineTo(this.x + 5, this.y + 8);
      ctx.closePath();
      ctx.fill();
      
      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    
    ctx.restore();
  }
}

// 阳光类
class Sun extends GameObject {
  value: number;
  speed: number;
  maxLifeTime: number;
  lifeTime: number;
  targetX: number;
  targetY: number;
  isAttracting: boolean; // 是否正在被吸引
  
  constructor(x: number, y: number, value: number = GAME_CONFIG.sunValue) {
    super(x - 15, y - 15, 30, 30, 1);
    this.value = value;
    this.speed = 0.5;
    this.maxLifeTime = 15000; // 15秒后消失
    this.lifeTime = 0;
    this.targetX = this.x;
    this.targetY = -50; // 屏幕外上方
    this.isAttracting = false;
  }
  
  update(deltaTime: number): void {
    if (this.isAttracting) {
      // 阳光被吸引飞向收集点
      const dx = this.targetX - (this.x + 15);
      const dy = this.targetY - (this.y + 15);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 5) {
        // 到达目标，准备被收集
        this.lifeTime = this.maxLifeTime; // 设置为过期以便收集
      } else {
        // 向目标移动
        const moveSpeed = 5 * deltaTime * 0.1;
        this.x += (dx / distance) * moveSpeed;
        this.y += (dy / distance) * moveSpeed;
      }
    } else {
      // 阳光缓慢上升
      this.y -= this.speed * deltaTime * 0.05;
    }
    
    // 上升一段时间后开始自动收集
    if (this.lifeTime > 2000 && !this.isAttracting) {
      this.isAttracting = true;
      // 设置收集点位置（通常在屏幕顶部阳光计数器附近）
      this.targetX = 100; // 假设阳光计数器在左侧
      this.targetY = 50;  // 屏幕上方
    }
    
    this.lifeTime += deltaTime;
  }
  
  isExpired(): boolean {
    return this.lifeTime >= this.maxLifeTime;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // 阳光基础发光效果
    if (this.isAttracting) {
      // 增强的发光效果
      ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
      ctx.shadowBlur = 15;
    } else {
      // 普通发光效果
      ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
      ctx.shadowBlur = 8;
    }
    
    // 绘制阳光外环
    const gradient = ctx.createRadialGradient(
      this.x + 15, this.y + 15, 0,
      this.x + 15, this.y + 15, 18
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.4, this.isAttracting ? 'rgba(255, 255, 0, 1)' : 'rgba(255, 215, 0, 0.9)');
    gradient.addColorStop(0.8, this.isAttracting ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 165, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 140, 0, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x + 15, this.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制阳光内部细节
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(this.x + 12, this.y + 12, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 阳光纹理
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    
    // 绘制阳光射线
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const outerX = this.x + 15 + Math.cos(angle) * 18;
      const outerY = this.y + 15 + Math.sin(angle) * 18;
      const innerX = this.x + 15 + Math.cos(angle) * 15;
      const innerY = this.y + 15 + Math.sin(angle) * 15;
      
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
    }
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // 绘制阳光值
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 添加文字阴影增强可读性
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(`${this.value}`, this.x + 15, this.y + 15);
    
    // 重置所有阴影效果
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.restore();
  }
}

   // 陨石类
  class Meteorite extends GameObject {
    row: number;
    targetY: number;
    speed: number;
    isExploding: boolean;
    explodeRadius: number;
    explodeProgress: number;
    
    constructor(row: number) {
      const cellWidth = GAME_CONFIG.cellSize.width;
      const x = GAME_CONFIG.gridSize.cols * cellWidth - cellWidth / 2 - 10;
      const y = -50; // 从屏幕上方生成
      super(x, y, 30, 30, 1);
      
      this.row = row;
      this.targetY = row * GAME_CONFIG.cellSize.height + GAME_CONFIG.cellSize.height / 2;
      this.speed = 20; // 陨石下落速度
      this.isExploding = false;
      this.explodeRadius = GAME_CONFIG.cellSize.width * 1.5;
      this.explodeProgress = 0;
    }
    
    update(deltaTime: number): void {
      if (this.isExploding) {
        // 爆炸动画
        this.explodeProgress += deltaTime * 0.001;
      } else {
        // 下落动画
        const dy = this.targetY - this.y;
        if (Math.abs(dy) < 10) {
          // 到达目标位置，开始爆炸
          this.isExploding = true;
        } else {
          // 继续下落
          this.y += (dy / Math.abs(dy)) * this.speed * deltaTime * 0.1;
        }
      }
    }
    
    isFinished(): boolean {
      return this.explodeProgress >= 1;
    }
    
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    if (this.isExploding) {
      // 3D爆炸效果
      const alpha = 1 - this.explodeProgress;
      const radius = this.explodeRadius * this.explodeProgress;
      
      // 爆炸光圈（用于3D效果）
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(this.x + 15, this.targetY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // 爆炸外圈冲击波
      ctx.fillStyle = `rgba(255, 165, 0, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(this.x + 15, this.targetY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();
      
      // 爆炸外圈
      ctx.fillStyle = `rgba(255, 165, 0, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(this.x + 15, this.targetY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // 爆炸内圈
      ctx.fillStyle = `rgba(255, 69, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(this.x + 15, this.targetY, radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      
      // 爆炸中心
      ctx.fillStyle = `rgba(255, 255, 0, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(this.x + 15, this.targetY, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      // 3D爆炸碎片效果
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const fragmentDistance = radius * (0.5 + Math.random() * 0.5);
        const fragmentX = this.x + 15 + Math.cos(angle) * fragmentDistance;
        const fragmentY = this.targetY + Math.sin(angle) * fragmentDistance;
        const fragmentSize = 2 + Math.random() * 4;
        
        // 添加碎片旋转效果
        ctx.save();
        ctx.translate(fragmentX, fragmentY);
        ctx.rotate(this.explodeProgress * Math.PI * 2);
        
        // 随机火焰颜色
        const hue = 0; // 红色
        const saturation = 90 + Math.random() * 10;
        const lightness = 40 + Math.random() * 20;
        
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(0, 0, fragmentSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加碎片高光
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(-fragmentSize * 0.3, -fragmentSize * 0.3, fragmentSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
      
      // 爆炸冲击波效果（3D层次感）
      for (let i = 0; i < 3; i++) {
        const waveRadius = radius * (1.1 + i * 0.2);
        const waveAlpha = alpha * (0.3 - i * 0.1);
        
        ctx.strokeStyle = `rgba(255, 215, 0, ${waveAlpha})`;
        ctx.lineWidth = 3 - i;
        ctx.beginPath();
        ctx.arc(this.x + 15, this.targetY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      // 绘制3D效果的陨石
      // 陨石阴影（增强3D感）
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      
      // 陨石主体（更立体的不规则形状）
      ctx.fillStyle = '#696969'; // 深灰色陨石
      ctx.beginPath();
      // 创建更自然的不规则形状
      ctx.moveTo(this.x + 15, this.y);
      ctx.bezierCurveTo(
        this.x + 30, this.y + 5,
        this.x + 25, this.y + 30,
        this.x + 15, this.y + 28
      );
      ctx.bezierCurveTo(
        this.x + 5, this.y + 30,
        this.x, this.y + 5,
        this.x + 15, this.y
      );
      ctx.closePath();
      ctx.fill();
      
      // 陨石表面纹理（增强3D感）
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1.5;
      
      // 主要纹理线
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const startX = this.x + 15 + Math.cos(angle) * 8;
        const startY = this.y + 15 + Math.sin(angle) * 8;
        const endX = this.x + 15 + Math.cos(angle + Math.PI) * 8;
        const endY = this.y + 15 + Math.sin(angle + Math.PI) * 8;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      
      // 陨石表面凹坑（更明显的3D效果）
      ctx.fillStyle = '#505050';
      for (let i = 0; i < 4; i++) {
        const pitX = this.x + 5 + Math.random() * 20;
        const pitY = this.y + 5 + Math.random() * 20;
        const pitSize = 2 + Math.random() * 3;
        
        ctx.beginPath();
        ctx.arc(pitX, pitY, pitSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 凹坑阴影
        ctx.fillStyle = '#404040';
        ctx.beginPath();
        ctx.arc(pitX + 0.5, pitY + 0.5, pitSize * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 陨石高光（增强立体感）
      ctx.fillStyle = '#A0A0A0';
      ctx.beginPath();
      ctx.ellipse(this.x + 20, this.y + 10, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 次级高光
      ctx.fillStyle = '#C0C0C0';
      ctx.beginPath();
      ctx.ellipse(this.x + 22, this.y + 8, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // 增强的3D尾焰效果
      // 尾焰粒子
      for (let i = 0; i < 20; i++) {
        const flameX = this.x + 15 - Math.random() * 25;
        const flameY = this.y + 30 + Math.random() * 40;
        const flameSize = 1 + Math.random() * 4;
        
        // 随机火焰颜色，从红色到黄色的渐变
        const hue = 0 + Math.random() * 30; // 红色到橙色
        const saturation = 90 + Math.random() * 10;
        const lightness = 40 + Math.random() * 20;
        const alpha = 0.8 - Math.random() * 0.4;
        
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(flameX, flameY, flameSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 主要尾焰（多层结构）
      // 内层尾焰（黄色）
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
      ctx.beginPath();
      ctx.moveTo(this.x + 12, this.y + 30);
      ctx.lineTo(this.x + 15, this.y + 60);
      ctx.lineTo(this.x + 18, this.y + 30);
      ctx.closePath();
      ctx.fill();
      
      // 中层尾焰（橙色）
      ctx.fillStyle = 'rgba(255, 165, 0, 0.7)';
      ctx.beginPath();
      ctx.moveTo(this.x + 10, this.y + 30);
      ctx.lineTo(this.x + 15, this.y + 55);
      ctx.lineTo(this.x + 20, this.y + 30);
      ctx.closePath();
      ctx.fill();
      
      // 外层尾焰（红色）
      ctx.fillStyle = 'rgba(255, 69, 0, 0.8)';
      ctx.beginPath();
      ctx.moveTo(this.x + 8, this.y + 30);
      ctx.lineTo(this.x + 15, this.y + 50);
      ctx.lineTo(this.x + 22, this.y + 30);
      ctx.closePath();
      ctx.fill();
      
      // 3D烟雾效果
      for (let i = 0; i < 8; i++) {
        const smokeX = this.x + 15 - Math.random() * 30;
        const smokeY = this.y + 30 + Math.random() * 30;
        const smokeSize = 4 + Math.random() * 5;
        
        // 烟雾渐变效果
        ctx.fillStyle = `rgba(128, 128, 128, ${0.3 - Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(smokeX, smokeY, smokeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 烟雾中心（更透明）
        ctx.fillStyle = `rgba(169, 169, 169, ${0.15 - Math.random() * 0.1})`;
        ctx.beginPath();
        ctx.arc(smokeX, smokeY, smokeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 陨石下落时的3D轨迹效果（增强速度感）
      ctx.strokeStyle = 'rgba(255, 69, 0, 0.3)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x + 15, this.y - 50);
      ctx.lineTo(this.x + 15, this.y);
      ctx.stroke();
      
      // 次级轨迹
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.2)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(this.x + 15, this.y - 60);
      ctx.lineTo(this.x + 15, this.y - 10);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  }
  
   // 游戏引擎类
   class GameEngine {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  plants: Plant[] = [];
  zombies: Zombie[] = [];
  bullets: Bullet[] = [];
  suns: Sun[] = [];
  meteorites: Meteorite[] = []; // 陨石数组
  // 跟踪宿槐僵尸的召唤请求
  summonRequests: {zombieType: ZombieType, lane: number}[] = [];
    autoAttackers: AutoAttacker[] = []; // 自动攻击角色数组
    sun: number = GAME_CONFIG.initialSun;
   selectedPlants: PlantType[] = []; // 玩家选择的植物列表
   selectedZombies: ZombieType[] = []; // 玩家选择的僵尸列表
   selectedPlantType: PlantType | null = null;
    lastSunProductionTime: number = 0;
    lastWaveTime: number = 0;
    currentWave: number = 0;
    totalWaves: number = 3;
    gameStatus: GameStatus = 'ready';
    gameSpeed: number = GAME_CONFIG.gameSpeed;
    lastTime: number = 0;
    plantCooldowns: Record<PlantType, number> = {
      qingyuan: 0
    };
    currentLevel: number = 1;
    highestLevel: number = 1;
     meteoriteTriggeredRows: Record<number, number> = {}; // 记录每行触发陨石的时间
      achievements: Record<AchievementType, boolean> = {
         // 核心成就 - 光明的觉醒系列
         light_awakening: false, // 首次胜利 - 光明的觉醒
         sun_avatar: false, // 阳光大师 - 太阳使者
         shadow_hunter: false, // 僵尸杀手 - 暗影猎手
         unbreakable_light: false, // 完美防御 - 不可逾越的光明
         light_army_commander: false, // 植物大师 - 光明军团统帅
         light_defender: false, // 生存专家 - 光明捍卫者
         
         // 成长型成就 - 光明的成长
         light_retribution: false, // 首次击杀 - 光明的惩戒
         life_force: false, // 收集阳光 - 生命之力
         shadow_reaper: false, // 僵尸屠戮者 - 暗影收割者
         light_combo: false, // 连击大师 - 光明连击
         light_barrier: false, // 防御专家 - 光明壁垒
         shadow_resister: false, // 生存高手 - 暗影抵御者
         
         // 关卡成就 - 光明的征程
         water_defender: false, // 第5关冠军 - 水域守护者
         light_victory: false, // 终极守护者 - 光明的胜利
         
         // 核心角色成就 - 光明与暗影的对决
         light_descend: false, // 光明的降临（召唤清鸢）
         shancat_redemption: false, // 善•猫的救赎（使用善•猫教主）
         su_huai_fall: false // 宿槐的陨落（击败宿槐）
       }
     lastTipTime: number = 0;
     currentCombo: number = 0;
     lastZombieKillTime: number = 0;
      totalZombiesKilled: number = 0;
      totalSunsCollected: number = 0;
      totalDefensePlantsUsed: number = 0;
     plantsUsed: Set<PlantType> = new Set();
     gameTips: string[] = [
       "向日葵是阳光的主要来源，记得多种植一些！",
       "不同的僵尸有不同的弱点，合理选择植物应对！",
       "寒冰射手可以减速僵尸，配合其他攻击植物效果更好！",
       "坚果墙是优秀的防御植物，可以为后排植物争取时间！",
       "僵尸接近基地时会触发陨石攻击，这是最后的防线！",
       "香蒲可以追踪全图的僵尸，是对付气球僵尸的利器！",
       "收集足够的阳光再种植高级植物，不要浪费资源！",
       "赛罗奥特曼会自动攻击全图的僵尸，是你的得力助手！",
       "记得关注植物的冷却时间，合理安排种植节奏！",
       "每关的波次结束后会有短暂的休息时间，可以利用这段时间补充防线！"
     ];
     // 新增的天气和日夜循环相关属性
     timeOfDay: 'day' | 'night' = 'day';
     currentWeather: WeatherType = 'sunny';
     lastWeatherChangeTime: number = 0;
     // 特殊事件相关属性
     currentEvent: SpecialEvent | null = null;
     lastEventTime: number = 0;
     // 植物升级系统相关属性
     plantUpgrades: Map<string, { level: PlantUpgradeLevel; path: 'offense' | 'defense' | 'utility' }> = new Map();
     // 关卡特殊属性
     isNightLevel: boolean = false;
     isPoolLevel: boolean = false;
     isRoofLevel: boolean = false;
     isFogLevel: boolean = false;
      // 特殊配置
     GAME_CONFIG = {
       dayNightCycleDuration: 60000, // 60秒日夜循环
       weatherChangeChance: 0.3, // 天气变化几率
       specialEventChance: 0.15 // 特殊事件触发几率
     };
     
     // 新增：阳光生产速度修饰器
     sunProductionRateModifier = 1;
     // 新增：僵尸生成计时器
     zombieSpawnCooldown = 0;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    // 加载最高关卡记录
    this.loadGameData();
    
    // 设置画布大小
    this.resizeCanvas();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
    // 加载游戏数据
  loadGameData(): void {
    const savedLevel = localStorage.getItem('pvzHighestLevel');
    if (savedLevel) {
      this.highestLevel = parseInt(savedLevel);
    } else {
      // 开局解锁所有关卡 - 默认设置最高关卡为6
      this.highestLevel = 6;
      localStorage.setItem('pvzHighestLevel', '6');
    }
    
    // 加载成就数据
    const savedAchievements = localStorage.getItem('pvzAchievements');
    if (savedAchievements) {
      this.achievements = { ...this.achievements, ...JSON.parse(savedAchievements) };
    }
  }
  
  // 保存游戏数据
  saveGameData(): void {
    if (this.currentLevel > this.highestLevel) {
      this.highestLevel = this.currentLevel;
      localStorage.setItem('pvzHighestLevel', this.highestLevel.toString());
    }
    
    // 保存成就数据
    localStorage.setItem('pvzAchievements', JSON.stringify(this.achievements));
  }
  
    // 检查并解锁成就
   checkAchievements(): void {
      // 核心成就 - 光明的觉醒系列
      // 光明的觉醒 - 首次胜利
      if (this.gameStatus === 'victory' && !this.achievements.light_awakening) {
        this.achievements.light_awakening = true;
        this.showAchievementToast('光明的觉醒', '光明之力在你手中苏醒，成功抵御了暗影世界的首次入侵！');
      }
     
      // 太阳使者 - 阳光大师
      if (this.totalSunsCollected >= 1000 && !this.achievements.sun_avatar) {
        this.achievements.sun_avatar = true;
        this.showAchievementToast('太阳使者', '你已成为太阳之力的化身，掌控了1000点纯净的生命能量！');
      }
     
      // 暗影猎手 - 僵尸杀手
      if (this.totalZombiesKilled >= 100 && !this.achievements.shadow_hunter) {
        this.achievements.shadow_hunter = true;
        this.showAchievementToast('暗影猎手', '你已成为令暗影世界胆寒的猎手，成功净化了100个被暗影侵蚀的生命！');
      }
     
      // 不可逾越的光明 - 完美防御
      if (this.gameStatus === 'victory' && this.plants.length > 0 && !this.achievements.unbreakable_light) {
        this.achievements.unbreakable_light = true;
        this.showAchievementToast('不可逾越的光明', '你的光明防线坚不可摧，在没有损失任何守护者的情况下彻底净化了暗影大军！');
      }
     
      // 光明军团统帅 - 使用所有植物类型
      if (this.plantsUsed.size === Object.keys(PLANTS).length && !this.achievements.light_army_commander) {
        this.achievements.light_army_commander = true;
        this.showAchievementToast('光明军团统帅', '你已掌握了所有光明守护者的力量，成为了名副其实的光明统帅！');
      }
     
      // 光明捍卫者 - 生存专家
      if (this.gameStatus === 'victory' && this.currentLevel >= 4 && !this.achievements.light_defender) {
        this.achievements.light_defender = true;
        this.showAchievementToast('光明捍卫者', '即使在最黑暗的时刻，你依然坚守光明，成为了光明大陆真正的守护者！');
      }
     
      // 成长型成就 - 光明的成长
      // 光明的惩戒 - 首次击杀
      if (this.totalZombiesKilled >= 1 && !this.achievements.light_retribution) {
        this.achievements.light_retribution = true;
        this.showAchievementToast('光明的惩戒', '你的第一次净化，象征着光明对暗影的正义惩戒！');
      }
     
      // 生命之力 - 收集阳光
      if (this.totalSunsCollected >= 100 && !this.achievements.life_force) {
        this.achievements.life_force = true;
        this.showAchievementToast('生命之力', '你收集了100点来自太阳的生命能量，光明之力在你体内流淌！');
      }
     
      // 暗影收割者 - 僵尸屠戮者
      if (this.totalZombiesKilled >= 50 && !this.achievements.shadow_reaper) {
        this.achievements.shadow_reaper = true;
        this.showAchievementToast('暗影收割者', '你如收割者般净化了50个暗影生物，成为光明大陆的清道夫！');
      }
     
      // 光明连击 - 连击大师
      if (this.currentCombo >= 10 && !this.achievements.light_combo) {
        this.achievements.light_combo = true;
        this.showAchievementToast('光明连击', '连续10次净化暗影生物，光明力量在你手中绽放出璀璨的光芒！');
      }
     
      // 光明壁垒 - 防御专家
      if (this.totalDefensePlantsUsed >= 10 && !this.achievements.light_barrier) {
        this.achievements.light_barrier = true;
        this.showAchievementToast('光明壁垒', '你构建了坚不可摧的光明壁垒，任何暗影生物都无法轻易突破！');
      }
     
      // 暗影抵御者 - 生存高手
      if (this.gameStatus === 'victory' && this.currentLevel >= 3 && !this.achievements.shadow_resister) {
        this.achievements.shadow_resister = true;
        this.showAchievementToast('暗影抵御者', '你成功抵御了暗影世界的多次大规模入侵，证明了自己的实力！');
      }
     
      // 关卡成就 - 光明的征程
      // 水域守护者 - 第5关冠军
      if (this.gameStatus === 'victory' && this.currentLevel >= 5 && !this.achievements.water_defender) {
        this.achievements.water_defender = true;
        this.showAchievementToast('水域守护者', '你成功净化了被暗影污染的水域，恢复了大自然的平衡！');
      }
     
      // 光明的胜利 - 终极守护者
      if (this.gameStatus === 'victory' && this.currentLevel >= 8 && !this.achievements.light_victory) {
        this.achievements.light_victory = true;
        this.showAchievementToast('光明的胜利', '你彻底击败了宿槐和她的暗影大军，光明大陆重获永恒的和平！');
      }
     
      // 核心角色成就 - 光明与暗影的对决
      // 光明的降临 - 召唤清鸢
      if (this.gameStatus === 'victory' && 
          this.plants.some(plant => plant.type === 'qingyuan') && 
          !this.achievements.light_descend) {
        this.achievements.light_descend = true;
        this.showAchievementToast('光明的降临', '传说中的守护者清鸢响应了你的召唤，与你并肩作战，共同对抗暗影！');
      }
      
      // 善•猫的救赎 - 使用善•猫教主
      if (this.gameStatus === 'victory' && 
          this.plants.some(plant => plant.type === 'shancatleader') && 
          !this.achievements.shancat_redemption) {
        this.achievements.shancat_redemption = true;
        this.showAchievementToast('善•猫的救赎', '你见证了善•猫教主的救赎之路，曾经的暗影使者如今成为了光明的守护者！');
      }
      
      // 宿槐的陨落 - 击败宿槐
      if (this.totalZombiesKilled >= 10 && 
          !this.achievements.su_huai_fall) {
        this.achievements.su_huai_fall = true;
        this.showAchievementToast('宿槐的陨落', '你多次击败了暗影女王宿槐，证明了光明终将战胜黑暗！');
      }
     
     // 保存成就
     this.saveGameData();
   }
  
   // 显示成就提示
  showAchievementToast(title: string, description: string): void {
    // 实际项目中可以使用sonner等toast库
    console.log(`🏆 成就解锁: ${title} - ${description}`);
    
    // 创建视觉反馈元素
    const achievementElement = document.createElement('div');
    achievementElement.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-4 rounded-lg shadow-2xl z-50 transform transition-all duration-700 ease-out translate-x-full';
    achievementElement.innerHTML = `
      <div class="flex items-center">
        <div class="text-2xl mr-3 animate-bounce">🏆</div>
        <div>
          <div class="font-bold text-lg">成就解锁: ${title}</div>
          <div class="text-sm opacity-90">${description}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(achievementElement);
    
    // 添加更多动画效果
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      @keyframes glow {
        0% { box-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
        50% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.8); }
        100% { box-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
      }
      .animate-glow {
        animation: glow 2s infinite ease-in-out;
      }
    `;
    document.head.appendChild(style);
    
    // 显示动画
    setTimeout(() => {
      achievementElement.classList.remove('translate-x-full');
      achievementElement.classList.add('animate-glow');
    }, 100);
    
    // 漂浮动画
    setTimeout(() => {
      achievementElement.style.animation = 'float 2s infinite ease-in-out';
    }, 600);
    
    // 自动消失
    setTimeout(() => {
      achievementElement.classList.add('translate-x-full');
      achievementElement.style.animation = 'none';
      achievementElement.classList.remove('animate-glow');
      setTimeout(() => {
        document.body.removeChild(achievementElement);
        document.head.removeChild(style);
      }, 500);
    }, 6000);
  }
  
  // 显示游戏提示
  showGameTip(): void {
    const currentTime = Date.now();
    if (currentTime - this.lastTipTime >= GAME_CONFIG.gameTipsInterval && this.gameStatus === 'playing') {
      const randomTip = this.gameTips[Math.floor(Math.random() * this.gameTips.length)];
      this.lastTipTime = currentTime;
      
      // 创建提示元素
      const tipElement = document.createElement('div');
      tipElement.className = 'fixed bottom-4 left-0 right-0 max-w-md mx-auto bg-blue-900 bg-opacity-90 text-white px-4 py-3 rounded-lg shadow-lg z-40 transform transition-all duration-500 translate-y-full';
      tipElement.innerHTML = `
        <div class="flex items-start">
          <div class="text-lg mr-2 mt-1">💡</div>
          <div class="text-sm">${randomTip}</div>
        </div>
      `;
      
      document.body.appendChild(tipElement);
      
      // 显示动画
      setTimeout(() => {
        tipElement.classList.remove('translate-y-full');
      }, 100);
      
      // 自动消失
      setTimeout(() => {
        tipElement.classList.add('translate-y-full');
        setTimeout(() => {
          document.body.removeChild(tipElement);
        }, 500);
      }, 8000);
    }
  }
  
  // 检查连击系统
  checkCombo(): void {
    try {
      const currentTime = Date.now();
      // 重置连击如果超过2秒没有击杀僵尸
      if (currentTime - this.lastZombieKillTime > 2000) {
        this.currentCombo = 0;
      }
    } catch (error) {
      console.error('检查连击系统失败:', error);
    }
  }
  
  // 调整画布大小
  resizeCanvas(): void {
    const container = this.canvas.parentElement;
    if (!container) return; // 添加检查，如果父元素不存在则直接返回
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // 计算合适的缩放比例
    const gridWidth = GAME_CONFIG.gridSize.cols * GAME_CONFIG.cellSize.width;
    const gridHeight = GAME_CONFIG.gridSize.rows * GAME_CONFIG.cellSize.height;
    
    let scale = 1;
    if (containerWidth < gridWidth || containerHeight < gridHeight) {
      scale = Math.min(containerWidth / gridWidth, containerHeight / gridHeight);
    }
    
    // 设置画布大小
    this.canvas.width = gridWidth * scale;
    this.canvas.height = gridHeight * scale;
    
    // 应用缩放
    this.ctx.scale(scale, scale);
  }
  
    // 开始游戏（优化版，根据关卡特性调整开局配置）
  startGame(level: number = 1): void {
      this.currentLevel = level;
      this.totalWaves = LEVELS[level].waves;
      this.currentWave = 0;
      
      // 根据关卡类型调整初始阳光数量
      const levelData = LEVELS[level];
      let initialSun = GAME_CONFIG.initialSun;
      const isHighIntensityCustom = levelData.isHighIntensityCustom || false;
      
      // 夜间关卡减少初始阳光，但增加阳光生产速度
      if (level >= 4 && level <= 4) { // 第4关是夜晚关卡
        initialSun = Math.floor(GAME_CONFIG.initialSun * 0.8);
        this.sunProductionRateModifier = 1.2; // 增加阳光生产速度
      } else if (level >= 5 && level <= 5) { // 第5关是泳池关卡
        initialSun = Math.floor(GAME_CONFIG.initialSun * 1.1); // 稍微增加初始阳光，因为需要睡莲
      } else if (level >= 7 && level <= 7) { // 第7关是浓雾关卡
        initialSun = Math.floor(GAME_CONFIG.initialSun * 0.9);
      } else if (level >= 8 && level <= 8) { // 第8关是BOSS关卡
        initialSun = Math.floor(GAME_CONFIG.initialSun * 1.2); // 增加初始阳光以应对强大BOSS
      } else if (level === 9) { // 无尽模式
        initialSun = Math.floor(GAME_CONFIG.initialSun * 1.5); // 大幅增加初始阳光
      } else if (isHighIntensityCustom) { // 高强度自定义关卡
        initialSun = Math.floor(GAME_CONFIG.initialSun * 1.3); // 增加初始阳光以应对更高难度
      }
      
      this.sun = initialSun;
      this.plants = [];
      this.zombies = [];
      this.bullets = [];
      this.suns = [];
      this.meteorites = []; // 重置陨石数组
      this.selectedPlantType = null;
      this.lastSunProductionTime = Date.now();
      this.lastWaveTime = Date.now() + 5000; // 延迟5秒生成第一波僵尸，给玩家更多准备时间
      this.lastTipTime = Date.now();
      this.lastZombieKillTime = Date.now();
      this.gameStatus = 'playing';
      this.lastTime = Date.now();
      this.currentCombo = 0;
      
       // 重置陨石触发记录（每行设为false，表示未触发）
       this.meteoriteTriggeredRows = {};
       for (let row = 0; row < GAME_CONFIG.gridSize.rows; row++) {
         this.meteoriteTriggeredRows[row] = false;
       }
       
       // 根据关卡设置特殊属性
       this.isNightLevel = level === 4;
       this.isPoolLevel = level === 5;
       this.isRoofLevel = level === 6;
       this.isFogLevel = level === 7;
       
        // 添加开局阳光奖励
        setTimeout(() => {
          if (this.gameStatus === 'playing') {
            // 根据难度额外给予阳光奖励
            const bonusSun = Math.floor(initialSun * 0.4); // 增加奖励比例到40%
            this.sun = Math.min(this.sun + bonusSun, GAME_CONFIG.maxSun);
            this.createVisualFeedback('sun_bonus', this.canvas.width / 2, this.canvas.height / 2, bonusSun, '开局奖励！');
            
            // 额外创建3个自动漂浮的阳光，让玩家开局有更多收集机会
            setTimeout(() => {
              if (this.gameStatus === 'playing') {
                this.generateSun();
                this.generateSun();
                this.generateSun();
              }
            }, 1000);
            
            // 添加自动掉落阳光机制，游戏开始3秒后每隔2秒掉落一个阳光
            let dropCount = 0;
            const maxDrops = 8; // 总共掉落8个额外阳光
            const dropInterval = setInterval(() => {
              if (dropCount < maxDrops && this.gameStatus === 'playing') {
                this.generateSun();
                dropCount++;
              } else {
                clearInterval(dropInterval);
              }
            }, 2000);
          }
        }, 3000);
     
      // 重置植物冷却
      Object.keys(this.plantCooldowns).forEach(key => {
        this.plantCooldowns[key as PlantType] = 0;
      });
      
      // 添加自动攻击角色：赛罗奥特曼
      this.addAutoAttacker('ultraman_zero');
    
       // 开始游戏循环
      this.gameLoop();
      
      // 对于无尽模式，特殊处理
      if (this.currentLevel === 9 && LEVELS[this.currentLevel].isEndless) {
        this.startEndlessMode();
      }
  }
  
  // 添加自动攻击角色
  addAutoAttacker(type: AutoAttackerType): void {
    const autoAttacker = new AutoAttacker(type);
    this.autoAttackers.push(autoAttacker);
  }
  
  // 暂停游戏
  pauseGame(): void {
    if (this.gameStatus === 'playing') {
      this.gameStatus = 'paused';
    } else if (this.gameStatus === 'paused') {
      this.gameStatus = 'playing';
      this.lastTime = Date.now();
      this.gameLoop();
    }
  }
  
   // 游戏结束
  gameOver(): void {
    this.gameStatus = 'gameover';
    this.saveGameData();
  }
  
  // 手动保存游戏进度
  saveGameProgress(): void {
    this.saveGameData();
    console.log('游戏进度已保存');
  }
  
  // 游戏胜利
  gameVictory(): void {
    this.gameStatus = 'victory';
    this.saveGameData();
  }
  
  // 选择植物
  selectPlant(type: PlantType): void {
    if (this.sun >= PLANTS[type].cost && this.plantCooldowns[type] <= 0) {
      this.selectedPlantType = type;
    }
  }
  
  // 种植植物
   plantAtGrid(gridX: number, gridY: number): void {
    if (!this.selectedPlantType || this.gameStatus !== 'playing') return;
    
    const plantType = this.selectedPlantType;
    
    // 检查是否是玩家选择的植物
    if (this.selectedPlants.length > 0 && !this.selectedPlants.includes(plantType)) return;
    
    // 检查阳光是否足够
    if (this.sun < PLANTS[plantType].cost) return;
    
    // 检查该位置是否已有植物
    for (const plant of this.plants) {
      if (plant.gridX === gridX && plant.gridY === gridY) {
        return;
      }
    }
    
    // 创建新植物
    const newPlant = new Plant(plantType, gridX, gridY);
    this.plants.push(newPlant);
    
     // 扣除阳光
    this.sun -= PLANTS[plantType].cost;
    
    // 设置冷却时间（应用加速因子）
    this.plantCooldowns[plantType] = PLANTS[plantType].cooldown * GAME_CONFIG.plantCooldownMultiplier;
    
    // 清除选择
    this.selectedPlantType = null;
    
    // 播放种植音效(简化版)
    this.playSound('plant');
    
     // 记录使用过的植物类型
    this.plantsUsed.add(plantType);
    
  // 统计防御植物使用次数
  const defensePlants: PlantType[] = ['wallnut', 'tallnut'];
  if (defensePlants.includes(plantType)) {
    this.totalDefensePlantsUsed++;
  }
  
  // 添加种植成功的视觉反馈
    this.createVisualFeedback('plant_success', newPlant.x, newPlant.y);
}
  
   // 收集阳光
  collectSun(sun: Sun): void {
    this.sun = Math.min(this.sun + sun.value, GAME_CONFIG.maxSun);
    const index = this.suns.indexOf(sun);
    if (index !== -1) {
      this.suns.splice(index, 1);
    }
    
    // 播放收集音效(简化版)
    this.playSound('collect');
    
    // 增加阳光收集计数
    this.totalSunsCollected += sun.value;
    
    // 添加收集阳光的视觉反馈
    this.createVisualFeedback('sun_collect', sun.x, sun.y, sun.value);
  }
  
    // 生成僵尸波次（优化后的智能算法版本）
  generateWave(): void {
      if (!LEVELS[this.currentLevel]?.isEndless && this.currentWave >= this.totalWaves) return;
      
      this.currentWave++;
      const levelData = LEVELS[this.currentLevel];
      const isHighIntensityCustom = levelData.isHighIntensityCustom || false;
      
      // 智能计算僵尸数量：综合考虑波次、难度、游戏时间、玩家实力等因素
      let baseCount = this.calculateBaseZombieCount();
       // 根据难度获取最大僵尸数量
       const maxZombies = typeof GAME_CONFIG.maxZombiesPerWave === 'object' 
         ? GAME_CONFIG.maxZombiesPerWave[levelData.difficulty] * (isHighIntensityCustom ? 1.6 : 1)
         : GAME_CONFIG.maxZombiesPerWave * (isHighIntensityCustom ? 1.6 : 1);
       
       let maxCount = Math.min(baseCount, maxZombies);
       
       // 智能僵尸类型选择与分布
      // 对于高强度自定义关卡，如果有用户选择的僵尸类型，则使用它们
      if (isHighIntensityCustom && this.selectedZombies.length > 0) {
        // 创建一个临时的关卡数据对象，使用用户选择的僵尸类型
        const customLevelData = {
          ...levelData,
          zombieTypes: this.selectedZombies
        };
        this.generateZombiesWithStrategy(maxCount, customLevelData);
      } else {
        this.generateZombiesWithStrategy(maxCount, levelData);
      }
      
      this.lastWaveTime = Date.now();
      
      // 显示波次开始提示
      this.createVisualFeedback('wave_start', this.canvas.width / 2, 50, 0, `第 ${this.currentWave} 波僵尸来袭！`);
    }
    
     // 计算基础僵尸数量的智能算法
     private calculateBaseZombieCount(): number {
       const levelData = LEVELS[this.currentLevel];
       const isHighIntensityCustom = levelData.isHighIntensityCustom || false;
       const isEndless = LEVELS[this.currentLevel]?.isEndless || false;
       
       // 获取当前难度的最大僵尸数量
       const maxZombies = typeof GAME_CONFIG.maxZombiesPerWave === 'object' 
         ? GAME_CONFIG.maxZombiesPerWave[levelData.difficulty]
         : GAME_CONFIG.maxZombiesPerWave;
       
       // 基础计算公式：随波次线性增长，但增加更多随机性
       let baseCount = 4 + Math.floor((this.currentWave - 1) * 1.5) + Math.floor(Math.random() * 3);
       
       // 根据难度调整基础数量范围
       switch (levelData.difficulty) {
         case 'easy':
           baseCount = Math.max(3, Math.min(baseCount, maxZombies));
           break;
         case 'medium':
           baseCount = Math.max(5, Math.min(baseCount, maxZombies));
           break;
         case 'hard':
           baseCount = Math.max(7, Math.min(baseCount, maxZombies));
           break;
         case 'expert':
           baseCount = Math.max(9, Math.min(baseCount, maxZombies));
           break;
       }
       
       // 高强度自定义模式特殊调整：增加僵尸数量
       if (isHighIntensityCustom) {
         // 基础数量增加40%
         baseCount = Math.floor(baseCount * 1.4);
         // 最大值提高到普通模式的1.6倍
         const customMax = typeof GAME_CONFIG.maxZombiesPerWave === 'object' 
           ? GAME_CONFIG.maxZombiesPerWave[levelData.difficulty] * 1.6
           : GAME_CONFIG.maxZombiesPerWave * 1.6;
         baseCount = Math.min(baseCount, Math.floor(customMax));
       }
         
       // 无尽模式特殊调整：随波次增加难度呈指数增长
       if (isEndless) {
         // 基础数量随波次指数增长，但增长速率更加平滑
         const waveExponent = 1 + (this.currentWave - 1) * 0.015;
         baseCount = Math.floor(baseCount * Math.pow(1.08, waveExponent));
         
         // 难度系数随波次增加
         const difficultyMultiplier = 1 + Math.floor((this.currentWave - 1) / 5) * 0.08;
         baseCount = Math.floor(baseCount * difficultyMultiplier);
         
         // 最大值提高到普通模式的2.5倍
         const endlessMax = typeof GAME_CONFIG.maxZombiesPerWave === 'object' 
           ? GAME_CONFIG.maxZombiesPerWave[levelData.difficulty] * 2.5
           : GAME_CONFIG.maxZombiesPerWave * 2.5;
         baseCount = Math.min(baseCount, Math.floor(endlessMax));
       }
       
       // 根据玩家实力动态调整：更细致的阳光数量判断
       if (this.sun > 1000) {
         baseCount = Math.floor(baseCount * 1.2); // 阳光非常充足时增加20%僵尸
       } else if (this.sun > 500) {
         baseCount = Math.floor(baseCount * 1.05); // 阳光充足时增加5%僵尸
       } else if (this.sun < 200) {
         baseCount = Math.floor(baseCount * 0.9); // 阳光不足时减少10%僵尸，降低难度
       }
       
       // 根据已种植攻击植物数量调整：更细致的判断
       const attackPlantCount = this.plants.filter(p => p.damage).length;
       if (attackPlantCount > 15) {
         baseCount = Math.floor(baseCount * 1.2); // 攻击植物非常多时增加20%僵尸
       } else if (attackPlantCount > 8) {
         baseCount = Math.floor(baseCount * 1.1); // 攻击植物较多时增加10%僵尸
       } else if (attackPlantCount < 3) {
         baseCount = Math.floor(baseCount * 0.85); // 攻击植物较少时减少15%僵尸，降低难度
       }
       
       // 确保数量在合理范围内
       return Math.max(3, Math.min(baseCount, 
         typeof GAME_CONFIG.maxZombiesPerWave === 'object' 
           ? GAME_CONFIG.maxZombiesPerWave[levelData.difficulty] * (isHighIntensityCustom ? 1.6 : 1) * (isEndless ? 2.5 : 1)
           : GAME_CONFIG.maxZombiesPerWave * (isHighIntensityCustom ? 1.6 : 1) * (isEndless ? 2.5 : 1)
       ));
     }
    
    // 使用策略生成僵尸的智能算法
    private generateZombiesWithStrategy(maxCount: number, levelData: { waves: number; zombieTypes: ZombieType[]; difficulty: GameDifficulty; isEndless?: boolean }): void {
      // 分析当前游戏状态和玩家策略
      const gameStateAnalysis = this.analyzeGameState();
      
      // 创建僵尸生成计划
      const zombieGenerationPlan = this.createZombieGenerationPlan(maxCount, levelData, gameStateAnalysis);
      
      // 根据计划生成僵尸
      this.executeZombieGenerationPlan(zombieGenerationPlan, levelData);
    }
    
    // 分析当前游戏状态的辅助方法
    private analyzeGameState() {
      // 统计各类型植物数量
      const plantTypeCounts: Record<string, number> = {};
      this.plants.forEach(plant => {
        plantTypeCounts[plant.type] = (plantTypeCounts[plant.type] || 0) + 1;
      });
      
      // 识别防线弱点
      const laneStrengths: number[] = new Array(GAME_CONFIG.gridSize.rows).fill(0);
      this.plants.forEach(plant => {
        // 防御型植物增加防线强度
        if (['wallnut', 'tallnut', 'pumpkin'].includes(plant.type)) {
          laneStrengths[plant.gridY] += 3;
        }
        // 攻击型植物增加防线强度
        if (plant.damage) {
          laneStrengths[plant.gridY] += 2;
        }
        // 辅助型植物增加防线强度
        if (['magnetshroom', 'coffeebean'].includes(plant.type)) {
          laneStrengths[plant.gridY] += 1;
        }
      });
      
      // 找出最弱的防线
      const weakestLane = laneStrengths.indexOf(Math.min(...laneStrengths));
      
      // 检查是否有清鸢植物（需要特殊处理）
      const hasQingYuan = this.plants.some(p => p.type === 'qingyuan');
      
      return {
        plantTypeCounts,
        laneStrengths,
        weakestLane,
        hasQingYuan,
        totalPlants: this.plants.length,
        attackPlantCount: this.plants.filter(p => p.damage).length,
        defensePlantCount: this.plants.filter(p => ['wallnut', 'tallnut', 'pumpkin'].includes(p.type)).length,
        sunProductionRate: this.calculateSunProductionRate()
      };
    }
    
    // 计算阳光生产速率的辅助方法
    private calculateSunProductionRate(): number {
      const sunflowerCount = this.plants.filter(p => p.type === 'sunflower').length;
      const sunshroomCount = this.plants.filter(p => p.type === 'sunshroom').length;
      // 清鸢植物提供超高阳光产量
      const qingYuanCount = this.plants.filter(p => p.type === 'qingyuan').length;
      
      // 基础阳光生产速率 + 向日葵贡献 + 阳光菇贡献 + 清鸢贡献
      return 1 + (sunflowerCount * 0.5) + (sunshroomCount * 0.3) + (qingYuanCount * 2);
    }
    
    // 创建僵尸生成计划的辅助方法
    private createZombieGenerationPlan(maxCount: number, levelData: { waves: number; zombieTypes: ZombieType[]; difficulty: GameDifficulty; isEndless?: boolean }, gameStateAnalysis: any): {
      mainTypes: {type: ZombieType, count: number}[],
      supportTypes: {type: ZombieType, count: number}[],
      eliteTypes: {type: ZombieType, count: number}[],
      specialTiming: {type: ZombieType, timing: number, lane: number}[]
    } {
      // 获取难度对应的基础权重
      const difficulty = levelData.difficulty;
      const baseWeights = GAME_CONFIG.zombieTypeWeights[difficulty as keyof typeof GAME_CONFIG.zombieTypeWeights] || GAME_CONFIG.zombieTypeWeights.easy;
      
      // 创建适应玩家策略的动态权重
      const dynamicWeights = this.createDynamicWeights(baseWeights, gameStateAnalysis);
      
      // 计算各类僵尸的分配比例
      const mainRatio = 0.7; // 普通僵尸比例
      const supportRatio = 0.2; // 辅助僵尸比例
      const eliteRatio = 0.1; // 精英僵尸比例
      
      // 根据波次特性调整比例
      const isFirstWave = this.currentWave === 1;
      const isLastWave = !levelData.isEndless && this.currentWave === levelData.waves;
      
      let adjustedMainRatio = mainRatio;
      let adjustedSupportRatio = supportRatio;
      let adjustedEliteRatio = eliteRatio;
      
      if (isFirstWave) {
        // 第一波全部是普通僵尸
        adjustedMainRatio = 1.0;
        adjustedSupportRatio = 0;
        adjustedEliteRatio = 0;
      } else if (isLastWave) {
        // 最后一波增加精英僵尸
        adjustedMainRatio = 0.5;
        adjustedSupportRatio = 0.2;
        adjustedEliteRatio = 0.3;
      }
      
      // 确定各类僵尸的数量
      const mainCount = Math.floor(maxCount * adjustedMainRatio);
      const supportCount = Math.floor(maxCount * adjustedSupportRatio);
      const eliteCount = maxCount - mainCount - supportCount;
      
      // 选择具体的僵尸类型和数量
      const mainTypes = this.selectZombieTypesByWeight(mainCount, dynamicWeights.main, levelData.zombieTypes);
      const supportTypes = this.selectZombieTypesByWeight(supportCount, dynamicWeights.support, levelData.zombieTypes);
      const eliteTypes = this.selectZombieTypesByWeight(eliteCount, dynamicWeights.elite, levelData.zombieTypes);
      
      // 生成特殊时间点出现的僵尸（如针对防线弱点的攻击）
      const specialTiming = this.generateSpecialTimingZombies(gameStateAnalysis, levelData.zombieTypes);
      
      return {
        mainTypes,
        supportTypes,
        eliteTypes,
        specialTiming
      };
    }
    
    // 创建动态权重的辅助方法
    private createDynamicWeights(baseWeights: Record<string, number>, gameStateAnalysis: any) {
      // 基础权重
      const mainWeights: Record<string, number> = {...baseWeights};
      const supportWeights: Record<string, number> = {
        imp: 3,
        backupdancer: 2,
        newspaper: 2,
        glasses: 2
      };
      const eliteWeights: Record<string, number> = {
        giant: 2,
        buckethead: 3,
        screen: 3,
        gargantuar: 1,
        football: 2,
        captain: 2,
        cowbot: 2
      };
      
      // 根据玩家策略调整权重
      
      // 1. 如果有很多防御植物，增加破防僵尸权重
      if (gameStateAnalysis.defensePlantCount > 5) {
        if (mainWeights['buckethead']) mainWeights['buckethead'] *= 1.5;
        if (mainWeights['screen']) mainWeights['screen'] *= 1.5;
        if (eliteWeights['football']) eliteWeights['football'] *= 1.5;
      }
      
      // 2. 如果有很多攻击植物，增加高生命值僵尸权重
      if (gameStateAnalysis.attackPlantCount > 8) {
        if (mainWeights['buckethead']) mainWeights['buckethead'] *= 1.3;
        if (eliteWeights['giant']) eliteWeights['giant'] *= 1.3;
        if (eliteWeights['gargantuar']) eliteWeights['gargantuar'] *= 1.3;
      }
      
      // 3. 如果阳光生产速率高，增加快速僵尸权重
      if (gameStateAnalysis.sunProductionRate > 5) {
        if (mainWeights['digger']) mainWeights['digger'] *= 1.4;
        if (mainWeights['pogo']) mainWeights['pogo'] *= 1.4;
      }
      
      // 4. 如果有清鸢植物，增加特殊僵尸和精英僵尸的权重
      if (gameStateAnalysis.hasQingYuan) {
        // 增加特殊僵尸数量来分散清鸢的注意力
        Object.keys(mainWeights).forEach(key => {
          mainWeights[key] *= 1.2; // 整体增加普通僵尸数量
        });
        
        // 增加精英僵尸的生命值和攻击力
        if (eliteWeights['giant']) eliteWeights['giant'] *= 1.5;
        if (eliteWeights['gargantuar']) eliteWeights['gargantuar'] *= 1.5;
      }
      
      // 5. 根据关卡特性调整
      if (this.isPoolLevel) {
        // 泳池关卡增加水上僵尸
        const waterZombies = ['dolphinrider', 'snorkel', 'mermaid', 'zombiefish'];
        waterZombies.forEach(type => {
          if (mainWeights[type]) mainWeights[type] *= 1.5;
        });
      }
      
      if (this.isNightLevel) {
        // 夜晚关卡增加移动速度快的僵尸
        const fastZombies = ['digger', 'pogo'];
        fastZombies.forEach(type => {
          if (mainWeights[type]) mainWeights[type] *= 1.3;
        });
      }
      
      return {
        main: mainWeights,
        support: supportWeights,
        elite: eliteWeights
      };
    }
    
    // 根据权重选择僵尸类型和数量的辅助方法
    private selectZombieTypesByWeight(count: number, weights: Record<string, number>, availableTypes: ZombieType[]): {type: ZombieType, count: number}[] {
      if (count <= 0) return [];
      
      // 创建加权数组
      const weightedArray: ZombieType[] = [];
      for (const [type, weight] of Object.entries(weights)) {
        if (availableTypes.includes(type as ZombieType)) {
          for (let i = 0; i < weight; i++) {
            weightedArray.push(type as ZombieType);
          }
        }
      }
      
      // 如果没有可用僵尸，返回空数组
      if (weightedArray.length === 0) return [];
      
      // 随机选择僵尸类型
      const selectedTypes: Record<string, number> = {};
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * weightedArray.length);
        const selectedType = weightedArray[randomIndex];
        selectedTypes[selectedType] = (selectedTypes[selectedType] || 0) + 1;
      }
      
      // 转换为需要的格式
      return Object.entries(selectedTypes).map(([type, count]) => ({
        type: type as ZombieType,
        count
      }));
    }
    
  // 生成特殊时间点出现的僵尸的辅助方法
  private generateSpecialTimingZombies(gameStateAnalysis: any, availableTypes: ZombieType[], isBossWave: boolean = false): {type: ZombieType, timing: number, lane: number}[] {
    const specialTiming: {type: ZombieType, timing: number, lane: number}[] = [];
    
    // 1. 在防线最弱的线路发动集中攻击
    if (gameStateAnalysis.laneStrengths[gameStateAnalysis.weakestLane] < 5) {
      // 选择一个适合攻击弱点的僵尸类型
      let targetType: ZombieType = 'normal';
      
      // 如果有很多攻击植物但防御薄弱，使用高生命值僵尸
      if (gameStateAnalysis.attackPlantCount > 5 && gameStateAnalysis.defensePlantCount < 3) {
        if (availableTypes.includes('buckethead')) {
          targetType = 'buckethead';
        } else if (availableTypes.includes('conehead')) {
          targetType = 'conehead';
        }
      } 
      // 如果攻击和防御都薄弱，使用快速僵尸
      else if (gameStateAnalysis.attackPlantCount < 3 && gameStateAnalysis.defensePlantCount < 3) {
        if (availableTypes.includes('digger')) {
          targetType = 'digger';
        } else if (availableTypes.includes('pogo')) {
          targetType = 'pogo';
        }
      }
      
      // 在波次中期发送针对弱点的僵尸
      const timing = Math.floor(Math.random() * 20000) + 5000; // 5-25秒之间
      specialTiming.push({
        type: targetType,
        timing,
        lane: gameStateAnalysis.weakestLane
      });
      
      // 如果防线特别弱，再增加一个僵尸
      if (gameStateAnalysis.laneStrengths[gameStateAnalysis.weakestLane] < 2) {
        specialTiming.push({
          type: targetType,
          timing: timing + 2000, // 延迟2秒
          lane: gameStateAnalysis.weakestLane
        });
      }
    }
    
    // 2. 如果有清鸢植物，在后期发送精英僵尸进行突袭
    if (gameStateAnalysis.hasQingYuan) {
      const eliteTypes = availableTypes.filter(type => 
        ['giant', 'gargantuar', 'football', 'captain'].includes(type)
      );
      
      if (eliteTypes.length > 0) {
        const randomEliteType = eliteTypes[Math.floor(Math.random() * eliteTypes.length)];
        const timing = Math.floor(Math.random() * 15000) + 15000; // 15-30秒之间
        // 选择一个随机线路，但避免最弱的线路，让攻击更加出其不意
        let randomLane;
        do {
          randomLane = Math.floor(Math.random() * GAME_CONFIG.gridSize.rows);
        } while (randomLane === gameStateAnalysis.weakestLane);
        
        specialTiming.push({
          type: randomEliteType,
          timing,
          lane: randomLane
        });
      }
    }
    
    // 3. 如果有善•猫教主植物，发送猫教主僵尸进行对抗
    if (gameStateAnalysis.hasShanCatLeader && availableTypes.includes('cat_leader')) {
      const timing = Math.floor(Math.random() * 10000) + 10000; // 10-20秒之间
      // 选择善•猫教主所在的线路
      const shanCatLane = this.plants.find(p => p.type === 'shancatleader')?.gridY || gameStateAnalysis.weakestLane;
      
      specialTiming.push({
        type: 'cat_leader',
        timing,
        lane: shanCatLane
      });
    }
    
    // 4. Boss波次特殊处理
    if (isBossWave) {
      // 如果有关卡特性，发送对应的特殊僵尸
      if (this.isPoolLevel && availableTypes.includes('dolphinrider')) {
        // 泳池关卡发送海豚骑士僵尸
        specialTiming.push({
          type: 'dolphinrider',
          timing: 10000, // 10秒时发送
          lane: Math.floor(Math.random() * GAME_CONFIG.gridSize.rows)
        });
      } else if (this.isNightLevel && availableTypes.includes('newspaper')) {
        // 夜晚关卡发送读报僵尸
        specialTiming.push({
          type: 'newspaper',
          timing: 15000, // 15秒时发送
          lane: Math.floor(Math.random() * GAME_CONFIG.gridSize.rows)
        });
      }
      
      // 如果是高强度模式，再增加一个精英僵尸
      if (LEVELS[this.currentLevel]?.isHighIntensityCustom && specialTiming.length > 0) {
        const existingSpecial = specialTiming[Math.floor(Math.random() * specialTiming.length)];
        specialTiming.push({
          ...existingSpecial,
          timing: existingSpecial.timing + 3000
        });
      }
    }
    
    // 5. 根据玩家种植模式调整
    if (gameStateAnalysis.favorRightSide) {
      // 如果玩家偏向右侧种植，从左侧发动突袭
      if (availableTypes.includes('digger')) {
        specialTiming.push({
          type: 'digger',
          timing: 5000, // 5秒时发送
          lane: Math.floor(Math.random() * GAME_CONFIG.gridSize.rows)
        });
      }
    }
    
    // 确保特殊时间点僵尸数量合理
    const maxSpecialTiming = Math.min(3, Math.max(1, Math.floor(10 / 10)));
    return specialTiming.slice(0, maxSpecialTiming);
  }
    
  // 执行僵尸生成计划的辅助方法
  private executeZombieGenerationPlan(plan: {
    mainTypes: {type: ZombieType, count: number}[],
    supportTypes: {type: ZombieType, count: number}[],
    eliteTypes: {type: ZombieType, count: number}[],
    specialTiming: {type: ZombieType, timing: number, lane: number}[]
  }, levelData: { waves: number; zombieTypes: ZombieType[]; difficulty: GameDifficulty; isEndless?: boolean }) {
    // 记录僵尸配置用于学习
    this.currentWaveConfiguration = {
      zombieTypesUsed: [...plan.mainTypes, ...plan.supportTypes, ...plan.eliteTypes].map(t => t.type),
      zombiesDeployed: plan.mainTypes.reduce((sum, t) => sum + t.count, 0) + 
                       plan.supportTypes.reduce((sum, t) => sum + t.count, 0) + 
                       plan.eliteTypes.reduce((sum, t) => sum + t.count, 0) +
                       plan.specialTiming.length,
      timestamp: Date.now(),
      gameStateSnapshot: {}
    };
    
    let delay = 0;
    
    // 生成主要僵尸
    for (const {type, count} of plan.mainTypes) {
      for (let i = 0; i < count; i++) {
        this.scheduleZombieSpawn(type, delay, levelData);
        delay += 400 + Math.random() * 300; // 400-700ms间隔
      }
    }
    
    // 生成辅助僵尸（穿插在主要僵尸之间）
    const supportDelay = delay / (plan.supportTypes.length + 1);
    let currentSupportDelay = supportDelay;
    
    for (const {type, count} of plan.supportTypes) {
      for (let i = 0; i < count; i++) {
        this.scheduleZombieSpawn(type, currentSupportDelay, levelData);
        currentSupportDelay += supportDelay;
      }
    }
    
    // 生成精英僵尸（在波次中后期）
    const eliteStartDelay = delay * 0.6; // 波次60%进度时开始出现精英僵尸
    const eliteDelayStep = (delay * 0.4) / (plan.eliteTypes.reduce((sum, t) => sum + t.count, 0) + 1);
    let currentEliteDelay = eliteStartDelay;
    
    for (const {type, count} of plan.eliteTypes) {
      for (let i = 0; i < count; i++) {
        this.scheduleZombieSpawn(type, currentEliteDelay, levelData, true);
        currentEliteDelay += eliteDelayStep;
      }
    }
    
    // 生成特殊时间点的僵尸
    for (const {type, timing, lane} of plan.specialTiming) {
      this.scheduleZombieSpawnAtSpecificTime(type, timing, lane, levelData, true);
    }
  }
  
  // 记录波次配置用于学习
  private recordWaveConfiguration(plan: any, gameStateAnalysis: any): void {
    // 存储当前波次的配置信息，用于后续分析和学习
    const waveConfig = {
      waveNumber: this.currentWave,
      timestamp: Date.now(),
      zombieTypes: [...plan.mainTypes, ...plan.supportTypes, ...plan.eliteTypes].map(t => ({type: t.type, count: t.count})),
      specialTiming: plan.specialTiming,
      gameState: {
        plantTypeCounts: gameStateAnalysis.plantTypeCounts,
        laneStrengths: gameStateAnalysis.laneStrengths,
        totalPlants: gameStateAnalysis.totalPlants,
        sunProductionRate: gameStateAnalysis.sunProductionRate,
        hasQingYuan: gameStateAnalysis.hasQingYuan,
        hasShanCatLeader: gameStateAnalysis.hasShanCatLeader
      },
      // 初始化计数器，稍后在波次结束时更新
      plantsDestroyed: 0,
      zombiesDestroyed: 0,
      zombiesReachedEnd: 0
    };
    
    this.waveConfigurations.push(waveConfig);
    
    // 只保留最近10个波次的配置
    if (this.waveConfigurations.length > 10) {
      this.waveConfigurations.shift();
    }
  }
    
    // 安排僵尸生成的辅助方法
    private scheduleZombieSpawn(type: ZombieType, delay: number, levelData: any, isElite: boolean = false): void {
      setTimeout(() => {
        if (this.gameStatus === 'playing') {
          // 智能选择线路，平衡分布
          let lane = this.chooseOptimalLaneForZombie(type);
          
          // 创建僵尸
          const zombie = new Zombie(type, lane);
          
          // 增强精英僵尸属性
          if (isElite) {
            zombie.health = Math.floor(zombie.health * 1.5);
            zombie.speed = Math.min(zombie.speed * 1.2, 2.5); // 最高速度限制
          }
          
          // 根据波次和难度增强僵尸属性
          const waveMultiplier = 1 + (this.currentWave - 1) * 0.05;
          zombie.health = Math.floor(zombie.health * waveMultiplier);
          
          this.zombies.push(zombie);
          
          // 高难度关卡或后期波次增加额外僵尸作为随从
          if ((this.currentLevel >= 5 || this.currentWave > 10) && Math.random() < 0.3 && ['giant', 'gargantuar', 'captain'].includes(type)) {
            setTimeout(() => {
              if (this.gameStatus === 'playing') {
                const supportZombies = ['imp', 'backupdancer'];
                const randomSupportZombie = supportZombies.find(t => levelData.zombieTypes.includes(t)) as ZombieType | undefined;
                if (randomSupportZombie) {
                  const extraZombie = new Zombie(randomSupportZombie, lane);
                  this.zombies.push(extraZombie);
                }
              }
            }, 300 + Math.random() * 500);
          }
        }
      }, delay);
    }
    
    // 在特定时间安排僵尸生成的辅助方法
    private scheduleZombieSpawnAtSpecificTime(type: ZombieType, timing: number, lane: number, levelData: any, isElite: boolean = false): void {
      setTimeout(() => {
        if (this.gameStatus === 'playing') {
          // 创建僵尸
          const zombie = new Zombie(type, lane);
          
          // 增强精英僵尸属性
          if (isElite) {
            zombie.health = Math.floor(zombie.health * 1.5);
            zombie.speed = Math.min(zombie.speed * 1.2, 2.5); // 最高速度限制
          }
          
          // 根据波次和难度增强僵尸属性
          const waveMultiplier = 1 + (this.currentWave - 1) * 0.05;
          zombie.health = Math.floor(zombie.health * waveMultiplier);
          
          this.zombies.push(zombie);
        }
      }, timing);
    }
    
    // 选择最优线路放置僵尸的辅助方法
    private chooseOptimalLaneForZombie(zombieType: ZombieType): number {
      // 统计各线路僵尸数量
      const laneCounts = new Array(GAME_CONFIG.gridSize.rows).fill(0);
      for (const z of this.zombies) {
        const zombieLane = Math.floor(z.y / GAME_CONFIG.cellSize.height);
        if (zombieLane >= 0 && zombieLane < GAME_CONFIG.gridSize.rows) {
          laneCounts[zombieLane]++;
        }
      }
      
      // 某些僵尸类型有特殊线路偏好
      if (['dolphinrider', 'snorkel', 'mermaid', 'zombiefish'].includes(zombieType) && this.isPoolLevel) {
        // 水上僵尸优先选择中间线路（假设泳池在中间）
        const poolLanes = [2, 3]; // 假设第3、4行为泳池（从0开始计数）
        const availablePoolLanes = poolLanes.filter(lane => lane < GAME_CONFIG.gridSize.rows);
        
        if (availablePoolLanes.length > 0) {
          // 在可用泳池线路中选择僵尸最少的
          let minCount = Infinity;
          let optimalLane = availablePoolLanes[0];
          
          for (const lane of availablePoolLanes) {
            if (laneCounts[lane] < minCount) {
              minCount = laneCounts[lane];
              optimalLane = lane;
            }
          }
          
          return optimalLane;
        }
      }
      
      // 优先选择僵尸数量最少的线路
      const minCount = Math.min(...laneCounts);
      const availableLanes = laneCounts.map((count, idx) => idx).filter(idx => laneCounts[idx] === minCount);
      
      // 随机选择一个
      return availableLanes[Math.floor(Math.random() * availableLanes.length)];
    }
  
   // 播放音效(简化版)
  playSound(type: string): void {
    // 实际项目中可以使用Web Audio API或Audio元素实现
    console.log(`Play sound: ${type}`);
    
    // 模拟音效（实际项目中可以替换为真实的音频播放）
    if (type === 'meteorite') {
      // 陨石音效
      console.log('播放陨石音效：呼啸声和爆炸声');
    }
  }
  
    // 检查并触发陨石
  checkAndTriggerMeteorites(): void {
    const leftmostColumn = 0;
    const cellWidth = GAME_CONFIG.cellSize.width;
    const leftmostX = leftmostColumn * cellWidth;
    
    // 检查每行是否有僵尸到达最左列，并且该行列尚未触发过陨石
    for (let row = 0; row < GAME_CONFIG.gridSize.rows; row++) {
      // 检查该行是否已经触发过陨石（每行每局仅触发一次）
      if (this.meteoriteTriggeredRows[row]) {
        continue;
      }
      
      // 检查该行是否有僵尸到达最左列
      let hasZombieInLeftmost = false;
      for (const zombie of this.zombies) {
        const zombieRow = Math.floor(zombie.y / GAME_CONFIG.cellSize.height);
        if (zombieRow === row && zombie.x <= leftmostX + cellWidth && zombie.x >= leftmostX) {
          hasZombieInLeftmost = true;
          break;
        }
      }
      
      // 如果有僵尸到达最左列，触发陨石
      if (hasZombieInLeftmost) {
        // 标记该行已触发陨石
        this.meteoriteTriggeredRows[row] = true;
        
        // 创建陨石
        const meteorite = new Meteorite(row);
        this.meteorites.push(meteorite);
        
        // 播放陨石音效
        this.playSound('meteorite');
        
        // 延迟清空该行僵尸（与爆炸动画同步）
        setTimeout(() => {
          this.clearRowZombies(row);
        }, 500);
        
        break; // 一次只触发一个陨石
      }
    }
  }
  
  // 清空指定行的所有僵尸
  clearRowZombies(row: number): void {
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const zombie = this.zombies[i];
      const zombieRow = Math.floor(zombie.y / GAME_CONFIG.cellSize.height);
      if (zombieRow === row) {
        this.zombies.splice(i, 1);
        this.playSound('zombiedie');
      }
    }
  }
  
  // 游戏主循环
   gameLoop(): void {
    if (this.gameStatus !== 'playing') return;
    
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTime) * this.gameSpeed;
    this.lastTime = currentTime;
    
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制游戏背景和网格
    this.drawBackground();
    
     // 更新植物冷却时间
     Object.keys(this.plantCooldowns).forEach(key => {
       const plantType = key as PlantType;
       if (this.plantCooldowns[plantType] > 0) {
         this.plantCooldowns[plantType] -= deltaTime;
       }
     });
     
     // 处理清鸢的周期性效果
     const qingyuanPlants = this.plants.filter(p => p.type === 'qingyuan');
     if (qingyuanPlants.length > 0) {
       // 每10秒释放一次神圣光波，清除全屏负面效果
       if (currentTime - this.lastTipTime >= 10000) {
         // 清除所有僵尸的减速效果
         this.zombies.forEach(zombie => {
           zombie.isSlowed = false;
         });
         this.createVisualFeedback('holy_wave', this.canvas.width / 2, this.canvas.height / 2, 0, '神圣光波清除了所有负面效果！');
         this.lastTipTime = currentTime;
       }
       
       // 每30秒召唤一次神圣领域，持续5秒，期间所有植物攻击力提升50%
       if (currentTime - this.lastWaveTime >= 30000) {
         this.createVisualFeedback('holy_field', this.canvas.width / 2, this.canvas.height / 2, 0, '神圣领域！所有植物攻击力提升50%！');
         // 在实际实现中，这里应该增加所有植物的攻击力
         this.lastWaveTime = currentTime;
       }
     }
     
     // 处理宿槐的召唤请求
     while (this.summonRequests.length > 0) {
       const request = this.summonRequests.shift();
       if (request) {
         const { zombieType, lane } = request;
         try {
           const summonedZombie = new Zombie(zombieType, lane);
           this.zombies.push(summonedZombie);
           this.createVisualFeedback('summon_zombie', this.canvas.width - 50, summonedZombie.y, 0, `宿槐召唤了 ${ZOMBIES[zombieType].name}!`);
         } catch (error) {
           console.error(`Failed to summon zombie: ${error}`);
         }
       }
     }
    
     // 生成阳光（考虑修饰器）
    const adjustedSunRate = GAME_CONFIG.sunProductionRate / this.sunProductionRateModifier;
    if (currentTime - this.lastSunProductionTime >= adjustedSunRate) {
      this.generateSun();
      this.lastSunProductionTime = currentTime;
      
      // 特殊条件：晴天时额外生成阳光
      if (this.currentWeather === 'sunny' && Math.random() < 0.2) {
        setTimeout(() => {
          if (this.gameStatus === 'playing') {
            this.generateSun();
          }
        }, 500);
      }
    }
    
    // 检查并触发陨石
    this.checkAndTriggerMeteorites();
    
    // 生成僵尸波次
    if (this.currentWave < this.totalWaves && 
        currentTime - this.lastWaveTime >= GAME_CONFIG.waveInterval) {
      this.generateWave();
    }
    
     // 检查游戏胜利条件（非无尽模式）
    if (!LEVELS[this.currentLevel]?.isEndless && this.currentWave >= this.totalWaves && this.zombies.length === 0) {
      this.gameVictory();
      return;
    }
    
     // 更新和渲染植物
    for (let i = this.plants.length - 1; i >= 0; i--) {
      const plant = this.plants[i];
      
   // 检查植物是否死亡
   // 清鸢免疫减速、控制效果和所有负面状态
   if (plant.type === 'qingyuan') {
     // 清鸢有30%概率反弹50%伤害
     if (Math.random() < 0.3) {
       // 找到攻击清鸢的僵尸并反弹伤害
       const attackingZombies = this.zombies.filter(zombie => {
         const zombieRow = Math.floor(zombie.y / GAME_CONFIG.cellSize.height);
         const plantRow = plant.gridY;
         return zombieRow === plantRow && zombie.x <= plant.x + plant.width && zombie.x + zombie.width >= plant.x;
       });
       
       if (attackingZombies.length > 0) {
         const randomZombie = attackingZombies[Math.floor(Math.random() * attackingZombies.length)];
         // 反弹50%伤害
         const reflectedDamage = Math.floor((PLANTS[plant.type].damage || 0) * 0.5);
         this.createVisualFeedback('damage_reflect', randomZombie.x, randomZombie.y, reflectedDamage);
         randomZombie.health -= reflectedDamage;
       }
     }
     
     // 清鸢有神圣护盾，需要特殊处理死亡
     if (plant.health <= 0) {
       // 触发神圣爆发，对全屏僵尸造成3000点伤害并眩晕3秒
       for (let j = this.zombies.length - 1; j >= 0; j--) {
         const zombie = this.zombies[j];
         zombie.health -= 3000;
         // 设置僵尸眩晕状态（简化实现）
         zombie.speed *= 0.1;
         setTimeout(() => {
           if (zombie.speed) zombie.speed *= 10; // 恢复速度
         }, 3000);
       }
       
       // 播放清鸢死亡音效
       this.playSound('explosion');
       // 从数组中移除死亡植物
       this.plants.splice(i, 1);
     }
   } else if (plant.health <= 0) {
        // 从数组中移除死亡植物
        this.plants.splice(i, 1);
        this.playSound('plantdie');
        continue;
      }
      
      // 更新植物状态
      plant.update(deltaTime);
      
       // 向日葵生产阳光
       if (plant.canProduceSun(currentTime)) {
         const newSun = new Sun(plant.x + plant.width / 2, plant.y);
         this.suns.push(newSun);
         plant.lastSunProductionTime = currentTime;
       }
       
       // 清鸢特殊阳光生产
       if (plant.type === 'qingyuan' && currentTime - plant.lastSunProductionTime >= 800) {
         const newSun = new Sun(plant.x + plant.width / 2, plant.y, 80); // 每0.8秒产生80阳光
         this.suns.push(newSun);
         plant.lastSunProductionTime = currentTime;
       }
      
       // 植物攻击
      if (plant.canAttack(currentTime)) {
        let bullet = null;
        
        // 普通攻击植物
        if (plant.type === 'peashooter' || plant.type === 'snowpea') {
          bullet = plant.attack();
          if (bullet) {
            this.bullets.push(bullet);
            // 双发射手额外发射一颗子弹
            if (plant.type === 'repeater') {
              const secondBullet = new Bullet(
                bullet.x, 
                bullet.y + 10, 
                bullet.damage, 
                bullet.isFrozen
              );
              this.bullets.push(secondBullet);
            }
          }
        }
                 // 香蒲追踪攻击
                 else if (plant.type === 'cattail' || plant.type === 'qingyuan') {
                   // 寻找最近的僵尸作为目标
                   let closestZombie: Zombie | null = null;
                   let minDistance = Infinity;
                   
                   for (const zombie of this.zombies) {
                     const dx = zombie.x + zombie.width / 2 - (plant.x + plant.width / 2);
                     const dy = zombie.y + zombie.height / 2 - (plant.y + plant.height / 4);
                     const distance = Math.sqrt(dx * dx + dy * dy);
                     
                     if (distance < minDistance) {
                       minDistance = distance;
                       closestZombie = zombie;
                     }
                   }
                   
                   if (closestZombie) {
                     // 创建追踪子弹
                     bullet = new Bullet(
                       plant.x + plant.width / 2,
                       plant.y + plant.height / 4,
                       PLANTS[plant.type].damage || 0,
                       false,
                       true,
                       closestZombie
                     );
                     this.bullets.push(bullet);
                     
                     // 清鸢的额外攻击效果 - 攻击数量为场上僵尸数+3
                     if (plant.type === 'qingyuan') {
                       const additionalAttacks = Math.min(this.zombies.length + 3, 10); // 限制最大额外攻击数量为10
                       for (let i = 1; i < additionalAttacks; i++) {
                         const randomZombieIndex = Math.floor(Math.random() * this.zombies.length);
                         const randomZombie = this.zombies[randomZombieIndex];
                         if (randomZombie) {
                           const extraBullet = new Bullet(
                             plant.x + plant.width / 2,
                             plant.y + plant.height / 4,
                             PLANTS[plant.type].damage || 0,
                             false,
                             true,
                             randomZombie
                           );
                           this.bullets.push(extraBullet);
                         }
                       }
                     }
                   }
                 }
        // 冰西瓜范围攻击
        else if (plant.type === 'wintermelon') {
          // 寻找范围内的僵尸
          const radius = GAME_CONFIG.cellSize.width * 2; // 范围半径
          const centerX = plant.x + plant.width / 2;
          const centerY = plant.y + plant.height / 2;
          
          for (const zombie of this.zombies) {
            const dx = zombie.x + zombie.width / 2 - centerX;
            const dy = zombie.y + zombie.height / 2 - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
              // 对范围内的僵尸造成伤害并减速
              zombie.takeDamage(PLANTS[plant.type].damage || 0, true);
              this.playSound('shoot');
            }
          }
        }
        // 玉米加农炮攻击
        else if (plant.type === 'cobcannon') {
          // 寻找最前面的僵尸作为目标
          let frontmostZombie: Zombie | null = null;
          let minX = Infinity;
          
          for (const zombie of this.zombies) {
            if (zombie.x < minX) {
              minX = zombie.x;
              frontmostZombie = zombie;
            }
          }
          
          if (frontmostZombie) {
            // 创建玉米炮弹（范围伤害）
            const explosionX = frontmostZombie.x + frontmostZombie.width / 2;
            const explosionY = frontmostZombie.y + frontmostZombie.height / 2;
            
            // 对爆炸范围内的僵尸造成伤害
            const explosionRadius = GAME_CONFIG.cellSize.width * 1.5;
            for (let j = this.zombies.length - 1; j >= 0; j--) {
              const zombie = this.zombies[j];
              const dx = zombie.x + zombie.width / 2 - explosionX;
              const dy = zombie.y + zombie.height / 2 - explosionY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance <= explosionRadius) {
                if (zombie.takeDamage(PLANTS[plant.type].damage || 0)) {
                  this.zombies.splice(j, 1);
                  this.playSound('zombiedie');
                }
              }
            }
            
            // 播放爆炸音效
            this.playSound('explosion');
          }
        }
        
        if (bullet) {
          plant.lastAttackTime = currentTime;
          this.playSound('shoot');
        }
      }
      
       // 樱桃炸弹和火爆辣椒爆炸效果
      if ((plant.type === 'cherrybomb' || plant.type === 'jalapeno') && 
          currentTime - plant.lastAttackTime >= 1000) {
        if (plant.explode()) {
          // 爆炸范围内的僵尸受到伤害
          const damage = PLANTS[plant.type].damage || 0;
          
          if (plant.type === 'cherrybomb') {
            // 樱桃炸弹：范围爆炸
            const explosionRange = GAME_CONFIG.cellSize.width * 1.5;
            const explosionX = plant.x + plant.width / 2;
            const explosionY = plant.y + plant.height / 2;
            
            for (let j = this.zombies.length - 1; j >= 0; j--) {
              const zombie = this.zombies[j];
              const distX = Math.abs(zombie.x + zombie.width / 2 - explosionX);
              const distY = Math.abs(zombie.y + zombie.height / 2 - explosionY);
              
              if (distX <= explosionRange && distY <= explosionRange) {
                if (zombie.takeDamage(damage)) {
                  this.zombies.splice(j, 1);
                  this.playSound('zombiedie');
                }
              }
            }
          } else if (plant.type === 'jalapeno') {
            // 火爆辣椒：直线爆炸
            const row = Math.floor(plant.y / GAME_CONFIG.cellSize.height);
            
            for (let j = this.zombies.length - 1; j >= 0; j--) {
              const zombie = this.zombies[j];
              const zombieRow = Math.floor(zombie.y / GAME_CONFIG.cellSize.height);
              
              if (zombieRow === row) {
                if (zombie.takeDamage(damage)) {
                  this.zombies.splice(j, 1);
                  this.playSound('zombiedie');
                }
              }
            }
          }
          
          // 移除消耗型植物
          this.plants.splice(i, 1);
          this.playSound('explosion');
        }
      }
      
      // 渲染植物
      plant.render(this.ctx);
    }
    
    // 更新和渲染僵尸
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const zombie = this.zombies[i];
      if (!zombie) continue;
      
      // 更新僵尸状态
      zombie.update(deltaTime, this.plants);
      
      // 宿槐特有：处理召唤请求
      if (zombie.type === 'su_huai' && (zombie as any).lastSummonTime === currentTime) {
        // 获取召唤的僵尸类型
        const summonedTypes = (zombie as any).summonedZombies || [];
        // 为每个召唤的僵尸创建请求
        summonedTypes.forEach((summonedType: ZombieType) => {
          const lane = Math.floor(zombie.y / GAME_CONFIG.cellSize.height);
          this.summonRequests.push({ zombieType: summonedType, lane });
        });
      }
      
      // 特殊僵尸行为处理
      if (zombie.type === 'balloon') {
        // 气球僵尸飞行，不受普通植物阻挡
        let foundPlant = false;
        for (const plant of this.plants) {
          // 只有高坚果能阻挡气球僵尸
          if (plant.gridY === Math.floor(zombie.y / GAME_CONFIG.cellSize.height) &&
              plant.x + plant.width >= zombie.x &&
              plant.type === 'tallnut') {
            foundPlant = true;
            zombie.isEating = true;
            // 尝试攻击植物
            if (zombie.canAttack(Date.now())) {
             if (plant.takeDamage(zombie.damage)) {
              // 植物被消灭
              // 这里不需要手动移除，会在植物更新循环中处理
            }
            zombie.lastAttackTime = Date.now();
            }
            break;
          }
        }
        
        if (!foundPlant) {
          zombie.isEating = false;
           // 气球僵尸移动
           zombie.x -= zombie.speed * GAME_CONFIG.zombieSpeedMultiplier * deltaTime * 0.1;
        }
      } else if (zombie.type === 'digger') {
        // 矿工僵尸从后方出现
        if (zombie.x > GAME_CONFIG.gridSize.cols * GAME_CONFIG.cellSize.width) {
           // 还在屏幕外，继续向左移动
           zombie.x -= zombie.speed * GAME_CONFIG.zombieSpeedMultiplier * deltaTime * 0.1;
         } else if (zombie.x > GAME_CONFIG.gridSize.cols * GAME_CONFIG.cellSize.width * 0.5) {
           // 到达中间线，开始向下移动（挖掘）
           zombie.y += zombie.speed * GAME_CONFIG.zombieSpeedMultiplier * deltaTime * 0.05;
         } else if (zombie.x > 0) {
           // 到达左侧，向上移动（出土）
           zombie.y -= zombie.speed * GAME_CONFIG.zombieSpeedMultiplier * deltaTime * 0.05;
           // 出土后开始向右移动
           zombie.x += zombie.speed * GAME_CONFIG.zombieSpeedMultiplier * deltaTime * 0.1;
        }
      } else if (zombie.type === 'dolphinrider') {
        // 海豚骑士僵尸跳过第一个植物
        let hasJumped = false;
        for (const plant of this.plants) {
          if (plant.gridY === Math.floor(zombie.y / GAME_CONFIG.cellSize.height) &&
              plant.x + plant.width >= zombie.x && !hasJumped) {
            // 跳过第一个植物
            zombie.x = plant.x + plant.width + 10;
            hasJumped = true;
            break;
          }
        }
      }
      
      // 检查僵尸是否到达终点
      if (zombie.x <= 0 || (zombie.type === 'digger' && zombie.x > GAME_CONFIG.gridSize.cols * GAME_CONFIG.cellSize.width && zombie.y > GAME_CONFIG.gridSize.rows * GAME_CONFIG.cellSize.height)) {
        this.gameOver();
        return;
      }
      
      // 渲染僵尸
      zombie.render(this.ctx);
    }
    
    // 更新和渲染子弹
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      // 更新子弹位置
      bullet.update(deltaTime);
      
      // 检查子弹是否超出屏幕
      if (bullet.x > this.canvas.width) {
        this.bullets.splice(i, 1);
        continue;
      }
      
      // 检查子弹是否击中僵尸
      let hitZombie = false;
      for (let j = this.zombies.length - 1; j >= 0; j--) {
        const zombie = this.zombies[j];
        if (bullet.isColliding(zombie)) {
           // 僵尸受到伤害
           // 检查是否是清鸢的攻击
           const isQingYuanAttack = bullet.x < 500; // 简化判断：清鸢在左侧，子弹起始位置较低
           
           // 处理清鸢对特定僵尸的额外伤害
           let finalDamage = bullet.damage;
           if (isQingYuanAttack) {
             // 巨人僵尸+30%伤害
             if (['giant', 'gargantuar'].includes(zombie.type)) {
               finalDamage = Math.floor(finalDamage * 1.3);
             }
             // 飞行僵尸+40%伤害
             else if (['balloon', 'bungee'].includes(zombie.type)) {
               finalDamage = Math.floor(finalDamage * 1.4);
             }
             // 潜水僵尸+50%伤害
             else if (['dolphinrider', 'zombiefish', 'snorkel', 'mermaid'].includes(zombie.type)) {
               finalDamage = Math.floor(finalDamage * 1.5);
             }
             // 特殊僵尸+100%伤害
             else if (['flag', 'scientist', 'impmustache', 'captain'].includes(zombie.type)) {
               finalDamage = Math.floor(finalDamage * 2);
             }
           }
           
           if (zombie.takeDamage(finalDamage, bullet.isFrozen)) {
             this.zombies.splice(j, 1);
             this.playSound('zombiedie');
             
             // 无尽模式特殊奖励：每消灭10个僵尸奖励额外阳光
             if (LEVELS[this.currentLevel]?.isEndless && this.totalZombiesKilled > 0 && this.totalZombiesKilled % 10 === 0) {
               const bonusSun = 50 + Math.floor(this.currentWave / 5) * 10; // 基础50阳光，每5波增加10阳光
               this.sun = Math.min(this.sun + bonusSun, GAME_CONFIG.maxSun);
               this.createVisualFeedback('endless_bonus', zombie.x, zombie.y, bonusSun);
             }
            
            // 增加僵尸击杀计数
            this.totalZombiesKilled++;
            
            // 更新连击系统
            const currentTime = Date.now();
            if (currentTime - this.lastZombieKillTime < 2000) {
              this.currentCombo++;
              
              // 连击奖励
              if (this.currentCombo >= GAME_CONFIG.comboMultiplierThreshold) {
                const bonusSun = Math.floor(5 * GAME_CONFIG.comboMultiplier);
                this.sun = Math.min(this.sun + bonusSun, GAME_CONFIG.maxSun);
                this.createVisualFeedback('combo_bonus', zombie.x, zombie.y, bonusSun);
              }
            } else {
              this.currentCombo = 1;
            }
            this.lastZombieKillTime = currentTime;
            
            // 添加僵尸死亡的视觉反馈
            this.createVisualFeedback('zombie_death', zombie.x, zombie.y);
          }
          
          // 移除子弹
          this.bullets.splice(i, 1);
          hitZombie = true;
          break;
        }
      }
      
      // 渲染子弹
      if (!hitZombie) {
        bullet.render(this.ctx);
      }
    }
    
     // 更新和渲染阳光
    for (let i = this.suns.length - 1; i >= 0; i--) {
      const sun = this.suns[i];
      
      // 更新阳光位置和生命周期
      sun.update(deltaTime);
      
      // 检查阳光是否过期或到达收集点
      if (sun.isExpired()) {
        // 自动收集阳光
        this.sun = Math.min(this.sun + sun.value, GAME_CONFIG.maxSun);
        this.suns.splice(i, 1);
        this.playSound('collect'); // 播放收集音效
        
        // 增加阳光收集计数
        this.totalSunsCollected += sun.value;
        continue;
      }
      
      // 渲染阳光
      sun.render(this.ctx);
    }
    
     // 更新和渲染陨石
    for (let i = this.meteorites.length - 1; i >= 0; i--) {
      const meteorite = this.meteorites[i];
      
      // 更新陨石状态
      meteorite.update(deltaTime);
      
      // 检查陨石是否完成（爆炸动画结束）
      if (meteorite.isFinished()) {
        this.meteorites.splice(i, 1);
        continue;
      }
      
      // 渲染陨石
      meteorite.render(this.ctx);
    }
    
     // 更新和渲染自动攻击角色
    for (const attacker of this.autoAttackers) {
      try {
        attacker.update(deltaTime, this.zombies, this.bullets);
      } catch (error) {
        console.error('自动攻击者更新失败:', error);
      }
      try {
        attacker.render(this.ctx);
      } catch (error) {
        console.error('自动攻击者渲染失败:', error);
      }
    }
    
     // 继续游戏循环
     // 检查成就
    this.checkAchievements();
    
    // 更新天气和时间
    this.updateWeatherAndTime(currentTime);
    
    // 检查并触发特殊事件
    this.checkAndTriggerSpecialEvents(currentTime);
    
    // 检查植物升级
    this.checkPlantUpgrades();
    
    // 显示游戏提示
    this.showGameTip();
    
    // 检查连击
    this.checkCombo();
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
   // 新增游戏功能：更新天气和时间
  updateWeatherAndTime(currentTime: number): void {
    // 在固定时间间隔后随机改变天气
    if (currentTime - this.lastWeatherChangeTime >= this.GAME_CONFIG.dayNightCycleDuration) {
      // 切换日夜
      this.timeOfDay = this.timeOfDay === 'day' ? 'night' : 'day';
      
      // 随机改变天气
      if (Math.random() < this.GAME_CONFIG.weatherChangeChance) {
        const weathers: WeatherType[] = ['sunny', 'rainy', 'foggy', 'sandstorm', 'snowy'];
        this.currentWeather = weathers[Math.floor(Math.random() * weathers.length)];
      }
      
      this.lastWeatherChangeTime = currentTime;
      
      // 显示天气变化提示
      let weatherMessage = '';
      switch (this.currentWeather) {
        case 'sunny':
          weatherMessage = '阳光明媚的一天！阳光产量增加！';
          break;
        case 'rainy':
          weatherMessage = '开始下雨了！某些植物效果减弱！';
          break;
        case 'foggy':
          weatherMessage = '雾气弥漫！视野范围减小！';
          break;
        case 'sandstorm':
          weatherMessage = '沙尘暴来袭！植物生长速度减慢！';
          break;
        case 'snowy':
          weatherMessage = '下雪了！僵尸移动速度减慢！';
          break;
      }
      
      this.createVisualFeedback('weather_change', this.canvas.width / 2, 50, 0, weatherMessage);
    }
  }
  
   // 新增游戏功能：检查并触发特殊事件
  checkAndTriggerSpecialEvents(currentTime: number): void {
    // 只有在没有活跃事件且一定时间间隔后才触发新事件
    if (this.currentEvent === null && currentTime - this.lastEventTime >= this.GAME_CONFIG.dayNightCycleDuration) {
       if (Math.random() < this.GAME_CONFIG.specialEventChance) {
        const events: SpecialEvent[] = ['boss_battle', 'sun_storm', 'zombie_invasion'];
        this.currentEvent = events[Math.floor(Math.random() * events.length)];
        this.lastEventTime = currentTime;
        
        // 根据事件类型执行相应操作
        switch (this.currentEvent) {
          case 'boss_battle':
            this.triggerBossBattle();
            break;
          case 'sun_storm':
            this.triggerSunStorm();
            break;
          case 'zombie_invasion':
            this.triggerZombieInvasion();
            break;
        }
      }
    }
  }
  
  // 新增游戏功能：触发Boss战
  triggerBossBattle(): void {
    // 显示Boss战提示
    this.createVisualFeedback('boss_battle', this.canvas.width / 2, 50, 0, '僵尸Boss来袭！准备战斗！');
    
    // 在实际游戏中，这里应该创建一个强大的僵尸Boss
    // 简化版：创建一个巨人僵尸作为Boss
    setTimeout(() => {
      if (this.gameStatus === 'playing') {
        const bossZombie = new Zombie('giant', Math.floor(Math.random() * GAME_CONFIG.gridSize.rows));
        // 增强Boss属性
        bossZombie.health *= 2;
        bossZombie.damage *= 1.5;
        this.zombies.push(bossZombie);
      }
    }, 3000);
  }
  
  // 新增游戏功能：触发阳光风暴
  triggerSunStorm(): void {
    // 显示阳光风暴提示
    this.createVisualFeedback('sun_storm', this.canvas.width / 2, 50, 0, '阳光风暴来袭！收集额外阳光！');
    
    // 在一段时间内生成大量阳光
    const stormDuration = 10000;
    const intervalId = setInterval(() => {
      if (this.gameStatus === 'playing') {
        this.generateSun();
        // 额外生成更多阳光
        for (let i = 0; i < 2; i++) {
          this.generateSun();
        }
      } else {
        clearInterval(intervalId);
      }
    }, 500);
    
    // 风暴结束后清理
    setTimeout(() => {
      clearInterval(intervalId);
      this.currentEvent = null;
    }, stormDuration);
  }
  
  // 新增游戏功能：触发僵尸入侵
  triggerZombieInvasion(): void {
    // 显示僵尸入侵提示
    this.createVisualFeedback('zombie_invasion', this.canvas.width / 2, 50, 0, '僵尸大规模入侵！小心防守！');
    
    // 生成大量僵尸
    const invasionDuration = 15000;
    const intervalId = setInterval(() => {
      if (this.gameStatus === 'playing') {
        // 生成多个普通僵尸
        for (let i = 0; i < 3; i++) {
          const lane = Math.floor(Math.random() * GAME_CONFIG.gridSize.rows);
          const zombie = new Zombie('normal', lane);
          this.zombies.push(zombie);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 800);
    
    // 入侵结束后清理
    setTimeout(() => {
      clearInterval(intervalId);
      this.currentEvent = null;
    }, invasionDuration);
  }
  
  // 新增游戏功能：植物升级检查
  checkPlantUpgrades(): void {
    // 检查是否有可以升级的植物组合
    // 在实际游戏中，这里应该检查相邻的相同植物并进行升级
    // 简化版：每种植3个相同植物就升级一次
    const plantCounts = new Map<PlantType, number>();
    
    this.plants.forEach(plant => {
      const count = plantCounts.get(plant.type) || 0;
      plantCounts.set(plant.type, count + 1);
    });
    
    // 检查是否有植物可以升级
    plantCounts.forEach((count, type) => {
      const currentLevel = this.plantUpgrades.get(type as string)?.level || 1;
      if (count >= 3 * currentLevel && currentLevel < 3) {
        // 升级植物
        const newLevel = (currentLevel + 1) as PlantUpgradeLevel;
        this.plantUpgrades.set(type as string, {
          level: newLevel,
          path: 'offense' // 默认攻击升级路径
        });
        
        // 显示升级提示
        this.createVisualFeedback('plant_upgrade', this.canvas.width / 2, 50, 0, `${PLANTS[type].name} 升级到了 ${newLevel} 级！`);
        
        // 在实际游戏中，这里应该增强所有该类型植物的属性
      }
    });
  }

  // 创建视觉反馈效果（增加新的类型支持）
  createVisualFeedback(type: string, x: number, y: number, value?: number, message?: string): void {
    // 处理召唤僵尸的特殊效果
    if (type === 'summon_zombie') {
      const feedbackElement = document.createElement('div');
      feedbackElement.className = 'fixed pointer-events-none z-40 font-bold text-red-400 animate-fade-up';
      feedbackElement.innerHTML = `<div>${message}</div>`;
      
      // 设置位置
      feedbackElement.style.left = `${x}px`;
      feedbackElement.style.top = `${y}px`;
      
      // 添加到DOM
      document.body.appendChild(feedbackElement);
      
      // 添加CSS动画
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fade-up {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
        .animate-fade-up {
          animation: fade-up 1s forwards;
        }
      `;
      document.head.appendChild(style);
      
      // 1秒后移除
      setTimeout(() => {
        document.body.removeChild(feedbackElement);
        document.head.removeChild(style);
      }, 1000);
      return;
    }
    // 实际项目中可以使用粒子系统或CSS动画实现更复杂的效果
    try {
      // 波次开始特殊效果
      if (type === 'wave_start') {
        const waveElement = document.createElement('div');
        waveElement.className = 'fixed pointer-events-none z-50 font-bold text-xl text-red-500 animate-pulse';
        waveElement.innerHTML = `<div class="drop-shadow-lg">${message}</div>`;
        
        // 设置位置
        waveElement.style.left = `${x - 100}px`;
        waveElement.style.top = `${y - 20}px`;
        waveElement.style.width = '200px';
        waveElement.style.textAlign = 'center';
        
        // 添加到DOM
        document.body.appendChild(waveElement);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse-wave {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-pulse {
            animation: pulse-wave 2s forwards;
          }
        `;
        document.head.appendChild(style);
        
        // 2秒后移除
        setTimeout(() => {
          document.body.removeChild(waveElement);
          document.head.removeChild(style);
        }, 2000);
        return;
      }
      
      // 阳光奖励特殊效果
      if (type === 'sun_bonus') {
        const bonusElement = document.createElement('div');
        bonusElement.className = 'fixed pointer-events-none z-50 font-bold text-yellow-400';
        bonusElement.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="text-3xl mb-1">☀️</div>
            <div class="text-xl">+${value} 阳光</div>
            <div class="text-sm mt-1 text-yellow-300">${message}</div>
          </div>
        `;
        
        // 设置位置
        bonusElement.style.left = `${x - 50}px`;
        bonusElement.style.top = `${y - 50}px`;
        
        // 添加到DOM
        document.body.appendChild(bonusElement);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
          @keyframes float-up {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-100px); }
          }
          .animate-float-up {
            animation: float-up 2s forwards;
          }
        `;
        document.head.appendChild(style);
        bonusElement.classList.add('animate-float-up');
        
        // 2秒后移除
        setTimeout(() => {
          document.body.removeChild(bonusElement);
          document.head.removeChild(style);
        }, 2000);
        return;
      }
      // 计算游戏区域坐标
      const canvasRect = this.canvas.getBoundingClientRect();
      const cellWidth = GAME_CONFIG.cellSize.width;
      const cellHeight = GAME_CONFIG.cellSize.height;
      
      // 将游戏逻辑坐标转换为屏幕坐标
      const screenX = canvasRect.left + (x * canvasRect.width) / (GAME_CONFIG.gridSize.cols * cellWidth);
      const screenY = canvasRect.top + (y * canvasRect.height) / (GAME_CONFIG.gridSize.rows * cellHeight);
      
      // 创建临时DOM元素显示反馈
      const feedbackElement = document.createElement('div');
      feedbackElement.className = 'fixed pointer-events-none z-40 font-bold text-lg';
      
       switch (type) {
         case 'plant_success':
           feedbackElement.innerHTML = '<div class="text-green-400 animate-fade-up">🌱 种植成功！</div>';
           break;
         case 'sun_collect':
           feedbackElement.innerHTML = `<div class="text-yellow-400 animate-fade-up">☀️ +${value}</div>`;
           break;
         case 'zombie_death':
           feedbackElement.innerHTML = '<div class="text-red-400 animate-fade-up">💀 僵尸消灭！</div>';
           break;
         case 'combo_bonus':
           feedbackElement.innerHTML = `<div class="text-purple-400 animate-fade-up">✨ 连击奖励 +${value}！</div>`;
           break;
         case 'endless_start':
           feedbackElement.innerHTML = `<div class="text-purple-400 animate-fade-up text-xl font-bold">🌌 ${message}</div>`;
           feedbackElement.style.width = '300px';
           feedbackElement.style.textAlign = 'center';
           break;
         case 'endless_bonus':
           feedbackElement.innerHTML = `<div class="text-purple-400 animate-fade-up">🎁 无尽奖励 +${value}！</div>`;
           break;
        case 'weather_change':
          feedbackElement.innerHTML = `<div class="text-blue-400 animate-fade-up">🌤️ ${message}</div>`;
          break;
        case 'boss_battle':
          feedbackElement.innerHTML = `<div class="text-orange-400 animate-fade-up">👑 ${message}</div>`;
          break;
        case 'sun_storm':
          feedbackElement.innerHTML = `<div class="text-yellow-400 animate-fade-up">🌪️ ${message}</div>`;
          break;
        case 'zombie_invasion':
          feedbackElement.innerHTML = `<div class="text-red-400 animate-fade-up">🧟 ${message}</div>`;
          break;
        case 'plant_upgrade':
          feedbackElement.innerHTML = `<div class="text-green-400 animate-fade-up">📈 ${message}</div>`;
          break;
      }
      
      // 设置位置
      feedbackElement.style.left = `${screenX - 25}px`;
      feedbackElement.style.top = `${screenY - 50}px`;
      
      // 添加到DOM
      document.body.appendChild(feedbackElement);
      
      // 添加CSS动画
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fade-up {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
        .animate-fade-up {
          animation: fade-up 1s forwards;
        }
      `;
      document.head.appendChild(style);
      
      // 1秒后移除
      setTimeout(() => {
        document.body.removeChild(feedbackElement);
        document.head.removeChild(style);
      }, 1000);
    } catch (error) {
      console.error('Error creating visual feedback:', error);
    }
  }
  
   // 绘制游戏背景和网格，使用用户提供的图片作为背景，进一步提升清晰度
   drawBackground(): void {
      // 1. 绘制用户提供的图片作为背景
      const backgroundImage = new Image();
      backgroundImage.src = "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/屏幕截图 2025-10-14 112623_20251015210520.png";
      
      // 计算游戏区域大小
      const gridWidth = GAME_CONFIG.gridSize.cols * GAME_CONFIG.cellSize.width;
      const gridHeight = GAME_CONFIG.gridSize.rows * GAME_CONFIG.cellSize.height;
      
      // 先绘制一个黑色背景，确保图片加载前不会显示空白
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, gridWidth, gridHeight);
      
      // 创建图像缓存
      const cachedImage = this.createOptimizedBackgroundImage(backgroundImage, gridWidth, gridHeight);
      
      // 图片加载完成事件处理
      const handleImageLoad = () => {
        // 创建一个高质量的临时canvas来处理图片
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // 设置临时canvas的尺寸为游戏区域大小
          tempCanvas.width = gridWidth * 2; // 使用双倍分辨率
          tempCanvas.height = gridHeight * 2;
          
          // 设置高质量渲染
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          
          // 计算图片的最佳显示方式
          // 保持宽高比，确保图片完全显示在游戏区域内
          const imgRatio = backgroundImage.width / backgroundImage.height;
          const gridRatio = gridWidth / gridHeight;
          
          let drawWidth = gridWidth * 2; // 双倍分辨率绘制
          let drawHeight = gridHeight * 2;
          let drawX = 0;
          let drawY = 0;
          
          // 根据比例计算最佳显示尺寸
          if (imgRatio > gridRatio) {
            // 图片更宽，按高度缩放
            drawHeight = gridHeight * 2;
            drawWidth = drawHeight * imgRatio;
            drawX = (gridWidth * 2 - drawWidth) / 2;
          } else {
            // 图片更高，按宽度缩放
            drawWidth = gridWidth * 2;
            drawHeight = drawWidth / imgRatio;
            drawY = (gridHeight * 2 - drawHeight) / 2;
          }
          
          // 绘制高质量的图片
          tempCtx.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
          
          // 应用高级锐化滤镜增强图片细节
          this.applyAdvancedSharpening(tempCtx, drawX, drawY, drawWidth, drawHeight);
          
          // 应用智能对比度增强
          this.enhanceImageContrast(tempCtx, drawX, drawY, drawWidth, drawHeight);
          
          // 将临时canvas的内容绘制到游戏canvas（降采样到原始尺寸以提高清晰度）
          this.ctx.imageSmoothingEnabled = true;
          this.ctx.imageSmoothingQuality = 'high';
          this.ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, gridWidth, gridHeight);
          
          // 绘制优化的网格线
          this.drawOptimizedGridLines();
        }
      };
      
      // 检查图片是否已加载完成
      if (backgroundImage.complete) {
        // 图片已加载完成，直接绘制
        handleImageLoad();
      } else {
        // 图片尚未加载完成，设置加载完成的回调
        backgroundImage.onload = handleImageLoad;
        
        // 处理图片加载失败的情况
        backgroundImage.onerror = () => {
          console.error('Failed to load background image');
          // 绘制一个默认的背景
          this.ctx.fillStyle = '#1a1a1a';
          this.ctx.fillRect(0, 0, gridWidth, gridHeight);
          
          // 绘制错误提示文本
          this.ctx.fillStyle = 'white';
          this.ctx.font = '20px Arial';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText('背景图片加载失败', gridWidth / 2, gridHeight / 2);
          
          // 绘制网格线
          this.drawOptimizedGridLines();
        };
      }
    }
    
    // 创建优化的背景图像缓存
    private createOptimizedBackgroundImage(image: HTMLImageElement, width: number, height: number): HTMLCanvasElement | null {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;
        
        // 设置画布尺寸为原始尺寸的1.5倍，用于高质量缩放
        canvas.width = width * 1.5;
        canvas.height = height * 1.5;
        
        // 设置高质量渲染
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // 绘制图像
        const imgRatio = image.width / image.height;
        const gridRatio = width / height;
        
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let drawX = 0;
        let drawY = 0;
        
        if (imgRatio > gridRatio) {
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgRatio;
          drawX = (canvas.width - drawWidth) / 2;
        } else {
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgRatio;
          drawY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        
        return canvas;
      } catch (error) {
        console.error('Failed to create optimized background image:', error);
        return null;
      }
    }
    
    // 应用高级锐化滤镜，增强图像边缘和细节
    private applyAdvancedSharpening(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
      try {
        // 获取图像数据
        const imageData = ctx.getImageData(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        const data = imageData.data;
        
        // 创建一个临时数组存储处理后的像素数据
        const outputData = new Uint8ClampedArray(data.length);
        
        // 高级锐化卷积核，增强文字和线条清晰度
        const sharpenKernel = [
          -1, -1, -1,
          -1,  9, -1,
          -1, -1, -1
        ];
        
        // 应用卷积核
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            const pixelIndex = (i * width + j) * 4;
            
            // 边界像素不处理
            if (i === 0 || i === height - 1 || j === 0 || j === width - 1) {
              outputData[pixelIndex] = data[pixelIndex];
              outputData[pixelIndex + 1] = data[pixelIndex + 1];
              outputData[pixelIndex + 2] = data[pixelIndex + 2];
              outputData[pixelIndex + 3] = data[pixelIndex + 3];
              continue;
            }
            
            let r = 0, g = 0, b = 0;
            
            // 应用3x3卷积核
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const kernelValue = sharpenKernel[(ky + 1) * 3 + (kx + 1)];
                const neighborIndex = ((i + ky) * width + (j + kx)) * 4;
                
                r += data[neighborIndex] * kernelValue;
                g += data[neighborIndex + 1] * kernelValue;
                b += data[neighborIndex + 2] * kernelValue;
              }
            }
            
            // 确保颜色值在有效范围内
            outputData[pixelIndex] = Math.min(255, Math.max(0, r));
            outputData[pixelIndex + 1] = Math.min(255, Math.max(0, g));
            outputData[pixelIndex + 2] = Math.min(255, Math.max(0, b));
            outputData[pixelIndex + 3] = data[pixelIndex + 3]; // 保持alpha通道不变
          }
        }
        
        // 创建新的ImageData并应用到canvas
        const sharpenedImageData = new ImageData(outputData, width, height);
        ctx.putImageData(sharpenedImageData, Math.round(x), Math.round(y));
        
        // 二次锐化处理，进一步增强细节
        this.applySubtleSharpening(ctx, x, y, width, height);
      } catch (error) {
        console.log('Advanced image sharpening skipped due to browser limitations:', error);
        // 如果浏览器限制导致锐化失败，尝试备选方案
        this.applyFallbackSharpening(ctx, x, y, width, height);
      }
    }
    
    // 应用细微锐化，进一步增强边缘清晰度
    private applySubtleSharpening(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
      try {
        const imageData = ctx.getImageData(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        const data = imageData.data;
        
        const outputData = new Uint8ClampedArray(data.length);
        
        // 细微锐化卷积核
        const subtleSharpenKernel = [
          0,  0, -0.5, 0, 0,
          0, -0.5, 3, -0.5, 0,
          -0.5, 3, 8, 3, -0.5,
          0, -0.5, 3, -0.5, 0,
          0,  0, -0.5, 0, 0
        ];
        
        // 卷积核归一化
        const kernelSum = subtleSharpenKernel.reduce((sum, val) => sum + val, 0);
        
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            const pixelIndex = (i * width + j) * 4;
            
            // 跳过边界像素
            if (i < 2 || i > height - 3 || j < 2 || j > width - 3) {
              outputData[pixelIndex] = data[pixelIndex];
              outputData[pixelIndex + 1] = data[pixelIndex + 1];
              outputData[pixelIndex + 2] = data[pixelIndex + 2];
              outputData[pixelIndex + 3] = data[pixelIndex + 3];
              continue;
            }
            
            let r = 0, g = 0, b = 0;
            
            // 应用5x5卷积核
            for (let ky = -2; ky <= 2; ky++) {
              for (let kx = -2; kx <= 2; kx++) {
                const kernelValue = subtleSharpenKernel[(ky + 2) * 5 + (kx + 2)];
                const neighborIndex = ((i + ky) * width + (j + kx)) * 4;
                
                r += data[neighborIndex] * kernelValue;
                g += data[neighborIndex + 1] * kernelValue;
                b += data[neighborIndex + 2] * kernelValue;
              }
            }
            
            // 归一化结果
            r /= kernelSum;
            g /= kernelSum;
            b /= kernelSum;
            
            // 确保颜色值在有效范围内
            outputData[pixelIndex] = Math.min(255, Math.max(0, r));
            outputData[pixelIndex + 1] = Math.min(255, Math.max(0, g));
            outputData[pixelIndex + 2] = Math.min(255, Math.max(0, b));
            outputData[pixelIndex + 3] = data[pixelIndex + 3];
          }
        }
        
        const sharpenedImageData = new ImageData(outputData, width, height);
        ctx.putImageData(sharpenedImageData, Math.round(x), Math.round(y));
      } catch (error) {
        console.log('Subtle sharpening skipped:', error);
      }
    }
    
    // 备选锐化方法，当高级方法不可用时使用
    private applyFallbackSharpening(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
      try {
        // 使用Canvas的filter属性实现锐化
        ctx.save();
        ctx.filter = 'sharpness(1.5)';
        ctx.drawImage(ctx.canvas, Math.round(x), Math.round(y), Math.round(width), Math.round(height), Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        ctx.restore();
      } catch (error) {
        console.log('Fallback sharpening skipped:', error);
      }
    }
    
    // 增强图像对比度
    private enhanceImageContrast(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
      try {
        const imageData = ctx.getImageData(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        const data = imageData.data;
        
        // 计算图像的平均亮度
        let totalLuminance = 0;
        let pixelCount = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          // 计算亮度 (Y = 0.299*R + 0.587*G + 0.114*B)
          const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          totalLuminance += luminance;
          pixelCount++;
        }
        
        const avgLuminance = totalLuminance / pixelCount;
        
        // 根据平均亮度调整对比度
        let contrastFactor = 1.2; // 基础对比度增强
        if (avgLuminance > 128) {
          // 亮色图像降低对比度增强
          contrastFactor = 1.1;
        } else {
          // 暗色图像增加对比度增强
          contrastFactor = 1.3;
        }
        
        // 应用对比度调整
        const contrastAdjust = (value: number) => {
          // 对比度公式: (value - 128) * contrastFactor + 128
          return Math.min(255, Math.max(0, (value - 128) * contrastFactor + 128));
        };
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = contrastAdjust(data[i]);       // R
          data[i + 1] = contrastAdjust(data[i + 1]); // G
          data[i + 2] = contrastAdjust(data[i + 2]); // B
          // A 通道保持不变
        }
        
        ctx.putImageData(imageData, Math.round(x), Math.round(y));
      } catch (error) {
        console.log('Contrast enhancement skipped:', error);
      }
    }
    
    // 绘制优化的网格线，提升清晰度且不影响背景阅读
    private drawOptimizedGridLines(): void {
      const gridWidth = GAME_CONFIG.gridSize.cols * GAME_CONFIG.cellSize.width;
      const gridHeight = GAME_CONFIG.gridSize.rows * GAME_CONFIG.cellSize.height;
      
      // 保存当前context状态
      this.ctx.save();
      
      // 使用最强的抗锯齿
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      
      // 根据关卡类型选择合适的网格线颜色
      let primaryGridColor = 'rgba(0, 0, 0, 0.6)';
      let secondaryGridColor = 'rgba(255, 255, 255, 0.3)';
      
      if (this.isNightLevel) {
        primaryGridColor = 'rgba(255, 255, 255, 0.2)';
        secondaryGridColor = 'rgba(255, 255, 255, 0.1)';
      } else if (this.isPoolLevel) {
        primaryGridColor = 'rgba(255, 255, 255, 0.4)';
        secondaryGridColor = 'rgba(255, 255, 255, 0.2)';
      } else if (this.isRoofLevel) {
        primaryGridColor = 'rgba(0, 0, 0, 0.4)';
        secondaryGridColor = 'rgba(0, 0, 0, 0.2)';
      }
      
      // 绘制主网格线 - 更深色但更细的线条，减少干扰
      this.ctx.strokeStyle = primaryGridColor;
      this.ctx.lineWidth = 1.5;
      
      // 设置线条端点样式为圆角
      this.ctx.lineCap = 'round';
      
      // 绘制垂直线
      for (let i = 1; i < GAME_CONFIG.gridSize.cols; i++) {
        const x = i * GAME_CONFIG.cellSize.width;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, gridHeight);
        this.ctx.stroke();
      }
      
      // 绘制水平线
      for (let i = 1; i < GAME_CONFIG.gridSize.rows; i++) {
        const y = i * GAME_CONFIG.cellSize.height;
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(gridWidth, y);
        this.ctx.stroke();
      }
      
      // 绘制次网格线 - 使用半透明白色，只在需要时显示
      this.ctx.strokeStyle = secondaryGridColor;
      this.ctx.lineWidth = 0.8;
      
      // 使用虚线样式，进一步减少对背景的干扰
      this.ctx.setLineDash([5, 15]);
      
      // 绘制垂直线
      for (let i = 1; i < GAME_CONFIG.gridSize.cols; i++) {
        const x = i * GAME_CONFIG.cellSize.width;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, gridHeight);
        this.ctx.stroke();
      }
      
      // 绘制水平线
      for (let i = 1; i < GAME_CONFIG.gridSize.rows; i++) {
        const y = i * GAME_CONFIG.cellSize.height;
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(gridWidth, y);
        this.ctx.stroke();
      }
      
      // 重置线条样式
      this.ctx.setLineDash([]);
      
      // 为网格交点添加微妙的高亮效果，提升清晰度
      let intersectionColor = 'rgba(255, 255, 255, 0.5)';
      if (this.isRoofLevel) {
        intersectionColor = 'rgba(0, 0, 0, 0.5)';
      }
      
      this.ctx.fillStyle = intersectionColor;
      for (let i = 1; i < GAME_CONFIG.gridSize.cols; i++) {
        for (let j = 1; j < GAME_CONFIG.gridSize.rows; j++) {
          const x = i * GAME_CONFIG.cellSize.width;
          const y = j * GAME_CONFIG.cellSize.height;
          
          this.ctx.beginPath();
          this.ctx.arc(x, y, 1, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
      
      // 恢复context状态
      this.ctx.restore();
    }
  
   // 不需要这些动态装饰方法了，已经在drawBackground中直接实现了静态版本
   
   // 无尽模式特殊逻辑
   startEndlessMode(): void {
     // 重置波次相关参数，准备无尽模式
     this.currentWave = 0;
     this.totalWaves = 999; // 很大的数字表示无限波次
     
     // 显示无尽模式开始提示
     this.createVisualFeedback('endless_start', this.canvas.width / 2, this.canvas.height / 2, 0, '无尽模式开启！波次将无限进行，难度会逐渐增加！');
     
     // 设置无尽模式的特殊规则
     // 例如：波次间隔缩短、僵尸血量和速度随波次增加等
   }
  
  // 生成随机阳光
  generateSun(): void {
    const randomX = Math.random() * (GAME_CONFIG.gridSize.cols * GAME_CONFIG.cellSize.width - 60) + 30;
    const randomY = -30; // 从屏幕上方生成
    const sun = new Sun(randomX, randomY);
    this.suns.push(sun);
  }
  
  // 处理鼠标点击
  handleClick(x: number, y: number): void {
    if (this.gameStatus !== 'playing') return;
    
    // 检查是否点击了阳光（仍然保留手动收集功能）
    for (const sun of this.suns) {
      if (x >= sun.x && x <= sun.x + sun.width && y >= sun.y && y <= sun.y + sun.height) {
        this.collectSun(sun);
        return;
      }
    }
    
    // 检查是否种植植物
    if (this.selectedPlantType) {
      const gridX = Math.floor(x / GAME_CONFIG.cellSize.width);
      const gridY = Math.floor(y / GAME_CONFIG.cellSize.height);
      
      // 确保在有效网格范围内
      if (gridX >= 0 && gridX < GAME_CONFIG.gridSize.cols && 
          gridY >= 0 && gridY < GAME_CONFIG.gridSize.rows) {
        this.plantAtGrid(gridX, gridY);
      }
    }
  }
}

// 游戏主组件
   // 自动攻击角色类
class AutoAttacker extends GameObject {
  type: AutoAttackerType;
  attackSpeed: number;
  lastAttackTime: number;
  damage: number;
  attackRange: number;
  animationOffset: { x: number; y: number }; // 用于动画效果的偏移量
  attackEffect: { active: boolean; time: number }; // 攻击效果
  
   constructor(type: AutoAttackerType) {
    // 放置在地图左边，中间一行的位置
    const cellSize = GAME_CONFIG.cellSize;
    const x = -cellSize.width * 0.7; // 地图外部左侧
    const y = (GAME_CONFIG.gridSize.rows / 2 - 0.5) * cellSize.height; // 中间行
    
    // 使用豌豆射手的伤害值
    const damage = PLANTS.peashooter.damage || 30;
    
    super(x, y, cellSize.width * 1.4, cellSize.height * 1.6, 9999); // 超大生命值
    
    this.type = type;
    this.attackSpeed = 2000; // 攻击间隔（毫秒）
    this.lastAttackTime = 0;
    this.damage = damage;
    this.attackRange = 9999; // 超大攻击范围，确保覆盖全图
    this.animationOffset = { x: 0, y: 0 };
    this.attackEffect = { active: false, time: 0 };
    
    // 清鸢特有属性 - 如果是清鸢植物
     if (type === 'ultraman_zero') {
        this.神圣护盾 = 0; // 赛罗奥特曼拥有防护盾
        this.last神圣光波Time = 0; // 记录上次释放光波的时间
      }
  }
  
   // 奥特曼特有属性定义
 神圣护盾: number = 0; // 赛罗奥特曼拥有防护盾
  last神圣光波Time: number = 0; // 记录上次释放神圣光波的时间
  
  // 检查是否可以攻击
  canAttack(currentTime: number): boolean {
    return currentTime - this.lastAttackTime >= this.attackSpeed;
  }
  
  // 寻找最近的僵尸作为目标
  findTarget(zombies: Zombie[]): Zombie | null {
    if (zombies.length === 0) return null;
    
    let closestZombie: Zombie | null = null;
    let minDistance = Infinity;
    
    for (const zombie of zombies) {
      const dx = zombie.x + zombie.width / 2 - (this.x + this.width / 2);
      const dy = zombie.y + zombie.height / 2 - (this.y + this.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance && distance <= this.attackRange) {
        minDistance = distance;
        closestZombie = zombie;
      }
    }
    
    return closestZombie;
  }
  
  // 攻击目标
  attack(target: Zombie, bullets: Bullet[]): void {
    const currentTime = Date.now();
    if (!this.canAttack(currentTime)) return;
    
    // 创建追踪子弹
    const bullet = new Bullet(
      this.x + this.width,
      this.y + this.height / 2,
      this.damage,
      false,
      true,
      target
    );
    bullets.push(bullet);
    
    // 记录攻击时间
    this.lastAttackTime = currentTime;
    
    // 触发攻击效果
    this.attackEffect.active = true;
    this.attackEffect.time = currentTime;
    
    // 播放攻击音效
    this.playSound('shoot');
  }
  
  // 播放音效
  playSound(type: string): void {
    // 实际项目中可以使用Web Audio API或Audio元素实现
    console.log(`Play sound: ${type}`);
  }
  
   // 更新自动攻击角色状态
  update(deltaTime: number, zombies: Zombie[], bullets: Bullet[]): void {
    const currentTime = Date.now();
    
    // 检查攻击效果
    if (this.attackEffect.active && currentTime - this.attackEffect.time > 300) {
      this.attackEffect.active = false;
    }
    
    // 添加呼吸动画效果
    const breathingCycle = Math.sin(currentTime / 1000) * 2;
    this.animationOffset = {
      x: this.attackEffect.active ? 5 : 0,
      y: breathingCycle
    };
    
    // 寻找并攻击目标
    const target = this.findTarget(zombies);
    if (target && this.gameStatus === 'playing') {
      this.attack(target, bullets);
    }
  }
  // 渲染自动攻击角色
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // 应用动画偏移
    ctx.translate(this.animationOffset.x, this.animationOffset.y);
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    // 设置3D阴影效果
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
    
    // 绘制赛罗奥特曼
    const drawUltramanZero = () => {
      // 身体
      ctx.fillStyle = '#3498db'; // 蓝色身体
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 35, 55, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 头部
      ctx.fillStyle = '#e74c3c'; // 红色头部
      ctx.beginPath();
      ctx.arc(centerX, centerY - 40, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // 眼睛
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(centerX - 10, centerY - 45, 8, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(centerX + 10, centerY - 45, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 瞳孔
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(centerX - 10, centerY - 45, 3, 0, Math.PI * 2);
      ctx.arc(centerX + 10, centerY - 45, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 彩色计时器
      ctx.fillStyle = '#f39c12'; // 橙色计时器
      ctx.beginPath();
      ctx.arc(centerX, centerY - 20, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // 胸甲
      ctx.fillStyle = '#2ecc71'; // 绿色胸甲
      ctx.beginPath();
      ctx.moveTo(centerX - 25, centerY);
      ctx.lineTo(centerX, centerY - 20);
      ctx.lineTo(centerX + 25, centerY);
      ctx.closePath();
      ctx.fill();
      
      // 腿部
      ctx.fillStyle = '#3498db'; // 蓝色腿部
      ctx.fillRect(centerX - 15, centerY + 25, 10, 30);
      ctx.fillRect(centerX + 5, centerY + 25, 10, 30);
      
      // 手臂
      ctx.fillRect(centerX - 40, centerY - 10, 15, 20);
      ctx.fillRect(centerX + 25, centerY - 10, 15, 20);
      
      // 武器（光束剑）- 只在攻击时显示
      if (this.attackEffect.active) {
        ctx.strokeStyle = '#00ffff'; // 青色光束剑
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        
        // 剑的光芒效果
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        
        // 绘制光束剑
        ctx.beginPath();
        ctx.moveTo(centerX + 40, centerY - 5);
        ctx.lineTo(centerX + 80, centerY - 20);
        ctx.stroke();
        
        // 重置阴影
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 12;
      }
      
      // 名字标签
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(centerX - 35, centerY + 60, 70, 20, 10);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('赛罗奥特曼', centerX, centerY + 70);
    };
    
    // 绘制角色
    drawUltramanZero();
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.restore();
  }
  
   // 从游戏引擎获取游戏状态
   private get gameStatus(): GameStatus {
     // 为AutoAttacker类添加gameStatus属性，避免未定义引用
     return 'playing';
   }
}

  // 导出gameEngineRef供Zombie类使用
export let gameEngineRef: React.MutableRefObject<GameEngine | null>;

export default function Home() {
  const navigate = useNavigate();
  
  // 确保在组件挂载时检查和更新localStorage中的植物和僵尸数据
  useEffect(() => {
    // 检查并更新localStorage中的植物和僵尸数据
    try {
      checkAndUpdateGameData();
    } catch (error) {
      console.error('初始化游戏数据失败:', error);
    }
  }, []);
  
     // 检查并更新游戏数据的函数
  const checkAndUpdateGameData = () => {
    // 保存植物数据到localStorage
    localStorage.setItem('pvzPlants', JSON.stringify(PLANTS));
    
    // 保存僵尸数据到localStorage
    localStorage.setItem('pvzZombies', JSON.stringify(ZOMBIES));
    
    // 保存关卡数据到localStorage
    localStorage.setItem('pvzLevels', JSON.stringify(LEVELS));
    
    // 确保最高关卡已解锁
    const savedLevel = localStorage.getItem('pvzHighestLevel');
    if (!savedLevel || parseInt(savedLevel) < 10) {
      localStorage.setItem('pvzHighestLevel', '10');
      setHighestLevel(10);
    }
  };
   const canvasRef = useRef<HTMLCanvasElement>(null);
   gameEngineRef = useRef<GameEngine | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
   const [showLevelSelect, setShowLevelSelect] = useState<boolean>(true);
   const [highestLevel, setHighestLevel] = useState<number>(1);
   const [sunCount, setSunCount] = useState<number>(GAME_CONFIG.initialSun); // 阳光数量状态
   const [currentTime, setCurrentTime] = useState<string>('');
   const [showZombieSelection, setShowZombieSelection] = useState<boolean>(false);
   
  // 联机游戏相关状态
  const [playerName, setPlayerName] = useState<string>(localStorage.getItem('pvzPlayerName') || '');
  const [gameRooms, setGameRooms] = useState<any[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isOnlineMode, setIsOnlineMode] = useState<boolean>(false);
  const [showOnlineLobby, setShowOnlineLobby] = useState<boolean>(false);
  const [activeSearchTab, setActiveSearchTab] = useState<'rooms' | 'players'>('rooms');
  
  // 植物选择相关状态
  const [showPlantSelection, setShowPlantSelection] = useState<boolean>(false);
  const [selectedPlants, setSelectedPlants] = useState<PlantType[]>([]);
  
  // 初始化游戏引擎
     useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
         try {
           gameEngineRef.current = new GameEngine(canvas);
                 // 开局解锁所有关卡 - 设置最高关卡为10
          const maxLevel = 10;
          setHighestLevel(maxLevel);
          // 同时更新本地存储，确保永久解锁
          localStorage.setItem('pvzHighestLevel', maxLevel.toString());
         } catch (error) {
           console.error('游戏引擎初始化失败:', error);
           toast('游戏加载失败，请刷新页面重试');
         }
         
         // 设置点击事件
         const handleCanvasClick = (e: MouseEvent) => {
         if (gameEngineRef.current && canvas && (gameEngineRef.current.gameStatus === 'playing' || gameStatus === 'ready')) {
          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) * (canvas.width / rect.width);
          const y = (e.clientY - rect.top) * (canvas.height / rect.height);
          
          // 转换为游戏逻辑坐标
          const scale = canvas.width / (GAME_CONFIG.gridSize.cols * GAME_CONFIG.cellSize.width);
          gameEngineRef.current.handleClick(x / scale, y / scale);
        }
      };
      
      canvas.addEventListener('click', handleCanvasClick);
      
      // 清理函数
      return () => {
        canvas.removeEventListener('click', handleCanvasClick);
      };
    }
  }, []);
  
// 监听游戏状态和阳光数量变化
  useEffect(() => {
    const checkGameUpdates = () => {
      if (gameEngineRef.current) {
        // 更新游戏状态
        if (gameStatus !== gameEngineRef.current.gameStatus) {
          setGameStatus(gameEngineRef.current.gameStatus);
        }
        
        // 更新阳光数量
        if (gameEngineRef.current.sun !== sunCount) {
          setSunCount(gameEngineRef.current.sun);
        }
      }
    };
    
    const interval = setInterval(checkGameUpdates, 50); // 提高更新频率，使阳光数量变化更流畅
    return () => clearInterval(interval);
  }, [gameStatus, sunCount]);
  
  // 更新当前时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    
    // 初始化时间
    updateTime();
    
    // 每秒更新时间
    const intervalId = setInterval(updateTime, 1000);
    
    // 清理函数
    return () => clearInterval(intervalId);
  }, []);
  
  // 开始游戏前先显示植物选择界面
  const startGame = useCallback((level: number) => {
    setSelectedLevel(level);
    setShowLevelSelect(false);
    // 添加加载提示，提升用户体验
    toast(`正在加载关卡 ${level}...`);
    // 短暂延迟后显示植物选择界面，避免界面切换过快
    setTimeout(() => {
      setShowPlantSelection(true);
    }, 300);
  }, []);

   // 确认植物选择并开始游戏
   const confirmPlantSelection = useCallback((plants: PlantType[]) => {
     setSelectedPlants(plants);
     setShowPlantSelection(false);
     
     // 检查是否为高强度自定义关卡
     const isHighIntensityCustom = LEVELS[selectedLevel]?.isHighIntensityCustom || false;
     
     if (isHighIntensityCustom) {
       // 如果是自定义关卡，显示僵尸选择界面
       setTimeout(() => {
         setShowZombieSelection(true);
       }, 300);
     } else {
       if (gameEngineRef.current) {
         try {
           // 将选中的植物传递给游戏引擎
                  if (!gameEngineRef.current) {
                    console.error('游戏引擎未初始化');
                    toast('游戏引擎初始化失败，请刷新页面重试');
                    return;
                  }
                  
                  // 确保plants数组类型正确
                    gameEngineRef.current.selectedPlants = plants;

            // 初始化所有选中植物的冷却时间
            plants.forEach(plantType => {
              if (gameEngineRef.current) {
                gameEngineRef.current.plantCooldowns[plantType] = 0;
              }
            });
            
            // 启动游戏并提供视觉反馈
                    toast('游戏开始！准备战斗！');
                    if (gameEngineRef.current) {
                      gameEngineRef.current.startGame(selectedLevel);
                    }
                    setGameStatus('playing');
                    setSunCount(GAME_CONFIG.initialSun); // 重置阳光数量状态
            
            // 强制重新渲染植物选择栏
            setTimeout(() => {
              setSunCount(prev => prev);
            }, 100);
          } catch (error) {
            console.error('游戏启动失败:', error);
            toast('游戏启动失败，请刷新页面重试');
            setShowPlantSelection(true);
          }
       }
     }
   }, [selectedLevel]);
  
  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.pauseGame();
    }
  }, []);
  
  // 重新开始游戏
  const restartGame = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.startGame(selectedLevel);
      setGameStatus('playing');
    }
  }, [selectedLevel]);
  
  // 返回选关界面
  const backToLevelSelect = useCallback(() => {
    setShowLevelSelect(true);
    setGameStatus('ready');
  }, []);
  
   // 选择植物 - 确保徐清岚可以被正确选择
  const selectPlant = useCallback((plantType: PlantType) => {
    if (gameEngineRef.current) {
      try {
        // 确保植物类型有效
        if (Object.keys(PLANTS).includes(plantType)) {
          gameEngineRef.current.selectPlant(plantType);
          toast(`已选择 ${PLANTS[plantType].name}`);
        } else {
          console.error(`尝试选择无效的植物类型: ${plantType}`);
          toast(`无法选择 ${plantType}，植物类型无效`);
        }
      } catch (error) {
        console.error(`选择植物时出错: ${error}`);
        toast(`选择植物时出错，请重试`);
      }
    }
  }, []);
  
    // 辅助函数：渲染植物图片
  const renderPlantImage = (type: PlantType) => {
     // 创建植物图片映射表，避免重复代码
            const plantImageMap: Record<PlantType, string> = {
              sunflower: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20sunflower%20hat%20cute%20big%20eyes%20smiling%20green%20dress%20flower%20princess&sign=85e96d77d1615b56710362f10a7552e9",
              peashooter: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20pea%20shooter%20cute%20green%20outfit%20big%20eyes%20smiling%20plant%20magic&sign=2247bde5b2c08c5f627c97aba69ff5c6",
              wallnut: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20nut%20hat%20strong%20cute%20brown%20outfit%20big%20eyes%20defender&sign=6dfda4def363ee91d906e66313fc4acc",
              snowpea: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20ice%20powers%20blue%20dress%20cute%20big%20eyes%20snowflake%20magic%20smiling&sign=4e2aff77708202f1b219343e317c25e8",
              cherrybomb: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20cherry%20hair%20pink%20dress%20cute%20big%20eyes%20smiling%20explosive%20magic&sign=bbdd925134285adcd4e25a26e64e98c1",
              chomper: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20big%20mouth%20green%20dress%20cute%20big%20eyes%20smiling%20plant%20character&sign=ecfdcea3f2669b474a2f4e37b1b89dc7",
              repeater: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20twin%20peashooters%20green%20dress%20cute%20big%20eyes%20double%20weapon%20smiling&sign=2501ff25b9a28fa4328f2e0964a81592",
              jalapeno: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20fire%20powers%20red%20dress%20cute%20big%20eyes%20flame%20magic%20smiling&sign=5f7da59675c2cde80917e7dd0a153b63",
              tallnut: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20tall%20nut%20hat%20brown%20outfit%20cute%20big%20eyes%20tall%20defender%20smiling&sign=be62d9765f879c86defe93333d1b1902",
              cattail: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20purple%20magic%20dress%20cute%20big%20eyes%20homing%20missile%20smiling%20wizard&sign=21de1a1e335e2f617779d7b5033a7a02",
              cobcannon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20cannon%20weapon%20cute%20big%20eyes%20yellow%20dress%20explosive%20smiling%20artillery&sign=91bedae4ccba0cbc54aaa0f7a241898a",
              wintermelon: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20with%20ice%20melon%20blue%20dress%20cute%20big%20eyes%20aoe%20magic%20smiling%20snow&sign=a78185bcb839fd17aae2393ffe43dd66",
              potatomine: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20potato%20mine%20brown%20outfit%20explosive%20magic%20cute%20big%20eyes%20smiling&sign=b43bb81fc1580121be8e06dc579f0f23",
              squash: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20squash%20orange%20dress%20heavy%20weight%20cute%20big%20eyes%20smiling&sign=dcd988def52a37dfb0bdd812a56d8122",
              blover: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20clover%20green%20dress%20wind%20magic%20cute%20big%20eyes%20smiling&sign=362043b77a00a4084b5f3171e14a14f2",
              garlic: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20garlic%20white%20dress%20scent%20magic%20cute%20big%20eyes%20smiling&sign=cbbcf2f39e2c00bc72a645cf238bc502",
              pumpkin: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20pumpkin%20orange%20dress%20protective%20magic%20cute%20big%20eyes%20smiling&sign=c9533ee4e8ac7dd036e6c1abacb56404",
              magnetshroom: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20magnet%20purple%20dress%20magnetic%20magic%20cute%20big%20eyes%20smiling&sign=04eeaaea9fa99dac1ed1b317232b89d2",
              sunshroom: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20sun%20mushroom%20yellow%20dress%20small%20cute%20big%20eyes%20smiling&sign=3dd601c31200364b6ade009a14bb0ebf",
              fumeshroom: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20fume%20mushroom%20purple%20dress%20poison%20magic%20cute%20big%20eyes%20smiling&sign=d11e7034f7c2073e01b76d75e13eeb3a",
              gravebuster: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20grave%20buster%20brown%20dress%20eater%20cute%20big%20eyes%20smiling&sign=9634f302f445e4bb7f9f493f3fc3d06a",
              coffeebean: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20coffee%20bean%20brown%20dress%20energy%20magic%20cute%20big%20eyes%20smiling&sign=2d6df7eb1f14f53fabeaec27ec2afabd",
              starfruit: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20star%20fruit%20yellow%20dress%20star%20shape%20cute%20big%20eyes%20chibi%20style&sign=39cf8f92030071b49fc50bcaf1e723d1",
              kernelpult: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20corn%20thrower%20yellow%20dress%20corn%20hat%20cute%20big%20eyes%20chibi%20style&sign=37342c2b863a76b80a786cb2932bebf1",
              umbrellaleaf: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20umbrella%20leaf%20green%20dress%20umbrella%20hat%20cute%20big%20eyes%20chibi%20style&sign=299de600ddd01ebbb6e272b4655e3744",
              spikerock: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20spike%20rock%20brown%20dress%20spikes%20cute%20big%20eyes%20chibi%20style&sign=07457bbad26aaff609ad15c522140570",
              threepeater: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20three%20peashooters%20green%20dress%20multiple%20weapons%20cute%20big%20eyes%20chibi%20style&sign=c9e40a3e4aec6a8ecf0bb2ddd5a975c4",
              splitpea: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20split%20pea%20green%20dress%20two%20faces%20cute%20big%20eyes%20chibi%20style&sign=7d5f5ab706f3bb9f423830d4974e310d",
              iceberglettuce: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20ice%20lettuce%20blue%20dress%20ice%20crystals%20cute%20big%20eyes%20chibi%20style&sign=3ec4e890ee893d0bf8f646f9dcc5cdbb",
              goldmagnet: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20magnet%20gold%20yellow%20dress%20cute%20big%20eyes%20smiling%20attractive%20power&sign=f18531886f420329d1f0c68d3d625ecf",
              qingyuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/微信图片_20251016111846_103_92_20251016111910.jpg",
              shancatleader: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/善•猫教主_20251018115946.jpg",
                      xuqinglan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚(魔法少女)_20251019101043.jpg",
                       yijiu: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/屹九_20251020101211.jpg",
                        xuqinglan_god: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚（神）_20251020165934.jpg",
                         xuqinglan_dream: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚“梦”_20251021232653.jpg",
                        mumu: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/沐沐_20251022233255.png"
            };

    return (
      <img 
        src={plantImageMap[type] || "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20girl%20plant%20default%20green%20dress%20cute%20big%20eyes%20smiling&sign=6eb1b4993755f954e03abac0038ae131"} 
        alt={PLANTS[type].name} 
        className="w-full h-full object-contain"
        loading="lazy"
      />
    );
  };

  // 渲染植物选择栏
   const renderPlantSelection = () => {
    if (!gameEngineRef.current || showLevelSelect || showPlantSelection || gameStatus === 'ready') return null;
    
    const { plantCooldowns, selectedPlantType } = gameEngineRef.current;
    
    return (
      <div className="bg-gray-800 rounded-lg p-3 md:p-4 flex flex-wrap justify-center gap-3 w-full max-w-5xl mt-4">
        <div className="text-yellow-300 font-bold text-xl mr-4">
          <i className="fa-solid fa-sun"></i> 阳光: {sunCount}
        </div>
        
        {Object.entries(PLANTS).map(([type, plant]) => {
          const plantType = type as PlantType;
                   // 只显示玩家选择的植物
                   if (selectedPlants.length > 0 && !selectedPlants.includes(plantType)) return null;
                   
                   // 确保plantCooldowns中存在该植物类型，避免undefined比较
                   const isSelected = selectedPlantType === plantType;
                   const isOnCooldown = (plantCooldowns[plantType] || 0) > 0;
                   const canAfford = sunCount >= plant.cost;
          
          // 计算冷却进度
          let cooldownProgress = 0;
          if (isOnCooldown) {
            cooldownProgress = 1 - plantCooldowns[plantType] / plant.cooldown;
          }
          
            return (
             <div 
               key={type}
               className={`relative cursor-pointer rounded-xl p-3 transition-all duration-300 flex flex-col items-center justify-between bg-gray-800/80 border border-gray-700
                 ${isSelected ? 'ring-2 ring-yellow-400 bg-gray-700/80' : ''}
                 ${!canAfford || isOnCooldown ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:brightness-110 hover:shadow-lg hover:border-gray-600'}
                 w-full sm:w-auto`}
               onClick={() => {
                 if (!isOnCooldown && canAfford) {
                   selectPlant(plantType as PlantType);
                 } else {
                   // 即使不能选择植物，也提供视觉反馈
                   if (isOnCooldown) {
                     toast(`${plant.name}正在冷却中，请稍候...`);
                   } else if (!canAfford) {
                     toast(`阳光不足，需要${plant.cost}阳光`);
                   }
                 }
               }}
              >
              {/* 植物图片容器 */}
              <div className="relative w-14 h-14 flex items-center justify-center rounded-lg overflow-hidden bg-gray-900 mb-2">
                {renderPlantImage(plantType)}
                {/* 稀有度标识 */}
                {plant.rarity === '传说' && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse-glow"></div>
                )}
                {plant.rarity === '史诗' && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                )}
              </div>
              
              {/* 植物名称 */}
              <div className="text-center text-white font-medium text-xs sm:text-sm mb-1 min-h-[18px]">{plant.name}</div>
              
              {/* 阳光成本 */}
              <div className="flex items-center text-yellow-300 font-bold text-xs sm:text-sm mb-1">
                <i className="fa-solid fa-sun mr-1 text-[10px]"></i>
                {plant.cost}
              </div>
              
              {/* 特殊效果提示 - 统一优化显示 */}
              {plant.specialEffect && (
                <div className="text-center text-xs sm:text-xs text-blue-300 line-clamp-1 mb-1 max-w-[100px]">
                  {/* 为所有植物优化特殊效果描述 */}
                  {getShortSpecialEffect(plantType, plant.specialEffect)}
                </div>
              )}
             
              {/* 冷却指示器 */}
              {isOnCooldown && (
                <div className="absolute inset-0 bg-black bg-opacity-70 rounded-xl flex flex-col items-center justify-center">
                 <div className="w-10 h-10 rounded-full border-2 border-gray-600 border-t-blue-400 animate-spin mb-1"></div>
                  <div className="text-white font-bold text-sm">
                    {Math.ceil(plantCooldowns[plantType] / 1000)}s
                  </div>
                </div>
              )}
             
              {/* 全图攻击标识 */}
              {plant.attackRange === 99 && (
                <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                   <i className="fa-solid fa-crosshairs mr-0.5 text-[10px]"></i> 全图
                </div>
              )}
              
              {/* 攻击范围指示器 */}
              {(plant.attackRange && plant.attackRange < 99) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full z-10">
                  <i className="fa-solid fa-ruler-combined mr-0.5 text-[10px]"></i> {plant.attackRange}格
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // 渲染连击指示器
  const renderComboIndicator = () => {
    if (showLevelSelect || gameEngineRef.current?.currentCombo < GAME_CONFIG.comboMultiplierThreshold) return null;
    
    const combo = gameEngineRef.current.currentCombo;
    
    return (
      <div className="absolute top-20 left-4 z-10 bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 rounded-lg shadow-lg animate-pulse">
        <div className="flex items-center text-white font-bold">
          <i className="fa-solid fa-bolt mr-2 text-yellow-300"></i>
          连击 x{combo}!
        </div>
      </div>
    );
  };
  
   // 渲染游戏控制按钮
  const renderGameControls = () => {
    if (showLevelSelect || gameStatus === 'ready') return null;
    
    // 保存游戏进度的函数
    const saveGameProgress = () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.saveGameData();
        toast('游戏进度已保存！');
      }
    };
    
      // 使用motion包装返回内容，添加整体入场动画
      return (
       <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="flex flex-wrap justify-center gap-4 mt-4 w-full max-w-3xl"
       >
         {/* 游戏进行中状态的按钮组 */}
         {gameStatus === 'playing' && (
           <div className="flex flex-wrap justify-center gap-4 w-full">
             {/* 主要操作按钮组 */}
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={togglePause}
               className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-yellow-900/30 transition-all duration-300 flex items-center justify-center"
             >
               <i className="fa-solid fa-pause mr-2"></i> 暂停游戏
             </motion.button>
             
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={saveGameProgress}
               className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 flex items-center justify-center"
             >
               <i className="fa-solid fa-floppy-disk mr-2"></i> 保存进度
             </motion.button>
           </div>
         )}
         
         {/* 游戏暂停、结束或胜利状态的按钮组 */}
         {(gameStatus === 'paused' || gameStatus === 'gameover' || gameStatus === 'victory') && (
           <div className="flex flex-wrap justify-center gap-4 w-full">
             {/* 暂停状态的按钮 */}
             {gameStatus === 'paused' && (
               <>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={togglePause}
                   className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-900/30 transition-all duration-300 flex items-center justify-center"
                 >
                   <i className="fa-solid fa-play mr-2"></i> 继续游戏
                 </motion.button>
                 
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={saveGameProgress}
                   className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 flex items-center justify-center"
                 >
                   <i className="fa-solid fa-floppy-disk mr-2"></i> 保存进度
                 </motion.button>
               </>
             )}
             
             {/* 分割线 */}
             {(gameStatus === 'paused' && selectedLevel > 0) && (
               <div className="w-full h-px bg-gray-700 my-2"></div>
             )}
             
             {/* 通用操作按钮组 */}
             <div className="flex flex-wrap justify-center gap-4 w-full">
               {/* 重新开始按钮 - 根据状态使用不同颜色 */}
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={restartGame}
                 className={`font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center ${
                   gameStatus === 'gameover' 
                     ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-900/30' 
                     : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-900/30'
                 }`}
               >
                 <i className="fa-solid fa-rotate mr-2"></i> 
                 {gameStatus === 'gameover' ? '重新挑战' : '重新开始'}
               </motion.button>
               
               {/* 返回选关按钮 */}
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={backToLevelSelect}
                 className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-gray-900/30 transition-all duration-300 flex items-center justify-center"
               >
                 <i className="fa-solid fa-door-open mr-2"></i> 返回选关
               </motion.button>
             </div>
           </div>
         )}
       </motion.div>
     );
  };
  
  // 渲染关卡选择界面
  const renderLevelSelect = () => {
    if (!showLevelSelect) return null;
    
     return (
      <div className="absolute inset-0 bg-black bg-opacity-80 z-10 overflow-hidden">
        {/* 可滑动的内容容器 - 添加背景和透明特效 */}
        <div 
          className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent scroll-smooth p-6"
          style={{
            backgroundImage: `url(https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/双生蓝紫少女_20251026111203.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
           {/* 半透明覆盖层 - 降低透明度以增强背景显示 */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 backdrop-blur-sm"></div>
           <div className="min-h-full flex flex-col items-center justify-center relative z-10">
            {/* 标题区域 */}
            <div className="mb-12 text-center">
                     <h2 className="text-4xl md:text-5xl font-bold text-green-500 mb-3 drop-shadow-md">选择关卡</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
            </div>
            
                 {/* 关卡按钮区域 */}
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10 w-full max-w-2xl">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                     <button
                       key={level}
                  onClick={() => startGame(level)}
                  disabled={level > highestLevel}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 ease-out
                    ${level <= highestLevel 
                      ? 'bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95' 
                      : 'bg-gray-500 opacity-50 cursor-not-allowed'
                    }`}
                >
                    {/* 背景装饰效果 - 进一步弱化以突出大背景 */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-30">
                     {/* 使用渐变色背景的圆形 */}
                     <div className="absolute w-[30px] h-[30px] rounded-full bg-gradient-to-br from-green-500/05 to-green-700/02 animate-pulse"></div>
                     {/* 主图标 */}
                     <i className="fa-solid fa-map-location-dot text-[18px] text-green-400/08 animate-pulse relative z-10"></i>
                     {/* 图标光芒效果 */}
                     <div className="absolute w-[24px] h-[24px] rounded-full bg-green-400/05 blur-xl animate-pulse"></div>
                   </div>
                  <i className="fa-solid fa-map-location-dot text-3xl md:text-4xl text-white mb-2 relative z-10"></i>
                  <span className="text-lg md:text-xl font-bold text-white relative z-10">关卡 {level}</span>
                  <span className="text-xs md:text-sm text-green-200 mt-1 relative z-10">
                    {level === 1 ? '简单' : level === 2 ? '中等' : level <= 4 ? '困难' : '专家'}
                  </span>
                  
                  {/* 等级特殊标识 */}
                  {level === 4 && level <= highestLevel && (
                    <div className="absolute -bottom-2 -left-2 bg-blue-900 text-blue-100 font-bold text-xs px-2 py-1 rounded-full">
                      <i className="fa-solid fa-moon mr-1"></i> 夜晚
                    </div>
                  )}
                  {level === 5 && level <= highestLevel && (
                    <div className="absolute -bottom-2 -left-2 bg-blue-700 text-blue-100 font-bold text-xs px-2 py-1 rounded-full">
                      <i className="fa-solid fa-water mr-1"></i> 泳池
                    </div>
                  )}
                  {level === 6 && level <= highestLevel && (
                    <div className="absolute -bottom-2 -left-2 bg-brown-700 text-yellow-100 font-bold text-xs px-2 py-1 rounded-full">
                      <i className="fa-solid fa-house-chimney mr-1"></i> 屋顶
                    </div>
                  )}
                   {level === 7 && level <= highestLevel && (
                     <div className="absolute -bottom-2 -left-2 bg-gray-700 text-gray-100 font-bold text-xs px-2 py-1 rounded-full">
                       <i className="fa-solid fa-fog mr-1"></i> 浓雾
                     </div>
                   )}
                 {level === 8 && level <= highestLevel && (
                    <div className="absolute -bottom-2 -left-2 bg-red-700 text-red-100 font-bold text-xs px-2 py-1 rounded-full">
                      <i className="fa-solid fa-crown mr-1"></i> BOSS
                    </div>
                  )}
                  
                   {level === 9 && level <= highestLevel && (
                     <div className="absolute -bottom-2 -left-2 bg-purple-700 text-purple-100 font-bold text-xs px-2 py-1 rounded-full">
                       <i className="fa-solid fa-infinity mr-1"></i> 无尽
                     </div>
                   )}
                   
                   {level === 10 && level <= highestLevel && (
                     <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-xs px-2 py-1 rounded-full">
                       <i className="fa-solid fa-sliders mr-1"></i> 高强度自定义
                     </div>
                   )}
                  
                  {/* 等级锁指示器 */}
                  {level <= highestLevel && level > 1 && level !== 4 && level !== 5 && level !== 6 && level !== 7 && level !== 8 && level !== 9 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black font-bold text-xs px-2 py-1 rounded-full">
                      <i className="fa-solid fa-lock-open"></i>
                    </div>
                  )}
                  
                  {level > highestLevel && (
                    <div className="absolute -top-2 -right-2 bg-gray-500 text-white font-bold text-xs px-2 py-1 rounded-full">
                      <i className="fa-solid fa-lock"></i>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
             {/* 底部信息和按钮区域 */}
               <div className="flex flex-col items-center w-full max-w-md bg-black/10 backdrop-blur-md rounded-2xl p-4 border border-purple-500/05">
               {/* 最高通关信息和剧情图标 */}
              <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm px-6 py-3 rounded-full mb-6 flex items-center justify-between w-full">
                <div className="flex items-center">
                  <i className="fa-solid fa-trophy text-yellow-400 mr-2"></i>
                  <span className="text-yellow-300 font-medium">最高通关: 关卡 {highestLevel}</span>
                </div>
                <StoryIcon />
              </div>
              
                {/* 功能按钮区域 */}
                <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
                 {/* 图鉴按钮 */}
                 <Link 
                   to="/guidebook" 
                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-blue-500/30 active:scale-98"
                 >
                   <i className="fa-solid fa-book mr-2"></i> 图鉴
                 </Link>
                 
                   {/* 剧情分支按钮 */}
                   <button 
                     onClick={() => {
                       setShowLevelSelect(false);
                       // 导航到剧情分支页面
                       navigate('/story-branch');
                     }}
                     className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-purple-500/30 active:scale-98"
                   >
                     <i className="fa-solid fa-book-open mr-2"></i> 剧情分支
                   </button>
               </div>
               
                  {/* 人物关系按钮 */}
                  <Link
                    to="/character-relationships"
                    className="mt-4 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-purple-500/30 active:scale-98 w-full"
                  >
                    <i className="fa-solid fa-users-between-lines mr-2"></i> 人物关系
                  </Link>
                 
                 {/* 成就按钮 */}
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => {
                     setShowLevelSelect(false);
                     setGameStatus('ready');
                   }}
                   className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-yellow-500/30 active:scale-98 w-full"
                 >
                   <i className="fa-solid fa-trophy mr-2"></i> 成就
                 </motion.button>
            </div>
            
            {/* 添加额外的底部空间，确保内容可以完全滚动 */}
            <div className="h-16"></div>
          </div>
        </div>
        
              {/* 滑动指示器 - 在小屏幕上显示 */}
              <div className="hidden md:hidden absolute bottom-4 left-0 right-0 flex justify-center items-center">
                <div className="flex items-center space-x-2 opacity-100 transition-opacity duration-500 delay-1000">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
      </div>
    );
  };
  
   // 渲染游戏状态信息
  const renderGameStatusInfo = () => {
    if (showLevelSelect || gameStatus === 'ready') return null;
    
    const { currentWave, totalWaves } = gameEngineRef.current || { currentWave: 0, totalWaves: 0 };
    
     return (
      <div className="bg-black bg-opacity-70 text-white px-6 py-2 rounded-full flex items-center shadow-lg">
        <span className="mr-4"><i className="fa-regular fa-clock mr-1"></i>{currentTime}</span>
        <span className="mr-4">关卡 {selectedLevel}</span>
        <span className="mr-4">波次 {currentWave}/{totalWaves}</span>
        <span>{gameStatus === 'playing' ? '游戏进行中' : 
               gameStatus === 'paused' ? '游戏暂停' :
               gameStatus === 'gameover' ? '游戏结束' : '游戏胜利'}</span>
      </div>
    );
  };
  
   // 渲染游戏结束/胜利画面
  const renderGameEndScreen = () => {
    if (showLevelSelect || gameStatus === 'ready' || (gameStatus !== 'gameover' && gameStatus !== 'victory')) return null;
    
    return (
      <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-10">
      {gameStatus === 'victory' ? (
          <>
            <div className="text-6xl font-bold text-yellow-400 mb-4">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <h2 className="text-4xl font-bold text-green-500 mb-4">胜利!</h2>
              <>
                <p className="text-xl text-white mb-8">恭喜您成功通关关卡 {selectedLevel}!</p>
                
                {selectedLevel < 3 && (
                   <button 
                     onClick={() => startGame(selectedLevel + 1)}
                     className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 mb-4"
                   >
                     挑战下一关
                   </button>
                 )}
                 
                  {selectedLevel === 8 && (
                   <div className="mt-4 text-center">
                     <div className="text-yellow-400 text-3xl mb-2">🏆</div>
                     <p className="text-white font-bold">恭喜您成为终极守护者！</p>
                   </div>
                 )}
              </>
          </>
        ) : (
          <>
            <div className="text-6xl font-bold text-red-400 mb-4">
              <i className="fa-solid fa-skull"></i>
            </div>
            <h2 className="text-4xl font-bold text-red-500 mb-4">游戏结束</h2>
            <p className="text-xl text-white mb-8">僵尸入侵了您的家园!</p>
          </>
        )}
      </div>
    );
  };
  
   // 渲染成就展示区
  const renderAchievements = () => {
     if (showLevelSelect || gameStatus === 'playing' || gameStatus === 'ready') return null;
     
     const achievements = gameEngineRef.current?.achievements || {};
     const totalZombiesKilled = gameEngineRef.current?.totalZombiesKilled || 0;
     const totalSunsCollected = gameEngineRef.current?.totalSunsCollected || 0;
     const plantsUsedCount = gameEngineRef.current?.plantsUsed.size || 0;
     const totalPlantsCount = Object.keys(PLANTS).length;
     
     return (
       <div className="absolute top-20 right-4 z-10 bg-black bg-opacity-80 backdrop-blur-sm p-4 rounded-xl border border-gray-700 shadow-xl max-w-[280px]">
         <div className="text-yellow-400 font-bold text-lg mb-3 flex items-center">
           <i className="fa-solid fa-trophy mr-2"></i>
           成就
         </div>
         <div className="space-y-3">
           {/* 首次胜利 */}
           <div className="p-2 rounded-lg bg-gray-800/70">
             <div className="flex items-center justify-between mb-1">
               <span className="font-medium text-white">首次胜利</span>
               <i className={`fa-solid ${achievements.first_win ? 'fa-check-circle text-green-500' : 'fa-lock text-gray-500'}`}></i>
             </div>
             <div className="text-xs text-gray-400">成功完成首次挑战</div>
          </div>
          
          {/* 阳光大师 */}
          <div className="p-2 rounded-lg bg-gray-800/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">阳光大师</span>
              <i className={`fa-solid ${achievements.sun_master ? 'fa-check-circle text-green-500' : 'fa-lock text-gray-500'}`}></i>
            </div>
            <div className="text-xs text-gray-400 mb-1">累计收集1000个阳光</div>
            {!achievements.sun_master && (
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-yellow-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(totalSunsCollected / 1000 * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
          
          {/* 僵尸杀手 */}
          <div className="p-2 rounded-lg bg-gray-800/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">僵尸杀手</span>
              <i className={`fa-solid ${achievements.zombie_killer ? 'fa-check-circle text-green-500' : 'fa-lock text-gray-500'}`}></i>
            </div>
            <div className="text-xs text-gray-400 mb-1">累计消灭100个僵尸</div>
            {!achievements.zombie_killer && (
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-red-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(totalZombiesKilled / 100 * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
          
          {/* 完美防御 */}
          <div className="p-2 rounded-lg bg-gray-800/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">完美防御</span>
              <i className={`fa-solid ${achievements.perfect_defense ? 'fa-check-circle text-green-500' : 'fa-lock text-gray-500'}`}></i>
            </div>
            <div className="text-xs text-gray-400">在没有损失任何植物的情况下通关</div>
          </div>
          
          {/* 植物大师 */}
          <div className="p-2 rounded-lg bg-gray-800/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">植物大师</span>
              <i className={`fa-solid ${achievements.all_plants ? 'fa-check-circle text-green-500' : 'fa-lock text-gray-500'}`}></i>
            </div>
            <div className="text-xs text-gray-400 mb-1">使用过游戏中的所有植物类型</div>
            {!achievements.all_plants && (
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(plantsUsedCount / totalPlantsCount * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
          
          {/* 生存专家 */}
          <div className="p-2 rounded-lg bg-gray-800/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">生存专家</span>
              <i className={`fa-solid ${achievements.survival_expert ? 'fa-check-circle text-green-500' : 'fa-lock text-gray-500'}`}></i>
            </div>
            <div className="text-xs text-gray-400">成功通关所有关卡</div>
          </div>
        </div>
        
        {/* 成就统计 */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">已解锁成就</span>
            <span className="text-yellow-400 font-medium">
              {Object.values(achievements).filter(a => a).length} / {Object.keys(achievements).length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full" 
              style={{ width: `${Object.values(achievements).filter(a => a).length / Object.keys(achievements).length * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };
  
   // 加载游戏房间列表
  const loadGameRooms = useCallback(() => {
    try {
      const savedRooms = localStorage.getItem('pvzOnlineRooms');
      if (savedRooms) {
        try {
          const rooms = JSON.parse(savedRooms);
          if (Array.isArray(rooms)) {
            // 过滤掉超过10分钟的房间
            const currentTime = Date.now();
            const validRooms = rooms.filter((room: any) => 
              room && typeof room.createdAt === 'number' &&
              currentTime - room.createdAt < 10 * 60 * 1000
            );
            setGameRooms(validRooms);
            // 保存过滤后的房间列表
            localStorage.setItem('pvzOnlineRooms', JSON.stringify(validRooms));
          } else {
            console.error('Invalid rooms data format, expected array');
            setGameRooms([]);
            localStorage.setItem('pvzOnlineRooms', JSON.stringify([]));
          }
        } catch (e) {
          console.error('Failed to parse game rooms:', e);
          setGameRooms([]);
          localStorage.setItem('pvzOnlineRooms', JSON.stringify([]));
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage for rooms:', e);
    }
  }, []);

  // 更新玩家状态
  const updatePlayerStatus = useCallback((status: 'online' | 'ingame' | 'away') => {
    const savedPlayers = localStorage.getItem('pvzOnlinePlayers');
    const currentTime = Date.now();
    let players: Array<{name: string, status: 'online' | 'ingame' | 'away', lastActive: number, wins?: number, level?: number}> = [];
    
    if (savedPlayers) {
      try {
        players = JSON.parse(savedPlayers);
        // 移除当前玩家的旧记录
        players = players.filter(player => player.name !== playerName);
      } catch (e) {
        console.error('Failed to parse online players:', e);
      }
    }
    
    // 获取当前玩家的数据
    const playerData = JSON.parse(localStorage.getItem('pvzPlayerData') || '{}');
    
    // 添加当前玩家的新记录
    players.push({
      name: playerName,
      status,
      lastActive: currentTime,
      wins: playerData.wins || 0,
      level: playerData.level || 1
    });
    
    // 保存更新后的玩家列表
    localStorage.setItem('pvzOnlinePlayers', JSON.stringify(players));
  }, [playerName]);
  
  // 加载在线玩家列表
  const loadOnlinePlayers = useCallback(() => {
    try {
      // 更新当前玩家的在线状态
      updatePlayerStatus('online');
      
      const savedPlayers = localStorage.getItem('pvzOnlinePlayers');
      const currentTime = Date.now();
      
      if (savedPlayers) {
        try {
          const players = JSON.parse(savedPlayers);
          if (Array.isArray(players)) {
            // 过滤掉超过5分钟未活跃的玩家
            const validPlayers = players.filter((player: any) => 
              player && player.name && player.lastActive &&
              player.name !== playerName && // 排除当前玩家
              currentTime - player.lastActive < 5 * 60 * 1000
            );
            setOnlinePlayers(validPlayers);
          } else {
            console.error('Invalid players data format, expected array');
            setOnlinePlayers([]);
          }
        } catch (e) {
          console.error('Failed to parse online players:', e);
          setOnlinePlayers([]);
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage for players:', e);
    }
  }, [playerName, updatePlayerStatus]);

  // 创建游戏房间
  const createGameRoom = useCallback(() => {
    if (!playerName.trim()) {
      toast('请输入您的游戏昵称！');
      return;
    }
    
    // 更新状态为游戏中
    updatePlayerStatus('ingame');
    
    // 生成房间ID
    const roomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newRoom = {
      id: roomId,
      host: playerName,
      players: [playerName],
      status: 'waiting' as const,
      createdAt: Date.now()
    };
    
    // 保存到localStorage
    const rooms = [...gameRooms, newRoom];
    localStorage.setItem('pvzOnlineRooms', JSON.stringify(rooms));
    setGameRooms(rooms);
    setCurrentRoom(roomId);
    
    // 开始联机游戏
    startOnlineGame(roomId);
  }, [playerName, gameRooms, updatePlayerStatus]);

  // 加入游戏房间
  const joinGameRoom = useCallback((roomId: string) => {
    if (!playerName.trim()) {
      toast('请输入您的游戏昵称！');
      return;
    }
    
    // 更新状态为游戏中
    updatePlayerStatus('ingame');
    
    const updatedRooms = gameRooms.map(room => {
      if (room.id === roomId && room.players.length < 4) {
        return {
          ...room,
          players: [...room.players, playerName]
        };
      }
      return room;
    });
    
    localStorage.setItem('pvzOnlineRooms', JSON.stringify(updatedRooms));
    setGameRooms(updatedRooms);
    setCurrentRoom(roomId);
    
    // 开始联机游戏
    startOnlineGame(roomId);
  }, [playerName, gameRooms, updatePlayerStatus]);

   // 取消游戏房间
   const cancelGameRoom = useCallback((roomId: string) => {
    if (!window.confirm('确定要取消这个房间吗？')) {
      return;
    }
    
    const updatedRooms = gameRooms.filter(room => room.id !== roomId);
    localStorage.setItem('pvzOnlineRooms', JSON.stringify(updatedRooms));
    setGameRooms(updatedRooms);
    
    // 如果当前在这个房间中，也退出房间
    if (currentRoom === roomId) {
      setCurrentRoom(null);
      setIsOnlineMode(false);
      // 更新状态为在线
      if (playerName.trim()) {
        updatePlayerStatus('online');
      }
    }
    
    toast(`房间 ${roomId} 已取消`);
  }, [gameRooms, currentRoom, playerName, updatePlayerStatus]);

  // 开始联机游戏
  const startOnlineGame = useCallback((roomId: string) => {
    setIsOnlineMode(true);
    setShowOnlineLobby(false);
    setShowLevelSelect(false);
    
    // 在实际应用中，这里会连接到游戏服务器
    // 这里我们模拟开始游戏
    if (gameEngineRef.current) {
      gameEngineRef.current.startGame(1); // 联机模式使用固定关卡
      setGameStatus('playing');
      setSunCount(GAME_CONFIG.initialSun);
      
      // 模拟游戏状态同步
      const syncInterval = setInterval(() => {
        // 这里会与其他玩家同步游戏状态
        console.log('同步游戏状态到房间', roomId);
      }, 2000);
      
      // 清理函数
      return () => clearInterval(syncInterval);
    }
  }, []);
  
  // 邀请玩家加入游戏
  const invitePlayer = useCallback((playerName: string) => {
    if (!currentRoom) {
      toast('请先创建一个游戏房间！');
      return;
    }
    
    // 在实际应用中，这里会发送邀请通知给目标玩家
    // 这里我们模拟邀请功能
    toast(`${playerName} 收到了您的游戏邀请！`);
    
     // 可以存储邀请记录以便对方接受
    const invites = JSON.parse(localStorage.getItem('pvzPlayerInvites') || '[]');
    invites.push({
      from: playerName,
      to: playerName,
      roomId: currentRoom,
      sentAt: Date.now()
    });
    localStorage.setItem('pvzPlayerInvites', JSON.stringify(invites));
  }, [currentRoom]);
  
  // 查看玩家信息
  const viewPlayerProfile = useCallback((player: any) => {
    toast(`玩家信息: ${player.name}, 等级: ${player.level || 1}, 胜利场数: ${player.wins || 0}`);
  }, []);

    // 搜索状态
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // 渲染联机大厅界面
    const renderOnlineLobby = useCallback(() => {
    // 过滤房间列表
    const filteredRooms = gameRooms.filter(room => {
      if (!searchTerm.trim()) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return room.id.toLowerCase().includes(searchLower) || 
             room.host.toLowerCase().includes(searchLower);
    });
    
    // 过滤玩家列表
    const filteredPlayers = onlinePlayers.filter(player => {
      if (!searchTerm.trim()) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return player.name.toLowerCase().includes(searchLower);
    });
    
    return (
      <div className="absolute inset-0 bg-black bg-opacity-80 z-20 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent scroll-smooth p-6">
          <div className="min-h-full flex flex-col items-center justify-start pt-10">
            {/* 标题区域 */}
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-bold text-purple-500 mb-3 drop-shadow-lg">联机游戏大厅</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            {/* 玩家昵称输入 */}
            <div className="w-full max-w-md mb-6">
               <label className="block text-white text-sm font-medium mb-2">游戏昵称</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fa-solid fa-user text-gray-400"></i>
                </span>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setPlayerName(newName);
                    // 保存昵称到本地存储
                    localStorage.setItem('pvzPlayerName', newName);
                    
                    // 如果玩家已在联机大厅中，实时更新在线状态
                    if (showOnlineLobby && newName.trim()) {
                      updatePlayerStatus('online');
                    }
                  }}
                  placeholder="请输入您的游戏昵称"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  maxLength={12}
                />
                {playerName && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-400">
                    <i className="fa-solid fa-check-circle"></i>
                  </span>
                )}
              </div>
            </div>
            
            {/* 搜索房间输入 */}
            <div className="w-full max-w-md mb-8">
              <label className="block text-white text-sm font-medium mb-2">搜索房间</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fa-solid fa-search text-gray-400"></i>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="输入房间ID或房主名称搜索"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <i className="fa-solid fa-times-circle"></i>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="text-xs text-gray-400 mt-1">
                  搜索结果: {filteredRooms.length} 个房间
                </div>
              )}
            </div>
            
            {/* 创建房间按钮 */}
            <button
              onClick={createGameRoom}
              className="w-full max-w-md bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 mb-8 flex items-center justify-center text-lg shadow-lg hover:shadow-purple-500/30 active:scale-98"
            >
              <i className="fa-solid fa-plus-circle mr-2"></i> 创建游戏房间
            </button>
            
            {/* 搜索标签切换 */}
            <div className="w-full max-w-md mb-6 bg-gray-800 rounded-xl p-1">
              <div className="flex">
                <button
                  onClick={() => setActiveSearchTab('rooms')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSearchTab === 'rooms' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-door-open mr-2"></i> 游戏房间
                </button>
                <button
                  onClick={() => setActiveSearchTab('players')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSearchTab === 'players' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-users mr-2"></i> 在线玩家
                </button>
              </div>
            </div>
            
            {/* 房间或玩家列表 */}
            <div className="w-full max-w-2xl">
              {activeSearchTab === 'rooms' ? (
                <>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                       <i className="fa-solid fa-door-open mr-2 text-purple-400"></i>
                    {searchTerm ? `搜索结果` : `可加入的游戏房间 (${filteredRooms.length})`}
                  </h3>
                  
                  {/* 快速筛选 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      onClick={() => setSearchTerm('')}
                      className={`px-3 py-1 rounded-full text-sm ${!searchTerm ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    >
                      全部
                    </button>
                    <button 
                      onClick={() => {
                        setActiveSearchTab('rooms');
                        const waitingRooms = gameRooms.filter(room => room.status === 'waiting');
                        if (waitingRooms.length > 0) {
                          setSearchTerm(waitingRooms[0].host);
                        } else {
                          toast('当前没有等待中的房间，请创建一个新房间');
                        }
                      }}
                      className="px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                    >
                      <i className="fa-solid fa-clock mr-1"></i> 快速加入
                    </button>
                  </div>
                  
                  {filteredRooms.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <div className="text-4xl mb-3">🔍</div>
                      <p>{searchTerm ? '未找到匹配的房间' : '暂无可用的游戏房间，请创建一个新房间'}</p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="mt-4 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          清除搜索条件
                        </button>
                      )}
                      {!searchTerm && (
                        <button
                          onClick={createGameRoom}
                          className="mt-4 text-green-400 hover:text-green-300 transition-colors duration-200"
                        >
                          <i className="fa-solid fa-plus-circle mr-1"></i> 立即创建房间
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredRooms.map(room => (
                        <div 
                          key={room.id}
                          className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-all duration-200"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="text-lg font-bold text-white">房间 {room.id}</h4>
                              <p className="text-sm text-gray-400">房主: {room.host}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              room.status === 'waiting' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {room.status === 'waiting' ? '等待中' : '游戏中'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex -space-x-2">
                              {room.players.map((player, index) => (
                                <div 
                                  key={index}
                                  className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-xs border-2 border-gray-800"
                                  title={player}
                                >
                                  {player.charAt(0).toUpperCase()}
                                </div>
                              ))}
                              {room.players.length < 4 && (
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs border-2 border-gray-800 text-gray-400">
                                  +{4 - room.players.length}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              {/* 取消房间按钮 - 只有房主可见 */}
                              {room.host === playerName && (
                                <button
                                  onClick={() => cancelGameRoom(room.id)}
                                  className="px-3 py-2 rounded-lg transition-all duration-200 bg-red-600 hover:bg-red-700 text-white text-sm"
                                >
                                  <i className="fa-solid fa-times mr-1"></i> 取消房间
                                </button>
                              )}
                              
                              <button
                                onClick={() => joinGameRoom(room.id)}
                                disabled={room.status === 'playing' || room.players.length >= 4}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                  room.status === 'playing' || room.players.length >= 4
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                              >
                                加入房间
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                       <i className="fa-solid fa-users mr-2 text-blue-400"></i>
                    {searchTerm ? '搜索结果' : `在线玩家 (${filteredPlayers.length})`}
                  </h3>
                  
                  {filteredPlayers.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <div className="text-4xl mb-3">👥</div>
                      <p>{searchTerm ? '未找到匹配的在线玩家' : '当前没有其他在线玩家'}</p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="mt-4 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          清除搜索条件
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPlayers.map((player, index) => (
                        <div 
                          key={index}
                          className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-all duration-200"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                player.status === 'online' ? 'bg-green-900 text-green-400' : 
                                player.status === 'ingame' ? 'bg-yellow-900 text-yellow-400' : 'bg-gray-700 text-gray-400'
                              }`}>
                                <i className="fa-solid fa-user"></i>
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-white">{player.name}</h4>
                                <p className="text-sm text-gray-400">
                                  等级: {player.level || 1} | 胜利: {player.wins || 0}场
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              player.status === 'online' ? 'bg-green-900/50 text-green-400' : 
                              player.status === 'ingame' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-gray-700 text-gray-400'
                            }`}>
                               {player.status === 'online' ? '在线' : 
                              player.status === 'ingame' ? (
                                gameEngineRef.current && gameEngineRef.current.currentLevel === 9 && LEVELS[gameEngineRef.current.currentLevel] && LEVELS[gameEngineRef.current.currentLevel].isEndless 
                                  ? '无尽模式' 
                                   : '游戏中'
                               ) : '离开'}
                            </span>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => viewPlayerProfile(player)}
                              className="px-3 py-2 rounded-lg transition-all duration-200 bg-gray-700 hover:bg-gray-600 text-white text-sm"
                            >
                              <i className="fa-solid fa-circle-info mr-1"></i> 查看信息
                            </button>
                            
                            {player.status === 'online' && (
                              <button
                                onClick={() => invitePlayer(player.name)}
                                className="px-3 py-2 rounded-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                              >
                                <i className="fa-solid fa-envelope mr-1"></i> 发送邀请
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* 刷新按钮 */}
            <button
              onClick={() => {
                loadGameRooms();
                loadOnlinePlayers();
              }}
              className="mt-6 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center"
            >
              <i className="fa-solid fa-arrows-rotate mr-2"></i> 刷新列表
            </button>
            
            {/* 返回按钮 */}
            <button
              onClick={() => setShowOnlineLobby(false)}
              className="mt-8 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <i className="fa-solid fa-arrow-left mr-1"></i> 返回
            </button>
            
            {/* 添加额外的底部空间 */}
            <div className="h-16"></div>
          </div>
        </div>
      </div>
    );
   }, [playerName, gameRooms, createGameRoom, joinGameRoom, loadGameRooms, cancelGameRoom, searchTerm]);

   // 监听游戏房间和在线玩家变化
  useEffect(() => {
    // 当玩家进入联机大厅时，更新其在线状态
    if (showOnlineLobby && playerName.trim()) {
      updatePlayerStatus('online');
    }
    
    loadGameRooms();
    loadOnlinePlayers();
    
    // 定期刷新房间列表和在线玩家
    const intervalId = setInterval(() => {
      loadGameRooms();
      loadOnlinePlayers();
      
      // 定期更新当前玩家状态，保持在线
      if (showOnlineLobby && playerName.trim()) {
        updatePlayerStatus('online');
      }
    }, 5000);
    
    // 清理函数
    return () => {
      clearInterval(intervalId);
      
      // 当玩家离开联机大厅时，更新其状态为离开
      if (playerName.trim()) {
        updatePlayerStatus('away');
      }
    };
  }, [loadGameRooms, loadOnlinePlayers, showOnlineLobby, playerName, updatePlayerStatus]);
   return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-gray-900 to-red-900 text-white flex flex-col items-center justify-start p-4 pt-8">
        {/* 剧情图标 - 固定在右下角，添加新的动态效果 */}
        <motion.div 
          className="fixed bottom-6 right-6 z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <StoryIcon />
        </motion.div>
       {/* 游戏标题区域 */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-400 mb-6 md:mb-8 text-center drop-shadow-md max-w-4xl w-full opacity-90">
 光明与暗影之战
</h1>
       
      {/* 游戏主体区域 */}
      <div className="relative w-full max-w-5xl flex flex-col items-center mb-8 flex-grow">
          {/* 游戏状态信息 - 移到地图上方 */}
          <div className="mb-3 z-10 w-full opacity-85">
           {renderGameStatusInfo()}
         </div>
         
       {/* 游戏区域背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black/50 to-red-900/20 pointer-events-none rounded-xl"></div>
              
             {/* 背景动态光效 */}
             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
             <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-2000"></div>
             
             {/* 优化Canvas显示 */}
             <canvas 
               ref={canvasRef}
               className="w-full h-auto rounded-xl shadow-[0_0_30px_rgba(34,139,34,0.25)] border-2 border-green-800/50 bg-black relative overflow-hidden"
               style={{ 
                 minHeight: '400px', 
                 maxHeight: '600px',
                 backgroundImage: 'linear-gradient(to right bottom, rgba(34, 139, 34, 0.05), rgba(139, 0, 0, 0.05))'
               }}
             />
             
             {/* Canvas加载状态指示器 */}
             {gameStatus === 'ready' && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30 backdrop-blur-sm z-10">
                 <motion.div 
                   animate={{ 
                     scale: [1, 1.2, 1],
                     rotate: [0, 360]
                   }}
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   className="text-green-400 text-6xl"
                 >
                   <i className="fa-solid fa-seedling"></i>
                 </motion.div>
               </div>
             )}
             
             {/* Canvas底部渐变装饰 */}
             <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
             
             {/* Canvas顶部渐变装饰 */}
             <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
             
             {/* 连击指示器 */}
            {renderComboIndicator()}
            
          {/* 关卡选择界面 */}
          {renderLevelSelect()}
            
            {/* 游戏结束/胜利画面 */}
            {renderGameEndScreen()}
           
          {/* 植物选择页面 */}
        
         {/* 植物选择栏 */}
           <div className="opacity-85">{renderPlantSelection()}</div>
         
         {/* 游戏控制按钮 */}
           <div className="opacity-85">{renderGameControls()}</div>
       </div>
       
       {/* 提示信息区域 */}
       <div className="mt-4 mb-6 text-gray-400 text-center max-w-xl w-full">
         <p className="mb-3 leading-relaxed">
           <i className="fa-solid fa-lightbulb mr-2 text-yellow-400"></i>
           玩法提示: 点击下方植物种植到网格中，收集阳光来种植更多植物，抵御僵尸进攻!
         </p>
         <p className="leading-relaxed">
           <i className="fa-solid fa-shield-halved mr-2 text-blue-400"></i>
            每种植物都有独特的功能，合理搭配才能取得胜利!
         </p>
       </div>
      
        {/* 成就展示区 - 仅在首页显示，不在关卡界面显示 */}
         {!showLevelSelect && gameStatus !== 'playing' && (
          <div className="mt-6 mb-12 w-full max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl"
            >
              {/* 成就系统头部 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                 <h2 className="text-2xl font-bold text-yellow-400 flex items-center mb-4 md:mb-0">
                   <i className="fa-solid fa-trophy mr-3 text-xl"></i>
                   光明成就录
                </h2>
               
               {/* 成就统计 */}
               <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 w-full md:w-auto">
                 <div className="flex flex-col md:flex-row md:items-center justify-between">
                   <div className="mb-3 md:mb-0 mr-0 md:mr-6">
                     <div className="text-sm text-gray-400 mb-1">总完成度</div>
                     <div className="text-3xl font-bold text-yellow-400">
                       {Math.round((Object.values(gameEngineRef.current?.achievements || {}).filter(a => a).length / Object.keys(gameEngineRef.current?.achievements || {}).length) * 100)}%
                     </div>
                   </div>
                   <div className="w-full md:w-48">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-sm text-gray-400">已解锁成就</span>
                       <span className="text-sm text-white">
                         {Object.values(gameEngineRef.current?.achievements || {}).filter(a => a).length} / {Object.keys(gameEngineRef.current?.achievements || {}).length}
                       </span>
                     </div>
                     <div className="w-full bg-gray-700 rounded-full h-3">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Object.values(gameEngineRef.current?.achievements || {}).filter(a => a).length / Object.keys(gameEngineRef.current?.achievements || {}).length * 100}%` }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-3 rounded-full" 
                       ></motion.div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
            
             {/* 成就卡片网格 */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
               {/* 核心成就 - 光明的觉醒系列 */}
               {/* 光明的觉醒 */}
               <motion.div 
                 whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.2)" }}
                 transition={{ type: "spring", stiffness: 300 }}
                 className={`p-5 rounded-xl transition-all duration-300 ${
                   (gameEngineRef.current?.achievements.light_awakening || false) 
                     ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-700/30 border border-yellow-600/50 shadow-lg shadow-yellow-900/20' 
                     : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                 }`}
               >
                 <div className="flex justify-between items-start mb-4">
                   <motion.div 
                     animate={{ rotate: (gameEngineRef.current?.achievements.light_awakening || false) ? [0, 15, -15, 15, 0] : 0 }}
                     transition={{ duration: (gameEngineRef.current?.achievements.light_awakening || false) ? 0.5 : 0 }}
                     className={`w-12 h-12 rounded-full flex items-center justify-center ${
                       (gameEngineRef.current?.achievements.light_awakening || false) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'
                     }`}
                   >
                     <i className="fa-solid fa-trophy text-xl"></i>
                   </motion.div>
                   <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                     (gameEngineRef.current?.achievements.light_awakening || false) ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                   }`}>
                     {gameEngineRef.current?.achievements.light_awakening ? '已解锁' : '未解锁'}
                   </div>
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">光明的觉醒</h3>
                 <p className="text-gray-400 text-sm mb-3">光明之力在你手中苏醒，成功抵御了暗影世界的首次入侵</p>
                 
                 {/* 成就分类标签 */}
                 <div className="flex flex-wrap gap-2 mb-3">
                   <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded-full">
                     核心成就
                   </span>
                   <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded-full">
                     入门
                   </span>
                 </div>
                 
                 {gameEngineRef.current?.achievements.light_awakening && (
                   <div className="text-xs text-yellow-400/80">
                     <i className="fa-solid fa-calendar-check mr-1"></i>
                     已解锁
                   </div>
                 )}
               </motion.div>
               
               {/* 太阳使者 */}
               <motion.div 
                 whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.2)" }}
                 transition={{ type: "spring", stiffness: 300 }}
                 className={`p-5 rounded-xl transition-all duration-300 ${
                   (gameEngineRef.current?.achievements.sun_avatar || false) 
                     ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-700/30 border border-yellow-600/50 shadow-lg shadow-yellow-900/20' 
                     : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                 }`}
               >
                 <div className="flex justify-between items-start mb-4">
                   <motion.div 
                     animate={{ 
                       boxShadow: (gameEngineRef.current?.achievements.sun_avatar || false) ? 
                         ['0 0 0px rgba(255, 215, 0, 0)', '0 0 20px rgba(255, 215, 0, 0.7)', '0 0 0px rgba(255, 215, 0, 0)'] : 'none'
                     }}
                     transition={{ duration: (gameEngineRef.current?.achievements.sun_avatar || false) ? 2 : 0, repeat: Infinity }}
                     className={`w-12 h-12 rounded-full flex items-center justify-center ${
                       (gameEngineRef.current?.achievements.sun_avatar || false) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'
                     }`}
                   >
                     <i className="fa-solid fa-sun text-xl"></i>
                   </motion.div>
                   <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                     (gameEngineRef.current?.achievements.sun_avatar || false) ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                   }`}>
                     {gameEngineRef.current?.achievements.sun_avatar ? '已解锁' : '未解锁'}
                   </div>
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">太阳使者</h3>
                 <p className="text-gray-400 text-sm mb-2">你已成为太阳之力的化身，掌控了1000点纯净的生命能量</p>
                 <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                   <div 
                     className={`h-2 rounded-full transition-all duration-1000 ${(gameEngineRef.current?.achievements.sun_avatar || false) ? 'bg-yellow-500' : 'bg-yellow-700'}`} 
                     style={{ width: gameEngineRef.current ? `${Math.min((gameEngineRef.current.totalSunsCollected || 0) / 1000 * 100, 100)}%` : '0%' }}
                   ></div>
                 </div>
                 <div className="text-xs text-gray-500 mb-3">
                   {(gameEngineRef.current?.totalSunsCollected || 0)}/1000
                 </div>
                 
                 {/* 成就分类标签 */}
                 <div className="flex flex-wrap gap-2">
                   <span className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded-full">
                     核心成就
                   </span>
                   <span className="text-xs bg-orange-900/30 text-orange-300 px-2 py-1 rounded-full">
                     进阶
                   </span>
                 </div>
               </motion.div>
               
               {/* 暗影猎手 */}
               <motion.div 
                 whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.2)" }}
                 transition={{ type: "spring", stiffness: 300 }}
                 className={`p-5 rounded-xl transition-all duration-300 ${
                   (gameEngineRef.current?.achievements.shadow_hunter || false) 
                     ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-700/30 border border-yellow-600/50 shadow-lg shadow-yellow-900/20' 
                     : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                 }`}
               >
                 <div className="flex justify-between items-start mb-4">
                   <motion.div 
                     animate={{ 
                       opacity: (gameEngineRef.current?.achievements.shadow_hunter || false) ? 
                         [1, 0.7, 1] : 1
                     }}
                     transition={{ duration: (gameEngineRef.current?.achievements.shadow_hunter || false) ? 1 : 0, repeat: Infinity }}
                     className={`w-12 h-12 rounded-full flex items-center justify-center ${
                       (gameEngineRef.current?.achievements.shadow_hunter || false) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'
                     }`}
                   >
                     <i className="fa-solid fa-skull text-xl"></i>
                   </motion.div>
                   <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                     (gameEngineRef.current?.achievements.shadow_hunter || false) ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                   }`}>
                     {gameEngineRef.current?.achievements.shadow_hunter ? '已解锁' : '未解锁'}
                   </div>
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">暗影猎手</h3>
                 <p className="text-gray-400 text-sm mb-2">你已成为令暗影世界胆寒的猎手，成功净化了100个被暗影侵蚀的生命</p>
                 <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                   <div 
                     className={`h-2 rounded-full transition-all duration-1000 ${(gameEngineRef.current?.achievements.shadow_hunter || false) ? 'bg-red-500' : 'bg-red-700'}`} 
                     style={{ width: gameEngineRef.current ? `${Math.min((gameEngineRef.current.totalZombiesKilled || 0) / 100 * 100, 100)}%` : '0%' }}
                   ></div>
                 </div>
                 <div className="text-xs text-gray-500 mb-3">
                   {(gameEngineRef.current?.totalZombiesKilled || 0)}/100
                 </div>
                 
                 {/* 成就分类标签 */}
                 <div className="flex flex-wrap gap-2">
                   <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded-full">
                     核心成就
                   </span>
                   <span className="text-xs bg-orange-900/30 text-orange-300 px-2 py-1 rounded-full">
                     进阶
                   </span>
                 </div>
               </motion.div>
               
               {/* 不可逾越的光明 */}
               <motion.div 
                 whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.2)" }}
                 transition={{ type: "spring", stiffness: 300 }}
                 className={`p-5 rounded-xl transition-all duration-300 ${
                   (gameEngineRef.current?.achievements.unbreakable_light || false) 
                     ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-700/30 border border-yellow-600/50 shadow-lg shadow-yellow-900/20' 
                     : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                 }`}
               >
                 <div className="flex justify-between items-start mb-4">
                   <motion.div 
                     animate={{ 
                       boxShadow: (gameEngineRef.current?.achievements.unbreakable_light || false) ? 
                         ['0 0 0px rgba(0, 255, 0, 0)', '0 0 20px rgba(0, 255, 0, 0.7)', '0 0 0px rgba(0, 255, 0, 0)'] : 'none'
                     }}
                     transition={{ duration: (gameEngineRef.current?.achievements.unbreakable_light || false) ? 2 : 0, repeat: Infinity }}
                     className={`w-12 h-12 rounded-full flex items-center justify-center ${
                       (gameEngineRef.current?.achievements.unbreakable_light || false) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'
                     }`}
                   >
                      <i className="fa-solid fa-shield-halved text-xl"></i>
                   </motion.div>
                   <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                     (gameEngineRef.current?.achievements.unbreakable_light || false) ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                   }`}>
                     {gameEngineRef.current?.achievements.unbreakable_light ? '已解锁' : '未解锁'}
                   </div>
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">不可逾越的光明</h3>
                  <p className="text-gray-400 text-sm mb-3">你的光明防线坚不可摧，在没有损失任何守护者的情况下彻底净化了暗影大军</p>
                  
                 {/* 成就分类标签 */}
                 <div className="flex flex-wrap gap-2">
                   <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full">
                     核心成就
                   </span>
                   <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded-full">
                     困难
                   </span>
                 </div>
                 
                 {gameEngineRef.current?.achievements.unbreakable_light && (
                   <div className="text-xs text-yellow-400/80 mt-2">
                     <i className="fa-solid fa-calendar-check mr-1"></i>
                     已解锁
                   </div>
                 )}
               </motion.div>
               
               {/* 核心角色成就 */}
               {/* 光明的降临 */}
               <motion.div 
                 whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.2)" }}
                 transition={{ type: "spring", stiffness: 300 }}
                 className={`p-5 rounded-xl transition-all duration-300 ${
                   (gameEngineRef.current?.achievements.light_descend || false) 
                     ? 'bg-gradient-to-br from-purple-900/50 to-purple-700/30 border border-purple-600/50 shadow-lg shadow-purple-900/20' 
                     : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                 }`}
               >
                 <div className="flex justify-between items-start mb-4">
                   <motion.div 
                     animate={{ 
                       boxShadow: (gameEngineRef.current?.achievements.light_descend || false) ? 
                         ['0 0 0px rgba(128, 0, 128, 0)', '0 0 20px rgba(128, 0, 128, 0.7)', '0 0 0px rgba(128, 0, 128, 0)'] : 'none'
                     }}
                     transition={{ duration: (gameEngineRef.current?.achievements.light_descend || false) ? 2 : 0, repeat: Infinity }}
                     className={`w-12 h-12 rounded-full flex items-center justify-center ${
                       (gameEngineRef.current?.achievements.light_descend || false) ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
                     }`}
                   >
                     <i className="fa-solid fa-angel text-xl"></i>
                   </motion.div>
                   <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                     (gameEngineRef.current?.achievements.light_descend || false) ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                   }`}>
                     {gameEngineRef.current?.achievements.light_descend ? '已解锁' : '未解锁'}
                   </div>
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">光明的降临</h3>
                 <p className="text-gray-400 text-sm mb-3">传说中的守护者清鸢响应了你的召唤，与你并肩作战，共同对抗暗影</p>
                 
                 {/* 成就分类标签 */}
                 <div className="flex flex-wrap gap-2">
                   <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full">
                     角色成就
                   </span>
                   <span className="text-xs bg-orange-900/30 text-orange-300 px-2 py-1 rounded-full">
                     传说
                   </span>
                 </div>
                 
                 {gameEngineRef.current?.achievements.light_descend && (
                   <div className="text-xs text-yellow-400/80 mt-2">
                     <i className="fa-solid fa-calendar-check mr-1"></i>
                     已解锁
                   </div>
                 )}
               </motion.div>
               
               {/* 善•猫的救赎 */}
                <motion.div 
                   whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.2)" }}
                   transition={{ type: "spring", stiffness: 300 }}
                   className={`p-5 rounded-xl transition-all duration-300 ${
                     (gameEngineRef.current?.achievements.shancat_redemption || false) 
                       ? 'bg-gradient-to-br from-blue-900/50 to-blue-700/30 border border-blue-600/50 shadow-lg shadow-blue-900/20' 
                       : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                   }`}
                 >
                   <div className="flex justify-between items-start mb-4">
                     <motion.div 
                       animate={{ 
                         rotate: (gameEngineRef.current?.achievements.shancat_redemption || false) ? [0, 10, -10, 10, 0] : 0
                       }}
                       transition={{ duration: (gameEngineRef.current?.achievements.shancat_redemption || false) ? 0.5 : 0 }}
                       className={`w-12 h-12 rounded-full flex items-center justify-center ${
                         (gameEngineRef.current?.achievements.shancat_redemption || false) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
                       }`}
                     >
                       <i className="fa-solid fa-cat text-xl"></i>
                     </motion.div>
                     <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                       (gameEngineRef.current?.achievements.shancat_redemption || false) ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                     }`}>
                       {gameEngineRef.current?.achievements.shancat_redemption ? '已解锁' : '未解锁'}
                     </div>
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">善•猫的救赎</h3>
                   <p className="text-gray-400 text-sm mb-3">你见证了善•猫教主的救赎之路，曾经的暗影使者如今成为了光明的守护者</p>
                   
                   {/* 成就分类标签 */}
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded-full">
                       角色成就
                     </span>
                     <span className="text-xs bg-orange-900/30 text-orange-300 px-2 py-1 rounded-full">
                       史诗
                     </span>
                   </div>
                   
                   {gameEngineRef.current?.achievements.shancat_redemption && (
                     <div className="text-xs text-yellow-400/80 mt-2">
                       <i className="fa-solid fa-calendar-check mr-1"></i>
                       已解锁
                     </div>
                   )}
                 </motion.div>
               
               {/* 宿槐的陨落 */}
               <motion.div 
                 whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.2)" }}
                 transition={{ type: "spring", stiffness: 300 }}
                 className={`p-5 rounded-xl transition-all duration-300 ${
                   (gameEngineRef.current?.achievements.su_huai_fall || false) 
                     ? 'bg-gradient-to-br from-red-900/50 to-red-700/30 border border-red-600/50 shadow-lg shadow-red-900/20' 
                     : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                 }`}
               >
                 <div className="flex justify-between items-start mb-4">
                   <motion.div 
                     animate={{ 
                       boxShadow: (gameEngineRef.current?.achievements.su_huai_fall || false) ? 
                         ['0 0 0px rgba(255, 0, 0, 0)', '0 0 20px rgba(255, 0, 0, 0.7)', '0 0 0px rgba(255, 0, 0, 0)'] : 'none'
                     }}
                     transition={{ duration: (gameEngineRef.current?.achievements.su_huai_fall || false) ? 2 : 0, repeat: Infinity }}
                     className={`w-12 h-12 rounded-full flex items-center justify-center ${
                       (gameEngineRef.current?.achievements.su_huai_fall || false) ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                     }`}
                   >
                     <i className="fa-solid fa-ghost text-xl"></i>
                   </motion.div>
                   <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                     (gameEngineRef.current?.achievements.su_huai_fall || false) ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                   }`}>
                     {gameEngineRef.current?.achievements.su_huai_fall ? '已解锁' : '未解锁'}
                   </div>
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">宿槐的陨落</h3>
                 <p className="text-gray-400 text-sm mb-3">你多次击败了暗影女王宿槐，证明了光明终将战胜黑暗</p>
                 <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                   <div 
                     className={`h-2 rounded-full transition-all duration-1000 ${(gameEngineRef.current?.achievements.su_huai_fall || false) ? 'bg-red-500' : 'bg-red-700'}`}style={{ width: gameEngineRef.current ? `${Math.min((gameEngineRef.current.totalZombiesKilled || 0) / 10 * 100, 100)}%` : '0%' }}
                   ></div>
                 </div>
                 <div className="text-xs text-gray-500 mb-3">
                   {(gameEngineRef.current?.totalZombiesKilled || 0)}/10
                 </div>
                 
                 {/* 成就分类标签 */}
                 <div className="flex flex-wrap gap-2">
                   <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded-full">
                     角色成就
                   </span>
                   <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded-full">
                     极难
                   </span>
                 </div>
               </motion.div>
            </div>
            
            {/* 分享和返回按钮 */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* 分享成就按钮 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/30"
                onClick={() => toast('成就分享功能即将上线！')}
              >
                <i className="fa-solid fa-share-nodes mr-2"></i> 分享成就
              </motion.button>
              
              {/* 返回按钮 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={backToLevelSelect}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-gray-500/30"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> 返回选关界面
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      
       {/* 联机大厅界面 */}
      {showOnlineLobby && renderOnlineLobby()}
      
       {/* 植物选择界面 */}
       {showPlantSelection && (
         <PlantSelectionScreen 
           level={selectedLevel} 
           onConfirm={confirmPlantSelection} 
           onCancel={() => {
             setShowPlantSelection(false);
             setShowLevelSelect(true);
           }}
           isHighIntensity={LEVELS[selectedLevel]?.isHighIntensityCustom || false}
         />
       )}
       
        {/* 僵尸选择界面 */}
        {showZombieSelection && (
          <ZombieSelectionScreen
            onConfirm={(selectedZombies) => {
              setShowZombieSelection(false);
              
                    if (gameEngineRef.current) {
                      try {
                        // 将选中的僵尸传递给游戏引擎
                        gameEngineRef.current.selectedZombies = selectedZombies;
                        gameEngineRef.current.startGame(selectedLevel);
                        setGameStatus('playing');
                        setSunCount(GAME_CONFIG.initialSun); // 重置阳光数量状态
                      } catch (error) {
                        console.error('游戏启动失败:', error);
                        toast('游戏启动失败，请刷新页面重试');
                        setShowZombieSelection(true);
                      }
                    } else {
                      console.error('游戏引擎未初始化');
                      toast('游戏引擎初始化失败，请刷新页面重试');
                      setShowZombieSelection(true);
                    }
            }}
            onCancel={() => {
              setShowZombieSelection(false);
              setShowPlantSelection(true);
            }}
            isHighIntensity={LEVELS[selectedLevel]?.isHighIntensityCustom || false}
          />
        )}
        
        {/* 渲染对话系统 */}
        <DialogueSystem 
          gameState={{
            currentWave: gameEngineRef.current?.currentWave || 0,
            totalWaves: gameEngineRef.current?.totalWaves || 0,
            gameStatus: gameStatus,
            selectedLevel: selectedLevel,
            totalZombiesKilled: gameEngineRef.current?.totalZombiesKilled || 0,
            plants: gameEngineRef.current?.plants || [],
            sunCount: sunCount
          }} 
        />
      </div>
    );
    
    // 获取植物简短特殊效果描述的辅助函数
     function getShortSpecialEffect(plantType: PlantType, fullEffect: string): string {
       // 为每种植物提供简短明了的特殊效果描述
       const shortEffects: Record<PlantType, string> = {
         qingyuan: '全能型终极植物，多技能集一身',
         shancatleader: '可移动的植物，对猫教主造成额外伤害',
          xuqinglan: '成长型魔法少女，拥有三级进化阶段',
           yijiu: '呆萌可爱，使敌人攻击减半',
            xuqinglan_god: '神秘的终极形态，拥有超越常规的能力',
             xuqinglan_dream: '命运之子的未知形态，拥有能看清历史发展的神秘能力',
            mumu: '冰属性法师，减速控制，护盾保护'
       };
      
      return shortEffects[plantType] || fullEffect.substring(0, 15) + '...';
    }
}