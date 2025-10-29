/**
  * 游戏共享数据 - 植物与僵尸的配置数据
  * 所有组件应从这里导入数据，以确保数据一致性
  */

// 定义游戏状态类型
export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameover' | 'victory';
export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

// 定义成就类型和相关接口
export type AchievementType = 'light_awakening' | 'sun_avatar' | 'shadow_hunter' | 'unbreakable_light' | 'light_army_commander' | 'light_defender' | 'light_retribution' | 'life_force' | 'shadow_reaper' | 'light_combo' | 'light_barrier' | 'shadow_resister' | 'water_defender' | 'light_victory' | 'light_descend' | 'shancat_redemption' | 'su_huai_fall' | 'epic_combo' | 'legendary_survivor' | 'plant_collector' | 'zombie_exterminator' | 'sun_empire' | 'perfect_victory' | 'seasonal_achievement' | 'special_event_champion' | 'first_blood' | 'survival_expert' | 'master_strategist' | 'ultimate_defender' | 'sun_master' | 'darkness_slayer' | 'perfect_defense' | 'all_plants' | 'zombie_killer';

// 成就类别
export type AchievementCategory = 'core' | 'growth' | 'collection' | 'combat' | 'special' | 'secret';

// 成就稀有度
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

// 定义天气类型
export type WeatherType = 'sunny' | 'rainy' | 'foggy' | 'sandstorm' | 'snowy';

// 定义特殊事件类型
export type SpecialEvent = 'boss_battle' | 'sun_storm' | 'zombie_invasion';

// 植物升级等级类型
export type PlantUpgradeLevel = 1 | 2 | 3;

// 定义攻击范围类型
export type AttackRangeType = 'straight' | 'area' | 'melee' | 'all' | 'diagonal' | 'multiple';

// 定义目标选择策略类型
export type TargetSelectionStrategy = 'closest' | 'first' | 'strongest' | 'weakest' | 'random';

// 角色通用属性类型
export interface CharacterAttributes {
  // 通用属性
  name: string;
  description: string;
  quote?: string;
  rarity: string;
  category: string;
  unlockLevel?: number;
  
  // 战斗属性
  health: number;
  damage?: number;
  speed?: number;
  armor?: number;
  
  // 特殊属性
  specialEffect?: string;
  weakness?: string[];
  bestAgainst?: string[];
  
  // 图片相关
  imageUrl?: string;
}

// 植物类型 - 添加善•猫教主和青玄
export type PlantType = 'qingyuan' | 'shancatleader' | 'xuqinglan' | 'xuqinglan_student' | 'qingxuan' | 'murongyanfeng' | 'yijiu' | 'xuqinglan_god' | 'nanaisei' | 'vexithra' | 'xuqinglan_dream' | 'mumu' | 'mingjiansanshi' | 'ling' | 'xingzhe' | 'xiaoshengkui' | 'yunli_time_arbiter' | 'xiaoyue' | 'yuchen' | 'lingyaoning' | 'lingxi' | 'lihuoshuangsheng_changli' | 'jinghuashuiyue_lingxi' | 'cangxuan' | 'qingwu' | 'shuangshenghuaxian_lingxi' | 'ningshuang' | 'xuanshuang' | 'lingxi_chitong' | 'xingguisansi';

// 僵尸类型
export type ZombieType = 'su_huai' | 'cat_leader' | 'ji_zai' | 'li_huo' | 'vexithra' | 'xuqinglan_dark' | 'xia' | 'alibi' | 'qiuyue' | 'shantao' | 'xian' | 'shilie_lingxi' | 'longzunjiyan' | 'xingtianzhenyang' | 'xuanye';

// 成就接口
export interface Achievement {
  id: AchievementType;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string; // Font Awesome icon class
  rarity: AchievementRarity;
  points: number; // 成就点数
  isSecret?: boolean; // 是否为隐藏成就
  progressMax?: number; // 进度最大值（用于进度型成就）
  rewardDescription?: string; // 奖励描述
  reward?: {
    type: 'sun' | 'plant' | 'zombie' | 'story' | 'cosmetic';
    value: number | string;
  };
  conditions: {
    type: 'game_win' | 'kill_count' | 'sun_collected' | 'plant_used' | 'story_unlocked' | 'perfect_defense' | 'combo' | 'survival_wave' | 'special_event' | 'hidden';
    targetValue?: number;
    description: string;
  };
  
  }

// 成就数据
export const ACHIEVEMENTS: Record<AchievementType, Achievement> = {
  // 核心成就 - 光明的觉醒系列
  light_awakening: {
    id: 'light_awakening',
    title: '光明的觉醒',
    description: '光明之力在你手中苏醒，成功抵御了暗影世界的首次入侵！',
    category: 'core',
    icon: 'fa-trophy',
    rarity: 'common',
    points: 50,
    conditions: {
      type: 'game_win',
      description: '首次完成任意关卡'
    }
  },
  sun_avatar: {
    id: 'sun_avatar',
    title: '太阳使者',
    description: '你已成为太阳之力的化身，掌控了1000点纯净的生命能量！',
    category: 'core',
    icon: 'fa-sun',
    rarity: 'rare',
    points: 100,
    progressMax: 1000,
    rewardDescription: '解锁高级阳光生产技术',
    reward: {
      type: 'sun',
      value: 500
    },
    conditions: {
      type: 'sun_collected',
      targetValue: 1000,
      description: '累计收集1000点阳光'
    }
  },
  shadow_hunter: {
    id: 'shadow_hunter',
    title: '暗影猎手',
    description: '你已成为令暗影世界胆寒的猎手，成功净化了100个被暗影侵蚀的生命！',
    category: 'core',
    icon: 'fa-skull',
    rarity: 'rare',
    points: 100,
    progressMax: 100,
    rewardDescription: '提升植物对僵尸伤害',
    reward: {
      type: 'plant',
      value: 'damage_boost'
    },
    conditions: {
      type: 'kill_count',
      targetValue: 100,
      description: '累计消灭100个僵尸'
    }
  },
  unbreakable_light: {
    id: 'unbreakable_light',
    title: '不可逾越的光明',
    description: '你的光明防线坚不可摧，在没有损失任何守护者的情况下彻底净化了暗影大军！',
    category: 'core',
    icon: 'fa-shield-halved',
    rarity: 'epic',
    points: 200,
    rewardDescription: '解锁特殊防御技能',
    reward: {
      type: 'cosmetic',
      value: 'defense_aura'
    },
    conditions: {
      type: 'perfect_defense',
      description: '无植物损失通关任意关卡'
    }
  },
  light_army_commander: {
    id: 'light_army_commander',
    title: '光明军团统帅',
    description: '你已掌握了所有光明守护者的力量，成为了名副其实的光明统帅！',
    category: 'core',
    icon: 'fa-chess-king',
    rarity: 'epic',
    points: 150,
    progressMax: 9,
    rewardDescription: '所有植物属性提升10%',
    reward: {
      type: 'plant',
      value: 'global_boost'
    },
    conditions: {
      type: 'plant_used',
      targetValue: 9,
      description: '使用过所有类型的植物'
    }
  },
  light_defender: {
    id: 'light_defender',
    title: '光明捍卫者',
    description: '即使在最黑暗的时刻，你依然坚守光明，成为了光明大陆真正的守护者！',
    category: 'core',
    icon: 'fa-shield',
    rarity: 'epic',
    points: 150,
    conditions: {
      type: 'game_win',
      description: '完成第4关或更高级关卡'
    }
  },
  
  // 成长型成就 - 光明的成长
  light_retribution: {
    id: 'light_retribution',
    title: '光明的惩戒',
    description: '你的第一次净化，象征着光明对暗影的正义惩戒！',
    category: 'growth',
    icon: 'fa-bolt',
    rarity: 'common',
    points: 10,
    conditions: {
      type: 'kill_count',
      targetValue: 1,
      description: '首次消灭僵尸'
    }
  },
  life_force: {
    id: 'life_force',
    title: '生命之力',
    description: '你收集了100点来自太阳的生命能量，光明之力在你体内流淌！',
    category: 'growth',
    icon: 'fa-heart',
    rarity: 'common',
    points: 30,
    progressMax: 100,
    conditions: {
      type: 'sun_collected',
      targetValue: 100,
      description: '累计收集100点阳光'
    }
  },
  shadow_reaper: {
    id: 'shadow_reaper',
    title: '暗影收割者',
    description: '你如收割者般净化了50个暗影生物，成为光明大陆的清道夫！',
    category: 'growth',
    icon: 'fa-scythe',
    rarity: 'rare',
    points: 70,
    progressMax: 50,
    conditions: {
      type: 'kill_count',
      targetValue: 50,
      description: '累计消灭50个僵尸'
    }
  },
  light_combo: {
    id: 'light_combo',
    title: '光明连击',
    description: '连续10次净化暗影生物，光明力量在你手中绽放出璀璨的光芒！',
    category: 'growth',
    icon: 'fa-fire',
    rarity: 'rare',
    points: 60,
    progressMax: 10,
    conditions: {
      type: 'combo',
      targetValue: 10,
      description: '达到10次连续击杀'
    }
  },
  light_barrier: {
    id: 'light_barrier',
    title: '光明壁垒',
    description: '你构建了坚不可摧的光明壁垒，任何暗影生物都无法轻易突破！',
    category: 'growth',
    icon: 'fa-wall',
    rarity: 'rare',
    points: 50,
    progressMax: 10,
    conditions: {
      type: 'plant_used',
      targetValue: 10,
      description: '累计使用10个防御型植物'
    }
  },
  shadow_resister: {
    id: 'shadow_resister',
    title: '暗影抵御者',
    description: '你成功抵御了暗影世界的多次大规模入侵，证明了自己的实力！',
    category: 'growth',
    icon: 'fa-shield-alt',
    rarity: 'epic',
    points: 120,
    conditions: {
      type: 'game_win',
      description: '完成第3关或更高级关卡'
    }
  },
  
  // 关卡成就 - 光明的征程
  water_defender: {
    id: 'water_defender',
    title: '水域守护者',
    description: '你成功净化了被暗影污染的水域，恢复了大自然的平衡！',
    category: 'combat',
    icon: 'fa-water',
    rarity: 'rare',
    points: 80,
    conditions: {
      type: 'game_win',
      description: '完成第5关'
    }
  },
  light_victory: {
    id: 'light_victory',
    title: '光明的胜利',
    description: '你彻底击败了宿槐和她的暗影大军，光明大陆重获永恒的和平！',
    category: 'combat',
    icon: 'fa-crown',
    rarity: 'legendary',
    points: 300,
    rewardDescription: '解锁传说级植物',
    reward: {
      type: 'plant',
      value: 'ultimate_plant'
    },
    conditions: {
      type: 'game_win',
      description: '完成第8关'
    }
  },
  
  // 核心角色成就 - 光明与暗影的对决
  light_descend: {
    id: 'light_descend',
    title: '光明的降临',
    description: '传说中的守护者清鸢响应了你的召唤，与你并肩作战，共同对抗暗影！',
    category: 'special',
    icon: 'fa-angel',
    rarity: 'epic',
    points: 200,
    conditions: {
      type: 'plant_used',
      description: '使用清鸢并取得胜利'
    }
  },
  shancat_redemption: {
    id: 'shancat_redemption',
    title: '善•猫的救赎',
    description: '你见证了善•猫教主的救赎之路，曾经的暗影使者如今成为了光明的守护者！',
    category: 'special',
    icon: 'fa-cat',
    rarity: 'epic',
    points: 180,
    conditions: {
      type: 'plant_used',
      description: '使用善•猫教主并取得胜利'
    }
  },
  su_huai_fall: {
    id: 'su_huai_fall',
    title: '宿槐的陨落',
    description: '你多次击败了暗影女王宿槐，证明了光明终将战胜黑暗！',
    category: 'special',
    icon: 'fa-ghost',
    rarity: 'legendary',
    points: 250,
    progressMax: 10,
    conditions: {
      type: 'kill_count',
      targetValue: 10,
      description: '累计击败10次宿槐'
    }
  },
  
  // 新增成就
  epic_combo: {
    id: 'epic_combo',
    title: '连击大师',
    description: '达到30次连续击杀，展示你无与伦比的操作技巧！',
    category: 'combat',
    icon: 'fa-bolt-lightning',
    rarity: 'epic',
    points: 150,
    progressMax: 30,
    conditions: {
      type: 'combo',
      targetValue: 30,
      description: '达到30次连续击杀'
    }
  },
  legendary_survivor: {
    id: 'legendary_survivor',
    title: '传奇生存者',
    description: '在无尽模式中坚持到50波，展现你的持久作战能力！',
    category: 'combat',
    icon: 'fa-medal',
    rarity: 'legendary',
    points: 350,
    progressMax: 50,
    rewardDescription: '解锁特殊无尽模式奖励',
    reward: {
      type: 'cosmetic',
      value: 'endless_title'
    },
    conditions: {
      type: 'survival_wave',
      targetValue: 50,
      description: '在无尽模式中坚持到第50波'
    }
  },
  plant_collector: {
    id: 'plant_collector',
    title: '植物收藏家',
    description: '收集并使用过所有类型的植物，成为真正的植物大师！',
    category: 'collection',
    icon: 'fa-seedling',
    rarity: 'epic',
    points: 200,
    progressMax: 9,
    conditions: {
      type: 'plant_used',
      targetValue: 9,
      description: '收集并使用过所有类型的植物'
    }
  },
  zombie_exterminator: {
    id: 'zombie_exterminator',
    title: '僵尸终结者',
    description: '累计消灭1000个僵尸，成为暗影世界的噩梦！',
    category: 'combat',
    icon: 'fa-bug',
    rarity: 'legendary',
    points: 400,
    progressMax: 1000,
    conditions: {
      type: 'kill_count',
      targetValue: 1000,
      description: '累计消灭1000个僵尸'
    }
  },
  sun_empire: {
    id: 'sun_empire',
    title: '太阳帝国',
    description: '收集5000点阳光，建立庞大的资源帝国！',
    category: 'collection',
    icon: 'fa-coins',
    rarity: 'legendary',
    points: 350,
    progressMax: 5000,
    conditions: {
      type: 'sun_collected',
      targetValue: 5000,
      description: '累计收集5000点阳光'
    }
  },
  perfect_victory: {
    id: 'perfect_victory',
    title: '完美胜利',
    description: '以零损失通关所有主线关卡，展示完美的战术布局！',
    category: 'core',
    icon: 'fa-award',
    rarity: 'legendary',
    points: 500,
    rewardDescription: '解锁终极隐藏角色',
    reward: {
      type: 'plant',
      value: 'hidden_character'
    },
    conditions: {
      type: 'perfect_defense',
      description: '以零损失通关所有主线关卡'
    }
  },
  seasonal_achievement: {
    id: 'seasonal_achievement',
    title: '季节庆典',
    description: '在特殊节日活动中完成季节性挑战！',
    category: 'special',
    icon: 'fa-calendar-check',
    rarity: 'epic',
    points: 150,
    isSecret: true,
    conditions: {
      type: 'special_event',
      description: '在特殊节日活动中完成季节性挑战'
    }
  },
  special_event_champion: {
    id: 'special_event_champion',
    title: '特殊事件冠军',
    description: '在特殊事件中获得最高排名！',
    category: 'special',
    icon: 'fa-star',
    rarity: 'legendary',
    points: 300,
    isSecret: true,
    conditions: {
      type: 'special_event',
      description: '在特殊事件中获得最高排名'
    }
  },
  
  // 新增的更明确的成就定义
  first_blood: {
    id: 'first_blood',
    title: '初次尝血',
    description: '首次消灭僵尸',
    category: 'growth',
    icon: 'fa-tint',
    rarity: 'common',
    points: 5,
    conditions: {
      type: 'kill_count',
      targetValue: 1,
      description: '首次消灭僵尸'
    }
  },
  survival_expert: {
    id: 'survival_expert',
    title: '生存专家',
    description: '在困难难度下坚持30分钟',
    category: 'combat',
    icon: 'fa-clock',
    rarity: 'rare',
    points: 80,
    conditions: {
      type: 'survival_wave',
      targetValue: 30,
      description: '在困难难度下坚持30分钟'
    }
  },
  master_strategist: {
    id: 'master_strategist',
    title: '战术大师',
    description: '使用10种不同的植物组合取得胜利',
    category: 'core',
    icon: 'fa-chess',
    rarity: 'epic',
    points: 120,
    progressMax: 10,
    conditions: {
      type: 'plant_used',
      targetValue: 10,
      description: '使用10种不同的植物组合取得胜利'
    }
  },
  ultimate_defender: {
    id: 'ultimate_defender',
    title: '终极守护者',
    description: '在专家难度下取得胜利',
    category: 'combat',
    icon: 'fa-shield-alt',
    rarity: 'legendary',
    points: 200,
    conditions: {
      type: 'game_win',
      description: '在专家难度下取得胜利'
    }
  },
  
  // 与Home.tsx中使用的成就ID保持一致
  sun_master: {
    id: 'sun_master',
    title: '阳光大师',
    description: '累计收集100个阳光',
    category: 'growth',
    icon: 'fa-sun',
    rarity: 'common',
    points: 20,
    progressMax: 100,
    conditions: {
      type: 'sun_collected',
      targetValue: 100,
      description: '累计收集100个阳光'
    }
  },
  darkness_slayer: {
    id: 'darkness_slayer',
    title: '黑暗杀手',
    description: '累计消灭50个僵尸',
    category: 'combat',
    icon: 'fa-skull',
    rarity: 'rare',
    points: 60,
    progressMax: 50,
    conditions: {
      type: 'kill_count',
      targetValue: 50,
      description: '累计消灭50个僵尸'
    }
  },
  perfect_defense: {
    id: 'perfect_defense',
    title: '完美防御',
    description: '在没有损失任何植物的情况下通关',
    category: 'core',
    icon: 'fa-shield',
    rarity: 'epic',
    points: 100,
    conditions: {
      type: 'perfect_defense',
      description: '在没有损失任何植物的情况下通关'
    }
  },
  all_plants: {
    id: 'all_plants',
    title: '植物大师',
    description: '使用过游戏中的所有植物类型',
    category: 'collection',
    icon: 'fa-seedling',
    rarity: 'epic',
    points: 150,
    progressMax: 9,
    conditions: {
      type: 'plant_used',
      targetValue: 9,
      description: '使用过游戏中的所有植物类型'
    }
  },
  zombie_killer: {
    id: 'zombie_killer',
    title: '僵尸杀手',
    description: '累计消灭100个僵尸',
    category: 'combat',
    icon: 'fa-crosshairs',
    rarity: 'rare',
    points: 80,
    progressMax: 100,
    conditions: {
      type: 'kill_count',
      targetValue: 100,
      description: '累计消灭100个僵尸'
    }
  }
};

// 植物配置接口
export interface PlantConfig extends CharacterAttributes {
  cost: number;
  cooldown: number;
  attackRange?: number;
  attackRangeType: AttackRangeType; // 新增：攻击范围类型（直线、范围、近战等）
  attackSpeed?: number;
  targetSelection: TargetSelectionStrategy; // 新增：目标选择策略
  bulletSpeed?: number; // 新增：子弹速度
  bulletPierce?: number; // 新增：子弹穿透次数
  aoeRadius?: number; // 新增：范围攻击半径
}

// 僵尸配置接口
export interface ZombieConfig extends CharacterAttributes {
  reward?: number;
  difficulty: string;
  appearsIn?: number[];
  strategy?: string;
  type: 'normal' | 'tank' | 'fast' | 'flying' | 'special'; // 新增：僵尸类型
}

// 更新历史接口
export interface UpdateHistory {
  id: string;
  date: string;
  title: string;
  description: string;
  changes: UpdateChange[];
}

// 更新内容接口
export interface UpdateChange {
  type: 'feature' | 'balance' | 'bugfix' | 'visual';
  title: string;
  description: string;
}

 // 更新历史数据
export const GAME_UPDATES: UpdateHistory[] = [
  {
    id: '7',
    date: '2025-10-28',
    title: '游戏内容全面更新与角色立绘优化',
    description: '新增角色与优化现有角色，提升游戏体验与视觉效果',
    changes: [
      {
        type: 'feature',
        title: '新增古神级僵尸角色：刑天真阳',
        description: '先天杀伐神魔，混沌青莲碎片与幽冥血海怨气凝结而成，拥有万劫冻结、斩因果等强大技能，带来全新的游戏体验。'
      },
      {
        type: 'feature',
        title: '新增古神级僵尸角色：玄夜',
        description: '混沌熵魔，先天神魔，非神非魔，独立于巫妖人阐之外的混沌原生体，拥有混沌熵潮、无序狼·无序、时空褶跃等强大技能。'
      },
      {
        type: 'visual',
        title: '角色立绘全面更新',
        description: '更新了清鸢、善•猫教主等多个角色的立绘，使其更加精美和符合角色设定。'
      },
      {
        type: 'feature',
        title: '新增植物角色：灵璇',
        description: '先天星灵族•摇光星君，执掌北斗第七星，拥有星轨注道、璇玑定星盘等强大星象技能。'
      },
      {
        type: 'balance',
        title: '游戏平衡性调整',
        description: '优化了部分角色的属性和技能效果，提升游戏的平衡性和可玩性。'
      },
      {
        type: 'visual',
        title: 'UI界面优化',
        description: '优化了图鉴页面的UI界面，提升用户体验和视觉效果。'
      }
    ]
  },
  {
    id: '6',
    date: '2025-10-27',
    title: '洪荒古神系列角色登场',
    description: '新增两位强大的洪荒古神级植物角色，带来全新的游戏体验',
    changes: [
      {
        type: 'feature',
        title: '新增植物角色：离火双生•长离',
        description: '先天火灵修成的人族形态，洪荒焚天剑冢守护者，执掌天地间第一缕离火，拥有双生形态——表体为持剑卫道的守护者，里体为蒙眼的离火本源之灵。'
      },
      {
        type: 'feature',
        title: '新增植物角色：镜花水月·灵汐',
        description: '先天灵植·绿萼仙莲化形，洪荒三千镜像世界的守护者，拥有掌控镜像之力的神秘能力，能洞察万物本质。'
      },
      {
        type: 'balance',
        title: '洪荒世界观扩展',
        description: '完善了洪荒世界观设定，为游戏增添更多深度和背景故事'
      },
      {
        type: 'visual',
        title: '角色立绘更新',
        description: '更新了离火双生•长离和镜花水月·灵汐的角色立绘，使其更加符合角色设定'
      }
    ]
  },
  {
    id: '5',
    date: '2025-10-21',
    title: '核心角色全面加强',
    description: '清鸢和宿槐作为游戏核心角色获得全面强化，能力大幅提升',
    changes: [
      {
        type: 'feature',
        title: '新增植物角色：徐清岚（梦）',
        description: '命运之子徐清岚的未知形态，独立于传统属性之外，拥有能看清历史发展的神秘能力。她代表着善良和美好，是徐清岚内心的完美形态，不存在于现实，是来自未来的指引。'
      },
      {
        type: 'balance',
        title: '清鸢能力全面强化',
        description: '生命值提升至300000，攻击力提升至2800，攻击速度提升至350；阳光生成速度加快至每0.3秒120阳光；神圣光波冷却时间缩短至6秒并新增治疗效果；神圣领域持续时间延长至12秒，攻击力提升效果增加至150%，并新增防御力提升和暴击效果；新增光明壁垒和太阳祝福被动技能；神圣净化技能伤害提升至5000，冷却时间缩短至35秒；神圣守护恢复效果提升至每秒2%最大生命值'
      },
      {
        type: 'balance',
        title: '宿槐能力全面强化',
        description: '生命值提升至120000，攻击力提升至7000，护甲提升至12000，移动速度提升至0.5；暗影护盾反弹伤害提升至150%，冷却时间缩短至12秒；诅咒光环范围扩大至8格，伤害提升至500点并新增防御力降低效果；生命吸取效果提升至12%；与Vexithra的灵魂联结效果增强，新增生命恢复能力；新增黑暗屏障和枯萎之力技能；新增终极技能时间停滞，可在生命值低于20%时使所有植物停止行动8秒'
      },
      {
        type: 'feature',
        title: '核心角色特性优化',
        description: '清鸢和宿槐新增专属特性，使他们在战斗中更加独特和强大'
      },
      {
        type: 'balance',
        title: '角色平衡性调整',
        description: '略微提高了清鸢的成本以匹配增强的能力，同时调整了相关游戏机制以确保游戏平衡性'
      }
    ]
  },
  {
    id: '4',
    date: '2025-10-20',
    title: '全面增强更新',
    description: '所有植物与僵尸获得全面增强，能力提升，新增特殊效果',
    changes: [
      {
        type: 'balance',
        title: '清鸢能力全面增强',
        description: '生命值提升至200000，攻击力提升至2000，神圣领域持续时间延长至10秒，攻击力提升效果增加至100%，新增自动恢复能力'
      },
      {
        type: 'balance',
        title: '善•猫教主能力提升',
        description: '移动速度提升至每2秒一格，新增无敌冲刺状态，"圣猫形态"持续时间延长至8秒，攻击力提升效果增加至50%'
      },
      {
        type: 'balance',
        title: '宿槐能力强化',
        description: '生命值提升至80000，攻击力提升至5000，暗影护盾吸收伤害量提升至10000，新增召唤高级随从能力'
      },
      {
        type: 'balance',
        title: '季灾与离火能力进化',
        description: '季灾的暗影领域效果增强，离火的火焰领域持续时间延长，两者新增特殊协同效果'
      },
      {
        type: 'feature',
        title: '植物与僵尸新增被动技能',
        description: '所有角色新增独特的被动技能，提升战斗策略多样性'
      },
      {
        type: 'visual',
        title: '技能特效全面升级',
        description: '所有特殊技能的视觉效果获得全面提升，更加华丽震撼'
      },
      {
        type: 'balance',
        title: '游戏平衡性调整',
        description: '调整了植物种植成本与僵尸奖励，优化了游戏节奏和资源管理体验'
      }
    ]
  },
  {
    id: '3',
    date: '2025-10-19',
    title: '游戏系统优化',
    description: '优化了游戏性能，改善了用户体验',
    changes: [
      {
        type: 'balance',
        title: '指南手册界面优化',
        description: '改进了指南手册的布局和交互体验，优化了"查看最近更新"功能'
      },
      {
        type: 'bugfix',
        title: '修复已知问题',
        description: '修复了游戏中已知的bug和性能问题，提升游戏稳定性'
      },
      {
        type: 'visual',
        title: '界面美化',
        description: '更新了游戏界面的视觉效果，提升整体美感'
      }
    ]
  },
  {
    id: '2',
    date: '2025-10-18',
    title: '暗影大陆新使者登场',
    description: '新的强大僵尸加入战场，带来全新的战斗体验',
    changes: [
      {
        type: 'feature',
        title: '新增僵尸角色：季灾',
        description: '暗影大陆的顶级阴阳师，代表极致的暗。拥有极强的削弱植物能力，能通过暗影领域和诅咒大幅降低植物的战斗能力'
      },
      {
        type: 'feature',
        title: '新增僵尸角色：离火',
        description: '暗影大陆的顶级阴阳师，代表极致的火。拥有极强的增益僵尸能力，能通过火焰领域和强化效果大幅提升僵尸的战斗能力'
      },
      {
        type: 'balance',
        title: '僵尸召唤机制优化',
        description: '调整了宿槐召唤僵尸的概率，季灾和离火的召唤概率略低于猫教主'
      },
      {
        type: 'visual',
        title: '僵尸角色立绘更新',
        description: '更新了季灾和离火的角色立绘，使其更符合暗影大陆阴阳师的形象'
      }
    ]
  },
  {
    id: '1',
    date: '2025-10-17',
    title: '植物与僵尸属性优化',
    description: '调整了植物攻击系统和僵尸属性，提高游戏平衡性',
    changes: [
      {
        type: 'balance',
        title: '植物攻击范围明确',
        description: '明确了各类植物的攻击覆盖区域（直线、范围、近战等）'
      },
      {
        type: 'balance',
        title: '攻击间隔调整',
        description: '重新设置了植物的攻击频率，优化游戏节奏'
      },
      {
        type: 'balance',
        title: '目标选择策略优化',
        description: '改进了植物选择攻击目标的逻辑（最靠近的僵尸、第一个进入范围的僵尸等）'
      },
      {
        type: 'feature',
        title: '子弹轨迹系统',
        description: '新增了子弹飞行路径和击中检测的精确计算'
      },
      {
        type: 'feature',
        title: '伤害计算系统',
        description: '根据植物和僵尸的属性计算最终伤害的新系统'
      }
    ]
  }
];

// 版本信息
export const GAME_VERSION = {
  major: parseInt(GAME_UPDATES[0]?.id || '1'),
  minor: 0,
  patch: 0,
  fullVersion: `v${parseInt(GAME_UPDATES[0]?.id || '1')}.0.0`,
  lastUpdateDate: GAME_UPDATES[0]?.date || new Date().toISOString().split('T')[0],
  updateCount: GAME_UPDATES.length
};

/**
 * 创建植物配置工具函数
 * 简化新植物的添加过程
 */
const createPlantConfig = (
  type: PlantType,
  baseConfig: Omit<PlantConfig, 'attackRangeType' | 'targetSelection' | 'category' | 'rarity' | 'cost' | 'cooldown'> & 
  Partial<PlantConfig>
): PlantConfig => {
  return {
    cost: 500, // 默认成本
    cooldown: 2000, // 默认冷却时间
    attackRangeType: 'all', // 默认全图攻击
    targetSelection: 'strongest', // 默认优先攻击最强的目标
    category: '光明守护者', // 默认分类
    rarity: '传说', // 默认稀有度
    ...baseConfig
  };
};

// 植物配置数据 - 添加善•猫教主
export const PLANTS_CONFIG: Record<PlantType, PlantConfig> = {
  qingyuan: createPlantConfig('qingyuan', {
    name: '清鸢',
    cost: 600, // 略微提高成本以匹配增强的能力
    cooldown: 1800, // 冷却时间缩短，提高可用性
    health: 300000, // 全面强化：生命值大幅提升
    damage: 2800, // 全面强化：攻击力大幅提升
    attackRange: 99,
    attackSpeed: 350, // 全面强化：攻击速度大幅提升
    specialEffect: '每0.3秒产生120阳光；场上出现僵尸时，自动攻击，攻击数量为场上僵尸数+8；免疫减速、控制效果和所有负面状态；对来自暗影世界的僵尸造成额外200%伤害；每消灭2个僵尸获得一个神圣护盾，可抵挡一次致命伤害；每6秒释放一次神圣光波，清除全屏负面效果并为所有植物恢复5%最大生命值；每20秒召唤一次神圣领域，持续12秒，期间所有植物攻击力提升150%，防御力提升50%；对所有类型僵尸造成额外伤害（巨人+100%、飞行+120%、潜水+150%、特殊+300%）；周围8格内的植物获得50%伤害减免和30%攻击速度提升；死亡时触发神圣爆发，对全屏僵尸造成12000点伤害并眩晕10秒；拥有自动瞄准系统，优先攻击血量最高和威胁最大的僵尸；受到攻击时有80%概率反弹120%伤害；主动技能：神圣净化，可手动触发，立即清除全屏负面效果并对所有僵尸造成5000点伤害，冷却时间35秒；被动技能：神圣守护，每秒恢复自身2%最大生命值；新增被动技能：光明壁垒，每隔10秒获得一层光明壁垒，吸收5000点伤害；新增被动技能：太阳祝福，每次攻击有30%几率为随机一个植物恢复10%最大生命值；新增特性：在神圣领域持续期间，所有植物获得30%暴击率，暴击伤害提升50%。',
     description: '清鸢，光明大陆的永恒守护者，诞生于世界本源之力的光明面。在天地初开的混沌时代，她与宿槐同源一体，本是同一存在的两面。清鸢代表着光明与生命的力量，是希望与变革的化身，坚信生命因变化而美丽，时间的流逝让每一刻都变得珍贵而有意义。\n\n在独立于光暗大陆之外的虚空之中，清鸢与宿槐曾有过一场决定性的对话。宿槐认为"生命，只有在停滞不前的时间中，才能实现永恒的幸福"，而清鸢则坚定地反驳："正因为时间流逝，生命才有喜怒哀乐，才能诞生出珍贵的事物和回忆！将这一切都停止，根本不是和平，那只是单纯的\'停滞\'！"\n\n经过全面强化的清鸢，实力得到了前所未有的提升。她的每一次出现都伴随着更加强大的光芒和生命气息，能够更快地创造生命之源阳光，更频繁地释放神圣领域大幅提升所有植物的战斗能力，甚至可以反弹更多敌人的攻击并净化一切负面效果。她还获得了全新的光明壁垒和太阳祝福技能，能够更好地保护自己和队友，在战斗中发挥更加关键的作用。\n\n在这场光明与暗影的终极对决中，清鸢是所有植物战士最坚定的精神支柱，她用自己的光芒照亮了对抗黑暗的道路，让所有生命看到了希望的曙光。她始终坚信，即使是与自己理念相悖的宿槐，内心深处依然保留着对生命的热爱，这也是她始终不愿放弃拯救妹妹的原因。',
    category: '光明守护者',
    bestAgainst: ['大规模僵尸群', '来自暗影世界的生物', '宿槐与其随从', '需要持续阳光供应的情况', '任何需要强大火力的战局', '高强度自定义关卡'],
    worstAgainst: ['无明显弱点'],
    quote: '正因为时间流逝，生命才有喜怒哀乐，才能诞生出珍贵的事物和回忆！'
  }),
  shancatleader: createPlantConfig('shancatleader', {
    name: '善•猫教主',
    cost: 350, // 略微提高成本以匹配增强的能力
    cooldown: 2500, // 冷却时间缩短，提高可用性
    health: 15000, // 全面强化：生命值大幅提升
    damage: 2000, // 全面强化：攻击力大幅提升
    attackRange: 2, // 攻击范围扩大，从1格增加到2格
    attackRangeType: 'melee',
    attackSpeed: 600, // 全面强化：攻击速度大幅提升
    targetSelection: 'closest', // 优先攻击最近的目标
     specialEffect: '可以移动的植物，每1秒向右移动一格，遇到僵尸时停止移动并进行战斗；对猫教主僵尸造成额外800%伤害；击杀僵尸后获得额外150阳光奖励；移动时免疫攻击和负面效果；受到致命伤害时会回到初始位置并恢复100%生命值，并且在接下来的5秒内获得无敌状态；每消灭1个僵尸后进入"圣猫形态"，持续12秒，移动速度提升150%，攻击力提升100%，且在形态期间免疫所有负面效果；普通攻击有60%几率触发"光明冲击"，对目标造成额外伤害并眩晕4秒；每8秒可以使用一次"光明冲刺"，立即向前移动8格并对路径上的所有僵尸造成伤害，且在冲刺过程中无敌；在场时，周围6格内的植物获得30%攻击速度加成和25%伤害提升；新增高级被动技能：光明之怒，每次攻击有40%几率召唤光明能量波，对前方3格内的所有僵尸造成伤害；新增终极技能：猫神降临，每消灭8个僵尸后，可以释放一次全屏AOE伤害并恢复自身70%生命值；新增被动技能：光明守护，每2秒恢复自身3%最大生命值；新增被动技能：灵魂净化，每次攻击有20%几率净化目标，使其受到的伤害增加20%，持续5秒；新增特性：在圣猫形态下，攻击范围扩大至3格。',
     description: '善•猫教主的故事充满了救赎与重生的传奇色彩。在暗影女王宿槐尚未堕落之前，她曾在精灵森林中救下了一只濒临死亡的小猫，这只猫后来成为了她最忠实的伴侣"猫教主"。然而，随着宿槐的堕落，小猫也被黑暗力量侵蚀，变成了半猫半僵尸的诡异形态，成为了宿槐最得力的随从。\n\n在一次与清鸢的激烈战斗中，猫教主被光明之力击中，黑暗能量在体内剧烈震荡，唤醒了它内心深处残留的善良记忆。清鸢察觉到了这一丝光明的存在，她没有选择消灭猫教主，而是用自己的光明之力净化了它被黑暗侵蚀的灵魂，赋予它全新的生命形态。\n\n重生后的善•猫教主获得了更加强大的光明之力！它拥有了雪白的毛发和金色的眼睛，身后漂浮着耀眼的光雾。它的速度变得更加迅捷，力量变得更加强大，能够在战场上以闪电般的速度穿梭，用锋利的光明爪子和强大的光明能量打击敌人，同时为周围的植物伙伴提供强大的增益效果。\n\n善•猫教主不仅保留了作为僵尸时的敏捷与战斗本能，还获得了全新的光明技能。它能够更快地进入"圣猫形态"，在这个形态下，它的能力得到全面提升，攻击范围也会扩大。它还获得了自我治疗和净化目标的能力，使其在战斗中更加持久和致命。\n\n善•猫教主的存在是光明与救赎的象征，它用实际行动证明着即使曾经迷失在黑暗中的灵魂，也能重获光明并变得更加强大。它对清鸢有着绝对的忠诚，愿意为保护光明大陆付出一切代价。在战斗中，它与曾经的自己——"猫教主"僵尸有着特殊的感应，会优先攻击对方，对其造成毁灭性的伤害。',
    category: '光明使者',
    bestAgainst: ['猫教主僵尸', '快速僵尸', '单个高生命值僵尸', '需要快速移动应对的战局', '所有类型的僵尸'],
    worstAgainst: ['大规模僵尸群'],
    quote: '喵呜~就算曾经迷失在黑暗，也要相信光明终会到来！'
  }),
  xuqinglan: createPlantConfig('xuqinglan', {
    name: '徐清岚（魔法少女）',
    cost: 400,
    cooldown: 3000,
    health: 8000, // 血量薄
    damage: 1500, // 远程强攻击
    attackRange: 6, // 远程攻击范围
    attackRangeType: 'straight', // 直线攻击
    attackSpeed: 800, // 中等攻击速度
    targetSelection: 'first', // 优先攻击第一个目标
    specialEffect: '成长型植物，拥有三级进化阶段：一级时通过笔墨写符咒攻击前方；二级时形成魔法阵，多只笔作宝剑和符咒一起攻击，攻击速度提升至原来的2倍，攻击范围扩大至周围1格，变为范围型攻击；三级时进化为法杖形态，继续多只笔一起成宝剑魔法阵攻击，进入终极阶段，大范围攻击（前方3x3区域），同时伴有增幅己方植物攻击力25%、削弱僵尸防御力20%的作用；对火属性僵尸造成额外150%伤害；每次攻击有30%几率触发"魔法连击"，额外发射一道符咒攻击；随着游戏时间推移，自动提升至更高等级，每20秒自动升级一级；达到三级后，每消灭5个僵尸可获得一次额外的魔法能量爆发，短暂提升所有能力（攻击速度+50%、伤害+30%，持续8秒）；免疫所有减速和控制效果；普通攻击有20%几率造成"魔法标记"，使目标受到的后续魔法伤害增加10%，持续5秒；三级形态时，每15秒释放一次"光明守护"，为周围3格内所有植物恢复10%最大生命值；与善•猫教主同时在场时，两人获得20%伤害减免和15%攻击速度提升，形成"光明搭档"效果。',
    description: '徐清岚是来自人类世界的天才魔法少女，年仅14岁便已经掌握了人类世界最顶尖的魔法技艺。她出生在一个古老的魔法世家，从记事起就能看到常人无法看见的能量流动，展现出了惊人的魔法天赋。\n\n在一次偶然的冥想中，清岚的意识与光明大陆的本源能量产生了共鸣。她看到了一个神秘的世界正面临着黑暗势力的威胁，而自己似乎就是那个世界所等待的"命运之子"。不顾家人的劝阻，清岚通过古老的传送魔法阵，毅然前往了这个陌生而危险的异世界。\n\n在光明大陆的"星辰秘境"中，清岚发现了与自己魔法属性完美契合的"星尘之笔"，这是一支拥有自我意识的魔法武器，可以随着持有者的魔力增强而进化。随着对星尘之笔的掌控逐渐熟练，清岚能够释放出三种不同形态的魔法攻击：最基础的符咒攻击、华丽的魔法阵攻击，以及最终的法杖形态的强大魔法。\n\n清岚有着金色的卷发和如蓝宝石般清澈的眼睛，总是喜欢在头发上别着三叶草发饰，认为那能给自己带来好运。她性格开朗活泼，面对困难总是保持乐观的态度，经常用标志性的"V"字手势来鼓舞队友。虽然在战斗中展现出了强大的实力，但本质上她仍然是一个普通的少女，喜欢可爱的东西，讨厌虫子，害怕打雷。\n\n在与宿槐的战斗中，清岚逐渐理解了自己来到光明大陆的真正使命——不仅仅是为了拯救这个世界，更是为了找到属于自己的成长之路。她与善•猫教主之间产生了特殊的羁绊，两人的组合能够发挥出远超个体的力量，成为了植物阵营中最耀眼的"光明搭档"。',
    category: '魔法使者',
    bestAgainst: ['普通僵尸', '速度型僵尸', '中等血量僵尸', '需要范围攻击的场合', '火属性僵尸', '密集僵尸群'],worstAgainst: ['高护甲僵尸', '高血量僵尸', '需要快速击杀的场合'],
    quote: '魔法的真谛不是破坏，而是守护我珍视的一切！'
  }),
  xuqinglan_student: createPlantConfig('xuqinglan_student', {
    name: '徐清岚（修习者）',
    cost: 450,
    cooldown: 3500,
    health: 6000, // 血量少
    damage: 1800, // 比魔法少女形态更强的元素魔法
    attackRange: 7, // 更远的攻击范围
    attackRangeType: 'straight', // 直线攻击
    attackSpeed: 700, // 更快的攻击速度
    targetSelection: 'strongest', // 优先攻击最强的目标
    specialEffect: '徐清岚的成长形态，通过深入学习光明大陆的本源魔法，将元素魔法发挥到极致；每次攻击有40%几率触发"元素爆发"，额外发射一道强大的元素魔法，对目标造成150%伤害；对黑暗魔法增强的僵尸造成额外200%伤害；受到攻击时有20%几率触发"魔法护盾"，免疫下一次伤害并反弹50%伤害；每消灭3个僵尸获得一次魔法能量积累，达到3层时释放一次全屏魔法能量爆发，对所有僵尸造成当前伤害值的50%伤害并减速30%，持续4秒；与善•猫教主同时在场时，两人获得25%伤害减免和20%攻击速度提升，形成"强化光明搭档"效果；三级形态时，每12秒释放一次"魔力守护"，为周围4格内所有植物恢复15%最大生命值并清除负面效果；每10秒随机获得一种元素强化（火：伤害+25%，水：减速敌人，风：攻击速度+30%，土：防御力+40%），持续15秒，各元素强化提供不同效果；拥有极高的魔法天赋，但血量较少，需要其他植物保护；每次升级时，获得短暂的无敌状态（1.5秒）和攻击力提升（10%），持续到战斗结束。',
    description: '当来自人类世界的魔法少女徐清岚踏入光明大陆的那一刻，她便被这片土地上浓郁而古老的魔法能量深深吸引。在清鸢的引导下，她开始在星辰秘境中修习本源魔法。面对远超人类世界认知的史前魔法体系，年轻的清岚经历了无数次迷茫与挫折。她的魔力波动变得极不稳定，甚至偶尔会失控引发小型魔法风暴。\n\n在这段孤独的修行时光中，清岚逐渐学会了控制和融合不同元素的魔法力量。她的星尘之笔也随之进化，能够同时操控多种元素之力。然而，长期的独处和高强度的修行也让清岚的内心产生了一丝孤寂感。这种情绪在"宿槐"对光明大陆发动黑暗魔法侵蚀时被放大，成为了她内心深处的一个隐患。\n\n尽管如此，修习者形态的清岚依然保持着对光明的信念，她的魔法技艺日益精湛，甚至能够释放出比魔法少女形态更加强大的元素魔法。她相信，只要坚持自己的初心，终有一天能够完全掌握这些古老而强大的力量，成为真正的魔法大师。',
    category: '魔法使者',
    bestAgainst: ['黑暗魔法增强的僵尸', '高伤害僵尸', '需要强大单体伤害的场合', '密集僵尸群', '飞行僵尸'],
    worstAgainst: ['高护甲僵尸', '高血量僵尸', '需要快速击杀的场合'],
    quote: '魔法的修行之路充满荆棘，但我不会退缩！'
  }),
  qingxuan: createPlantConfig('qingxuan', {
    name: '青玄',
    cost: 550,
    cooldown: 2200,
    health: 180000,
    damage: 2200,
    attackRange: 99,
    attackSpeed: 500,
    targetSelection: 'closest', // 优先攻击最近的目标
    specialEffect: '守护星界之门的神秘力量，同时拥有强大的输出与修复能力；每1秒产生50阳光；木和风双属性攻击，对暗影世界的僵尸造成额外200%伤害；每消灭2个僵尸获得一个守护护盾，可抵挡一次致命伤害；每10秒释放一次星界守护，为周围3格内的所有植物恢复15%最大生命值；每20秒召唤一次星界领域，持续8秒，期间所有植物攻击力提升80%，防御力提升50%；对所有类型僵尸造成额外伤害（巨人+60%、飞行+70%、潜水+80%、特殊+180%）；周围6格内的植物获得50%伤害减免和15%攻击速度提升；死亡时触发星界爆发，对全屏僵尸造成6000点伤害并眩晕6秒；免疫减速、控制效果和所有负面状态；受到攻击时有70%概率反弹100%伤害；新增主动技能：星界净化，可手动触发，立即清除全屏负面效果并为所有植物恢复10%最大生命值，冷却时间40秒；新增被动技能：星界守护，每秒恢复自身2%最大生命值',
    description: '青玄，星界之门的守护者，是创世神在光明大陆最隐秘角落创造的超然存在。她诞生于星尘与月光的交汇之处，肩负着维护光明大陆与其他世界平衡的神圣使命。传说中，她曾是创世神座下的首席星使，因在星界之战中立下赫赫战功，被赋予了守护星界之门的重任。\n\n身着飘逸的青蓝色长袍，手持由星尘凝聚而成的"流光伞"，青玄的每一次出现都会伴随着柔和的星光和微风。她性格清冷而睿智，说话时总是带着淡淡的星辰般的光芒。作为木和风双属性的守护者，她既能操控自然界的力量攻击敌人，又能编织治愈的星光守护同伴。\n\n千万年来，青玄始终恪守职责，默默守护着星界之门，阻挡了无数试图破坏两界平衡的黑暗势力。她的存在让暗影世界的生物对星界之门望而却步，成为了连接两个世界的稳固屏障。然而，在季灾的精心策划下，徐清岚（暗）趁她不备发动了突然袭击，青玄在重伤坠落后下落不明，成为了光明大陆的一大谜团。\n\n在战斗中，青玄展现出了无与伦比的全能性。她不仅能对敌人造成毁灭性的范围伤害，还能持续为队友提供治疗和增益效果。这种独特的能力组合使她成为了植物阵营中不可或缺的核心角色，无论是防守还是进攻都能发挥关键作用。',
    category: '星界守护者',
    bestAgainst: ['大规模僵尸群', '来自暗影世界的生物', '需要持续治疗的情况', '任何需要强大火力的战局', '高强度自定义关卡'],
    worstAgainst: ['无明显弱点'],
    quote: '生命的意义与我无关，守护，我的抉择'
  }),
  murongyanfeng: createPlantConfig('murongyanfeng', {
    name: '慕容言风',
    cost: 600,
    cooldown: 2500,
    health: 150000,
    damage: 2500,
    attackRange: 99,
    attackSpeed: 600,
    targetSelection: 'strongest', // 优先攻击最强的目标
    specialEffect: '居住在光明大陆最混乱的地方"明渊"的神秘人类；拥有极其强大的单体输出与群体输出能力；暗属性攻击，对光明属性的敌人造成额外250%伤害；每消灭1个僵尸获得一个黑暗能量积累，达到3层时释放一次黑暗风暴，对全屏僵尸造成5000点伤害并降低其防御力30%，持续6秒；每15秒释放一次"暗之领域"，持续10秒，期间所有敌人的移动速度降低40%，攻击速度降低30%；对所有类型僵尸造成额外伤害（巨人+70%、飞行+60%、潜水+80%、特殊+250%）；周围8格内的敌人受到10%额外伤害；死亡时触发"黑暗爆发"，对全屏僵尸造成8000点伤害并眩晕8秒；免疫减速、控制效果和所有负面状态；受到攻击时有80%概率反弹100%伤害；新增主动技能："阴阳光华"，可手动触发，立即对全屏敌人造成3000点伤害并恢复自身20%最大生命值，冷却时间50秒；新增被动技能："明暗流转"，每秒恢复自身1%最大生命值',
    description: '慕容言风，一个游离于光明与黑暗之间的神秘存在，被光明大陆的居民称为"明渊之主"。他身着墨色长袍，腰间挂着一个古老的酒葫芦，长发随意束起，眼神中总是带着三分不羁、三分冷漠和四分看透一切的深邃。作为人类，却拥有远超普通人类的强大力量，这使他成为了光明大陆上最令人捉摸不透的存在之一。\n\n明渊，这片位于光明大陆最边缘的混乱之地，是光明与暗影的交汇之处，也是通往星界之门的最后屏障。慕容言风在这里建立了自己的领地，成为了这个危险区域的实际统治者。他既不站在光明一方，也不投身于黑暗，始终保持着中立的立场，只按照自己的意愿行事。\n\n关于他的来历，大陆上流传着许多传说。有人说他是古代阴阳师的后裔，有人说他是光暗平衡被打破时诞生的特殊存在，还有人说他曾是季灾和离火的同门师兄。无论真相如何，慕容言风强大的实力是毋庸置疑的。他能够操控黑暗能量进行攻击，同时又能吸收光明之力恢复自身，这种独特的能力使他在战斗中几乎立于不败之地。\n\n尽管性格阴晴不定，慕容言风内心却有着自己的底线和原则。在宿槐率领暗影大军入侵光明大陆时，他最终选择站在光明一方，用自己的力量帮助植物阵营抵御僵尸的进攻。他的加入极大地改变了战局，成为了对抗暗影势力的重要力量。',
    category: '明渊守护者',
    bestAgainst: ['大规模僵尸群', '来自光明世界的生物', '需要强大火力的情况', '任何需要强大输出的战局', '高强度自定义关卡'],
    worstAgainst: ['无明显弱点'],
    quote: "你在哪里……"
  }),
  yijiu: createPlantConfig('yijiu', {
    name: '屹九',
    cost: 150,
    cooldown: 1500,
    health: 500,
    damage: 30,
    attackRange: 3,
    attackRangeType: 'straight',
    attackSpeed: 2000,
    targetSelection: 'closest',
    specialEffect: '来自于人类世界，喜欢吃糖葫芦，呆萌的形象让敌人对其的攻击减半；当受到攻击时，有30%几率使攻击者陷入迷惑状态，持续3秒；周围3格内的植物获得15%伤害减免；对巨人僵尸的攻击减半效果提升至70%；免疫所有控制效果；每消灭1个僵尸恢复自身5%最大生命值；受到致命伤害时会进入防御姿态，持续5秒，期间受到的伤害减少80%',
    description: '屹九是光明大陆上最特殊的存在之一，这个可爱的小男孩有着圆滚滚的脸蛋、大大的眼睛和永远挂着笑容的嘴角。他穿着传统的中国风服饰，腰间总是挂着一串糖葫芦，走到哪里都能带来欢乐的氛围。\n\n在人类世界时，屹九是一个出生于高官世家的小少爷，集万千宠爱于一身。他天真无邪、心地善良，最喜欢做的事情就是拿着糖葫芦在大街上跑来跑去，和所有遇到的人打招呼。然而，一场突如其来的光暗大战改变了他的命运，他不幸被卷入其中，年轻的生命就此终结。\n\n但屹九纯净无瑕的灵魂引起了光明之力的注意。光明之力被这个孩子纯真的心灵所打动，决定赋予他新的生命形态，让他成为光明大陆的守护者。于是，屹九以植物的形态重生，继续用他的纯真和善良守护着这片土地。\n\n在战斗中，屹九的特殊能力令人惊叹。他呆萌可爱的形象会让敌人不由自主地减弱攻击，甚至陷入迷惑状态。同时，他还能为周围的植物伙伴提供保护，帮助它们更好地抵抗僵尸的进攻。虽然攻击力不强，但屹九在队伍中的作用不可替代，他用自己独特的方式为光明大陆的胜利贡献着力量。',
    category: '防御型植物',
    rarity: '普通',
    bestAgainst: ['高伤害僵尸', '巨人僵尸', '需要长期生存的防线'],
    worstAgainst: ['快速僵尸群', '飞行僵尸'],
    quote: "歪日他得，就剩我了？？？"
  }),
  xuqinglan_god: createPlantConfig('xuqinglan_god', {
    name: '徐清岚（神）',
    cost: 1000,
    cooldown: 5000,
    health: 500000,
    damage: 10000,
    attackRange: 99,
    attackSpeed: 300,
    targetSelection: 'strongest', // 优先攻击最强的目标
    specialEffect: '神秘',
    description: '神秘',
    category: '光明守护者',
    rarity: '神秘',
    bestAgainst: ['所有类型僵尸'],
    worstAgainst: ['神秘'],
    quote: '光明与黑暗，终将在命运的指引下合而为一。'
  }),
   nanaisei: createPlantConfig('nanaisei', {
   name: '奈奈生',
   cost: 800,
   cooldown: 3000,
   health: 250000,
   damage: 3000,
   attackRange: 99,
   attackSpeed: 600,
   targetSelection: 'strongest', // 优先攻击最强的目标
   specialEffect: '光明大陆的先天灵，诞生于世界本源之光，拥有掌控时间与命运的神秘力量；每2秒产生80阳光；对黑暗属性的僵尸造成额外200%伤害；免疫所有负面状态和控制效果；每15秒释放一次"预知未来"，提前3秒预警下一波僵尸的类型和路线，并为所有植物提供30%伤害减免和15%攻击速度提升，持续10秒；每30秒释放一次"本源守护"，为周围8格内的所有植物恢复20%最大生命值并清除所有负面效果；与徐清岚（任何形态）同时在场时，两人获得50%伤害减免、30%攻击速度提升和25%伤害加成，形成"命运羁绊"效果；死亡时触发"本源传承"，将所有能力传递给场上最强的植物，并为其恢复50%最大生命值；拥有极高的魔法抗性，受到的魔法伤害减少50%；能够感知敌人的弱点，攻击时有30%几率造成暴击，暴击伤害为200%；每消灭5个僵尸，自身攻击速度提升5%，持续到战斗结束，最多叠加10层；当场上同时存在徐清岚（神）时，两人的"命运羁绊"效果提升至70%伤害减免、50%攻击速度提升和40%伤害加成',
   description: '奈奈生，光明大陆最古老的先天灵之一，诞生于世界形成之初的第一缕阳光中，是光明本源的直接化身。她拥有银白色的长发和清澈如泉水的蓝色眼眸，肌肤若冰雪般纯净，身上散发着柔和而温暖的金色光芒。作为先天灵，奈奈生不仅能够掌控极致的光明之力，还拥有着极其罕见的"时间预见"和"命运编织"能力。\n\n在预感到光明大陆即将面临的巨大危机后，奈奈生决定采取行动。她用自己的本源之力作为引路灯，跨越时空壁垒，将来自人类世界的"命运之子"徐清岚召唤到了光明大陆。为了确保清岚能够顺利成长，奈奈生在暗中以一缕本源之力引导她修行，虽然两人从未直接谋面，但清岚在修炼过程中总能感受到一股温和而熟悉的力量在指引着自己。\n\n当季灾策划偷袭徐清岚时，奈奈生虽然无法直接干预，但她在徐清岚彻底堕落为"徐清岚（暗）"的前一刻，冒着生命危险在她的神魂中留下了一丝本源之力。这丝看似微弱的光明之力，最终成为了徐清岚能够摆脱黑暗控制、重获新生的关键伏笔。\n\n奈奈生性格温和而睿智，总是以大局为重。她虽然拥有强大的力量，但很少直接参与战斗，更多的是在幕后默默地守护着光明大陆和所有生命。她相信，每个生命都有其存在的意义和价值，即使是曾经迷失在黑暗中的灵魂，也有被救赎的可能。',
   category: '先天灵',
   bestAgainst: ['黑暗属性僵尸', '大规模僵尸群', '需要提前预警的战局', 'BOSS级僵尸', '与徐清岚搭配时效果最佳'],
   worstAgainst: ['无明显弱点'],
     quote: '命运的丝线早已编织好，光明终将战胜黑暗。'
  }),
  vexithra: createPlantConfig('vexithra', {
    name: 'Vexithra(战神)',
    cost: 750,
    cooldown: 3000,
    health: 200000,
    damage: 2800,
    attackRange: 99,
    attackSpeed: 500,
    targetSelection: 'strongest', // 优先攻击最强的目标
    specialEffect: '极限单体输出，能够对单个目标造成毁灭性伤害；增加周围5格内所有植物的攻击力25%和攻击速度20%；擅长格斗和剑术，普通攻击有70%几率触发连击，额外造成150%伤害；对暗属性敌人造成额外200%伤害；每消灭3个僵尸获得一个战神护盾，可抵挡一次致命伤害；每15秒释放一次战神领域，持续8秒，期间所有植物获得30%伤害减免；免疫减速、控制效果和所有负面状态；受到攻击时有60%概率反弹100%伤害；新增主动技能：战神之怒，可手动触发，立即对一个目标造成5000点伤害并眩晕4秒，冷却时间35秒；新增被动技能：战神守护，每秒恢复自身1%最大生命值',
    description: '相传很久之前，人类世界出现了一位极其强大的"战神"，她的传说在人类世界广为流传，很多世家的长辈曾向其说媒，均被其拒绝。后来，听闻其与一名神秘男子，共同消失于人类世界。现在大陆还流传着其击败未知怪物，追寻光明大陆"清鸢"，抵御暗影大陆侵袭的传说。没有人知道她后来去了哪里……',
    category: '战神',
    bestAgainst: ['暗属性敌人', '高血量单体僵尸', 'BOSS级敌人', '需要单体输出的场合', '需要增强队友属性的场合'],
    worstAgainst: ['阴阳师类型敌人', '大规模僵尸群', '需要范围攻击的场合'],
     quote: '战神之剑，为守护而挥！'
   }),
   xuqinglan_dream: createPlantConfig('xuqinglan_dream', {
     name: '徐清岚（梦）',
     cost: 1000,
     cooldown: 4000,
     health: 300000,
     damage: 8000,
     attackRange: 99,
     attackSpeed: 400,
     targetSelection: 'strongest', // 优先攻击最强的目标
     specialEffect: '独立于传统属性之外的未知属性；拥有能看清历史发展的神秘能力；每次攻击有70%几率触发"命运之眼"，额外造成50%伤害并清除目标所有强化效果；对暗影属性敌人造成额外250%伤害；每消灭2个僵尸获得一个命运护盾，可抵挡一次致命伤害；每12秒释放一次"时空净化"，清除全屏负面效果并为所有植物恢复15%最大生命值；周围8格内的所有植物获得30%伤害减免和20%攻击速度提升；免疫减速、控制效果和所有负面状态；受到攻击时有80%概率反弹100%伤害；新增主动技能："未来指引"，可手动触发，立即对所有僵尸造成6000点伤害并眩晕6秒，冷却时间35秒；新增被动技能："梦境守护"，每秒恢复自身2%最大生命值；与徐清岚（任何形态）同时在场时，触发"命运共鸣"，双方攻击力提升50%，防御力提升30%；新增特性：在"时空净化"效果下，所有植物获得"未来视"效果，能够提前0.5秒预知僵尸的行动',
     description: '徐清岚（梦）是命运之子徐清岚的未知形态，代表着善良与美好，是徐清岚内心的完美形态，不存在于现实，是来自未来的指引，一双眼睛能看清历史的发展；徐清岚（梦），一个存在于未来道路上的人，在现实与未来的交织中，徐清岚（梦）就存在于此。\n\n传说中，当清鸢与宿槐这对曾经的双生姐妹第一次感受到对方心中的裂痕时，徐清岚（梦）的能量波动首次在星界之门附近出现。清鸢与宿槐曾尝试接近这股神秘能量，但被一股温和而强大的力量轻轻推开，似乎在暗示着她的使命还未到来。\n\n与其他角色不同，徐清岚（梦）拥有看透历史发展的"命运之眼"，能够在战斗中预知僵尸的行动轨迹和弱点。她的攻击带有强烈的时间属性，能够撕裂时空壁垒，对暗影生物造成毁灭性的打击。她的"时空净化"技能不仅能清除负面效果，还能为同伴注入来自未来的生命力。\n\n作为连接现实与未来的存在，徐清岚（梦）的真实目的至今仍是一个谜。有人猜测她是徐清岚未来的某种形态，也有人认为她是整个光明大陆在时间长河中的守护者。唯一可以确定的是，她的存在为这场光暗之战带来了新的变数和希望。',
     category: '命运使者',
     rarity: '神秘',
     bestAgainst: ['暗影属性敌人', 'BOSS级敌人', '所有类型僵尸', '拥有强化效果的僵尸'],
     worstAgainst: ['无明显弱点'],quote: '世俗不能批判希望，偏见无法撂倒未来'
  }),
  // 新增植物：沐沐
  mumu: createPlantConfig('mumu', {
    name: '沐沐',
    cost: 650,
    cooldown: 3500,
    health: 150000,
    damage: 2500,
    attackRange: 99,
    attackSpeed: 600,
    targetSelection: 'closest',
    specialEffect: '冰属性攻击，对暗影属性敌人造成额外200%伤害；每次攻击有60%几率触发"冰之束缚"，使目标减速50%，持续3秒；每消灭1个僵尸获得一个"冰之护盾"，可抵挡一次伤害；每12秒释放一次"冰雪领域"，清除全屏负面效果并为所有植物提供15%伤害减免，持续8秒；在场时，周围8格内的所有植物受到的冰属性伤害提升20%；免疫减速和控制效果；受到攻击时有70%几率反弹50%伤害并减速攻击者；新增主动技能："冰之封锁"，可手动触发，立即对所有僵尸造成4000点伤害并附加冰冻效果，冷却时间30秒；新增被动技能："冰雪之心"，每秒恢复自身1.5%最大生命值；新增特性：当生命值低于30%时，获得"冰茧守护"，免疫所有伤害，持续5秒，每场战斗只能触发一次。',
    description: '冰雪森林中的银发少女，冰蓝眼眸澄澈，发间缀冰晶雪花饰，露肩蓝白礼裙如霜华闪烁。周遭树木覆雪，冰晶飘落，静谧清冷又梦幻。隶属于光明大陆影月谷的内门弟子，其性格冷淡，似乎对任何事都不感兴趣，其内心向往安静与静止的世界，想创造一个独属于其的独立世界，不对外开放。\n\n沐沐在小时候并非如此，其性格暴烈，身着红衣，经常对弱小群体进行欺压，经常性的做作，使"沐沐"变得毒恶，精神失常，经常对周围人无差别攻击。后来，在一次做作之后，碰到了一个对于其不同寻常的人，一个弱小但对生活充满信心的人，于是，这个人便成了"沐沐"经常欺负的对象。随着年龄的增长，两人渐渐无法接受双方的分离，但事与愿违，这个人在莫一天消失了，彻底的消失，留下了一句"已走，勿念"，就丢下了"沐沐"，不知去向，"沐沐"刚开始并不太相信，后来，经历了长时间的等待，莫次日落后，"沐沐"便开始了封心锁爱，换上了冷色调的衣服，拜入影月谷，开始了修行……',
    category: '冰属性法师',
    rarity: '史诗',
    bestAgainst: ['暗影属性敌人', '高速僵尸', '大规模僵尸群', '需要减速控制的场合', 'BOSS级僵尸'],
    worstAgainst: ['火属性僵尸', '对冰冻免疫的僵尸'],
    quote: '等闲变却故人心，却道故人心易变。'
   }),
  // 新增植物：冥界三使
  mingjiansanshi: createPlantConfig('mingjiansanshi', {
    name: '冥界三使',
    cost: 750,
    cooldown: 4000,
    health: 180000,
    damage: 2800,
    attackRange: 99,
    attackSpeed: 600,
    targetSelection: 'strongest', // 优先攻击最强的目标
    specialEffect: '土属性和暗属性双重攻击；作为暗杀者，对敌人造成额外200%暴击伤害；拥有"拘傀遣将"能力，每10秒召唤冥界的拘傀者协助战斗；免疫所有控制效果和负面状态；对光属性敌人造成额外150%伤害；周围8格内的所有植物受到的暗属性伤害提升30%；受到攻击时有60%几率反弹80%伤害并减速攻击者；每消灭1个僵尸获得一个黑暗护盾，可抵挡一次伤害；每15秒释放一次"冥界领域"，清除全屏负面效果并为所有植物提供20%伤害减免，持续8秒；新增主动技能："冥界召唤"，可手动触发，立即召唤3个强力拘傀者到场上进行战斗，冷却时间45秒；新增被动技能："冥界守护"，每秒恢复自身1.5%最大生命值；新增特性：当生命值低于30%时，获得"冥界庇护"，免疫所有伤害，持续5秒，每场战斗只能触发一次。',
    description: '冥界，位于人类世界之下，人死为"傀"，傀则前往冥界。冥界三使为长期停留在人类世界的冥界使者，早在很久之前，冥君就派此三傀前往人界，暗中完成特殊任务。人类世界对于冥界的存在，极少数的人才知道，冥界为轮回之处，由于冥界之人多为傀的形式存在，不可见光，故其界之人为晚上去人间办事。\n\n冥界三使为大地与黑暗结合所诞生的，故而可以长存人间。她们经常用其外表去迷惑他人来执行任务，后来在光暗大战中，被逃回人界的徐清岚(暗)吸收力量而亡。\n\n这三位冥界使者分别代表着不同的能力：一位擅长暗杀，一位擅长召唤，一位擅长防御。她们三位一体，共同守护着冥界与人界的平衡。虽然她们在光暗大战中不幸陨落，但她们的灵魂依然在冥界徘徊，等待着合适的时机重新现世。',
    category: '冥界使者',
    rarity: '史诗',
    bestAgainst: ['光属性敌人', '高生命值敌人', '需要持续召唤支援的场合', 'BOSS级敌人', '黑暗属性增强的僵尸'],
    worstAgainst: ['光属性攻击', '金属线陷阱', '群体攻击', '净化效果'],
    quote: '漫长的生命意味着更多别离，但也意味着更多相遇、更多希望。学会离别，也是生命意义的一部分。'
   }),
  // 新增植物：凌
  ling: createPlantConfig('ling', {
    name: '凌',
    cost: 1000,
    cooldown: 5000,
    health: 350000,
    damage: 9000,
    attackRange: 99,
    attackSpeed: 450,
    targetSelection: 'strongest', // 优先攻击最强的目标
    specialEffect: '先天水属性，水之本源；对火属性敌人造成额外250%伤害；免疫所有负面效果和控制效果；每次攻击有80%几率触发"水之净化"，清除目标所有强化效果并减速40%，持续5秒；每消灭1个僵尸获得一个"水之护盾"，可抵挡一次伤害；每15秒释放一次"水之领域"，清除全屏负面效果并为所有植物提供20%伤害减免，持续10秒；周围8格内的所有植物受到的水属性伤害提升30%；受到攻击时有80%几率反弹100%伤害；新增主动技能："水之律动"，可手动触发，立即对所有僵尸造成7000点伤害并眩晕7秒，冷却时间40秒；新增被动技能："水之守护"，每秒恢复自身2%最大生命值；新增特性：当生命值低于30%时，获得"水之屏障"，免疫所有伤害，持续6秒，每场战斗只能触发一次。',
    description: '洪荒纪，即在混沌之中，世界未分之时，便已出现了许多古神，"凌"便是其中之一。洪荒的秩序为混沌，天地不分，古神行事各异，他们在漫长的岁月里，忘记了时间。\n\n"凌"为水属性的古神，其本体为先天水，洪荒中的第一滴水—甘澪。在洪荒纪时，"凌"时常陷于迷茫，从何而来，为何而生，意义为何，一切未知。在最后的古神大战中，"凌"明白了，世界为何会这样，为何重建……',
    category: '洪荒古神',
    rarity: '古神',
    bestAgainst: ['火属性敌人', '高生命值敌人', 'BOSS级敌人', '所有类型僵尸', '拥有强化效果的僵尸'],
    worstAgainst: ['时间魔法', '单体高爆发敌人'],
    quote: '在死去纪元的骨架上，种下下一代文明的种子'
  }),
  // 新增植物：星褶
  xingzhe: createPlantConfig('xingzhe', {
    name: '星褶',
    cost: 1200,
    cooldown: 6000,
    health: 400000,
    damage: 12000,
    attackRange: 99,
    attackSpeed: 400,
    targetSelection: 'strongest', // 优先攻击最强的目标
    specialEffect: '暗属性和星辰之力双重攻击；作为古神，对所有类型敌人造成额外300%伤害；免疫所有负面效果和控制效果；每次攻击有90%几率触发"星辰陨落"，对目标及周围3格内的所有敌人造成额外800%伤害并眩晕3秒；每消灭1个敌人获得一个"星辰护盾"，可抵挡一次致命伤害；每15秒释放一次"星辰领域"，清除全屏负面效果并为所有植物提供30%伤害减免，持续12秒；周围10格内的所有植物受到的暗属性伤害提升50%；受到攻击时有90%几率反弹150%伤害；新增主动技能："灵境九序自在归"，可手动触发，立即对所有敌人造成15000点伤害并眩晕10秒，冷却时间50秒；新增被动技能："星辰守护"，每秒恢复自身3%最大生命值；新增特性：当生命值低于20%时，获得"星辰重启"，免疫所有伤害，持续8秒，每场战斗只能触发一次；随着时间流逝，攻击力和防御力持续提升，每60秒提升10%，无上限。',
    description: '若世有永恒,则其一定是星辰.无数纪元的生命,皆有崇拜星星的教派,以祈星辰之力,换取起愿."星褶"为星辰的化身,文明的重启,伴随着"星褶"的苏醒;文明的毁灭,伴随着"星褶"的沉睡."星褶"的能量来源于星空,每当夜幕降临,"星褶"就会吸收其力量,一助自己修行."星褶"体内拥有强大的能量,随着时间的增加,其会越来越强,最后会怎样无从得知."星褶"在洪荒纪感到文明即将毁去,于是便发动漫天星辰之力,提前带来毁灭,并告诉众神,"毁灭与重生,相伴相随",语罢,便发动"灵境九序自在归",对洪荒中心的时空核心发动攻击,提前激活了界器.完罢,星褶就陷入了沉睡……',
    category: '洪荒古神',
    rarity: '古神',
    bestAgainst: ['所有类型敌人', 'BOSS级敌人', '大规模敌人', '需要强力单体输出的场合', '需要长时间战斗的场合'],
    worstAgainst: ['无'],
    quote: '宇宙重置本质上是矛盾不可调和时的宇宙免疫反应，是宇宙理性的自我校正机制'
  }),
  // 新增植物：筱燊傀
  xiaoshengkui: createPlantConfig('xiaoshengkui', {
    name: '筱燊傀',
    cost: 500,
    cooldown: 3000,
    health: 200000,
    attackRange: 0,
    attackRangeType: 'melee',
    attackSpeed: 0,
    targetSelection: 'closest',
    specialEffect: '冥界的记载史吏，本身并无战力，但其逃跑与记载查阅能力一绝；作为防御类植物，能够为周围植物提供强大的防御加成；周围8格内的所有植物受到的伤害减少30%；免疫所有减速和控制效果；对光属性攻击有额外的抵抗能力；受到攻击时有50%几率闪避；能够感知危险，提前预警；每15秒生成一个记载屏障，可阻挡一次对自身或周围植物的攻击；对冥界三使有特殊的增益效果，同时在场时双方防御增加20%；擅长记录历史，能够复制并保存其他植物的技能效果，但只能在危急时刻使用一次；在夜晚或冥界环境中，防御能力提升50%；作为残傀形态，其生命力顽强，即使生命值降至0也不会立即死亡，而是进入假死状态，有机会在3秒内恢复10%生命值。',
    description: '冥界的记载史吏,以记载现世重大事迹为职责,其族密史相传记载了关于世界重启前的秘闻,但具体情况无从得知.筱燊傀本身并无战力,但其逃跑与记载查阅能力一绝.也是极少数知道世界真相的人,后来,在告诉徐清岚等人相关内容时,惹怒莫位不可言的存在,被拖走其识海,仅剩一残傀.最后,经历了漫长时光,徐清岚在与不可言谈判时,识海有机会逃离,回到了残傀上面.',
    category: '防御型植物',
    rarity: '史诗',
    bestAgainst: ['光属性敌人', '高伤害敌人', '需要防御加成的场合', '与冥界三使配合时效果最佳'],
    worstAgainst: ['光属性攻击', '空间系魔法', '持续伤害类攻击'],
    quote: '历史会记住胜利者，但也不会忘记失败者的故事。'
   }),
  // 新增植物：云璃•时光裁决者
  yunli_time_arbiter: createPlantConfig('yunli_time_arbiter', {
    name: '云璃•时光裁决者',
    cost: 1500,
    cooldown: 6000,
    health: 450000,
    damage: 15000,
    attackRange: 99,
    attackSpeed: 350,
    targetSelection: 'strongest', // 优先攻击最强的目标
    specialEffect: '时间系与空间系双重攻击，对所有类型敌人造成额外350%伤害；免疫所有负面效果和控制效果；每次攻击有90%几率触发"时间切割"，对目标及周围4格内的所有敌人造成额外1000%伤害并眩晕4秒；每消灭1个敌人获得一个"时光护盾"，可抵挡一次致命伤害；每10秒释放一次"命运囚笼"，将范围内敌人困在时间裂隙中，使其停止行动5秒；每20秒释放一次"时空重置"，清除全屏负面效果并为所有植物恢复30%最大生命值；周围12格内的所有植物获得40%伤害减免和30%攻击速度提升；受到攻击时有95%几率反弹200%伤害；新增主动技能："时序之断"，可手动触发，立即对所有敌人造成20000点伤害并暂停时间8秒，冷却时间60秒；新增被动技能："命运编织"，每秒恢复自身5%最大生命值；新增特性：随着时间流逝，攻击力和防御力持续提升，每30秒提升15%，无上限；星轨圣铠提供额外的防御加成，使云璃受到的伤害减少50%；时序之刃能够切割时间，使敌人的冷却时间延长50%；时间水晶提供预知能力，使云璃能够提前2秒预知敌人的行动。',
    description: '云璃•时光裁决者，命运神殿第7代殿主，时空秩序的守护者，「时序之刃」的持有者。流金长发如融化的阳光瀑布，发梢泛着星尘微光，象征时间长河的永恒流动；黄绿双色瞳孔（左眼映刻过去的「记忆之沙」，右眼预见未来的「可能性之影」）；全身披挂「星轨圣铠」：金色铠甲镶嵌十二颗蓝宝石（对应黄道十二宫的时空锚点），肩甲浮雕「莫比乌斯环」纹路，腰链由可伸缩的星金锁链构成（战斗时可化为时间囚笼）；右手握持「时序之刃」：剑身镌刻宇宙膨胀公式，剑柄镶嵌「奇点水晶」，挥动时会留下金色轨迹（实为被切割的时间残片）。\n\n铠甲即枷锁，亦是容器："这身圣铠不是权力的象征，而是时间赋予我的「认知监狱」——它让我看见所有命运的分支，却也让我永远困在「观测者」的视角。"——云璃认为，命运神殿的职责不是「裁决」而是「记录」，正如她铠甲上的锁链：看似束缚，实则是维系无数平行时空的「稳定器」。时间是可塑的晶体，而非线性的河流："凡人说「命运不可逆」，不过是他们无法理解「晶体的多面体」——每个面都是一种可能，而我能触摸到晶体的每个棱角。"\n\n她的哲学融合赫拉克利特「万物流变」与量子力学「叠加态」，主张命运是「未坍缩的概率云」，裁决者的使命是防止某一可能性吞噬其他分支（如阻止暴君通过时间旅行抹除反抗者）。终极悖论：裁决者的命运由谁裁决？云璃后颈有一道隐形的「星链印记」，这是历代殿主传承的标记，也是她哲学体系的裂缝："如果我能看见所有人的命运，为何看不见自己颈间星链的终点？"这种自我质疑使其区别于传统「全知全能」的神祇形象——她既是命运的编织者，也是被编织的纱线。',
    category: '时空守护者',
    rarity: '神秘',
    bestAgainst: ['所有类型敌人', 'BOSS级敌人', '大规模敌人', '需要强力单体输出的场合', '需要长时间战斗的场合', '拥有强化效果的敌人'],
    worstAgainst: ['无'],
    quote: '你所谓的命运，不过是你对\'必然\'的恐惧与\'偶然\'的渴望交织的幻影。'
   }),
  // 新增植物：晓月
  xiaoyue: createPlantConfig('xiaoyue', {
    name: '晓月',
    cost: 600,
    cooldown: 3000,
    health: 120000,
    damage: 2200,
    attackRange: 99,
    attackSpeed: 550,
    targetSelection: 'closest', // 优先攻击最近的目标
    specialEffect: '时间系和风系双重攻击，对空间属性敌人造成额外200%伤害；拥有「时空织者」血脉，能够感知时间的裂隙；每消灭1个敌人获得一个"时光锚点"，可抵挡一次伤害；每12秒释放一次"月之领域"，清除全屏负面效果并为所有植物提供15%伤害减免，持续8秒；在场时，周围8格内的所有植物获得20%攻击速度提升和15%伤害提升；免疫减速和控制效果；受到攻击时有60%几率闪避；能够在月圆之夜（游戏中随机触发）获得强化，所有属性提升50%，持续30秒；与徐清岚（暗）同时在场时，两人获得30%伤害减免和25%攻击速度提升，形成"时空共鸣"效果；每8秒可以使用一次"时间凝固"，使目标停止行动3秒；新增主动技能："双生时计"，可手动触发，立即对所有敌人造成5000点伤害并减速40%，持续5秒，冷却时间35秒；新增被动技能："月华守护"，每秒恢复自身1.5%最大生命值；新增特性：当生命值低于30%时，获得"时光回溯"，恢复30%最大生命值并清除所有负面效果，每场战斗只能触发一次。',
    description: '晓月诞生于月落之森最古老的银叶精灵部落，天生拥有「时空织者」血脉——浅紫色发丝中流淌着月神的恩赐，精灵耳尖镶嵌着会随月华变色的星辰石。她的敏捷不仅体现在身法上，更能在月圆之夜感知时间的裂隙：当满月升至天顶时，她的修炼速度会随月光强度呈几何级增长，指尖甚至能捕捉到流动的光阴碎片。部落视「时间掌控」为禁忌，长老们认为过度干涉时序会招致混沌。晓月却在16岁那年质疑：「若永恒是静止的虚无，刹那的绽放是否更接近存在的本质？」她带着祖父留下的古董怀表离开森林，在人类世界以甜点师为伪装，通过制作限时赏味的糕点探索「瞬间即永恒」——正如她最擅长的「樱花流心慕斯」，必须在出炉后三分钟内品尝，否则樱花的清甜便会消散，恰如生命中不可复刻的美好。在市集邂逅失明的徐清岚（暗）（徐清岚（暗)吞噬完冥界三使后，进入了失明期——冥界的诅咒）后，晓月的世界观被彻底颠覆。徐清岚（暗）虽看不见月光，却能通过触摸怀表齿轮的震动「听」出时间的韵律：「你的存在，就像秒针与齿轮的相遇——看似偶然的碰撞，却让整个世界开始转动。」两人合作创造出「双生时计」：晓月注入月华之力让钟表在满月夜倒转，徐清岚（暗）则用魔法将倒转的时间凝固为可触摸的「昨日之糖」。这段跨越种族的羁绊，让她领悟到「敏捷」的终极形态不是速度，而是在时光洪流中锚定所爱之人的勇气。她腰间的黑色腰带实为封印着时空裂隙的「缚时索」，每当她竖起大拇指，便是在确认当前时间线的稳定性。而她总在下午茶时微微出汗，并非因为燥热，而是体内月神之力与人间烟火产生的微妙排斥——这份矛盾，暗示着她终将在「守护世界秩序」与「拥抱人间情感」间做出抉择。',
    category: '时空织者',
    rarity: '史诗',
    bestAgainst: ['空间属性敌人', '高伤害敌人', '需要控制的场合', '与徐清岚（暗）配合时效果最佳'],
    worstAgainst: ['空间系魔法', '持续伤害类攻击'],
    quote: '我于满月夜饮尽时光，却在你眼眸里尝到永恒。'
  }),
  // 新增植物：羽尘
  yuchen: createPlantConfig('yuchen', {
    name: '羽尘',
    cost: 150,
    cooldown: 1500,
    health: 300,
    damage: 45,
    attackRange: 3,
    attackRangeType: 'straight',
    attackSpeed: 2000,
    targetSelection: 'closest',
    specialEffect: '低级风属性和木属性植物，对火属性僵尸造成额外100%伤害；每次攻击有20%几率触发"风叶齐飞"，对前方2格内的所有僵尸造成额外伤害；受到火属性攻击时，受到的伤害增加50%；对飞行僵尸造成额外50%伤害；免疫减速效果；每消灭1个僵尸恢复自身3%最大生命值',
    description: '人类世界对于魔法视为异端，视为招摇撞骗，为下九流之末。羽尘出生于当今人类世界第二大帝国的"明"，由于地理环境与天气等原因，"明"国一直被"月"国所压制。羽尘为村落魔法师之子，父亲寄希望于他，希望能传承其衣钵。羽尘本该过着平凡的生活，但随着光暗大战的帷幕，暗影大陆的力量悄悄在人类世界蔓延，为此父亲交给羽尘一些实用的魔法，但好景不长，那天晚上，天空落下一个陨石，正好砸在羽尘所在的村落。只记得，那晚过后，羽尘再也没见到父亲了，并且也丢失了之后的记忆……',
    category: '风属性法师',
    rarity: '普通',
    bestAgainst: ['普通僵尸', '飞行僵尸'],
    worstAgainst: ['火属性僵尸', '高护甲僵尸'],
    quote: '我的路是否就在脚下？'
  }),
  // 新增植物：灵•瑶凝
  lingyaoning: createPlantConfig('lingyaoning', {
    name: '灵•瑶凝',
    cost: 900,
    cooldown: 4000,
    health: 280000,
    damage: 7500,
    attackRange: 99,
    attackRangeType: 'all',
    attackSpeed: 450,
    targetSelection: 'strongest',
    specialEffect: '冰、星、灵三属性攻击，对暗影属性敌人造成额外300%伤害；免疫所有负面效果和控制效果；每次攻击有80%几率触发"冰晶星落"，对目标及周围3格内的所有敌人造成额外1000%伤害并眩晕4秒；每消灭1个敌人获得一个"灵晶护盾"，可抵挡一次致命伤害；每15秒释放一次"冰晶圣殿"，清除全屏负面效果并为所有植物提供25%伤害减免，持续10秒；周围10格内的所有植物受到的冰、星、灵属性伤害提升40%；受到攻击时有85%几率反弹120%伤害；新增主动技能："寒月灵晶诀"，可手动触发，立即对所有敌人造成12000点伤害并附加冰冻效果，冷却时间40秒；新增被动技能："双灵共生"，每秒恢复自身2.5%最大生命值；新增特性：当生命值低于30%时，获得"月霜守护"，免疫所有伤害，持续8秒，每场战斗只能触发一次。',
    description: '昆仑仙域冰晶圣殿圣女瑶凝（右）与灵侍星璃（左），乃是洪荒西昆仑灵气凝结的精灵双生体。瑶凝为先天精灵，由天地间第一缕「太阴寒气」与「庚金之精」融合而生，位列洪荒三千客，执掌西方庚金之气；星璃则是瑶凝证道时以心头血化形的后天精灵，承载其未证道前的记忆碎片，二者共生共存，合称「西昆仑双璧」。\n\n瑶凝修炼《寒月灵晶诀》，操控水行之力与庚金之气，法宝「寒霜灵晶杖」可引九天银河；星璃主修《流光引灵术》，辅助操控空间裂隙，掌后天灵宝「星辰引路灯」。二者身后独角兽月霜为先天灵兽，乃昆仑山脉灵气所化，与瑶凝缔结本命契约。\n\n瑶凝清冷如冰，心怀慈悲，遵循天道法则；星璃活泼灵动，好奇纯真，为瑶凝本我之化身。战斗时瑶凝以长杖布下冰封万里大阵，星璃则以星轨穿梭扰乱敌阵，双灵合力曾于洪荒大战中冰封十万巫族，后隐于昆仑守护西方灵脉。\n\n瑶凝神通庚金裂天可劈开空间，星璃记忆回溯能窥见时空碎片；服饰蓝白渐变象征天地灵气，金色纹路暗合洪荒星图，背景破碎晶体代表洪荒破碎时空，光带与独角兽角的金光则寓意灵脉流转。二者既是昆仑守护者，亦是洪荒冰，星，灵三元素的具象化存在。',
    category: '洪荒古神',
    rarity: '先天灵',
    bestAgainst: ['暗影属性敌人', '高生命值敌人', 'BOSS级敌人', '所有类型僵尸', '拥有强化效果的僵尸'],
    worstAgainst: ['单体爆发'],
    quote: '双灵同辉，冰晶不寒；星璃伴月，大道不孤。'
  }),
  // 新增植物：灵汐
  lingxi: createPlantConfig('lingxi', {
    name: '灵汐',
    cost: 1200,
    cooldown: 5000,
    health: 320000,
    damage: 8500,
    attackRange: 99,
    attackRangeType: 'all',
    attackSpeed: 420,
    targetSelection: 'strongest',
    specialEffect: '时空之力属性攻击，对所有类型敌人造成额外300%伤害；免疫所有负面效果和控制效果；每次攻击有90%几率触发"时序之断"，对目标及周围4格内的所有敌人造成额外1000%伤害并暂停时间3秒；每消灭1个敌人获得一个"时序护盾"，可抵挡一次致命伤害；每15秒释放一次"四时轮转"，清除全屏负面效果并为所有植物提供25%伤害减免，持续10秒；周围10格内的所有植物获得30%攻击速度提升和20%伤害提升；受到攻击时有90%几率反弹120%伤害；新增主动技能："应龙衔尾"，可手动触发，立即对所有敌人造成15000点伤害并眩晕8秒，冷却时间50秒；新增被动技能："时空共鸣"，每秒恢复自身3%最大生命值；新增特性：当生命值低于30%时，获得"时序回溯"，免疫所有伤害，持续8秒，每场战斗只能触发一次。',
    description: '灵汐，先天灵族·时序之主，天地初开时，第一缕晨光穿透混沌，与东海龙气交汇于昆仑之墟，凝结为灵胎。因吸收四时之气而生，故掌天地时序流转之权。"执时如衡，过则倾颓"——认为万物需在时序中各安其位，逆天改命者终将被时间洪流反噬。\n\n灵汐是中立守护者，不介入洪荒之争，独居于"时空城之巅"，监察三界时间线是否偏离正轨。"昨日之我非今日之我，明日之我亦非今日之我。然三我同体，共栖于此刻。"提出时间是非线性的"时空琥珀"，过去、现在、未来同时存在，只是被感知为流动状态。"因在前，果在后，世人皆以为然。殊不知果亦塑因，如应龙衔尾，互为始终。"认为因果是双向缠绕的环，今日之果可能是昨日之因的源头，挑战传统因果律认知。\n\n外貌特征：银灰长发垂至脚踝，发间悬垂三枚菱形玉佩（分别刻有"春""夏""秋""冬"篆文，第四枚常年隐现），额间有淡金色时轮印记。上衣为玄色鲛绡，袖口绣银线流云纹，腰间系月白玉带，悬挂青铜编钟（敲响可调节局部时间流速），双手交叠于"测时仪"上——此器为先天灵根"建木"枝桠所制，盘面刻有天干地支，指针随洪荒时间流转而转动。\n\n伴生异兽：时之应龙（青蓝色龙身，鹿角马面，鬃毛呈霜白色，鳞片闪烁如星屑），能穿梭于时间裂隙，龙瞳可窥见过去未来。周身异象：站立处常有四色光晕轮转（春绿、夏赤、秋金、冬玄），随呼吸节奏变换，代表四时有序交替。\n\n灵汐守护的"洪荒时序轮"出现一道裂痕，此裂痕非外力所致，而是源于未来某个"不存在的时刻"。应龙预言：当裂痕扩大至三分之一时，灵汐将面临终极抉择——要么修补时序轮任由自身存在被抹去（因她是时序的产物），要么放任时间线崩坏，见证洪荒重归混沌后新生。后来，在灵汐抉择时，看到了徐清岚（梦），看到了未来，于是，便欣然离去……',
    category: '时空守护者',
    rarity: '古神',
    bestAgainst: ['所有类型敌人', 'BOSS级敌人', '大规模敌人', '需要强力单体输出的场合', '需要控制效果的场合'],
    worstAgainst: ['无'],
    quote: '应龙衔尾，终始相及。今日种因，明日得果；明日之果，亦塑今日之因。'
  }),
  // 新增植物：离火双生•长离
  lihuoshuangsheng_changli: createPlantConfig('lihuoshuangsheng_changli', {
    name: '离火双生•长离',
    cost: 1300,
    cooldown: 5500,
    health: 350000,
    damage: 9000,
    attackRange: 99,
    attackRangeType: 'all',
    attackSpeed: 400,
    targetSelection: 'strongest',
    specialEffect: '始源之火属性攻击，对所有类型敌人造成额外300%伤害；免疫所有负面效果和控制效果；每次攻击有90%几率触发"离火焚世"，对目标及周围4格内的所有敌人造成额外1000%伤害并眩晕5秒；每消灭1个敌人获得一个"离火护盾"，可抵挡一次致命伤害；每15秒释放一次"双生守护"，清除全屏负面效果并为所有植物提供30%伤害减免，持续10秒；周围10格内的所有植物获得35%攻击速度提升和25%伤害提升；受到攻击时有90%几率反弹150%伤害；新增主动技能："离火焚天"，可手动触发，立即对所有敌人造成18000点伤害并附加燃烧效果，持续20秒，冷却时间60秒；新增被动技能："双生共鸣"，每秒恢复自身3%最大生命值；新增特性：当生命值低于25%时，获得"焚火涅槃"，免疫所有伤害，持续10秒，每场战斗只能触发一次。',
    description: '长离，先天火灵修成的人族形态，洪荒焚天剑冢守护者，执掌天地间第一缕离火，诞生于盘古开天辟地时的混沌火核，因吸收昆仑墟昆仑镜碎片而拥有双生形态——表体为持剑卫道的守护者，里体为蒙眼的离火本源之灵。修行理念：焚尽虚妄，照见真如，认为火焰既是毁灭之力亦是净化之光，以剑为尺丈量洪荒秩序。洪荒立场：中立于洪荒之争，独守上古神殿遗址，却因持有昆仑镜碎片成为量劫关键。双生形态对应现在与未来的叠加态，蒙眼形态能窥见未来灾劫却无法言说，形成"知而不行"的宿命困境。持剑形态每斩出一剑，蒙眼形态便会承受相应业火反噬，提出因果同源，焚因即焚果的悖论性观点。双生形态：表体（持剑者）黑白色裙装配过膝袜，左袖绣离字篆文，剑穗系昆仑镜碎片；里体（蒙眼者）白衣无垢，发丝间悬浮三枚火纹玉珏，蒙眼布条上以血写就不见二字。伴生异象：足踏之处生烬莲，花瓣呈火焰状却不灼伤草木，行走时身后留赤金色轨迹如剑痕划破空间。长剑焚世剑身泛红如熔铁，剑柄缠绕太古雷纹，挥动时剑气化作朱雀虚影，剑鸣能震慑低阶妖魔。长离身负双生劫：当表体完全觉醒离火本源时，里体将彻底消散。在洪荒大战中，她必须选择是守护时空城（维持现状）还是用昆仑镜碎片逆转战局（牺牲自我），其抉择将导致洪荒世界线分裂为秩序永存或新生混沌两种结局。',
    category: '洪荒古神',
    rarity: '古神',
    bestAgainst: ['所有类型敌人', 'BOSS级敌人', '大规模敌人', '需要强力单体输出的场合', '需要控制效果的场合'],
    worstAgainst: ['无'],
    quote: '眼盲者见真，心明者执妄——吾以离火为鉴，照尽洪荒三千虚妄。'
  }),

   // 新增植物：镜花水月·灵汐
   jinghuashuiyue_lingxi: createPlantConfig('jinghuashuiyue_lingxi', {
     name: '镜花水月·灵汐',
     cost: 1400,
     cooldown: 6000,
     health: 380000,
     damage: 9500,
     attackRange: 99,
     attackRangeType: 'all',
     attackSpeed: 380,
     targetSelection: 'strongest',
     specialEffect: '镜像之力属性攻击，对所有类型敌人造成额外300%伤害；免疫所有负面效果和控制效果；每次攻击有90%几率触发"镜花水月"，对目标及周围4格内的所有敌人造成额外1000%伤害并眩晕5秒；每消灭1个敌人获得一个"镜之护盾"，可抵挡一次致命伤害；每15秒释放一次"万象镜宫"，清除全屏负面效果并为所有植物提供30%伤害减免，持续10秒；周围10格内的所有植物获得35%攻击速度提升和25%伤害提升；受到攻击时有90%几率反弹150%伤害；新增主动技能："混沌镜源"，可手动触发，立即对所有敌人造成20000点伤害并附加镜像混乱效果，持续20秒，冷却时间60秒；新增被动技能："镜像共鸣"，每秒恢复自身3%最大生命值；新增特性：当生命值低于25%时，获得"镜碎重生"，免疫所有伤害，持续10秒，每场战斗只能触发一次。',
     description: '先天灵植·绿萼仙莲化形，洪荒三千镜像世界的守护者。天地初开时，昆仑之墟的"太虚幻境"中，第一株映月而生的绿萼莲吸收先天阴阳二气，感"镜花水月"之象而化形。其本体莲台倒映三千世界，花瓣凝结时空碎片。"以镜为道，观物照心"——主张通过映照万物表象来洞悉本质，认为虚实本无差别，执着于真实反落执念。游离于洪荒之外的中立存在，居于"万象镜宫"，既不干预天道运转，亦不参与量劫纷争，仅以旁观者身份记录洪荒变迁。道之镜像："道本无象，因镜而显。三千大道皆为镜像，映照的不过是观者自心"——认为所谓天道法则只是宇宙本质在不同意识中的折射。时空折叠："过去未来，皆在镜中。所谓时间，不过是镜像的连续翻转"——提出时空并非线性流动，而是无数平行镜像的叠加态，可通过"镜转术"在特定节点切换。因果环镜："因是果之镜，果是因之影。善恶报应，不过是镜像的对称显现"——主张因果律是宇宙维持平衡的镜像机制，打破因果将导致镜像破碎（世界崩塌）。人物形象细节核心特征：浅绿色长发中夹杂金色流光（时空之力的具象化），左眸为翡翠色（映照真实），右眸为琥珀色（洞察虚妄），眉心一点朱砂痣凝结先天阴阳鱼印记。服饰法器：上衣：露肩式流云纹仙衣，红纹如血管般缠绕，象征"镜像世界的脉络"。袖套：橙白相间的太极纹袖套，随动作展开时会显现微型星系。法器："流光镜花杖"——顶端镶嵌千年冰晶雕琢的莲花镜，可映照任何存在的本源形态，杖身缠绕的红绸实为时间长河的一缕支流。异象环绕：行走时脚下生莲，每步踏出都会浮现破碎的镜面残影，周身漂浮7面小型古镜，分别对应"生老病死爱恨痴"七情镜像。伴生异兽："蜃龙·望月"——形似九尾白狐却生有龙角的异兽，能吞吐蜃气制造真实幻境，其尾尖托举的青铜古镜可照见三生石上的命数。镜花水月·灵汐的本命莲台封印着"混沌镜源"——这是开天辟地时遗留的第一面镜子，亦是所有镜像世界的本源。当日月无光、天地倾覆之时（洪荒大战末期）。她将面临终极抉择：要么打碎镜源，释放足以重开天地的能量却导致所有镜像世界崩塌；要么守护镜源，任由天道轮回陷入死循环。其命运与三至尊之一的帝俊存在隐秘联系——传说帝俊的"斩仙剑阵"四方阵眼，正是用灵汐莲台的四片花瓣炼化而成，这层因果将迫使她在洪荒量劫中打破中立立场。',
     category: '洪荒古神',
     rarity: '古神',
     bestAgainst: ['所有类型敌人', 'BOSS级敌人', '大规模敌人', '需要强力单体输出的场合', '需要控制效果的场合'],
     worstAgainst: ['无'],
     quote: '镜碎之时，方见真如。世人皆惧虚妄，却不知真实本就是最大的虚妄。'
   }),
   // 新增植物：苍玄
   cangxuan: createPlantConfig('cangxuan', {
     name: '苍玄',
     rarity: '古神',
     cost: 1300,
     cooldown: 5500,
     health: 400000,
     damage: 10000,
     attackRange: 99,
     attackRangeType: 'all',
     attackSpeed: 400,
     targetSelection: 'strongest',
     specialEffect: '青龙之力、本源律者；免疫所有负面效果与控制；每次攻击有90%几率触发"斩妄"，斩断目标的虚妄因果（移除所有强化与增益并造成额外1000%伤害与3秒眩晕）；每12秒释放一次"青螭佩"，使周围6格内的敌人时间短暂停滞3秒；每15秒开启"元初律·校正"，清除全屏负面效果并为所有植物提供30%伤害减免与25%攻击速度提升，持续10秒；被动"秩序与混沌的动态平衡"：场上每存在1个敌方强化单位，自身获得5%伤害提升与5%防御提升，可叠加；对混沌/暗影系敌人造成额外300%伤害；受到攻击时有90%几率反弹150%伤害；每消灭1个敌人获得"青龙护盾"，可抵挡一次致命伤害；主动技能："因果重编"，可手动触发，重置全场敌人的增益与冷却并造成20000点范围伤害，冷却60秒；被动技能："律者守护"，每秒恢复自身3%最大生命值；当生命值低于25%时，触发"秩序闭环"，10秒内免疫所有伤害与控制，每场战斗仅触发一次。',
     description: '苍玄取"苍天之玄，律历之本"之意，洪荒先天生灵·青龙元灵所化，天地法则"执律者"，司掌"秩序与混沌的动态平衡"。诞生于盘古开天辟地后第一缕青龙之气与玄冰之精的交融，因目睹洪荒初期法则崩坏、生灵涂炭，自封"执律者"，以剑为笔、以契约为墨，铭刻天地运行的隐性规律。修行理念："执两用中"——不执着于绝对秩序（如天道规则），亦不纵容混沌无序（如凶兽横行），主张"法则如剑，可斩可护"，认为真正的强大在于理解矛盾的共生性。中立于洪荒各势力，却暗中维系各大族群的力量均衡，曾在洪荒大战前夕修正过十二祖神的部分血脉诅咒。苍玄认为"道"非恒定真理，而是"矛盾的永恒博弈"。她手中的黑色契约书《元初律》记载着洪荒所有"未发生却必然发生"的事件（类平行宇宙记录），她曾言："道如流水，遇方则方，遇圆则圆——非道变，实观者之心变。"她腰间的"青螭佩"可短暂停滞局部时空，但她坚信"时空非线性，而是无数\'现在\'的叠加态"。某次对抗时空魔神时，她留下"昨日之因非今日之果，明日之果或为今日之因"的悖论性言论。苍玄拒绝"因果报应"的宿命论，主张"因果如网，节点可改"。她曾逆天改命救下一只本该陨落的玄鸟，导致后世凤凰一族多出一脉冰凰分支，印证了"因果的可塑性"。外貌：青色龙角并非实体，而是由玄冰寒气凝结的能量体，情绪波动时会泛起不同色阶的蓝光；精灵耳尖悬挂三枚青铜环，对应"过去、现在、未来"三时之刻度。法器：右手契约书《元初律》 ：封面烫金古篆"律"字会随洪荒法则变动而变换形态，内页空白，却能在她指尖浮现需要的法则条文。右腿长剑"斩妄" ：剑鞘上的红色花纹实为封印的混沌之气，出鞘时会发出龙吟，可斩断"虚妄之因果"（如无意义的仇恨链）。异象与伴生：行走时身后常伴随三团青雾，分别化形为小龙、玄鸟、冰蝶，代表"力量、自由、蜕变"；每当她修改法则，天空会出现短暂的"逆序星轨"（星辰短暂倒流）。她发现自己的诞生本身就是"洪荒最大的悖论"——青龙元灵本应在开天辟地时消散，却因某未来存在（疑似她自己）的干预而残留，形成"先有鸡还是先有蛋"的时空闭环。洪荒大战期间，她将面临抉择：是维护时空闭环（确保自身存在），还是斩断因果链（避免未来更大的浩劫）？',
     category: '洪荒古神',
     bestAgainst: ['混沌/暗影系敌人', '拥有强化与增益的敌人', 'BOSS级敌人', '大规模敌人', '需要强力单体输出的场合'],
     worstAgainst: ['无'],
     quote: '混沌生秩序，秩序孕混沌，执两用中者，方见天地心'
   }),
   // 新增植物：青芜
   qingwu: createPlantConfig('qingwu', {
     name: '青芜',
     rarity: '古神',
     cost: 1200,
     cooldown: 5000,
     health: 350000,
     damage: 9000,
     attackRange: 99,
     attackRangeType: 'all',
     attackSpeed: 420,
     targetSelection: 'strongest',
     specialEffect: '自然静谧法则的化身；周围三丈范围内使时间流速减缓，敌方攻击与移动速度降低40%；每20秒触发"静谧结界"，清除全场负面效果并为所有植物提供30%伤害减免，持续10秒；每次攻击有85%几率触发"忧昙绽放"，对目标及周围4格内敌人造成额外800%伤害并短暂减速；每消灭1个敌人获得"静气护盾"，抵挡一次致命伤害；场上因果纠缠过重时（僵尸拥有≥3层增益），自动施放"静观回环"，移除其增益并造成15000点范围伤害，冷却55秒；被动"刹那永恒"：每10秒为全队恢复5%最大生命值；面对工业/机械系敌人时额外造成+200%伤害；免疫所有控制与负面效果。',
     description: '青芜（取"青冥之芜，天地之华"之意），上古草木精灵族，先天灵根"忧昙"化形，洪荒初开时诞生的自然守护者，由昆仑墟下第一株吸收了天地初开时"静气"的忧昙花化形，与洪荒的"静谧法则"共生，是天地间第一缕"沉寂之气"的具象化。"静极生慧，默观天道"，主张以静默之心体悟自然循环，认为万物兴衰皆有定数，强求不如静观其变。中立于各方势力，守护洪荒草木生灵，不主动参与纷争，但在自然法则失衡时会现身干预。认为"道"并非恒定不变的法则，而是如同草木生长般的动态平衡——"道如藤蔓，看似无序，实则循天地脉络而生"；提出"刹那永恒论"，认为每个静默的瞬间都包含着洪荒的过去与未来，"一花一世界，一叶一洪荒，静观者能于刹那见永恒"；主张"因果如环，往复不息"，认为今日之果皆为昨日之因，而静默是解开因果纠缠的唯一方式——"静则明，明则见因果，见则能解"。人物形象细节为蓝色螺旋状双角（象征草木生长的螺旋规律），角上生有细小青纹银灰色长发中夹杂着青色草叶，随风飘动时会洒落微光左眼角下有三点忧昙花纹身，与眉心一点朱砂痣遥相呼应右臂缠绕着活体藤蔓纹身，会随情绪变化而开花或枯萎。身着"青冥幻纱"，以洪荒蛛丝混以月华织成，呈深蓝与青绿渐变，随风飘动时如云雾缭绕。手持"枯荣杖"：主体为雷击桃木，顶端结有三颗永不凋零的紫色忧昙果（象征"过去、现在、未来"），杖尾系着七片不同时期的洪荒古叶，足踏"蹑云履"，以晨露凝结而成，踏地无声，行过时会留下青色花印。现身时周围三丈内会自动陷入绝对静默，连风声都会停止，情绪波动时，发间会绽放忧昙花，花开则时光流速减缓，花落则恢复正常。作为"静谧法则"的化身，却天生拥有"预见未来"的能力，预见的灾难越多，自身的"静气"就越稀薄，逐渐向"动"转化，面临着失去自身存在根基的危机。宿命命题：在洪荒大战后期，预见了洪荒将迎来"永动时代"（即人类崛起后的工业文明），这将彻底打破自然的静默平衡。她必须在"守护自然静默"与"顺应时代变革"之间做出抉择，其选择将决定洪荒草木生灵的未来。其持有的"枯荣杖"中封印着洪荒第一缕"动气"，正是后来引发洪荒大战的导火索之一，而她本人可能是解开洪荒恩怨的关键人物。',
     category: '洪荒古神',
     bestAgainst: ['工业/机械系敌人', '拥有增益效果的敌人', 'BOSS级敌人', '大规模敌人', '需要控制效果的场合'],
    worstAgainst: ['无'],
    quote: '静观众妙，默察兴衰，天地之道，不过枯荣二字'
  }),
  // 新增植物：双生花仙•灵汐
  shuangshenghuaxian_lingxi: createPlantConfig('shuangshenghuaxian_lingxi', {
    name: '双生花仙•灵汐',
    rarity: '古神',
    cost: 1300,
    cooldown: 5500,
    health: 380000,
    damage: 9500,
    attackRange: 99,
    attackRangeType: 'all',
    attackSpeed: 400,
    targetSelection: 'strongest',
    specialEffect: '生灭法则与因果之网的执中者；免疫所有负面与控制；每次攻击有90%几率触发"生灭回环"，对目标及周围4格造成额外1000%伤害，并在左侧形成"死之域"（敌方移动/攻速-40%），右侧形成"生之域"（我方攻速+30%、伤害+20%），持续8秒；每15秒编织一次"往生蝶网"，为全队清除负面并为所有植物提供30%伤害减免，持续10秒，同时引渡范围内被击败敌人的残魂，使其在3秒后爆裂造成范围伤害；周围10格内的我方单位获得"蝶舞祝福"（蓝蝶：治疗5%最大生命；红蝶：灼烧敌人造成持续伤害；灰蝶：清心破妄，移除敌人增益）；受到攻击时有90%几率反弹150%伤害并显化三世因果，使目标后续受到的伤害提升25%，持续10秒；主动技能："蝶道调弦"，可手动触发，重置场上时间节奏并造成20000点范围伤害，冷却60秒；被动技能："执两用中"，每秒恢复自身3%最大生命值；特性：当生命值低于25%时触发"道无常形"，10秒内免疫所有伤害与控制，每场战斗仅触发一次。',
    description: '先天灵根化形·双生花仙（鸿蒙青莲伴生之灵，非神非妖，游离于洪荒之外的先天存在），盘古开天辟地时，混沌青莲碎片坠入洪荒，其莲心一点真灵吸摄天地间"生灭之气"，于昆仑墟万丈冰崖下结出红白双生花。红花聚生之阳气，白花凝死之阴气，花茎缠结处化出人形，发丝间自然生长的幽冥枝（黑色枝条）与往生花（红色花朵），正是生死法则的具象化。"执两用中，化劫为机"——不执于生，不溺于死，认为劫难本身即是天道平衡的显化。其修炼之法需亲历三千红尘劫，每度一劫，幽冥枝便多一缕生机，往生花便增一分寂灭，以此参悟生死转化的玄奥。其为中立调和者。洪荒大战时隐于昆仑墟，却以幽冥枝编织"往生蝶网"，引渡双方战死者残魂入轮回；"道非恒道，是谓蝶道。"灵汐认为天道并非恒定不变的法则，而是如蝴蝶振翅般处于永恒的动态平衡中。她指尖飞舞的彩蝶，每一只都代表一种可能的"道"——蓝蝶象征生道，红蝶象征死道，灰蝶象征中庸之道，而当万蝶齐舞时，便显化出"道无常形"的真谛。"昨日之花，今日之蝶，明日之尘。"她发丝间的幽冥枝具有穿梭时空的特性：向前延伸的枝条能触达未来（花苞未绽），向后缠绕的能回溯过去（花落成泥），而当下的枝条永远绽放着半开的往生花。灵汐曾言："洪荒三千界，不过是我掌中蝶翅的正反面。""因非因，果非果，因果本是缠枝索。"黑色枝条上的倒刺并非束缚，而是"因果显化器"——每刺中一个生灵，便会浮现其三世因果的丝线。灵汐从不主动干预因果，却会将缠绕过紧的因果线轻轻拨开，正如她对女娲所言："娘娘补的是天，我解的是结。"人物形象为手执幽冥枝，自顶心生出，随情绪变化长度，最长可达万丈，能捆缚古神级存在，枝条滴落的汁液可生死人肉白骨，但沾染者需承受三世因果反噬。往生花，共九朵，对应洪荒九重天，花开则天地生，花谢则星辰陨，目前已有三朵半开。踏蝶靴，鞋尖缀有两只琉璃蝶，左脚为"昨日蝶"（可回溯片刻前的时间），右脚为"明日蝶"（能窥见瞬息后的未来），踏空时会留下金色光轨。万蝶朝宗，现身时方圆千里必有彩蝶汇聚，蓝色蝴蝶能治愈伤势，红色蝴蝶可焚灭邪祟，灰色蝴蝶专克心魔，曾以此破了通天教主的"诛仙剑阵"心魔劫。生灭领域，周身三尺内呈现"花开花落"的循环异象——左侧空间草木枯萎（死之域），右侧空间万物生长（生之域），中心处则是永恒的现在。灵汐自身是"生灭同体"的悖论存在：当她完全掌控生之法则时，幽冥枝会化为通天巨木吞噬洪荒生机；当她彻底领悟死之法则时，往生花将凋零为灭世黑莲。这一宿命在龙凤初劫时已被鸿钧道祖预见，曾言："灵汐不死，洪荒不毁；灵汐若死，洪荒必毁。"她将在斩仙阵中以自身幽冥枝为祭，缠住帝俊的斩仙剑，使四剑合一之威延迟三息，为其余人争取一线生机，而这三息也将成为她自身因果线崩断的开端。其发丝间未开的第六朵往生花，花萼上隐约可见"量劫终末"四字，暗示她可能是终结洪荒轮回的关键，却也可能是开启新混沌的引路人。',
    category: '洪荒古神',
    bestAgainst: ['所有类型敌人', 'BOSS级敌人', '大规模敌人', '心魔类敌人', '拥有多层增益的敌人'],
    worstAgainst: ['无'],
    quote: '天道若弓弦，过紧则折，过松则废——我这幽冥枝，便是那调弦的手。'
  }),
  // 新增植物：凝霜
// 新增植物：玄霜
   xuanshuang: createPlantConfig('xuanshuang', {
     name: '玄霜',
     rarity: '古神',
     cost: 1500,
     cooldown: 7500,
     health: 450000,
     damage: 13000,
     attackRange: 99,
     attackRangeType: 'all',
     attackSpeed: 340,
     targetSelection: 'strongest',
     specialEffect: '银霜枪神与蓝白神兽的并行战斗形态；被动"时空灵狐"：每15秒在自身周围触发三维织网领域，使敌方时间/空间相关效果失效并降低其攻速、移速各35%（精英/BOSS降为20%）；主动"霜天裂枪阵"：每22秒对全场施放贯穿枪影，优先打击拥有最高增益层数的敌人，造成1000%伤害并清除其2层增益；"定光梭·停滞"：每65秒在半径8格范围内冻结时间3秒（不影响我方主动技能冷却）；伴生神兽"踏雪"：与玄霜同场时，每12秒对最近的BOSS或强化敌人追加800%寒霜伤害并使其进入"折线时空"（受到的后续伤害+30%，持续10秒）；对时间/空间系敌人+180%伤害；免疫控制、位移与减速。',
     description: '名唤"玄霜"，洪荒罕见的时空灵狐，九尾天狐与先天庚金之气交合所化，觉醒独一无二的"时空道胎"。生于昆仑瑶池冰壁，额间烙印北斗第七星"摇光"星纹，被视为执掌时空秩序的异类。她奉行"逆旅问道"，以动证道，穿梭三千小世界，于战火与轮回中磨砺枪术、体悟因果。玄霜主张"道如枪尖——枪尖所向即为道之所向"，将大道视作可随势而发的实践之术。创立"三维织网说"，将时间理解为过去之线、现在之点、未来之面；腰间"定光梭"可凝固时间流速，因屡次干预大势而背负"篡改天机"的骂名。她游离于诸方势力之外，自称"时空看客"，曾阻止十二金乌同巡、赠仓颉时空符文、洪荒大战冻结诛仙阵，也因此遭帝俊联手封印百年。 形象：银灰长发垂踝，狐耳与太阴星核耳坠，双眸金蓝异瞳；玄黑劲装绣北斗星轨，腰悬七枚"光阴通宝"；武器"霜天裂"以星辰陨铁与不周山断柱炼成，枪挥即起空间震荡；法宝"定光梭"由混沌青莲莲瓣所化，催动可施"时光停滞"；伴生神兽"踏雪"雪白双翼、额间独角，可撕裂时空壁垒，并与玄霜共享生命本源。 命运伏笔：摇光星纹为天道枷锁，每逾矩干预便收紧其命数。未来"量劫"将迫使玄霜于祭封混沌或跳入无回深渊之间作出终局抉择；七枚通宝的光辉对应其七次时空干预——当第七枚熄灭，命运终点亦至。',
     category: '洪荒古神',
     bestAgainst: ['时间/空间系敌人', '拥有强化或增益层数的敌人', 'BOSS级敌人', '大规模战斗'],
     worstAgainst: ['无'],
     quote: '枪尖所向，便是时空的尽头。'
   }),
   ningshuang: createPlantConfig('ningshuang', {
    name: '凝霜',
    rarity: '古神',
    cost: 1400,
    cooldown: 7000,
    health: 420000,
    damage: 12000,
    attackRange: 99,
    attackRangeType: 'all',
    attackSpeed: 360,
    targetSelection: 'strongest',
    specialEffect: '音之法则的先天生灵；被动"寒序律"：场上风雪静止，敌方攻击与移动速度降低30%；主动"笛·调和阴阳"：每25秒对全场施放音律冲击，清除负面效果并使我方获得25%伤害减免，持续8秒；"变调符"：每60秒可短暂回溯3秒战局状态（恢复我方最近损失的生命与位置，不复活阵亡单位）；"因果聆听"：能看见敌方因果纠缠层数，每层使其受到的伤害+6%，最高+60%；对时间/空间系或拥有≥3层增益的敌人额外造成+150%伤害；免疫控制与减速。',
    description: '冰雪精灵（洪荒初雪所化，天地间首个掌握"音之法则"的先天生灵），诞生于盘古开天辟地后第一片飘落的雪花，因吸收九天玄冰之气与昆仑之巅的天籁之音而化形，与洪荒天地的"寒序律"共生。"以乐悟道，以音化境"——认为天地万物皆有其固有频率，笛声可调和阴阳、逆转时空，主张"不争而善胜"的无为修行。中立观察者，不介入洪荒之争、神魔之战，仅以笛声记录洪荒变迁，其居所"万籁窟"藏有自开天以来所有生灵的声音记忆。"道非虚无，乃天地间流动之音律。吾笛所至，便是道之所向。"\n\n凝霜认为"道"并非抽象概念，而是可被感知的声波振动，不同生灵对"道"的理解差异源于其"听觉频率"的局限。"昨日之雪与今日之霜，本是同一朵花的开合。"提出"时空折叠论"——过去、现在、未来如同乐谱上的音符，看似离散实则早已注定排列顺序，而笛声可成为"变调符"，短暂改变局部旋律（如回溯片刻时光）。"因是前世之音，果是今生之韵，吹笛人不过是拨动了早已存在的弦。"主张因果并非线性链条，而是多维交织的音网，生灵的每个选择都是对特定频率的共振回应，凝霜的长笛可"听见"因果纠缠的节点。人物形象细节为发间嵌有三枚菱形冰晶，乃昆仑山上古冰川之核，可随笛声变换音律色泽；所持长笛"寒川"，以极北之地万年玄铁与冰蚕丝炼制，笛孔处萦绕着永不消散的霜雾，吹奏时会自动浮现上古符文；裙摆绣有"周天星斗乐谱"，每颗星辰对应一个洪荒生灵的命数音符。常坐于被白雪覆盖的黑色玄石之上，此石名"听心"，能映照听者内心最纯粹的愿望；吹奏时，方圆千里风雪骤停，仙鹤群会自动排列成"太玄音阵"，龙形云雾随旋律盘旋；发丝与衣袂飘动方向始终与风向相反，暗示其对"常理"的微妙逆反。凝霜的宿命与"昆仑镜"碎片相关——她的笛声中藏有修复昆仑镜的关键音节，但每次吹奏都会加速自身灵体的消散（"以命换音"）。在洪荒大战末期，她将面临抉择：要么保持中立见证洪荒毁灭，要么献祭自身吹奏"回天曲"逆转战局，却会导致时空悖论，使自己从未诞生。其长笛尾端悬挂的蓝色流苏，实为一缕"未生之魂"，暗示她早已处于"既存在又不存在"的叠加态。',
    category: '洪荒古神',
    bestAgainst: ['时间/空间系敌人', '拥有强化效果的敌人', 'BOSS级敌人', '大规模敌人'],
    worstAgainst: ['无'],
    quote: '天地本无音，人心自作声——汝闻风雪呜咽，不过是己心在哭。'
  }),
  // 新增植物：灵汐与赤瞳
  lingxi_chitong: createPlantConfig('lingxi_chitong', {
    name: '灵汐与赤瞳',
    rarity: '古神',
    cost: 1400,
    cooldown: 7200,
    health: 440000,
    damage: 12500,
    attackRange: 99,
    attackRangeType: 'all',
    attackSpeed: 360,
    targetSelection: 'strongest',
    specialEffect: '洪荒双生神使：月伞姬·灵汐与炎刃姬·赤瞳。被动【月伞与异火】：伞开时全队伤害减免12%，白蝶预警提高闪避20%；伞合时自身攻速+18%，对命中的目标附"异火灼烧"6秒（每秒2%最大生命）。主动【双生切换·流光伞/离火斩】：在所在行切换形态。流光伞：前方3格置伞幕，减伤30%并隐匿友方1.5秒；离火斩：对前方3格造成两段斩击并施加"杀气标记"，被标记目标死亡时触发"因果断"清除其召唤物。终极【太极同发】：一路中心生成太极阵4秒，每秒交替触发"月蚀庇护"（免控0.8秒+回复3%生命）与"离火爆燃"（范围伤害并附灼烧），结束对区域敌人施加"序破"2秒（攻防-40%）。',
    description: '月伞姬·灵汐，先天月华所化的神使，执掌洪荒昼夜交替之序。盘古开天辟地时，左眼化作太阳星，右眼化作太阴星。太阴星吸收亿万年混沌元气，凝结出第一缕月之灵识，是为灵汐。"以柔承刚，以静制动"，认为大道至柔如水，月有阴晴圆缺乃是天道循环之理，无需强求圆满。"种因如望月，得果似听潮。月有圆缺，潮有涨落，因果循环自有定数"形象为月白色和服上绣有银色月华纹路，腰间系着黄红格纹蝴蝶结，象征日月交替，流光伞- 伞面由太阴星精华织就，展开时能遮蔽天机，收拢时可化作三尺玉杖。周身常有白色蝴蝶环绕，这些蝴蝶实为月华所化，能预警危险。发间系着红色丝带，额间有红色月轮印记，随月相变化而改变形态。身负"太阴之劫"，当日月同现于天际之时，灵汐将面临自我意识消散的危机。此劫既是她的宿命，也是洪荒天地平衡的关键转折点。\n\n炎刃姬·赤瞳，先天离火所化的神使，执掌洪荒杀伐决断之则。盘古开天时，心脏化作洪荒大地的地核之火，其中最烈的一缕炎气凝结成形，是为赤瞳。"以杀止杀，以战止战"，认为大道至刚如剑，唯有斩断因果才能获得真正的自由。"因果如乱麻，唯有快刀斩之。昨日之因，今日之果，今日之果，明日之因"人物形象细节为红黑相间的劲装，露脐设计展现完美腹肌，腰间别着两把武士刀。赤霄剑- 剑身由地核之火淬炼而成，挥动时能引动九天神火。周身环绕着粉色和蓝色的火焰，这些火焰能焚尽一切虚妄。发间有红色尖角装饰，象征离火之精；左耳戴着三枚青铜耳环，是上古巫族的信物。持有"弑神之刃"，传说此剑能斩杀古神。赤瞳坚信只有用此剑斩断天道束缚，才能让洪荒众生获得真正的自由。但她不知道，这把剑其实是天道用来测试洪荒生灵的工具。双生关系为灵汐与赤瞳本是一体两面，分别代表洪荒世界的阴与阳、柔与刚。两人虽理念不同，却共同维持着洪荒的平衡。当两人合力时，能引动"太极之力"，这股力量足以改写洪荒历史。',
    category: '洪荒古神',
    bestAgainst: ['高强度BOSS'],
    worstAgainst: ['无'],
     quote: '月有阴晴，道无盈亏；剑出无悔，道成则斩。'
  }),
  // 新增植物：灵璇
  lingxuan: createPlantConfig('lingxuan', {
    name: '灵璇',
    rarity: '古神',
    cost: 1450,
    cooldown: 7300,
    health: 430000,
    damage: 12800,
    attackRange: 99,
    attackRangeType: 'all',
    attackSpeed: 360,
    targetSelection: 'strongest',
    specialEffect: '先天星灵族•摇光星君。被动【星轨注道】：每10秒在所在行布下"星轨印"，使敌人攻速与移速-30%（精英/BOSS降为20%），并记录其近4秒受到的伤害；若印记期间阵亡，向最近敌人溢出记录伤害的60%，若目标带有"星痕"则额外触发一次小型星爆。主动【璇玑定星盘】：选择一路中段生成"璇玑点"4秒，范围内我方获得免控与25%减伤，并在持续内每秒回复2%生命；敌方被施加"星痕"与护甲-35%，若其拥有召唤物则沉默2.5秒并打断其召唤。终极【周天星斗•焚天琉璃盏】：以定星盘为引在半径7格内降下星陨与太阳真火，造成三段伤害并附"星爆"持续灼烧（每秒按最大生命3.5%），第三段对精英/BOSS额外造成15%最大生命真实伤害；期间若累积3个"星轨印"在该区域，将在终段追加"摇光定杀"（对区域内最高生命目标再造成8%最大生命穿透伤害）。被动联动【星髓玉册】：每击杀1个携带"星痕"的敌人，获得1层"残页"，至多10层；每层使主动技能冷却-2%且终极真实伤害+0.5%。',
    description: '先天星灵族，执掌北斗第七星「摇光」的星君。混沌初开时，紫微星核逸散的一缕先天星光与太阴精华交融而生，于三十三天外的「璇玑星海」中沉睡万载，直至巫妖量劫时被星辰大阵的波动唤醒。以星轨证天道，以人心补天心——认为天道如星辰运行有常，却需生灵之心的变数来避免僵化，故常年行走洪荒记录生灵悲欢，将其刻入星图。中立于洪荒之争，却暗中以星力庇护大劫中流离的弱小族群。道非恒道，如星轨有定而光痕无常——天道规律如同恒星轨迹恒定不变，但每个生灵的选择会在轨迹上留下不同的光痕，这些光痕的总和构成了道的真意。过去为经，未来为纬，现在为璇玑——手持的定星盘能观测过去（经）与未来（纬）的可能性，但唯有"现在"这个璇玑点可真正拨动命运丝线。因如星种，果似星爆，中间隔着九千次流星的距离——反对简单的因果报应论，认为每个因的成熟需要特定的时空条件，正如恒星坍缩需积累万年能量。人物形象细节：胸口镶嵌紫微星核，能吸收混沌元气化为星力，白色丝袜上的云纹实为上古星图，走动时会随步伐显现不同的星象，右手操控的橙色光球名为「焚天琉璃盏」，内含一缕太阳真火，左手垂下的丝带上绣着二十八宿符文，行走时足尖会绽放星屑，身后自动展开由星光构成的周天星斗步虚词，情绪波动时，发间蝴蝶结会化为北斗七星虚影，左眼下方会浮现代表灾厄的破军纹，以紫微斗数为基础，指尖结印可召唤对应的星辰之力，如"贪狼噬月"、"文曲化气"等星术。星灵族预言显示，她手中的紫微星核将在洪荒大战末期化为灭世星陨，唯有献祭自身神魂才能化解。而她在行走洪荒时已与人类部落有熊氏结下羁绊，面临天道使命与个体情感的终极抉择。其沉睡之地璇玑星海，正是未来洪荒大战时群星列宿神位的本源之地，她的选择将直接影响洪荒量劫的走向，随身携带的星髓玉册，记录着她观测到的108种未来可能性，其中一种正是她以凡人之躯与星核同归于尽的结局',
    category: '洪荒古神',
    bestAgainst: ['召唤系敌人', '控制免疫敌人', 'BOSS级敌人', '大规模战斗'],
    worstAgainst: ['无'],
    quote: '你说天道无情？且看这亿万星辰，哪一颗不曾为守护苍生而燃烧自己'
  }),
   
   // 新增植物：星轨三司
   xingguisansi: createPlantConfig('xingguisansi', {
     name: '星轨三司',
     rarity: '先天灵',
     cost: 1600,
     cooldown: 7000,
     health: 420000,
     damage: 9000,
     attackRange: 99,
     attackRangeType: 'all',
     attackSpeed: 360,
     targetSelection: 'strongest',
     specialEffect: '星瑶·星轨大阵：边界与星道结界，友方防御+30%、投射反弹15%；灵曦·时序调律：友方攻速+25%，敌方移速/攻速-25%，单体时间禁锢2秒（冷却20秒）；墨韵·因果锁链：链接最近敌我各1名单位，转移30%伤害并反弹溢出，可斩断召唤物因果（冷却25秒）；三星聚首阵（终极）：等边三角触发，阵内短时无敌与技能加速（冷却-40%，持续6秒），结束后法则灼烧（虚弱5秒）；阵形被打散时协同减效。',
     description: '以星空为引，司掌”观测-时序-因果“三重法则，三者相辅相成构成洪荒世界的基本运行逻辑。小队标志为三星连环阵，对应紫微星、时光沙漏与因果罗盘的图腾组合。以观测明时序，以时序定因果，以因果证大道。三人分别代表认知世界的三种维度：星瑶观测表象规律，灵曦掌控时间流动，墨韵解构因果本质，共同构成理解洪荒大道的完整认知体系。星瑶布下星轨大阵划定战场边界，以星辰之力构建攻防结界，灵曦操控局部时间流速，为队友创造有利战机，对敌人施加时间禁锢，墨韵编织因果锁链连接敌我双方，转移伤害或反弹攻击。破解上古禁制时，星瑶解读星图坐标，灵曦回溯禁制生成时间，墨韵消除触发禁制的因果关联，形成观测-回溯-解构的黄金三角流程。团队命运羁绊。守护洪荒世界的时序平衡，阻止域外天魔篡改星轨、扰乱时间线、扭曲因果链的阴谋。三人的命运线在巫妖大战前夕出现交汇，成为决定洪荒未来走向的关键变量。星瑶坚信万物皆可预测，墨韵则认为因果网络存在不可观测的混沌节点,试图改变未来的行为本身可能成为导致灾难的原因，陷入观测-干预-更坏结果的循环。三星聚首阵：三人呈等边三角形站位，星瑶引动星辰之力形成穹顶，灵曦以时光之力构建时间泡，墨韵布下因果结界。阵内时间流速与外界隔绝，因果律由三人共同定义，是对抗天道级存在的终极底牌。在洪荒大战中，小队以星轨修正之法避免了十二祖巫与帝俊太一的同归于尽。洪荒量劫前夕，三人分别在昆仑山、东海蓬莱、西岐岐山布下三重大阵，延缓了矛盾的总爆发，其存在本身就是天道的纠错机制，当洪荒世界偏离平衡轨道时，三星异象便会出现在九霄云空。',
     category: '先天灵',
     bestAgainst: ['时空/因果类敌人', 'BOSS级敌人', '多变量混战', '域外天魔'],
     worstAgainst: ['绝对时空冻结', '因果断链机制', '秩序压制场'],
     quote: '星轨昭昭，时序茫茫，因果渺渺——三者同归，是为大道。'
   })
};

// 僵尸配置数据
export const ZOMBIES_CONFIG: Record<ZombieType, ZombieConfig> = {
  su_huai: {
    name: '宿槐',
    health: 120000, // 全面强化：生命值大幅提升
    speed: 0.5, // 全面强化：移动速度提升
    damage: 7000, // 全面强化：攻击力大幅提升
    armor: 12000, // 全面强化：护甲大幅提升
    reward: 25000, // 全面强化：奖励大幅提升
     specialAbility: '暗影护盾：免疫所有负面效果，并反弹150%伤害，每12秒可自动激活；诅咒光环：每秒对周围8格内植物造成500点伤害并降低其攻击力30%、防御力20%；生命吸取：每次攻击回复自身12%最大生命值；暗影契约：可以召唤忠实伙伴"猫教主"、"Vexithra"、"季灾"和"离火"到场上进行战斗，召唤概率为"猫教主"最高（50%），"Vexithra"次之（30%），"季灾"和"离火"较低；当宿槐生命值低于50%时，会同时召唤多名随从僵尸，包括强化版本；与Vexithra存在特殊的灵魂联结：当Vexithra在场时，宿槐的攻击速度提升40%，受到的伤害降低30%，每2秒恢复1%最大生命值；当宿槐在场时，Vexithra的攻击速度提升40%，防御力增加35%，受到伤害时额外触发30%伤害减免效果；灵魂共鸣：场上每存在一个随从僵尸，宿槐的防御力增加20%，攻击力提升12%，移动速度提升5%；暗影腐蚀：对光明大陆的土地造成永久性污染；黑暗升华：随着战斗时间增加，攻击力和防御力持续提升，最多提升50%；暗影爆发：一次性消耗当前15%生命值，对全屏植物造成8000点伤害并附加诅咒效果，冷却时间25秒；新增技能：黑暗屏障，每15秒在周围生成一个黑暗屏障，持续8秒，免疫所有控制效果并降低30%受到的伤害；新增技能：枯萎之力，对3x3范围内的植物造成持续伤害，并使其无法产生阳光，持续5秒；新增特性：宿槐每损失10%生命值，暗影能量将增强10%，提升所有技能效果；新增终极技能：时间停滞，当生命值低于20%时，触发时间停滞，使所有植物停止行动8秒，并对其造成持续伤害，每场战斗只能触发一次。',
           description: '宿槐，暗影世界的绝对统治者，与清鸢本为同源一体的存在。在天地初开的混沌时代，她们共同诞生于世界本源之力，本是同一存在的两面。宿槐代表着停滞与永恒的力量，她坚信只有停止时间的流动，让一切生命静止，才能实现真正的和平与永恒的幸福。\n\n经过全面强化的宿槐，实力达到了前所未有的高度。她的暗影护盾变得更加坚固，能够反弹更多伤害；诅咒光环的范围更广，伤害更高；生命吸取能力更强，使她在战斗中更加持久。她还获得了全新的黑暗屏障和枯萎之力技能，能够更好地保护自己并削弱敌人。最令人恐惧的是她的终极技能"时间停滞"，当她生命值低于20%时，能够使所有植物停止行动，这往往成为战场逆转的关键。\n\n当宿槐与Vexithra同时出现在战场上时，他们的灵魂联结会被进一步强化：宿槐的攻击速度和防御力会得到更大幅的提升，并且获得生命恢复能力；而Vexithra则会获得更强的生存能力和攻击力。这种组合成为了所有植物的噩梦，只有最强大的光明守护者才能有希望抵抗他们的联手进攻。\n\n她的终极目标是停止整个世界的时间流动，将一切生命转化为永恒静止的状态。在她看来，这不是毁灭，而是给予世界真正的"和平"。然而，在她内心最深处，或许还残留着与清鸢同源的记忆，这也成为了她内心最脆弱的部分。',
    difficulty: '极难',
    weakness: ['清鸢', '高伤害植物组合', '光明属性攻击', '群体控制', '优先消灭猫教主和Vexithra以削弱宿槐'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '优先消灭被宿槐召唤出的猫教主和Vexithra，以削弱宿槐的防御、攻击力和攻击速度，然后集中所有火力攻击宿槐，利用清鸢的光明力量持续输出。注意防范她的暗影护盾和黑暗屏障，及时清除她的诅咒光环效果。当宿槐生命值低于20%时，做好应对时间停滞技能的准备。',
    category: '暗影女王',
    type: 'special',
    quote: '生命，只有在停滞不前的时间中，才能实现永恒的幸福。'
  },
  cat_leader: {
    name: '猫教主',
    health: 15000, // 增强：生命值提升
    speed: 0.8, // 增强：移动速度提升
    damage: 1200, // 增强：攻击力提升
    reward: 3000, // 增强：奖励提升
     specialAbility: '快速移动：拥有比普通僵尸更快的移动速度；暗影守护：当宿槐在场上时，猫教主获得30%伤害减免；暗影协作：每消灭一个植物，猫教主会为宿槐恢复800点生命值；忠实伙伴：只会被宿槐召唤，对宿槐绝对忠诚；黑暗共鸣：与宿槐产生共鸣，提升彼此的战斗能力；暗影追踪：能够锁定并优先攻击脆弱的植物；新增被动技能：猫之敏捷，受到攻击时有40%几率闪避；新增技能：暗影冲刺，短时间内大幅提升移动速度，可穿透植物防线',
      description: '猫教主是宿槐最忠实的追随者，也是她在堕落前最喜爱的宠物伙伴。当宿槐还是精灵公主"明月"时，这只可爱的小猫就陪伴在她身边。然而，随着宿槐的堕落，小猫也被黑暗力量扭曲，变成了如今这副半猫半僵尸的诡异形态。它有着黑色的毛发、红色的眼睛和锋利的爪子，行动极为敏捷，能够迅速穿梭于战场之上。它对宿槐有着绝对的忠诚，甚至愿意为她牺牲自己的生命。值得注意的是，它对曾经的自己——"善•猫教主"有着特殊的敌意，会优先攻击对方。',
    difficulty: '中等',
    weakness: ['普通攻击植物', '减速效果', '与宿槐分离后实力会减弱'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '优先清理被宿槐召唤出的猫教主，以削弱宿槐的防御和攻击力，同时减少它们为宿槐恢复的生命值',
    category: '暗影使者',
    type: 'fast',
    quote: '喵呜~主人的命令，绝对服从！'
  },
  ji_zai: {
    name: '季灾',
    health: 20000, // 增强：生命值提升
    speed: 0.6, // 增强：移动速度提升
    damage: 1500, // 增强：攻击力提升
    reward: 4000, // 增强：奖励提升
    armor: 3000, // 增强：护甲提升
     specialAbility: '暗影领域：每12秒生成一个暗影领域，范围内的植物攻击力降低50%，防御力降低30%，持续10秒；虚弱诅咒：每次攻击有40%概率使目标植物的防御力降低40%，持续6秒；生命汲取：每次攻击恢复自身15%造成的伤害；暗影之盾：免疫减速和控制效果；暗影亲和：当宿槐在场上时，季灾获得35%伤害减免和20%移动速度加成；极致的暗：对光明属性的植物造成额外150%伤害；新增被动技能：黑暗侵蚀，对周围植物持续造成腐蚀伤害；新增技能：暗影漩涡，召唤一个黑暗漩涡，吸引周围植物并降低其防御',
     description: '在暗影世界最深处的冥渊之底，存在着一对古老的孪生兄弟——季灾与离火。他们是暗影世界最原始的力量象征，季灾代表"极致的暗"，离火代表"极致的火"，共同维持着暗影世界的力量平衡。\n\n季灾是两兄弟中更为内敛的一个，他浑身包裹在黑色的斗篷中，面容被金色的神秘符咒完全遮蔽，只露出一双闪烁着幽光的眼睛。他性格阴郁沉默，不喜欢与其他僵尸交流，总是独自沉浸在对黑暗魔法的研究中。他尤其擅长削弱类法术，能够在不知不觉中降低敌人的战斗力，让对手在绝望中慢慢崩溃。\n\n当宿槐成为暗影女王后，季灾出于对强大力量的敬畏选择效忠于她，成为她的首席谋士和战略专家。他为宿槐制定了许多精妙的战术，帮助暗影大军在与光明大陆的战争中取得了多次胜利。季灾的存在对植物防线构成了巨大威胁，他能够在战场上布置各种削弱性的黑暗领域，让整个植物防线的战斗力逐渐下降，最终陷入崩溃。\n\n值得注意的是，季灾与离火虽然是孪生兄弟，但两人的性格和战斗风格截然不同。季灾更喜欢用智谋和削弱敌人的方式取得胜利，而离火则更倾向于用强大的破坏力直接摧毁敌人。然而，当这对兄弟联手时，他们的力量会变得更加强大，形成一种奇特的平衡，让对手难以应对。',
    difficulty: '较难',
    weakness: ['清鸢', '高伤害植物', '光明属性攻击', '净化效果', '优先集火'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '优先消灭季灾以避免其持续削弱植物能力，注意净化他的暗影领域和诅咒效果',
    category: '暗影使者',
     type: 'special',
     quote: "时间啃食着一切，就有我来终结吧"
  },
  li_huo: {
    name: '离火',
    health: 18000, // 增强：生命值提升
    speed: 0.7, // 增强：移动速度提升
    damage: 1200, // 增强：攻击力提升
    reward: 3500, // 增强：奖励提升
    armor: 2000, // 增强：护甲提升
     specialAbility: '火焰领域：每15秒生成一个火焰领域，范围内的僵尸获得35%攻击力提升和25%移动速度提升，持续12秒；燃烧之魂：每次攻击使目标植物燃烧，每秒受到相当于自身攻击力20%的额外伤害，持续4秒；生命强化：每消灭一个植物，周围6格内的所有僵尸恢复30%最大生命值；火焰亲和：当宿槐在场上时，离火获得30%攻击力提升和30%生命恢复速度加成；极致的火：对冰系植物造成额外200%伤害；新增被动技能：火焰不灭，受到伤害时有30%几率免疫并反弹伤害；新增技能：火焰风暴，召唤一道火焰风暴，对范围内植物造成持续伤害',
     description: '离火是季灾的孪生兄弟，作为"极致的火"的化身，他与季灾形成了鲜明对比。离火浑身燃烧着幽紫色的暗影火焰，即使在黑暗中也显得格外醒目。他有着红色的长发和燃烧着火焰的眼睛，身着由暗影火焰编织而成的战甲，手中握着一把能够喷射出紫色火焰的长剑。\n\n与季灾的阴郁沉默不同，离火性格火爆直接，喜欢用强大的力量碾碎敌人。他享受战斗的刺激，总是渴望与强大的对手交锋。他擅长各种强化型火焰法术，能够大幅提升己方僵尸的战斗力，甚至可以让他们在短时间内获得惊人的力量。当宿槐成为暗影女王后，离火出于对战斗的渴望和对强大对手的期待而加入了她的阵营，成为她最强大的前线指挥官之一。\n\n离火对冰系植物有着特殊的仇恨，这源于他与冰系守护者之间的一段往事。在一次与光明大陆的战斗中，离火被一名强大的冰系守护者击败，险些丧命。虽然他最终侥幸逃脱，但这段屈辱的经历让他对冰系力量产生了深深的仇恨。从那以后，每当他在战场上遇到冰系植物，都会优先攻击它们，试图用自己的火焰力量将它们彻底摧毁。\n\n尽管离火性格火爆，但他对自己的孪生兄弟季灾却有着深厚的感情。两人虽然性格迥异，但在战斗中却配合默契，能够发挥出1+1>2的强大力量。当这对兄弟联手时，他们会形成一种奇特的平衡，让对手难以应对。',
    difficulty: '较难',
    weakness: ['清鸢', '高伤害植物', '冰系植物', '净化效果', '优先集火'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '优先消灭离火以避免其持续强化僵尸能力，注意避开他的火焰领域，冰系植物对他有额外效果',
    category: '暗影使者',
     type: 'special',
     quote: "来战斗吧，季灾，我们一起终结这个世界"
  },
  vexithra: {
    name: 'Vexithra',
    health: 45000, // 全面强化：生命值大幅提升
    speed: 0.9, // 全面强化：移动速度大幅提升
    damage: 2800, // 全面强化：攻击力大幅提升
    armor: 6500, // 全面强化：护甲值大幅提升
    reward: 12000, // 全面强化：阳光奖励大幅提升
    specialAbility: '暗影狂怒：每次攻击有70%几率触发额外伤害，伤害值为自身攻击力的100%；黑暗契约：在场时，周围8格内的所有僵尸攻击力提升30%，防御力提升25%，移动速度提升15%；致命追击：当生命值低于40%时，移动速度提升70%，攻击力提升50%，免疫所有负面效果；不死传说：击败后有40%几率复活，恢复50%生命值；暗影收割：每消灭一个植物，恢复自身10%最大生命值；对清鸢造成额外300%伤害；与宿槐的灵魂联结：当宿槐在场时，Vexithra的攻击速度提升30%，防御力增加25%，受到伤害时获得额外20%伤害减免；当Vexithra在场时，宿槐的攻击速度提升25%，受到的伤害降低20%；免疫减速、控制和减益效果；死亡时对周围5格内的所有植物造成3000点伤害并附加暗影诅咒；暗影之躯：每15秒获得一次暗影护盾，可抵挡一次致命攻击；暗影冲锋：每30秒可以发动一次暗影冲锋，瞬间移动到最前方的植物位置并对周围造成范围伤害；作为宿槐最信赖的副官，Vexithra在宿槐的召唤列表中优先级仅次于猫教主，召唤概率为30%',
    description: '在光明与暗影尚未彻底对立的年代，Vexithra曾是人类世界中最耀眼的战士。她凭借无与伦比的战斗天赋和坚定的意志，击败了无数威胁人类安全的怪物，被人们尊称为"战神"。然而，随着时间推移，对力量的渴望逐渐吞噬了她的初心，她开始质疑现有秩序，认为只有获得更强大的力量才能真正保护人类。\n\n为了追求终极力量，Vexithra踏上了寻找传说中光明守护者"清鸢"的旅程。当她终于站在清鸢面前，请求获得光明之力时，却遭到了拒绝。清鸢告诉她，真正的力量不是来自外部的赐予，而是内心的平静与正义。被拒绝的耻辱和愤怒彻底扭曲了Vexithra的心灵，她将这一切归咎于清鸢的傲慢和整个世界的不公。\n\n在一次与强大魔物的战斗中，Vexithra身受重伤，生命垂危。就在此时，暗影女王宿槐出现在她面前，向她伸出了援手。宿槐向Vexithra展示了暗影世界的力量，并告诉她，只有打破现有的光明秩序，才能获得真正的自由和力量。被仇恨蒙蔽双眼的Vexithra接受了宿槐的邀请，自愿放弃人类身份，成为了暗影世界的战士。\n\n如今的Vexithra已完全堕落为暗影的化身，她的力量得到了前所未有的强化。她身着黑色皮革战甲，长发如墨，眼瞳中燃烧着紫色的邪火。她的战斗风格既保留了人类时期的精湛技巧，又融入了暗影之力的诡异和致命。她与宿槐建立了特殊的灵魂联结，成为宿槐最信赖的副官之一，在宿槐的召唤列表中优先级仅次于猫教主，召唤概率为30%。\n\n当宿槐和Vexithra同时出现在战场上时，他们的灵魂联结会被激活：宿槐的攻击速度和防御力会显著提升，而Vexithra则会获得更强的生存能力和攻击力。这种组合成为了所有植物的噩梦，只有最强大的光明守护者才能有希望抵抗他们的联手进攻。\n\n经过全面强化的Vexithra，不仅拥有了更强大的个人战斗力，还获得了更丰富的暗影能力，包括暗影护盾、暗影冲锋和更强大的团队增益效果。她的复苏能力也得到了显著提升，让她成为了植物防线最致命的威胁之一。',
    difficulty: '极难',
    weakness: ['清鸢', '高伤害植物组合', '光明属性攻击', '优先集火', '群体控制'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: 'Vexithra拥有极高的伤害和生命值，并且有高概率复活，建议使用清鸢进行克制，并配合多个高伤害植物进行集火攻击。注意防范她的暗影冲锋和暗影护盾能力，及时清除被她强化的其他僵尸。同时，Vexithra与宿槐存在灵魂联结，优先消灭宿槐可以削弱Vexithra的能力，反之亦然',
    category: '暗影使者',
     type: 'special',
     quote: "老大，请给予我更强大的力量吧"
  },
  xuqinglan_dark: {
    name: '徐清岚（暗）',
    health: 50000, // 高生命值
    speed: 0.8, // 较快的移动速度
    damage: 3000, // 高攻击力
    armor: 7000, // 高护甲值
    reward: 18000, // 高额阳光奖励
    specialAbility: '极致之火：每次攻击释放黑暗火焰，对目标及周围1格内的所有植物造成伤害，并附带燃烧效果，每秒造成相当于自身攻击力30%的额外伤害，持续5秒；黑暗侵蚀：对光明属性的植物造成额外250%伤害，对清鸢和徐清岚（魔法少女）造成额外300%伤害；暗影护盾：每15秒获得一次暗影护盾，可免疫一次致命攻击并反弹100%伤害；黑暗共鸣：当季灾或离火在场时，获得30%攻击力提升和25%防御力提升，同时获得每秒500点生命恢复；死亡时触发黑暗爆发，对周围3格内的所有植物造成5000点伤害并降低其攻击力30%，持续10秒，同时为其他在场僵尸恢复20%最大生命值；黑暗领域：每20秒在场上生成一片黑暗领域，持续8秒，领域内的僵尸获得25%移动速度提升和20%伤害减免，植物攻击速度降低40%；拥有极高的元素魔法天赋，受到黑暗力量加持后更为强大，能够操控死亡和毁灭的力量。',
    description: '在光明与黑暗对决的前夕，暗影世界的首席谋士"季灾"通过神秘的星象占卜，预感到一个足以改变战局的变数正在光明大陆出现—那就是正在修习本源魔法的徐清岚。为了消除这个潜在的威胁，季灾决定亲自出手。\n\n在一个月黑风高的夜晚，季灾偷偷潜入了徐清岚的修炼之地。他利用暗影魔法制造出了徐清岚内心最深处的恐惧幻象—她的家人被黑暗力量所困，她的朋友在痛苦中挣扎。当徐清岚沉浸在冥想状态时，季灾发动了致命的偷袭，重伤了毫无防备的她。\n\n在极度的恐惧和痛苦中，徐清岚内心的那丝孤寂和迷茫被无限放大。黑暗力量乘虚而入，逐渐吞噬了她的意识和灵魂。当她再次醒来时，她的眼睛已变成了血红色，曾经纯净的魔法能量也被黑暗所污染。她成为了"徐清岚（暗）"—一个被黑暗力量彻底控制的强大战士。\n\n在之后的光暗大战中，"徐清岚（暗）"展现出了令人恐惧的力量。她能够操控黑暗火焰焚烧一切光明，她的存在让植物们感到了前所未有的绝望。然而，在她灵魂的最深处，或许还残留着一丝对光明的记忆，等待着被救赎的那一天……',
    difficulty: '极难',
    weakness: ['光属性', '刺客类型植物', '治疗系植物', '清鸢', '善•猫教主'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '优先使用光属性植物进行克制，清鸢和徐清岚（魔法少女）对其有额外伤害效果；配合刺客类型的高伤害植物进行快速打击，同时注意治疗系植物的保护，避免被其极致之火快速消灭；当"徐清岚（暗）"释放黑暗领域时，尽快使用清鸢的净化技能清除；注意分散种植植物，避免被其范围攻击一次性摧毁多个植物。',
    category: '暗影使者',
    type: 'special',
    quote: '光明，不过是脆弱的谎言。黑暗，才是永恒的真相。'
  },
// 新增僵尸：Alibi
   alibi: {
     name: 'Alibi',
     health: 12000,
     speed: 0.75,
     damage: 1200,
     reward: 2000,
     armor: 1200,
     specialAbility: '暗影行走：在黑暗环境中移动速度提升30%，攻击力提升20%；混乱诅咒：每次攻击有30%几率使目标植物陷入混乱状态，持续3秒，混乱期间植物攻击自己的同伴；暗属性亲和：对光属性植物造成额外150%伤害；净化抗性：对净化效果有20%的抵抗几率；游离之魂：不会被宿槐召唤，可自由行动，不受常规僵尸控制机制限制；受到光属性攻击时，移动速度降低15%，持续3秒；受到净化效果时，攻击力降低10%，持续4秒；特殊技能：时间停滞，每12秒可以使自身周围3格内的植物停止攻击1秒，同时自身进入无敌状态；新增特性：每当有其他僵尸被消灭时，Alibi会吸收其残留的暗影能量，提升10%攻击力，可叠加5层；新增技能：暗影突袭，每30秒可以发动一次，瞬间移动到随机一个植物后方并发动一次强力攻击',
     description: 'Alibi是暗影大陆中最独特的存在之一，一个游离于常规僵尸体系之外的行尸。他诞生于暗影大陆最阴暗的角落，那里曾经是一片繁荣的文明，但在暗影能量的侵蚀下沦为一片废墟。Alibi是那个文明最后的幸存者，也是其最悲惨的见证者。他拒绝被宿槐直接控制，选择在战场上自由行动，仿佛在寻找着什么失去的东西。',
     difficulty: '中等',
     weakness: ['光属性攻击', '净化效果', '高伤害植物', '群体控制'],
     appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
     strategy: '优先使用光属性植物攻击Alibi，使用净化效果抵消他的混乱诅咒，集中高伤害植物快速消灭他，避免被他的时间停滞技能影响防御节奏；注意防范他的暗影突袭技能，确保防线没有明显薄弱环节；由于他会吸收其他僵尸死亡时的能量，应优先解决Alibi再处理其他僵尸',
     category: '暗影使者',
     type: 'normal',
      quote: '我们被困在时间里，但时间本身也在消逝'
    },
  // 新增僵尸：秋月
  qiuyue: {
    name: '秋月',
    health: 25000,
    speed: 0.6,
    damage: 1800,
    reward: 6000,
    armor: 4000,
    specialAbility: '命运伞：每15秒生成一个命运伞领域，范围内的所有僵尸获得25%伤害减免和20%移动速度提升，持续10秒；节气轮转：每次攻击有50%几率触发节气轮转效果，根据当前月份获得不同增益（春：生命恢复，夏：攻击力提升，秋：防御力提升，冬：速度提升）；命运不可知：受到致命伤害时有30%几率触发命运回溯，回到5秒前的状态并恢复50%生命值，但会进入虚弱状态3秒；与空间之力对立：受到空间属性攻击时，受到的伤害增加50%；生性善良：对植物的攻击有20%几率因同情心而犹豫，伤害减半；随身携带的鎏金错银节气罗能感知时间流转，提前预警危险；作为命运神殿的长老，她可以感知到植物的部署意图，提前规避危险区域；每消灭一个植物，会陷入短暂的自责，降低移动速度10%，持续2秒',
    description: '秋月，暗影大陆命运神殿的长老，拥有执掌命运的能力，修习命运之轮的衍生之力—命运伞。她眉间有三瓣银桂胎记，右手腕七枚月牙形旧疤，随身携带鎏金错银节气罗，发如凝霜，眸含星霜，冰肌玉骨，总是撑着油纸伞立于圆月下，两旁桂花飘零，秋风萧瑟。\n\n命运神殿是命运之轮存在于暗影大陆的残存力量，其成员并未常出现于世间，通常也不会参与战争，而是默默处理大陆间的一些试图改变走向之事，以维持大陆的正常运行。秋月作为神殿的长老，拥有着至善的同情心，但也因此经常做错事。她的命运不可知，似乎连命运之轮也无法完全掌控她的未来。\n\n虽然身处暗影大陆，但秋月内心依然保持着一份善良。她并不喜欢战争和杀戮，却又不得不履行自己作为命运神殿长老的职责。这种矛盾的心理让她经常陷入痛苦和挣扎之中。在战斗中，她有时会因为同情心而对植物手下留情，但又会因为自己的职责而继续战斗。这种复杂的性格让她成为了暗影大陆上最独特的存在之一。\n\n秋月的命运伞不仅是她的武器，也是她感知命运的工具。通过命运伞，她能够操控命运之力，为自己和同伴提供保护和增益，同时也能感知到危险的来临。然而，这种强大的力量也让她付出了代价——右手腕上的七枚月牙形旧疤就是她与命运之力抗衡所留下的印记。',
    difficulty: '较难',
    weakness: ['空间之力', '光明属性攻击', '高伤害连击', '优先集火', '控制技能'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '优先使用空间属性植物攻击秋月，她对空间之力有额外的弱点。注意防范她的命运回溯技能，在她生命值较低时保持足够的火力输出。利用高伤害连击植物快速解决她，同时注意控制技能的使用可以有效限制她的行动。秋月的命运伞领域会为周围僵尸提供增益，应尽快破坏这个领域效果。',
    category: '命运使者',
    type: 'special',
    quote: '世间应充满爱，但我要如何做，我也不知道'
  },
  // 新增僵尸：山桃
  shantao: {
    name: '山桃',
    health: 25000,
    speed: 0.6,
    damage: 1800,
    reward: 6000,
    armor: 4000,
    specialAbility: '木属性攻击，擅长使用桃花相关的技能；受到火属性攻击时，受到的伤害增加50%；在桃树下时，移动速度和攻击力提升30%；每15秒召唤一次"桃花源"，范围内的僵尸获得20%伤害减免和15%移动速度提升，持续8秒；能够操控桃花的力量，对植物造成持续伤害；拥有特殊的时空之力，能够在短时间内预测植物的行动；死亡时释放大量桃花，对周围3格内的植物造成2000点伤害并附加减速效果；对光明属性的植物造成额外150%伤害；每消灭一个植物，恢复自身10%最大生命值；使用桃花护符，免疫一次致命伤害',
    description: '一个精致美丽的少女，粉色眼，头别琉璃桃花簪，身着桃花流苏裙，粉色的长发，手捻桃花，在桃树下，阳光洒在她的脸上。其居住在神秘时空城"时空核心"，时空城并无时间概念，不参与大陆间的战争。',
    difficulty: '较难',
    weakness: ['火属性', '光明属性', '高伤害植物', '优先集火'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '优先使用火属性植物攻击山桃，她对火属性有额外的弱点。注意防范她的桃花源技能，尽快集火消灭她。利用光明属性植物增强对她的伤害。',
    category: '时空使者',
    type: 'special',
    quote: '三月的信笺揉成团，春风一哄，枝头便炸开粉红的暄言'
   },
   // 新增僵尸：宪
   xian: {
     name: '宪',
     health: 30000,
     speed: 0.6,
     damage: 1800,
     reward: 6000,
     armor: 3000,
     specialAbility: '无元素属性；身体羸弱；怕光；人类世界的现任统治者，集齐吃喝玩乐和励精图治，矛盾集合体；在用兵上有极其强大的天赋；建造各种奇形怪状的雕像，奇怪的符文，并为其编写相关文献，在世界传播，为其建教；完成统一后，慢慢失去了战斗的乐趣，开始了其奇怪的行为；在建造的建筑里的时间越来越长',
     description: '人类世界的现任统治者，集齐吃喝玩乐和励精图治，矛盾集合体，宪从小便跟着父亲治理帝国，国号为月，有秘闻相传，"宪"与暗影大陆有联系，所以才能统一周围国家，形成大一统。"宪"在用兵上有极其强大的天赋，在很短的时间内完成父亲的遗愿，再后来，其建造各种奇形怪状的雕像，奇怪的符文，并为其编写相关文献，在世界传播，为其建教。"宪"在完成统一后，慢慢失去了战斗的乐趣，开始了其奇怪的行为，慢慢地增加在其建造的建筑里的时间……',
     difficulty: '较难',
     weakness: ['光属性', '高伤害植物', '优先集火'],
     appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
     strategy: '优先使用光属性植物攻击宪，他对光有特殊的弱点。注意防范他的特殊能力，尽快集火消灭他。',
     category: '人类统治者',
     type: 'special',
     quote: '救我'
   },
  // 新增僵尸：时裂·灵汐
  shilie_lingxi: {
    name: '时裂·灵汐',
    health: 400000,
    speed: 0.6,
    damage: 12000,
    reward: 30000,
    armor: 15000,
    specialAbility: '空间系攻击，操控时空之力；对所有类型敌人造成额外300%伤害；免疫所有负面效果和控制效果；每次攻击有95%几率触发"时空混乱"，对目标及周围5格内的所有敌人造成额外1200%伤害并眩晕6秒；每消灭1个敌人获得一个"时空护盾"，可抵挡一次致命伤害；每20秒释放一次"时间倒错"，清除全屏负面效果并对所有敌人造成8000点伤害；周围12格内的所有敌人受到的空间系伤害提升50%；受到攻击时有90%几率反弹150%伤害；新增主动技能："终焉时毒"，可手动触发，立即对所有敌人造成15000点伤害并附加"终焉时毒"效果，持续15秒，冷却时间60秒；新增被动技能："时空侵蚀"，每秒恢复自身3%最大生命值；新增特性：当生命值低于20%时，获得"时轮崩解"，免疫所有伤害，持续10秒，每场战斗只能触发一次。',
    description: '异化先天灵族·时空解构者，原初灵汐在修补洪荒大战造成的时间裂隙时，被混沌深处溢出的"终焉时毒"侵染。银灰长发化为紫黑，应龙蜕变为灾厄形态，成为行走的时空崩坏之源。"旧序不死，新道不生。时轮已锈，当以血火淬炼。"主张彻底摧毁现有时间线，在废墟之上建立不受天道束缚的"自由时空"。主动撕裂三界时间线，释放被封印的"旧日时空碎片"，试图颠覆鸿钧定下的天道秩序。"时间本无秩序，所谓时序，不过鸿钧为巩固统治编织的谎言。"提出时空本质是"无限可能性的叠加态"，被感知为线性流动是天道施加的认知囚笼。"因可改，果可塑，何须敬畏？今日之因，明日可焚；明日之果，今日可噬。"主张通过暴力干预彻底切断因果链，认为强者应成为因果的主宰而非奴隶。紫黑长发如蛇般扭曲，额间时轮印记碎裂成暗红色裂纹，双瞳呈暗紫色，左脸有三道时空侵蚀造成的黑色纹路。暗红长袍多处撕裂，露出苍白皮肤，衣料上凝结着时空乱流形成的紫黑色冰晶。左手持"碎时仪"（原测时仪异化产物，盘面崩裂，指针倒转，边缘缠绕锁链）腰间悬挂青铜编钟已锈蚀变形，敲响时会引发局部时空震荡。伴生异兽：终焉应龙（黑鳞红纹，鹿角断裂，龙瞳燃烧幽冥之火，翼膜布满时空裂缝，飞行时会留下黑色轨迹）。周身异象：站立处地面龟裂，溢出紫黑色时空瘴气，接触者会被卷入记忆碎片幻境；身后废墟中漂浮着破碎的时钟齿轮，逆向旋转。时裂灵汐体内的"终焉时毒"正在侵蚀原初灵汐的本源，二者共享记忆却立场对立。她试图找到"时空奇点"（传说中天地初开时的第一缕时间），将其污染为"混沌时核"，彻底改写洪荒时间线。而原初灵汐必须在"杀死异化自我"与"被同化"之间做出抉择，这场同体之战将决定三界是重归秩序还是永陷混沌。但最后"徐清岚（梦）"给予"灵汐"大道的帮助，助其找到方法，封印了"时裂·灵汐"。',
    difficulty: '极难',
    weakness: ['无'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '时裂·灵汐是非常强大的僵尸，拥有极高的生命值和攻击力，还能操控时空之力。建议使用多个高伤害植物组合进行集火攻击，同时注意防范她的"终焉时毒"和"时轮崩解"技能。由于她没有明显弱点，需要消耗大量火力才能击败她。',
    category: '时空城',
    type: 'special',
    quote: '鸿钧定序，吾便逆序；天道划界，吾便破界。这洪荒，该换种活法了。'
  },
  // 新增僵尸：龙尊忌炎
  longzunjiyan: {
    name: '龙尊忌炎',
    health: 450000,
    speed: 0.6,
    damage: 13000,
    reward: 35000,
    armor: 18000,
    specialAbility: '冰属性攻击，操控玄冰之力；对所有类型敌人造成额外300%伤害；免疫所有负面效果和控制效果；每次攻击有95%几率触发"玄冰冻结"，对目标及周围5格内的所有敌人造成额外1200%伤害并冻结4秒；每消灭1个敌人获得一个"玄冰护盾"，可抵挡一次致命伤害；每20秒释放一次"极寒领域"，清除全屏负面效果并对所有敌人造成10000点伤害；周围12格内的所有敌人受到的冰属性伤害提升60%；受到攻击时有90%几率反弹150%伤害；新增主动技能："玄冰风暴"，可手动触发，立即对所有敌人造成18000点伤害并附加冰冻效果，持续20秒，冷却时间60秒；新增被动技能："极寒之心"，每秒恢复自身3%最大生命值；新增特性：当生命值低于20%时，获得"冰龙守护"，免疫所有伤害，持续12秒，每场战斗只能触发一次。',
    description: '在"道衍九界"的洪荒体系中，北方玄冰之域由「冰原龙尊」忌炎镇守。这片被永恒暴风雪笼罩的领域，天空流淌着蓝绿色的极光龙脉，大地覆盖着万年不化的玄冰，每一块冰晶都凝结着上古哲思——"极寒生极热，至静蕴至动"。龙尊忌炎是元素法则的具象化存在，其蓝灰色长发中封存着三千年前冰封的星河倒影，背后龙形虚影实为"玄冰道韵"的显化。当他握剑时，风雪会停止流动，飞鸟会悬停于空，这并非时间静止，而是万物在绝对理性中回归本源。力量与节制：龙尊的双剑分别象征"破"与"守"，左剑斩断虚妄，右剑守护真实，却永远无法同时挥舞。存在与虚无：玄冰之域的生灵相信"冰封即永恒"，而龙尊却在每一次呼吸间让亿万吨冰川消融又重生。',
    difficulty: '极难',
    weakness: ['时间系', '火系'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '龙尊忌炎是非常强大的古神级僵尸，拥有极高的生命值和攻击力，还能操控玄冰之力。建议使用时间系和火系植物进行克制，同时注意防范他的"玄冰风暴"和"冰龙守护"技能。由于他没有明显弱点，需要消耗大量火力才能击败他。',
    category: '洪荒',
    type: 'special',
      quote: "当你凝视龙瞳时，看到的是深渊，还是深渊在凝视你的道心？"
   },
   // 新增僵尸：刑天真阳
   xingtianzhenyang: {
    name: '刑天真阳',
    health: 480000,
    speed: 0.6,
    damage: 14000,
    reward: 38000,
    armor: 22000,
    specialAbility: '万劫冻结：短时锁定战场变量，强制进入“可证状态”；斩因果：切断目标与其召唤物/傀儡的因果线；楼船熵价：每当战局进入冻结，结算后自损生命上限5%，并提升伤害穿透10%（上限3次）；剑影记忆：每击杀一个持有增益的单位，获得“刻痕”，提高下一次终极冻结的稳定度；熵价承诺：连续使用时空能力会触发法则灼烧与寿元衰减，需在战术上控制触发频率。',
    description: '刑天真阳（取刑天断首不屈之意），先天杀伐神魔（洪荒初开时，混沌青莲碎片与幽冥血海怨气凝结而成），天地未判时，阴阳二气失衡处诞生的"非道之种"，左眼为日魂所化，右眼为月魄所凝，头顶光环实为未圆满的混沌法则印记，"以杀证道，破而后立"，认为天道秩序是束缚洪荒进化的枷锁，唯有毁灭旧秩序才能催生更高维度的法则，游离于洪荒之外的第三方势力，暗中挑拨量劫，试图收集十二祖巫残魂与至尊元神碎片，炼制"万劫轮回盘"，主张"道无常形，唯变是恒"，认为鸿钧合道后的天道已沦为"死道"，真正的大道应如图片中机械与血肉的共生，处于永恒的解构与重构之中，提出"过去未来皆为虚妄，唯有此刻的杀伐真实"，其座舰"万劫楼船"能在战斗瞬间冻结时空，但每次使用都会加速自身存在的熵增，践行"因果闭环"理论，刻意制造杀劫却又亲手终结，如在巫妖大战中同时向帝俊与十二祖巫提供情报，最终导致双方同归于尽。人物形象细节为左右肩各栖息一只"噬道白泽"，左侧白泽生有战舰炮管，右侧白泽背生九柄先天杀剑，行走时脚下生出血色莲台，每一步都引发空间褶皱，背后悬浮三千柄微缩剑影，实则是被其斩杀的三千大道化身，上衣为"混沌蚕蛾"吐丝织就的素白法袍，袖口绣有血色星图，腰间悬"斩因果"玉佩，可斩断自身与当前时空的联系，右手握"万劫剑胚"，剑身流动着液态金属般的杀伐法则。其座舰"万劫楼船"实为开天辟地时遗留的混沌核心，舰体刻有"预演量劫"的星图。当角色收集齐十二祖巫残魂时，楼船将显现出未来三次量劫的完整轨迹，而她的左眼会化为新的天道眼，看到鸿钧都无法窥视的"道外之境"。',
    difficulty: '极难',
    weakness: ['时空类植物护盾', '星道/自然循环场', '连续冻结后法则灼烧'],
    appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
    strategy: '优先以"时空/星道/自然循环"形成保护场，翻倍其熵价成本；在其冻结窗口外迅速转移阵型，避免被闭环结算斩杀；利用召唤移除与增益清除的抗性豁免道具保护核心单位；若其连续两次冻结，乘其"法则灼烧"与冷却延长窗口进行强力反击。白泽二位是其关键机制载体，集中输出可显著降低其复写能力。',
    category: '洪荒古神',
    type: 'special',
    quote: '因果循环？不过是弱者为自己设下的牢笼罢了'
  },
    // 新增僵尸：玄夜
    xuanye: {
      name: '玄夜',
      health: 480000,
      speed: 0.6,
      damage: 14000,
      reward: 40000,
      armor: 22000,
      specialAbility: '混沌熵潮：提升战场局部熵增，降低敌方阵地稳定性，周期性触发“规则崩坏”（重力反转、时间紊乱）；无序狼·无序：吞噬目标的“有序记忆”，清除其身上正面增益并使其技能进入混乱冷却；时空褶跃：沿熵值节点短距跳跃，使用后自损存在稳定度（最大生命上限-5%，上限3层）；因果断链：尝试斩断召唤物/傀儡与本体的因果线，降低其协同效果；熵增图腾：情绪激发时亮起，短时提升自身伤害穿透与范围破坏。',
      description: '玄夜为混沌熵魔（先天神魔，非神非魔，独立于巫妖人阐之外的混沌原生体），混沌初开时，天地间"有序"与"无序"之力激烈碰撞，玄夜自熵增法则的奇点中诞生。他是宇宙无序化本质的具象化，银白与深蓝渐变的发色象征混沌能量的两极，赤裸上身的肌肉线条暗合熵增定律的数学模型，"破立道"——主张"秩序是大道的枷锁，唯有毁灭旧平衡，方能使宇宙回归真正的自由"。他认为鸿钧合道是对混沌本源的背叛，三清、接引准提的教化皆是对生灵本能的禁锢。游离于巫妖、洪荒势力之外的第三方毁灭力量，暗中推动量劫发生，试图在天地崩塌后重铸"无秩序"的混沌世界。\n\n"道无常形，唯变永恒。所谓天道，不过是鸿钧为牢笼贴上的封条。"玄夜认为大道的本质是无限可能性，而秩序恰恰限制了这种可能性，他要做的就是撕开封条，释放被压抑的混沌之力。"时间是熵增的刻度，空间是无序的容器。"他能看见时空褶皱中的"熵值节点"，通过加速局部熵增实现短暂时空跳跃，但每次使用都会导致自身存在的稳定性下降（埋下宿命伏笔）。"因果链是秩序的最后挣扎。"玄夜试图斩断自身因果，却发现每一次干预都会产生更复杂的因果网络，这种矛盾让他逐渐意识到：自己或许正是"熵增法则"用来平衡宇宙的终极因果。人物形象细节为左肩悬浮着由黑色能量构成的混沌魔狼"无序"，狼眼闪烁与玄夜同源的冷光，能吞噬他人的"有序记忆"，使其陷入永恒混乱。周身除白色能量流与金色火花外，空间呈现玻璃碎裂般的扭曲——近处物体不断崩解为粒子，远处粒子又重组为破碎的星辰，形成"熵增可视化"的动态奇观。当情绪激动时，胸口会浮现由数学符号组成的"熵增图腾"，图腾越亮，周围物理法则崩坏越严重（如重力反转、时间流速紊乱）。玄夜试图掌控熵增之力，却逐渐发现自己正在成为熵增的"祭品"——每当他加速宇宙无序化，自身存在就会变得更不稳定，最终可能在"熵增饱和"时彻底消散，成为宇宙从有序到无序的"过渡介质"。玄夜暗中赠予巫族"熵增战纹"，加速十二祖巫的力量失控，间接导致巫族衰败；洪荒大战时化身截教外门弟子，篡改通天教主的"诛仙阵图"，注入熵增之力，使阵法反噬阐截两教，为后来的"无天量劫"埋下隐患；在最终的"混沌回归"计划中，可能与鸿钧正面碰撞，揭示鸿钧合道的真相——原来鸿钧也在利用秩序延缓熵增，两人本质是同一法则的两极。',
      difficulty: '极难',
      weakness: ['秩序场/星道结界', '时间调律类护盾', '因果复位机制'],
      appearsIn: [1, 2, 3, 4, 5, 6, 7, 8],
      strategy: '以"秩序-时序-因果"三重体系克制：布置星道/自然循环结界抵消其熵潮，时间调律降低其褶跃容错，因果锁链稳固我方协同；在其熵价层数叠高（自损生命上限）时强势反击；优先清除伴生体"无序"的吞噬载体以削弱其混乱传播。',
      category: '洪荒古神',
      type: 'special',
      quote: '秩序是牢笼，毁灭是自由；待我熵增满，天地尽归无'
    }
  };

// 植物图片映射
export const plantImages: Record<PlantType, string> = {
  qingyuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/清鸢1_20251028193144.jpg",
  shancatleader: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/善•猫教主_20251018115946.jpg",
  xuqinglan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚(魔法少女)_20251019101043.jpg",
  xuqinglan_student: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚(修习者）_20251019200844.jpg",
  qingxuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/青玄_20251020073321.jpg",
  murongyanfeng: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/慕容言风_20251020080449.jpg",
  yijiu: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/屹九_20251020101211.jpg",
  xuqinglan_god: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚（神）_20251020165934.jpg",
   nanaisei: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/奈奈生_20251020220122.jpg",
  vexithra: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/Vexithra（战神）_20251021174818.jpg",
   xuqinglan_dream: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚“梦”_20251021232653.jpg",
    mumu: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/沐沐_20251022233255.png",
    mingjiansanshi: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/冥界三使_20251024034644.jpeg",
     ling: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/凌_20251024054108.jpg",
      xingzhe: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/星褶_20251024083503.jpg",
       xiaoshengkui: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/筱燊傀_20251024122052.jpg",
       yunli_time_arbiter: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Fantasy%20anime%20girl%20with%20long%20golden%20hair%2C%20dual%20eye%20colors%20%28yellow%20and%20green%29%2C%20wearing%20golden%20armor%20with%20blue%20gems%2C%20holding%20a%20sword%20with%20time%20symbols%2C%20time%20crystals%20floating%20around%2C%20M%C3%B6bius%20strip%20patterns%2C%20cosmic%20background&sign=f1506d4fd402ed8c499428da5c013146",
       xiaoyue: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/晓月_20251024185423.jpg",
  // 新增植物图片
  yuchen: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/羽尘_20251025094010.jpg",
  // 新增植物：灵•瑶凝
   lingyaoning: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/灵•瑶凝_20251026143816.jpg",
  // 新增植物：灵汐
  lingxi: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/灵汐_20251026192629.jpg",
  // 新增植物：离火双生•长离
  lihuoshuangsheng_changli: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/离火双生•长离_20251027110345.jpg",
  // 新增植物：镜花水月·灵汐
  jinghuashuiyue_lingxi: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/镜花水月·灵汐_20251027120920.jpg",
  // 新增植物：苍玄
  cangxuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/苍玄_compressed_1761558788116_compressed_1761558798_20251027175356.jpg",
  // 新增植物：青芜
  qingwu: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/青芜_20251028060900.jpg",
  // 新增植物：双生花仙•灵汐
   shuangshenghuaxian_lingxi: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/双生花仙•灵汐_20251028091539.jpg",
    ningshuang: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/壁纸_compressed_1761616502716_20251028101835.jpg",
     xuanshuang: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/玄霜_20251028104821.jpg",
      lingxi_chitong: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/灵汐与赤瞳_20251028125915.jpg",
      // 灵璇的图片已更新
       lingxuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/灵璇_20251028151227.jpg",
       // 新增植物：星轨三司
        xingguisansi: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/星轨三司_20251029104649.jpg"
};

// 僵尸图片映射
export const zombieImages: Record<ZombieType, string> = {
  su_huai: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/宿槐僵尸_20251017203937.jpg",
  cat_leader: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/猫教主_20251017204151.jpg",
  ji_zai: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/季灾_20251018084258.jpg",
  li_huo: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/离火_20251018084300.jpg",
  vexithra: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/Vexithra_20251018182402.jpg",
  xuqinglan_dark: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚（暗）_20251019210654.jpg",
   xia: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/霞_20251021164140.jpg",
   alibi: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/Alibi_20251022055207.jpg",
    qiuyue: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/秋月_20251022153700.jpg",
     shantao: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/Cache_-29e3261540d29512_20251023000220.jpg",
     xian: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/宪_20251023213328.jpg",
      shilie_lingxi: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/时裂灵汐_20251026200352.jpg",
                   longzunjiyan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/龙尊忌炎_20251027093343.jpg",
                   xingtianzhenyang: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/刑天真阳_20251028194918.jpg",
                   xuanye: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/玄夜_20251029110211.jpg"
      };

// 关卡配置接口
export interface LevelConfig {
  waves: number;
  zombieTypes: ZombieType[];
  difficulty: GameDifficulty;
  isEndless?: boolean; // 标识是否为无尽模式
  isHighIntensityCustom?: boolean; // 标识是否为高强度自定义模式
  // 关卡特性
  isNightLevel?: boolean; // 夜间关卡
  isPoolLevel?: boolean; // 泳池关卡
  isRoofLevel?: boolean; // 屋顶关卡
  isFogLevel?: boolean; // 浓雾关卡
  // 环境效果
  weather?: WeatherType; // 天气效果
  // 初始条件
  initialSun?: number; // 初始阳光
  sunProductionRateModifier?: number; // 阳光生产速率修正
  // 僵尸增强
  zombieHealthModifier?: number; // 僵尸生命值修正
  zombieSpeedModifier?: number; // 僵尸速度修正
  // 特殊规则
  specialRules?: string[]; // 特殊规则描述
  // 解锁条件
  unlockCondition?: string; // 解锁条件描述
}

// 关卡数据
export const LEVELS: Record<number, LevelConfig> = {
  1: {
    waves: 3,
    zombieTypes: ['su_huai'],
    difficulty: 'easy',
    initialSun: 200,
    specialRules:['简单入门关卡，适合新手练习']
  },
  2: {
    waves: 5,
    zombieTypes: ['su_huai'],
    difficulty: 'medium',
    initialSun: 180,
    specialRules: ['难度适中，考验基础布局能力']
  },
  3: {
    waves: 7,
    zombieTypes: ['su_huai'],
    difficulty: 'hard',
    initialSun: 160,
    specialRules: ['难度提升，需要更合理的植物搭配']
  },
  // 夜晚关卡（第4关）：阳光生成减少，僵尸速度加快
  4: {
    waves: 10,
    zombieTypes: ['su_huai'],
    difficulty: 'hard',
    isNightLevel: true,
    initialSun: 120,
    sunProductionRateModifier: 0.7,
    zombieSpeedModifier: 1.2,
    specialRules: ['夜间关卡，阳光生成减少，僵尸速度更快']
  },
  // 泳池关卡（第5关）：有水池格子限制，增加策略性
  5: {
    waves: 12,
    zombieTypes: ['su_huai'],
    difficulty: 'hard',
    isPoolLevel: true,
    initialSun: 140,
    specialRules: ['泳池关卡，需要睡莲才能在水面种植植物']
  },
  // 屋顶关卡（第6关）：需要先种植花盆才能种植植物
  6: {
    waves: 15,
    zombieTypes: ['su_huai'],
    difficulty: 'expert',
    isRoofLevel: true,
    initialSun: 150,
    specialRules: ['屋顶关卡，需要先种植花盆才能种植植物']
  },
  // 浓雾关卡（第7关）：视野受限，僵尸更难被发现
  7: {
    waves: 18,
    zombieTypes: ['su_huai'],
    difficulty: 'expert',
    isFogLevel: true,
    initialSun: 130,
    specialRules: ['浓雾关卡，视野受限，僵尸更难被发现']
  },
  // 终极BOSS关卡（第8关）：有强大的僵尸王和随从僵尸出现
  8: {
    waves: 20,
    zombieTypes: ['su_huai'],
    difficulty: 'expert',
    initialSun: 180,
    specialRules: ['终极BOSS关卡，宿槐将亲自带领强大的僵尸军队']
  },
  // 无尽模式（第9关）：无限波次，难度逐渐增加
  9: {
    waves: 999, // 很大的数字表示无限波次
    zombieTypes: ['su_huai'],
    difficulty: 'expert',
    isEndless: true,
    initialSun: 250,
    specialRules: ['无尽模式，波次无限进行，难度会逐渐增加']
  },
  // 高强度自定义关卡（第10关）
  10: {
    waves: 15,
    zombieTypes: ['su_huai'],
    difficulty: 'expert',
    isHighIntensityCustom: true,
    initialSun: 200,
    specialRules: ['高强度自定义模式，僵尸属性获得全面增强']
  }
};

// 获取植物世界观分类的辅助函数
export const getPlantWorldview = (plant: PlantConfig): string => {
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
  }
  return "未知";
};

// 导出游戏配置常量
export const GAME_CONFIG = {
  gridSize: { rows: 6, cols: 15 },
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
      su_huai: 10,
      cat_leader: 8,
      ji_zai: 5,
      li_huo: 5,
      vexithra: 3
    },
    medium: {
      su_huai: 12,
      cat_leader: 10,
      ji_zai: 7,
      li_huo: 7,
      vexithra: 5
    },
    hard: {
      su_huai: 15,
      cat_leader: 12,
      ji_zai: 9,
      li_huo: 9,
      vexithra: 7
    },
    expert: {
      su_huai: 18,
      cat_leader: 15,
      ji_zai: 12,
      li_huo: 12,
        vexithra: 10,
        xuqinglan_dark: 9,
        xingtianzhenyang: 8,
        xuanye: 8
      }
  },
  // 新增配置：游戏循环相关
  gameLoopInterval: 16, // 约60fps
  bulletUpdateInterval: 16, // 子弹更新间隔
  collisionDetectionInterval: 16, // 碰撞检测间隔
  // 伤害计算相关配置
  damageCalculation: {
    baseArmorReduction: 0.06, // 增强：基础护甲减免百分比增加
    criticalHitChance: 0.08, // 增强：暴击几率增加
    criticalHitMultiplier: 2.5 // 增强：暴击伤害倍数增加
  },
  // 智能算法相关配置
  aiConfig: {
    // 僵尸智能决策参数
    zombieDecisionMaking: {
      decisionInterval: 1000, // 僵尸决策间隔(ms)
      pathfindingUpdateInterval: 500, // 寻路更新间隔(ms)
      threatAssessmentThreshold: 0.7, // 威胁评估阈值
      prioritizeWeakestLane: true, // 是否优先攻击最弱防线
      adaptToPlayerTactics: true, // 是否适应玩家策略
      learnFromPreviousWaves: true, // 是否从之前波次学习
      maxMemoryRetention: 5, // 最大记忆保留波次数
    }
  }
};