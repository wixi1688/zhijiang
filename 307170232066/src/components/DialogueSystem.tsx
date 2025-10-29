import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';


// 定义对话角色类型
type Character = 'qingyuan' | 'shancatleader' | 'xuqinglan' | 'su_huai' | 'narrator' | 'qingxuan' | 'murongyanfeng' | 'xuqinglan_god' | 'nanaisei';

// 定义对话内容接口
interface DialogueLine {
  id: string;
  character: Character;
  text: string;
  condition?: (params: any) => boolean;
  delay?: number;
  choices?: {
    text: string;
    nextLineId: string;
    condition?: (params: any) => boolean;
  }[];
  emotion?: 'happy' | 'sad' | 'angry' | 'surprised' | 'calm' | 'determined' | 'curious';
}

// 定义对话系统属性接口
interface DialogueSystemProps {
  gameState: {
    currentWave: number;
    totalWaves: number;
    gameStatus: string;
    selectedLevel: number;
    totalZombiesKilled: number;
    plants: any[];
    sunCount: number;
  };
}

// 角色头像映射
const characterAvatars: Record<Character, string> = {
  qingyuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/微信图片_20251016111846_103_92_20251016111910.jpg",
  shancatleader: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/善•猫教主_20251018115946.jpg",
  xuqinglan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚(魔法少女)_20251019101043.jpg",
  su_huai: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/宿槐僵尸_20251017203937.jpg",
  narrator: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20narrator%20mysterious%20figure%20cloaked%20in%20light%20cute%20chibi%20style&sign=a1c196cd894d1dbf7697e8dc74a74d38",
  qingxuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/青玄_20251020073321.jpg",
  murongyanfeng: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/慕容言风_20251020080449.jpg",
  xuqinglan_god: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚（神）_20251020165934.jpg",
  nanaisei: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/奈奈生_20251020220122.jpg"
};

// 角色名称映射
const characterNames: Record<Character, string> = {
  qingyuan: "清鸢",
  shancatleader: "善•猫教主",
  xuqinglan: "徐清岚",
  su_huai: "宿槐",
  narrator: "旁白",
  qingxuan: "青玄",
  murongyanfeng: "慕容言风",
  xuqinglan_god: "徐清岚（神）",
  nanaisei: "奈奈生"
};

// 角色颜色映射
const characterColors: Record<ExtendedCharacter, string> = {
  qingyuan: "from-yellow-600 to-yellow-400",
  shancatleader: "from-blue-600 to-blue-400",
  xuqinglan: "from-purple-600 to-purple-400",
  su_huai: "from-red-600 to-red-400",
  narrator: "from-gray-600 to-gray-400",
  // 添加缺失的角色颜色
  xuqinglan_student: "from-purple-600 to-purple-400",
  ji_zai: "from-purple-600 to-purple-400",
  li_huo: "from-red-600 to-red-400",
  xuqinglan_dark: "from-red-600 to-red-400",
  qingxuan: "from-green-600 to-teal-400",
  murongyanfeng: "from-purple-900 to-indigo-600",
  xuqinglan_god: "from-cyan-600 to-blue-400",
  nanaisei: "from-yellow-500 to-white"
};

// 扩展Character类型以包含所有对话中使用的角色
type ExtendedCharacter = Character | 'xuqinglan_student' | 'ji_zai' | 'li_huo' | 'xuqinglan_dark' | 'qingxuan' | 'murongyanfeng' | 'xuqinglan_god';

// 对话数据
const dialogueData: Array<Omit<DialogueLine, 'character'> & { character: ExtendedCharacter }> = [
  // 开场对话
  {
    id: "intro-1",
    character: "narrator",
    text: "欢迎来到光明与暗影的世界...一场决定命运的战斗即将开始。",
    delay: 1000
  },
  {
    id: "intro-2",
    character: "qingyuan",
    text: "终于来了吗？我感受到了陌生而强大的魔法波动。",
    emotion: "calm"
  },
  {
    id: "intro-3",
    character: "xuqinglan",
    text: "你好！我是来自人类世界的徐清岚。我接收到了来自这个世界的求救信号，是你在呼唤我吗？",
    emotion: "surprised"
  },
  {
    id: "intro-4",
    character: "qingyuan",
    text: "是的，年轻的魔法使。暗影女王宿槐的势力正在侵蚀这片土地，我们需要你的帮助。"
  },
  {
    id: "intro-5",
    character: "shancatleader",
    text: "喵呜~又有新伙伴加入了吗？让我们一起将那些讨厌的僵尸赶出去吧！",
    emotion: "happy"
  },
  
  // 第一波僵尸出现
  {
    id: "wave-1-1",
    character: "qingyuan",
    text: "小心！第一波僵尸正在逼近，准备迎敌！",
    condition: (params) => params.currentWave === 1 && params.gameStatus === 'playing'
  },
  
  // 击败第一个僵尸
  {
    id: "first-kill-1",
    character: "xuqinglan",
    text: "成功了！我的魔法生效了！",
    condition: (params) => params.totalZombiesKilled === 1,
    emotion: "happy",
    choices: [
      {
        text: "继续努力！",
        nextLineId: "first-kill-2"
      }
    ]
  },
  {
    id: "first-kill-2",
    character: "shancatleader",
    text: "做得好！继续保持，我们一定能赢！",
    emotion: "happy"
  },
  
  // 阳光不足时的提示
  {
    id: "low-sun-1",
    character: "qingyuan",
    text: "阳光不足了，多种一些向日葵来收集更多的阳光能量吧。",
    condition: (params) => params.sunCount < 100 && params.gameStatus === 'playing' && params.currentWave > 0
  },
  
  // 第3波僵尸
  {
    id: "wave-3-1",
    character: "xuqinglan",
    text: "这些僵尸越来越强了，我需要提升我的魔法强度！",
    condition: (params) => params.currentWave === 3 && params.gameStatus === 'playing',
    emotion: "determined"
  },
  
  // 第5波僵尸
  {
    id: "wave-5-1",
    character: "shancatleader",
    text: "喵！这些僵尸越来越多了，但我们不会轻易认输的！",
    condition: (params) => params.currentWave === 5 && params.gameStatus === 'playing',
    emotion: "determined"
  },
  {
    id: "wave-5-2",
    character: "qingyuan",
    text: "坚持住！我们已经成功抵御了一半的攻势！"
  },
  
  // 一半波次完成
  {
    id: "half-waves-1",
    character: "qingyuan",
    text: "我们已经度过了一半的挑战。坚持住，胜利就在前方！",
    condition: (params) => params.currentWave > 0 && params.totalWaves > 0 && params.currentWave >= Math.floor(params.totalWaves / 2) && params.currentWave < params.totalWaves && !dialogueData.find(d => d.id === "wave-5-1" && params.currentWave === 5)
  },
  
  // 大量僵尸出现时的警告
  {
    id: "massive-attack-1",
    character: "qingyuan",
    text: "小心！大规模僵尸来袭！集中火力消灭它们！",
    condition: (params) => params.currentWave > 5 && params.gameStatus === 'playing' && Math.random() > 0.7,
    emotion: "angry"
  },
  
  // 宿槐出现
  {
    id: "su-huai-appear-1",
    character: "su_huai",
    text: "清鸢，你还是这么执着。难道你看不出来这个世界已经无可救药了吗？",
    condition: (params) => params.selectedLevel >= 8,
    emotion: "angry"
  },
  {
    id: "su-huai-appear-2",
    character: "qingyuan",
    text: "宿槐...我依然相信你内心深处还有一丝光明。放弃黑暗吧！",
    emotion: "calm"
  },
  {
    id: "su-huai-appear-3",
    character: "su_huai",
    text: "光明？哈哈哈哈...光明给过我什么？只有背叛和失望！",
    emotion: "angry"
  },
  
  // 清鸢升级时的对话
  {
    id: "qingyuan-upgrade-1",
    character: "qingyuan",
    text: "光明之力正在增强！我感觉充满了能量！",
    condition: (params) => params.plants.some(plant => plant.type === 'qingyuan') && params.currentWave > 2 && params.gameStatus === 'playing' && Math.random() > 0.8,
    emotion: "happy"
  },
  
  // 徐清岚进化为修习者
  {
    id: "xuqinglan-evolve-1",
    character: "xuqinglan_student",
    text: "我的星尘之笔正在进化！我感觉我的魔法更加强大了！",
    condition: (params) => params.plants.some(plant => plant.type === 'xuqinglan_student') && params.currentWave > 4 && params.gameStatus === 'playing' && Math.random() > 0.8,
    emotion: "surprised"
  },
  
  // 徐清岚（修习者）和清鸢的对话
  {
    id: "xuqinglan-student-1",
    character: "xuqinglan_student",
    text: "清鸢姐姐，我感觉自己正在与这片土地的魔法力量融为一体。这种感觉...很奇妙。",
    condition: (params) => params.plants.some(plant => plant.type === 'xuqinglan_student') && params.plants.some(plant => plant.type === 'qingyuan') && Math.random() > 0.7,
    emotion: "calm"
  },
  {
    id: "xuqinglan-student-2",
    character: "qingyuan",
    text: "这是很好的迹象，清岚。当你真正理解并接纳这种力量时，你将变得更加强大。但请记住，力量越大，责任也就越大。",
    emotion: "calm"
  },
  
  // 季灾出现
  {
    id: "ji-zai-appear-1",
    character: "ji_zai",
    text: "清鸢，你以为找来这个人类女孩就能改变什么吗？太天真了！",
    condition: (params) => params.currentWave > 6 && params.gameStatus === 'playing' && Math.random() > 0.7,
    emotion: "angry"
  },
  {
    id: "ji-zai-appear-2",
    character: "qingyuan",
    text: "季灾！你这个阴险的家伙！离我们远点！",
    emotion: "angry"
  },
  
  // 徐清岚（暗）出现
  {
    id: "xuqinglan-dark-appear-1",
    character: "xuqinglan_dark",
    text: "清鸢...善•猫教主...你们为什么要抛弃我？",
    condition: (params) => params.selectedLevel >= 8 && params.gameStatus === 'playing' && Math.random() > 0.7,
    emotion: "angry"
  },
  {
    id: "xuqinglan-dark-appear-2",
    character: "shancatleader",
    text: "喵呜~清岚姐姐！你怎么了？我们没有抛弃你啊！",
    emotion: "sad"
  },
  {
    id: "xuqinglan-dark-appear-3",
    character: "xuqinglan_dark",
    text: "没有抛弃？哈哈哈哈...当我在黑暗中挣扎时，你们在哪里？当我最需要帮助时，你们又在哪里？",
    emotion: "angry"
  },
  {
    id: "xuqinglan-dark-appear-4",
    character: "qingyuan",
    text: "清岚，我知道你现在很痛苦。但这不是真正的你！请相信我们，我们一直都在你身边！",
    emotion: "determined"
  },
  
  // 最后一波僵尸
  {
    id: "final-wave-1",
    character: "xuqinglan",
    text: "这是最后一波了！让我们用全力击溃他们！",
    condition: (params) => params.currentWave === params.totalWaves && params.gameStatus === 'playing' && params.totalWaves > 0,
    emotion: "determined"
  },
  {
    id: "final-wave-2",
    character: "shancatleader",
    text: "喵呜！最后的决战！让我们让这些僵尸见识一下真正的力量！",
    emotion: "happy"
  },
  
  // 游戏胜利
  {
    id: "victory-1",
    character: "narrator",
    text: "恭喜！你成功抵御了僵尸的入侵，光明再次笼罩这片土地。",
    condition: (params) => params.gameStatus === 'victory'
  },
  {
    id: "victory-2",
    character: "qingyuan",
    text: "谢谢你，徐清岚。你的魔法力量对我们帮助很大。",
    emotion: "happy"
  },
  {
    id: "victory-3",
    character: "xuqinglan",
    text: "这是我的使命。只要这个世界还需要我，我就会回来的！",
    emotion: "determined",
    choices: [
      {
        text: "我也会永远记住这次冒险。",
        nextLineId: "victory-4"
      }
    ]
  },
  {
    id: "victory-4",
    character: "shancatleader",
    text: "喵呜~胜利啦！我们是最棒的团队！",
    emotion: "happy"
  },
  
  // 游戏失败
  {
    id: "defeat-1",
    character: "su_huai",
    text: "哈哈哈...清鸢，你输了。黑暗终将吞噬一切光明！",
    condition: (params) => params.gameStatus === 'gameover',
    emotion: "angry"
  },
  {
    id: "defeat-2",
    character: "qingyuan",
    text: "不要灰心，我们还有机会。下次一定能击败宿槐！",
    emotion: "calm"
  },
  {
    id: "defeat-3",
    character: "xuqinglan",
    text: "我...我还不够强。但是下一次，我一定会变得更强！",
    emotion: "sad"
  },
  
  // 徐清岚和猫教主同时在场
  {
    id: "partners-1",
    character: "xuqinglan",
    text: "善•猫教主，我们配合得真好！",
    condition: (params) => params.plants.some(plant => plant.type === 'shancatleader') && params.plants.some(plant => plant.type === 'xuqinglan') && Math.random() > 0.7,
    emotion: "happy"
  },
  {
    id: "partners-2",
    character: "shancatleader",
    text: "喵呜~那当然啦！我们可是最佳搭档！",
    emotion: "happy"
  },
  
  // 高级关卡鼓励
  {
    id: "advanced-level-1",
    character: "qingyuan",
    text: "这是一个充满挑战的关卡，但我相信你的能力。",
    condition: (params) => params.selectedLevel >= 7 && params.gameStatus === 'playing'
  },
  
  // 长时间游戏时的鼓励
  {
    id: "long-game-1",
    character: "shancatleader",
    text: "喵呜~别累坏了！我们慢慢来，一定能赢的！",
    condition: (params) => params.currentWave > 8 && params.gameStatus === 'playing' && Math.random() > 0.8,
    emotion: "happy"
  },
  
  // 青玄相关对话
   {
    id: "qingxuan-intro-1",
    character: "qingxuan",
    text: "星界之门的守护者青玄，愿为光明大陆贡献我的力量。即使经历了坠落后的迷茫，我依然记得自己的使命。",
    condition: (params) => params.plants.some(plant => plant.type === 'qingxuan') && params.gameStatus === 'playing',
    emotion: "calm"
  },
  {
    id: "qingxuan-combat-1",
    character: "qingxuan",
    text: "星界之力，护佑光明！流光伞，绽放你的光芒吧！",
    condition: (params) => params.plants.some(plant => plant.type === 'qingxuan') && params.currentWave > 3 && params.gameStatus === 'playing',
    emotion: "determined"
  },
  {
    id: "qingxuan-heal-1",
    character: "qingxuan",
    text: "让星界的力量治愈你。每一片星光，都是生命的祝福。",
    condition: (params) => params.plants.some(plant => plant.type === 'qingxuan') && params.currentWave > 1 && params.gameStatus === 'playing' && Math.random() > 0.8,
    emotion: "calm"
  },
  {
    id: "qingxuan-with-xuqinglan-1",
    character: "qingxuan",
    text: "徐清岚，你的魔法与星界之力有着奇妙的共鸣。或许，你与星界之间也有着不为人知的缘分。",
    condition: (params) => params.plants.some(plant => plant.type === 'qingxuan') && params.plants.some(plant => plant.type === 'xuqinglan') && Math.random() > 0.8,
    emotion: "surprised"
  },
  {
    id: "qingxuan-victory-1",
    character: "qingxuan",
    text: "星界的平衡得以维持，光明必将战胜黑暗。这不仅是我的信念，也是所有守护者的共同心愿。",
    condition: (params) => params.plants.some(plant => plant.type === 'qingxuan') && params.gameStatus === 'victory',
    emotion: "happy"
  },
   // 慕容言风相关对话
  {
    id: "murongyanfeng-intro-1",
    character: "murongyanfeng",
    text: "哈哈哈...光明与黑暗的战斗，又开始了吗？真是让人怀念的场景啊。",
    condition: (params) => params.plants.some(plant => plant.type === 'murongyanfeng') && params.gameStatus === 'playing',
    emotion: "calm"
  },
  {
    id: "murongyanfeng-combat-1",
    character: "murongyanfeng",
    text: "明渊之力，听我号令！黑暗的力量啊，为我所用吧！",
    condition: (params) => params.plants.some(plant => plant.type === 'murongyanfeng') && params.currentWave > 3 && params.gameStatus === 'playing',
    emotion: "determined"
  },
  {
    id: "murongyanfeng-dark-1",
    character: "murongyanfeng",
    text: "黑暗...不过是另一种力量罢了。光明与黑暗，本就是相生相克的存在。",
    condition: (params) => params.plants.some(plant => plant.type === 'murongyanfeng') && params.currentWave > 1 && params.gameStatus === 'playing' && Math.random() > 0.8,
    emotion: "calm"
  },
  {
    id: "murongyanfeng-with-ji_zai-1",
    character: "murongyanfeng",
    text: "季灾，我们又见面了。这次，我站在另一边。你我之间的恩怨，也该做个了断了。",
    condition: (params) => params.plants.some(plant => plant.type === 'murongyanfeng') && params.gameStatus === 'playing' && Math.random() > 0.8,
    emotion: "calm"
  },
  {
    id: "murongyanfeng-victory-1",
    character: "murongyanfeng",
    text: "这场战斗...还算有趣。不过，这只是开始。光明与黑暗的故事，还远没有结束。",
    condition: (params) => params.plants.some(plant => plant.type === 'murongyanfeng') && params.gameStatus === 'victory',
    emotion: "calm"
  },
  // 奈奈生专属对话
  {
    id: "nanaisei-intro-1",
    character: "nanaisei",
    text: "命运的齿轮已经开始转动，光明与黑暗的对决将决定这个世界的未来...",
    condition: (params) => params.plants.some(plant => plant.type === 'nanaisei') && params.gameStatus === 'playing',
    emotion: "calm"
  },
  {
    id: "nanaisei-foresee-1",
    character: "nanaisei",
    text: "我预见到了下一波僵尸的动向。它们会从第三条和第五条路线发起进攻，准备好迎敌！",
    condition: (params) => params.plants.some(plant => plant.type === 'nanaisei') && params.currentWave > 0 && params.gameStatus === 'playing' && Math.random() > 0.7,
    emotion: "determined"
  },
  {
    id: "nanaisei-with-xuqinglan-1",
    character: "nanaisei",
    text: "清岚，你的成长远超我的预期。光明之力在你体内流淌，你将成为对抗黑暗的关键。",
    condition: (params) => params.plants.some(plant => plant.type === 'nanaisei') && params.plants.some(plant => plant.type === 'xuqinglan') && Math.random() > 0.7,
    emotion: "happy"
  },
  {
    id: "nanaisei-protect-1",
    character: "nanaisei",
    text: "本源守护，开启！愿光明之力护佑所有生命。",
    condition: (params) => params.plants.some(plant => plant.type === 'nanaisei') && params.gameStatus === 'playing' && params.currentWave > 3 && Math.random() > 0.8,
    emotion: "calm"
  },
  {
    id: "nanaisei-victory-1",
    character: "nanaisei",
    text: "光明终将战胜黑暗，这是命运的必然。但真正的胜利，是让每个灵魂都能找到属于自己的光明。",
    condition: (params) => params.plants.some(plant => plant.type === 'nanaisei') && params.gameStatus === 'victory',
    emotion: "happy"
  },
  {
    id: "nanaisei-dark-appear-1",
    character: "nanaisei",
    text: "清岚，我知道你在痛苦中挣扎。但请记住，在你内心最深处，永远有一缕光明在等待着被重新点燃。",
    condition: (params) => params.plants.some(plant => plant.type === 'nanaisei') && params.selectedLevel >= 8 && params.gameStatus === 'playing' && Math.random() > 0.7,
    emotion: "sad"
  },
  {
    id: "nanaisei-with-god-1",
    character: "nanaisei",
    text: "命运的轮回已经完成，光明的意志将继续传承。清岚，你终于找到了真正的自己。",
    condition: (params) => params.plants.some(plant => plant.type === 'nanaisei') && params.plants.some(plant => plant.type === 'xuqinglan_god') && Math.random() > 0.8,
    emotion: "happy"
  }
];

const DialogueSystem: React.FC<DialogueSystemProps> = ({ gameState }) => {
  const location = useLocation();
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine | null>(null);
  const [displayedDialogues, setDisplayedDialogues] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [showChoices, setShowChoices] = useState(false);
  const [lastCharacter, setLastCharacter] = useState<Character | null>(null);
  const [dialogueHistory, setDialogueHistory] = useState<DialogueLine[]>([]);
  const dialogueQueue = useRef<DialogueLine[]>([]);
  const typingTimeout = useRef<number | null>(null);
  // 添加状态来跟踪对话系统的显示模式：展开、收起或最小化
  const [displayMode, setDisplayMode] = useState<'expanded' | 'collapsed' | 'minimized'>('expanded');
  // 添加状态来跟踪上次对话的角色，用于平滑过渡效果
  const [previousCharacter, setPreviousCharacter] = useState<Character | null>(null);

  // 检查并添加满足条件的对话到队列
  useEffect(() => {
    const newDialogues = dialogueData.filter(dialogue => 
      !displayedDialogues.includes(dialogue.id) && 
      (!dialogue.condition || dialogue.condition(gameState))
    );

    if (newDialogues.length > 0) {
      // 按照ID排序，确保对话顺序正确
      newDialogues.sort((a, b) => {
        // 提取ID中的数字部分进行排序
        const getNumber = (id: string) => {
          const match = id.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };
        
        const numA = getNumber(a.id);
        const numB = getNumber(b.id);
        
        if (numA < numB) return -1;
        if (numA > numB) return 1;
        return 0;
      });

      // 优先添加没有后续对话的条目到队列，保持对话流畅性
      const mainDialogues = newDialogues.filter(d => !d.id.includes('followup'));
      const followupDialogues = newDialogues.filter(d => d.id.includes('followup'));
      
      dialogueQueue.current = [...dialogueQueue.current, ...mainDialogues, ...followupDialogues];
      
      // 如果当前没有对话正在显示，立即显示第一个
      if (!currentDialogue && dialogueQueue.current.length > 0) {
        showNextDialogue();
      }
    }
  }, [gameState, displayedDialogues, currentDialogue]);

  // 显示下一段对话
  const showNextDialogue = () => {
    if (dialogueQueue.current.length === 0) {
    // 完成一轮对话后，将对话框收起在右侧而不是完全隐藏
    setTimeout(() => {
      setDisplayMode('minimized');
    }, 1000);
    return;
    }

    const nextDialogue = dialogueQueue.current.shift()!;
    
    // 根据角色调整打字速度，增加对话的真实感
    const typingSpeed = getTypingSpeedForCharacter(nextDialogue.character);
    
    setCurrentDialogue(nextDialogue);
    setDisplayedDialogues(prev => [...prev, nextDialogue.id]);
    
    // 打字效果
    setIsTyping(true);
    setDisplayText('');
    
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    
    let currentIndex = 0;
    const typeText = () => {
      if (currentIndex < nextDialogue.text.length) {
        // 随机添加一些小停顿，使打字更自然
        const pauseChance = Math.random();
        const delay = pauseChance > 0.95 ? 100 : pauseChance > 0.9 ? 50 : typingSpeed;
        
        setDisplayText(prev => prev + nextDialogue.text[currentIndex]);
        currentIndex++;
        typingTimeout.current = setTimeout(typeText, delay);
      } else {
        setIsTyping(false);
        
        // 对于有选项的对话，自动选择第一个选项（可选）
        if (nextDialogue.choices && nextDialogue.choices.length > 0) {
          setShowChoices(true);
        }
      }
    };
    
    // 如果有延迟，延迟后开始打字
    if (nextDialogue.delay) {
      setTimeout(typeText, nextDialogue.delay);
    } else {
      typeText();
    }
  };
  
  // 根据角色获取不同的打字速度，增加对话的真实感
  const getTypingSpeedForCharacter = (character: Character): number => {
    switch (character) {
      case 'su_huai':
        return 45; // 宿槐说话较慢，更有威严感
      case 'qingyuan':
        return 35; // 清鸢说话中等速度，优雅从容
      case 'xuqinglan':
        return 30; // 徐清岚说话较快，充满活力
      case 'shancatleader':
        return 25; // 善•猫教主说话最快，活泼可爱
      case 'narrator':
        return 40; // 旁白说话平稳适中
     case 'xuqinglan_god':
       return 32; // 徐清岚（神）说话稳重而神秘
     case 'nanaisei':
       return 28; // 奈奈生说话温和而优雅
     default:
       return 30;
    }
  };

  // 跳过打字效果
  const skipTyping = () => {
    if (isTyping && currentDialogue) {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      setDisplayText(currentDialogue.text);
      setIsTyping(false);
      
      // 快速显示选项（如果有）
      if (currentDialogue.choices && currentDialogue.choices.length > 0) {
        setShowChoices(true);
      }
    } else if (showChoices && currentDialogue?.choices) {
      // 如果显示选项，自动选择第一个选项
      handleChoice(currentDialogue.choices[0].nextLineId);
    } else {
      showNextDialogue();
    }
  };
  
  // 处理选择选项
  const handleChoice = (nextDialogueId: string) => {
    setShowChoices(false);
    
    // 查找下一个对话
    const nextDialogue = dialogueData.find(d => d.id === nextDialogueId);
    if (nextDialogue) {
      // 将选择的对话添加到队列开头
      dialogueQueue.current.unshift(nextDialogue);
    }
    
    // 显示下一段对话
    showNextDialogue();
  };

  // 清理函数
  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  // 更新最后发言的角色，用于对话过渡效果
  useEffect(() => {
    if (currentDialogue) {
      setPreviousCharacter(lastCharacter);
      setLastCharacter(currentDialogue.character);
      setDialogueHistory(prev => [...prev.slice(-5), currentDialogue]); // 只保留最近5条对话历史
    }
  }, [currentDialogue, lastCharacter]);

  // 如果不在首页，不显示
  if (location.pathname !== "/") return null;

  // 最小化状态时，总是显示一个可点击的小图标
  const isMinimized = displayMode === 'minimized';
  
  return (
    <AnimatePresence>
      {!isMinimized && currentDialogue ? (
        <motion.div 
          className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
         {/* 添加角色特定的视觉效果 - 增强视觉体验 */}
         <motion.div 
           className={`absolute inset-0 bg-gradient-to-r ${characterColors[currentDialogue.character]} opacity-5 rounded-full blur-3xl`}
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.05, 0.08, 0.05]
           }}
           transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
         />
         
         {/* 添加动态粒子效果，提升氛围 */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {Array.from({ length: 8 }).map((_, i) => (
             <motion.div
               key={i}
               className={`absolute rounded-full bg-${(characterColors[currentDialogue.character] || 'from-purple-600 to-purple-400').split(' ')[1].split('-')[0]}-400 opacity-30`}
               style={{
                 width: Math.random() * 8 + 2,
                 height: Math.random() * 8 + 2,
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
               }}
               animate={{
                 y: [0, -Math.random() * 30 - 10],
                 opacity: [0.3, 0],
               }}
               transition={{
                 duration: Math.random() * 3 + 2,
                 repeat: Infinity,
                 repeatType: "loop",
                 delay: Math.random() * 2,
               }}
             />
           ))}
         </div>
          
            <motion.div 
              className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-xl p-4 max-w-2xl w-full pointer-events-auto shadow-2xl border border-gray-700 relative overflow-hidden"
              onClick={skipTyping}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {/* 角色特定的光效背景 */}
              <div className="absolute inset-0 opacity-5">
                <div className={`absolute inset-0 bg-gradient-to-br ${characterColors[currentDialogue.character]}`}></div>
                <motion.div 
                  className="absolute top-1/2 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              
              {/* 左下角收起按钮 */}
              <motion.button
                className="absolute bottom-3 left-3 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full p-2 z-20 backdrop-blur-sm border border-gray-700 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDisplayMode('minimized')}
                aria-label="收起对话"
              >
                <i className="fa-solid fa-chevron-down"></i>
              </motion.button>
              
              <div className="flex items-start relative z-10">
                {/* 角色头像 - 增强动态效果 */}
                <motion.div 
                  className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 ${currentDialogue.character === 'su_huai' ? 'border-red-500 ring-2 ring-red-500' : `border-${(characterColors[currentDialogue.character] || 'from-purple-600 to-purple-400').split(' ')[1].split('-')[0]}-500 ring-2 ring-transparent`}`}
                  style={{ boxShadow: `0 0 20px ${currentDialogue.character === 'su_huai' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(79, 70, 229, 0.4)'}` }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <img
                    src={characterAvatars[currentDialogue.character]} 
                    alt={characterNames[currentDialogue.character]}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* 情感指示器 - 增强视觉效果 */}
                  {currentDialogue.emotion && (
                    <motion.div 
                      className="absolute -top-2 -right-2 bg-black bg-opacity-70 rounded-full w-7 h-7 flex items-center justify-center text-white text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {currentDialogue.emotion === 'happy' && '😊'}
                      {currentDialogue.emotion === 'sad' && '😢'}
                      {currentDialogue.emotion === 'angry' && '😠'}
                      {currentDialogue.emotion === 'surprised' && '😮'}
                      {currentDialogue.emotion === 'calm' && '😌'}
                      {currentDialogue.emotion === 'determined' && '😤'}
                      {currentDialogue.emotion === 'curious' && '🤔'}
                    </motion.div>
                  )}
                </motion.div>
                
                {/* 对话内容 */}
                <div className="flex-grow ml-4">
                  {/* 角色名称 - 增强视觉效果 */}
                  <motion.div 
                    className={`font-bold text-sm mb-2 inline-flex items-center px-3 py-1 rounded-full ${
                      currentDialogue.character === 'su_huai' 
                        ? 'bg-red-900/50 text-red-300 border border-red-700/50' 
                        : 'bg-gray-800/80 text-white border border-gray-700'
                    }`}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className={`mr-1.5 inline-block w-2 h-2 rounded-full ${
                      currentDialogue.character === 'su_huai' 
                        ? 'bg-red-400' 
                        : 'bg-blue-400'
                    }`}></span>
                    {characterNames[currentDialogue.character]}
                  </motion.div>
                  
                  {/* 对话文本容器 - 增加气泡形状 */}
                  <motion.div 
                    className="relative"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* 对话气泡小三角 */}
                    <div className={`absolute -left-4 top-2 w-4 h-4 rotate-45 ${
                      currentDialogue.character === 'su_huai' 
                        ? 'bg-red-900/20 border-t border-l border-red-700/50' 
                        : 'bg-gray-800/20 border-t border-l border-gray-700'
                    }`}></div>
                    
                    {/* 对话文本 - 增强动态效果 */}
                    <p className="text-white text-base mb-3 leading-relaxed bg-gray-800/20 backdrop-blur-sm p-4 rounded-xl border border-gray-700 shadow-inner">
                      {displayText}
                      {isTyping && (
                        <motion.span 
                          className="inline-block w-2 h-4 bg-white ml-1 rounded-full"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      )}
                    </p>
                    
                    {/* 打字声音指示器 */}
                    {isTyping && (
                      <div className="flex space-x-1.5 justify-end -mt-2 mb-2 mr-2">
                        {[1, 2, 3].map(i => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 1.2, 
                              repeat: Infinity, 
                              delay: i * 0.2,
                              repeatType: "reverse" 
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                  
                  {/* 对话选项 - 增强视觉效果 */}
                  <AnimatePresence>
                    {showChoices && currentDialogue.choices && (
                      <motion.div 
                        className="mt-4 space-y-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {currentDialogue.choices.map((choice, index) => (
                          <motion.button
                            key={index}
                            className={`w-full text-left bg-gradient-to-r ${
                              index === 0 
                                ? 'from-purple-900/80 to-indigo-900/80 hover:from-purple-800/80 hover:to-indigo-800/80 border-purple-700/50' 
                                : 'from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 border-gray-700'
                            } text-white p-3.5 rounded-xl border transition-all duration-300 shadow-lg backdrop-blur-sm group`}
                            whileHover={{ scale: 1.02, x: 6 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleChoice(choice.nextLineId)}
                            disabled={choice.condition && !choice.condition(gameState)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                          >
                            <span className="mr-3 font-bold text-lg text-purple-300">{index + 1}.</span> 
                            <span className="group-hover:text-purple-200 transition-colors duration-200">{choice.text}</span>
                            {choice.condition && !choice.condition(gameState) && (
                              <span className="ml-2 text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded-full">条件未满足</span>
                            )}
                            <motion.span 
                              className="inline-block ml-2 opacity-70"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <i className="fa-solid fa-arrow-right"></i>
                            </motion.span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* 提示信息 - 增强视觉效果 */}
                  <div className="text-xs text-gray-400 text-right flex flex-wrap justify-between items-center mt-3 gap-2">
                    <div className="flex items-center">
                      <i className="fa-solid fa-hand-pointer mr-1.5"></i>
                      {isTyping ? (
                        <span>点击快速显示</span>
                      ) : showChoices ? (
                        <span>选择一个选项</span>
                      ) : (
                        <span>点击继续</span>
                      )}
                    </div>
                    
                    {/* 进度指示器 - 增强视觉效果 */}
                    <div className="flex items-center bg-gray-800/50 px-2 py-1 rounded-full">
                      <span className="text-xs text-gray-500 mr-2">进度:</span>
                      <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${characterColors[currentDialogue.character]}`}
                          style={{ width: `${(displayText.length / (currentDialogue?.text.length || 1)) * 100}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(displayText.length / (currentDialogue?.text.length || 1)) * 100}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                        <motion.div 
                          className="absolute h-full w-6 bg-white/20 blur-sm"
                          animate={{ 
                            x: [0, '100%'],
                            opacity: [0, 0.7, 0]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5, 
                            ease: "easeInOut",
                            repeatDelay: 0.5
                          }}
                          style={{ pointerEvents: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 装饰元素 - 增强视觉效果 */}
              <motion.div 
                className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${characterColors[currentDialogue.character]}`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div 
                className={`absolute top-1/4 -left-10 w-20 h-20 rounded-full blur-2xl opacity-10 bg-gradient-to-br ${characterColors[currentDialogue.character]}`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        ) : (
            // 最小化状态：显示在右侧边缘的可点击图标 - 增强视觉效果
          <motion.div 
            className="fixed bottom-6 right-6 z-50 pointer-events-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setDisplayMode('expanded');
              // 如果有新对话可显示，直接显示下一条
              if (dialogueQueue.current.length > 0) {
                showNextDialogue();
              } else {
                // 检查是否有新的满足条件的对话
                const newDialogues = dialogueData.filter(dialogue => 
                  !displayedDialogues.includes(dialogue.id) && 
                  (!dialogue.condition || dialogue.condition(gameState))
                );
                
                if (newDialogues.length > 0) {
                  newDialogues.sort((a, b) => {
                    const getNumber = (id: string) => {
                      const match = id.match(/\d+/);
                      return match ? parseInt(match[0]) : 0;
                    };
                    
                    const numA = getNumber(a.id);
                    const numB = getNumber(b.id);
                    
                    if (numA < numB) return -1;
                    if (numA > numB) return 1;
                    return 0;
                  });
                  
                  dialogueQueue.current = newDialogues;
                  showNextDialogue();
                }
              }
            }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative group">
              {/* 图标底座光晕 */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* 图标主体 */}
              <motion.div 
                className="relative bg-gradient-to-r from-purple-600 to-indigo-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20"
                whileHover={{ y: -3 }}
              >
                <i className="fa-solid fa-comment text-white text-2xl animate-pulse"></i>
                
                {/* 未读消息指示器 */}
                {dialogueQueue.current.length > 0 && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {dialogueQueue.current.length}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

// 导出类型定义
export type { Character, DialogueLine };
export default DialogueSystem;