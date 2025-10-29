/**
 * 游戏剧情数据 - 完整的故事线
 * 所有剧情相关组件应从这里导入数据，以确保故事一致性
 */

// 定义对话角色类型
export type StoryCharacter = 'qingyuan' | 'shancatleader' | 'xuqinglan' | 'xuqinglan_student' | 'xuqinglan_dark' | 'su_huai' | 'narrator' | 'wise_elder' | 'young_su_huai' | 'cat' | 'qingxuan' | 'murongyanfeng' | 'xuqinglan_god' | 'nanaisei';

// 定义剧情章节类型
export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  content: StoryDialogue[];
  unlockCondition?: () => boolean;
}

// 定义对话内容类型
export interface StoryDialogue {
  id: string;
  character: StoryCharacter;
  text: string;
  emotion?: 'happy' | 'sad' | 'angry' | 'surprised' | 'calm';
  choices?: {
    text: string;
    nextDialogueId: string;
    condition?: () => boolean;
  }[];
  background?: string;
  effects?: string[];
}

// 角色头像映射
export const characterAvatars: Record<StoryCharacter, string> = {
  qingyuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/微信图片_20251016111846_103_92_20251016111910.jpg",
  shancatleader: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/善•猫教主_20251018115946.jpg",
  xuqinglan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚(魔法少女)_20251019101043.jpg",
  xuqinglan_student: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚(修习者）_20251019200844.jpg",
  xuqinglan_dark: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚（暗）_20251019210654.jpg",
  su_huai: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/宿槐僵尸_20251017203937.jpg",
  narrator: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20narrator%20mysterious%20figure%20cloaked%20in%20light%20cute%20chibi%20style&sign=a1c196cd894d1dbf7697e8dc74a74d38",
  wise_elder: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20wise%20elder%20long%20white%20beard%20flowing%20robes%20wise%20expression%20cute%20chibi%20style&sign=b9cae1785e6989ed1419712530c46355",
  young_su_huai: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=anime%20young%20princess%20purple%20hair%20kind%20smile%20cute%20chibi%20style&sign=420077d9385cdebe0f895640c598e27a",
  cat: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cute%20anime%20cat%20black%20fur%20big%20eyes%20chibi%20style&sign=b9abbe69758ee9fb563e3857bf16b3fd",
  qingxuan: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/青玄_20251020073321.jpg",
  murongyanfeng: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/慕容言风_20251020080449.jpg",
  xuqinglan_god: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚（神）_20251020165934.jpg",
  nanaisei: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/奈奈生_20251020220122.jpg"
};

// 角色名称映射
export const characterNames: Record<StoryCharacter, string> = {
  qingyuan: "清鸢",
  shancatleader: "善•猫教主",
  xuqinglan: "徐清岚（魔法少女）",
  xuqinglan_student: "徐清岚（修习者）",
  xuqinglan_dark: "徐清岚（暗）",
  su_huai: "宿槐",
  narrator: "旁白",
  wise_elder: "智慧长者",
  young_su_huai: "小宿槐",
  cat: "小猫",
  qingxuan: "青玄",
  murongyanfeng: "慕容言风",
  xuqinglan_god: "徐清岚（神）",
  nanaisei: "奈奈生"
};

// 角色颜色映射
export const characterColors: Record<StoryCharacter, string> = {
  qingyuan: "from-yellow-600 to-yellow-400",
  shancatleader: "from-blue-600 to-blue-400",
  xuqinglan: "from-purple-600 to-purple-400",
  xuqinglan_student: "from-indigo-600 to-indigo-400",
  xuqinglan_dark: "from-red-900 to-purple-900",
  su_huai: "from-red-600 to-red-400",
  narrator: "from-gray-600 to-gray-400",
  wise_elder: "from-blue-700 to-blue-500",
  young_su_huai: "from-purple-400 to-pink-400",
  cat: "from-gray-500 to-gray-300",
  qingxuan: "from-green-600 to-teal-400",
  murongyanfeng: "from-purple-900 to-indigo-600",
  xuqinglan_god: "from-cyan-600 to-blue-400",
  nanaisei: "from-yellow-500 to-white"
};

// 完整的游戏剧情
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "chapter-1",
    title: "光明与暗影的起源",
    description: "创世之初，光明大陆的诞生与守护者的使命",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ancient%20fantasy%20world%20creation%20light%20and%20darkness%20anime%20style%20beautiful%20scenery&sign=389d56ec26c2b180e0b38f7db28ae11b",
    content: [
      {
        id: "ch1-1",
        character: "narrator",
        text: "在宇宙诞生的混沌之中，两股强大的力量相互交织——光明与暗影。它们既相互对立，又相互依存，共同维持着宇宙的平衡。"
      },
      {
        id: "ch1-2",
        character: "narrator",
        text: "在这两股力量的交汇处，诞生了一片美丽的世界——光明大陆。这片土地上孕育着各种生命，花草树木，飞禽走兽，一切都显得那么和谐与美好。"
      },
      {
        id: "ch1-3",
        character: "wise_elder",
        text: "在光明大陆诞生的同时，从世界本源之力中自然孕育出了两位守护者——清鸢与宿槐。她们本为同源一体，如同双生姐妹，清鸢代表着光明与生命，宿槐代表着自然与平衡。"
      },
      {
        id: "ch1-4",
        character: "wise_elder",
        text: "姐妹们发誓要用自己的生命守护光明大陆的和平与繁荣。在她们的保护下，大陆上的生灵们过着幸福快乐的生活。"
      },
      {
        id: "ch1-5",
        character: "narrator",
        text: "然而，随着时间的推移，人类文明逐渐发展壮大。他们开始过度开发自然，砍伐森林，污染河流，破坏了大陆的生态平衡。这一切，都被宿槐默默地看在眼里..."
      },
      {
        id: "ch1-6",
        character: "narrator",
        text: "在独立于光暗大陆之外的虚空之中，一段尘封的回忆在清鸢的脑海中浮现..."
      },
      {
        id: "ch1-7",
        character: "su_huai",
        text: "生命，只有在停滞不前的时间中，才能实现永恒的幸福。我，宿槐，将停止所有生命的时间。将一切生命转化为静止状态，实现永远的和平与安定。",
        emotion: "calm"
      },
      {
        id: "ch1-8",
        character: "qingyuan",
        text: "你错了，宿槐！",
        emotion: "determined"
      },
      {
        id: "ch1-9",
        character: "su_huai",
        text: "吾之名为——宿槐！生命，因不断争斗、彼此伤害、心生怨恨，所以才会产生痛苦。这一切的元凶，就是'生命'本身，就是'时间'的流动！",
        emotion: "angry"
      },
      {
        id: "ch1-10",
        character: "qingyuan",
        text: "不！正因为时间流逝，生命才有喜怒哀乐，才能诞生出珍贵的事物和回忆！将这一切都停止，根本不是和平，那只是单纯的'停滞'！",
        emotion: "determined"
      },
      {
        id: "ch1-11",
        character: "su_huai",
        text: "无谓的挣扎……就让吾，来终结这一切吧！",
        emotion: "angry"
      },
      {
        id: "ch1-12",
        character: "narrator",
        text: "这段回忆如潮水般涌来，清鸢的眼神变得愈发坚定。她知道，宿槐内心深处的痛苦与迷茫，正是导致她走向黑暗的原因。"
      },
      {
        id: "ch1-6",
        character: "narrator",
        text: "宿槐的内心开始产生动摇，她不理解为什么人类要如此对待这片给予他们生命的土地。这种质疑，为后来的悲剧埋下了伏笔..."
      }
    ]
  },
  {
    id: "chapter-2",
    title: "宿槐的堕落",
    description: "内心的裂痕如何让黑暗力量乘虚而入",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=fallen%20angel%20corrupted%20by%20darkness%20anime%20style%20tragic%20scene&sign=4dcd71b43a83d4edb8abe4e264da7c23",
    content: [
      {
        id: "ch2-1",
        character: "narrator",
        text: "随着人类活动的加剧，光明大陆的环境日益恶化。宿槐对此感到无比痛心，她多次向人类发出警告，但都被置若罔闻。"
      },
      {
        id: "ch2-2",
        character: "young_su_huai",
        text: "清鸢姐姐，你看到了吗？森林在消失，河流在哭泣，动物们失去了家园...为什么人类要这样做？",
        emotion: "sad"
      },
      {
        id: "ch2-3",
        character: "qingyuan",
        text: "我看到了，宿槐妹妹。但我们不能失去信心，人类并非全是恶意的。我们应该继续引导他们，而不是放弃。",
        emotion: "calm"
      },
      {
        id: "ch2-4",
        character: "narrator",
        text: "尽管清鸢一直在安慰和鼓励着宿槐，但宿槐心中的失望与愤怒却与日俱增。她开始质疑自己守护人类的意义。"
      },
      {
        id: "ch2-5",
        character: "narrator",
        text: "随着时间的推移，宿槐对生命本质的理解与清鸢产生了越来越大的分歧。清鸢相信生命因变化而美丽，而宿槐则认为生命因变化而痛苦。"
      },
      {
        id: "ch2-6",
        character: "su_huai",
        text: "清鸢！你还不明白吗？生命本身就是痛苦的根源！因为时间的流逝，一切美好的事物都会凋零；因为生命的存在，才有了争斗和伤害！只有停止时间，让一切静止，才能实现真正的和平！",
        emotion: "angry"
      },
      {
        id: "ch2-7",
        character: "qingyuan",
        text: "不！宿槐！你忘记了我们曾经的对话了吗？正因为时间流逝，生命才有喜怒哀乐，才能诞生出珍贵的事物和回忆！将这一切都停止，根本不是和平，那只是单纯的'停滞'！",
        emotion: "surprised"
      },
      {
        id: "ch2-8",
        character: "su_huai",
        text: "已经太晚了，姐姐。我心意已决。从今天起，我将以暗影女王的身份，用我的方式守护这个世界——即使那意味着要与你为敌！",
        emotion: "angry"
      }
    ]
  },
  {
    id: "chapter-3",
    title: "魔法少女的使命",
    description: "来自异世界的少女如何与光明大陆产生联系",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=magical%20girl%20from%20another%20world%20anime%20style%20mystical%20atmosphere&sign=c56ce18bbfc13a43ff1cb909103e980c",
    content: [
      {
        id: "ch3-1",
        character: "narrator",
        text: "在另一个世界——人类世界中，生活着一位名叫徐清岚的天才魔法少女。年仅14岁的她，已经展现出了惊人的魔法天赋。"
      },
      {
        id: "ch3-2",
        character: "xuqinglan",
        text: "爷爷，为什么我能看到别人看不到的能量流动？为什么我总是做那些奇怪的梦？",
        emotion: "curious"
      },
      {
        id: "ch3-3",
        character: "wise_elder",
        text: "清岚，你是被选中的孩子。你的命运与另一个世界紧密相连。终有一天，你将肩负起重大的使命。",
        emotion: "calm"
      },
      {
        id: "ch3-4",
        character: "narrator",
        text: "随着时间的推移，清岚的梦境变得越来越清晰。她开始看到一个被黑暗笼罩的世界，以及两位正在战斗的美丽女性。"
      },
      {
        id: "ch3-5",
        character: "xuqinglan",
        text: "我必须去那里！我能感觉到，那个世界需要我的帮助！",
        emotion: "determined"
      },
      {
        id: "ch3-6",
        character: "wise_elder",
        text: "这是你的命运，清岚。带上这个星尘之笔，它会在关键时刻给予你力量。记住，真正的力量来自内心的信念。",
        emotion: "calm"
      },
      {
        id: "ch3-7",
        character: "narrator",
        text: "在古老的魔法阵中，清岚毅然启动了传送咒语。她的意识逐渐模糊，当她再次醒来时，发现自己已经来到了一个陌生而美丽的世界——光明大陆。"
      }
    ]
  },
  {
    id: "chapter-4",
    title: "善•猫教主的救赎",
    description: "一只小猫如何从黑暗中获得新生",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=cat%20transformed%20by%20light%20magic%20anime%20style%20redemption%20scene&sign=0163e5b77c9d585fdfca545f5aa48596",
    content: [
      {
        id: "ch4-1",
        character: "narrator",
        text: "在宿槐尚未堕落之前，她在精灵森林中救下了一只濒临死亡的小猫。这只小猫成为了她最忠实的伙伴，陪伴她度过了许多美好的时光。"
      },
      {
        id: "ch4-2",
        character: "cat",
        text: "喵~（蹭了蹭宿槐的手）",
        emotion: "happy"
      },
      {
        id: "ch4-3",
        character: "young_su_huai",
        text: "你真是个可爱的小家伙。以后你就叫'猫教主'吧！我们要永远在一起哦！",
        emotion: "happy"
      },
      {
        id: "ch4-4",
        character: "narrator",
        text: "然而，随着宿槐的堕落，小猫也被黑暗力量侵蚀，变成了半猫半僵尸的诡异形态。它失去了自我意识，成为了宿槐最得力的随从。"
      },
      {
        id: "ch4-5",
        character: "narrator",
        text: "在一次与清鸢的激烈战斗中，猫教主被光明之力击中。黑暗能量在体内剧烈震荡，唤醒了它内心深处残留的善良记忆。"
      },
      {
        id: "ch4-6",
        character: "qingyuan",
        text: "我感受到了！这只小猫还有救！它的内心仍有光明！",
        emotion: "surprised"
      },
      {
        id: "ch4-7",
        character: "narrator",
        text: "清鸢用自己的光明之力净化了猫教主被黑暗侵蚀的灵魂，赋予它全新的生命形态。重生后的猫教主获得了更加强大的光明之力，它决定用这份力量来弥补自己过去的过错。"
      },
      {
        id: "ch4-8",
        character: "shancatleader",
        text: "喵呜！我现在是善•猫教主！我要用光明的力量保护这个世界！",
        emotion: "happy"
      }
    ]
  },
  {
    id: "chapter-5",
    title: "徐清岚的修炼之旅",
    description: "魔法少女如何在光明大陆成长为强大的修习者",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=magical%20girl%20training%20anime%20style%20fantasy%20world%20mystical%20atmosphere&sign=fd3f64fbd1e144ee2343f95b9635c41c",
    content: [
      {
        id: "ch5-1",
        character: "narrator",
        text: "来到光明大陆的徐清岚，被这个世界浓郁的魔法能量所吸引。在清鸢的引导下，她开始在星辰秘境中修习本源魔法。"
      },
      {
        id: "ch5-2",
        character: "qingyuan",
        text: "清岚，这里的魔法与你在人类世界所学的截然不同。它是这片土地的本源力量，需要用心去感受，而不仅仅是控制。",
        emotion: "calm"
      },
      {
        id: "ch5-3",
        character: "xuqinglan",
        text: "我明白，清鸢姐姐。这股力量...它在和我说话！我能感受到它的脉动，它的呼吸...",
        emotion: "surprised"
      },
      {
        id: "ch5-4",
        character: "narrator",
        text: "随着修炼的深入，徐清岚逐渐掌握了控制和融合不同元素的魔法力量。她的星尘之笔也随之进化，能够同时操控多种元素之力。"
      },
      {
        id: "ch5-5",
        character: "xuqinglan_student",
        text: "啊！这...这是什么感觉？我...我感觉自己的身体在变化！星尘之笔...它在回应我！",
        emotion: "surprised"
      },
      {
        id: "ch5-6",
        character: "qingyuan",
        text: "不要害怕，清岚。这是你的第二次觉醒，你正在与这片土地的魔法力量融为一体。接受它，拥抱它，它将成为你最强大的武器。",
        emotion: "calm"
      },
      {
        id: "ch5-7",
        character: "narrator",
        text: "经过艰苦的修炼，徐清岚终于掌握了光明大陆的本源魔法，成为了强大的修习者。然而，长时间的独处和高强度的修行也让她的内心产生了一丝孤寂感..."
      }
    ]
  },
  {
    id: "chapter-6",
    title: "季灾的阴谋",
    description: "暗影谋士如何策划对徐清岚的偷袭",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=dark%20magic%20wizard%20plotting%20evil%20scheme%20anime%20style%20dark%20atmosphere&sign=7469c12d1462aef0d50bc66f84ae86a0",
    content: [
      {
        id: "ch6-1",
        character: "narrator",
        text: "在光明与黑暗对决的前夕，暗影世界的首席谋士'季灾'，通过神秘的星象占卜，预感到一个足以改变战局的变数正在光明大陆出现—那就是正在修习本源魔法的徐清岚。"
      },
      {
        id: "ch6-2",
        character: "ji_zai",
        text: "这个人类女孩...她的魔法天赋...太可怕了。如果让她完全掌握了光明大陆的本源魔法，对我们暗影世界将是致命的威胁。我必须在她成长起来之前除掉她！",
        emotion: "angry"
      },
      {
        id: "ch6-3",
        character: "narrator",
        text: "在一个月黑风高的夜晚，季灾偷偷潜入了徐清岚的修炼之地。他利用暗影魔法制造出了徐清岚内心最深处的恐惧幻象—她的家人被黑暗力量所困，她的朋友在痛苦中挣扎。"
      },
      {
        id: "ch6-4",
        character: "xuqinglan_student",
        text: "爷爷！爸爸妈妈！不...这不是真的！这一定是幻觉！",
        emotion: "sad"
      },
      {
        id: "ch6-5",
        character: "ji_zai",
        text: "就是现在！黑暗吞噬！",
        emotion: "angry"
      },
      {
        id: "ch6-6",
        character: "narrator",
        text: "当徐清岚沉浸在冥想状态时，季灾发动了致命的偷袭，重伤了毫无防备的她。在极度的恐惧和痛苦中，徐清岚内心的那丝孤寂和迷茫被无限放大。黑暗力量乘虚而入，逐渐吞噬了她的意识和灵魂..."
      }
    ]
  },
  {
    id: "chapter-7",
    title: "徐清岚的堕落",
    description: "光明少女如何被黑暗力量侵蚀",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=fallen%20magical%20girl%20corrupted%20by%20darkness%20anime%20style%20tragic%20scene&sign=88e6b148a00090819d77a9b52f580fd3",
    content: [
      {
        id: "ch7-1",
        character: "narrator",
        text: "当徐清岚再次醒来时，她的眼睛已变成了血红色，曾经纯净的魔法能量也被黑暗所污染。她成为了'徐清岚（暗）'—一个被黑暗力量彻底控制的强大战士。"
      },
      {
        id: "ch7-2",
        character: "xuqinglan_dark",
        text: "清鸢...善•猫教主...你们为什么要抛弃我？为什么要让我一个人承受这一切？",
        emotion: "angry"
      },
      {
        id: "ch7-3",
        character: "ji_zai",
        text: "欢迎加入暗影的怀抱，徐清岚。在这里，你将获得真正的力量，不再被任何人抛弃。",
        emotion: "happy"
      },
      {
        id: "ch7-4",
        character: "narrator",
        text: "在季灾的蛊惑下，徐清岚（暗）彻底投入了暗影的怀抱。她的魔法天赋在黑暗力量的加持下变得更加强大，能够操控死亡和毁灭的力量。"
      },
      {
        id: "ch7-5",
        character: "xuqinglan_dark",
        text: "光明...都是虚伪的！只有黑暗才是真实的！我要用这黑暗的力量，让这个世界为我所受的痛苦付出代价！",
        emotion: "angry"
      }
    ]
  },
  {
    id: "chapter-8",
    title: "光明与暗影的终极对决",
    description: "清鸢、善•猫教主与堕落的徐清岚之间的最终战役",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=epic%20battle%20between%20light%20and%20darkness%20anime%20style%20heroic%20scene&sign=36f823e01eac4a285021ca80118ce903",
    content: [
      {
        id: "ch8-1",
        character: "narrator",
        text: "在得知徐清岚堕落的消息后，清鸢和善•猫教主悲痛欲绝。但他们并没有放弃，而是决定在战场上唤醒徐清岚内心深处的光明。"
      },
      {
        id: "ch8-2",
        character: "qingyuan",
        text: "清岚！我知道你还在里面！请回来吧！我们需要你！",
        emotion: "sad"
      },
      {
        id: "ch8-3",
        character: "shancatleader",
        text: "喵呜~清岚姐姐！不要被黑暗控制！我们是好朋友啊！",
        emotion: "sad"
      },
      {
        id: "ch8-4",
        character: "xuqinglan_dark",
        text: "好朋友？哈哈哈哈...好朋友会让我一个人承受那么多痛苦吗？好朋友会在我最需要帮助的时候离开我吗？",
        emotion: "angry"
      },
      {
        id: "ch8-5",
        character: "qingyuan",
        text: "不，清岚！我们从来没有离开过你！是你自己封闭了内心，拒绝了我们的帮助！请相信我们，我们一直都在你身边！",
        emotion: "determined"
      },
      {
        id: "ch8-6",
        character: "narrator",
        text: "在清鸢和善•猫教主的呼唤下，徐清岚（暗）的内心开始产生动摇。她的脑海中浮现出与朋友们在一起的美好时光，那些温暖的记忆正在与黑暗力量抗争..."
      },
      {
        id: "ch8-7",
        character: "xuqinglan",
        text: "我...我想起来了...那些美好的时光...那些珍贵的友谊...我...我不能被黑暗控制！",
        emotion: "determined"
      },
      {
        id: "ch8-8",
        character: "narrator",
        text: "在光明与黑暗的激烈碰撞中，徐清岚终于找回了真正的自我。她的眼睛重新焕发出明亮的光芒，星尘之笔也恢复了纯净的魔法能量。在三位英雄的共同努力下，暗影女王宿槐的暗影军团被彻底击败。"
      }
    ]
  },
  {
    id: "chapter-9",
    title: "未来的希望",
    description: "战斗后的光明大陆与新的开始",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=reborn%20world%20after%20battle%20anime%20style%20hopeful%20scene&sign=4930c3d0d9d9dc299290d5085cd2b1ab",
    content: [
      {
        id: "ch9-1",
        character: "narrator",
        text: "光明与暗影的终极对决持续了三天三夜。最终，在三位英雄的共同努力下，宿槐被击败了。然而，清鸢并没有选择消灭自己的妹妹，而是用光明之力净化了她体内的黑暗能量。"
      },
      {
        id: "ch9-2",
        character: "su_huai",
        text: "姐姐...我...我都做了些什么...我差点毁了我们守护的一切...",
        emotion: "sad"
      },
      {
        id: "ch9-3",
        character: "qingyuan",
        text: "没关系，妹妹。重要的是你找回了自己。我们一起重建光明大陆，好吗？",
        emotion: "happy"
      },
      {
        id: "ch9-4",
        character: "narrator",
        text: "在大家的共同努力下，光明大陆逐渐恢复了往日的生机与美丽。人类也从这次事件中吸取了教训，开始与自然和谐相处。"
      },
      {
        id: "ch9-5",
        character: "xuqinglan",
        text: "看来这里的一切都已经恢复正常了。我应该回到自己的世界了。",
        emotion: "sad"
      },
      {
        id: "ch9-6",
        character: "qingyuan",
        text: "谢谢你，清岚。你不仅拯救了光明大陆，也教会了我们希望的力量。无论何时，你都是我们永远的朋友。",
        emotion: "happy"
      },
      {
        id: "ch9-7",
        character: "shancatleader",
        text: "喵呜~别忘了我们哦！有空一定要回来看我们！",
        emotion: "sad"
      },
      {
        id: "ch9-8",
        character: "xuqinglan",
        text: "我会的！这里永远是我的第二个家！再见了，朋友们！",
        emotion: "happy"
      },
      {
        id: "ch9-9",
        character: "narrator",
        text: "随着魔法阵的启动，清岚回到了自己的世界。但她知道，只要光明大陆需要她，她随时会再次穿越时空，前来相助。而光明大陆的故事，也将继续传唱下去..."
      }
    ]
  },
  {
    id: "chapter-10",
    title: "明渊的守护者",
    description: "慕容言风与明渊的秘密",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=mysterious%20human%20in%20shadow%20light%20anime%20style%20legendary%20warrior&sign=cbd94dc69383495f670c91e0834e1315",
    content: [
      {
        id: "ch10-1",
        character: "narrator",
        text: "在光明大陆的最边缘，有一个被称为'明渊'的神秘地方。这里是光明与暗影的交汇之处，也是通往星界之门的最后关键。"
      },
      {
        id: "ch10-2",
        character: "wise_elder",
        text: "明渊...那个地方...充满了危险和未知。据说只有最强大和最勇敢的人才能在那里生存下来。"
      },
      {
        id: "ch10-3",
        character: "narrator",
        text: "然而，在这个混乱的地方，却居住着一个让人捉摸不透的人类——慕容言风。他性格阴晴不定，时而喜好杀人，时而喜好饮酒作乐。"
      },
      {
        id: "ch10-4",
        character: "murongyanfeng",
        text: "哈哈哈...光明与黑暗，不过是可笑的戏码罢了。我只相信自己的力量，和手中的这把剑。",
        emotion: "calm"
      },
      {
        id: "ch10-5",
        character: "qingyuan",
        text: "慕容言风，你的力量确实强大，但你的内心似乎也被黑暗所侵蚀。难道你不想回到光明的怀抱吗？"
      },
      {
        id: "ch10-6",
        character: "murongyanfeng",
        text: "光明的怀抱？别开玩笑了。我见过太多光明下的黑暗，也见过太多黑暗中的光明。所谓的正义，不过是胜利者的说辞罢了。",
        emotion: "angry"
      },
      {
        id: "ch10-7",
        character: "narrator",
        text: "尽管如此，当宿槐的黑暗大军入侵光明大陆时，慕容言风还是选择了站在光明一方。他的力量对抵御僵尸起到了关键作用。"
      },
      {
        id: "ch10-8",
        character: "xuqinglan",
        text: "慕容先生，谢谢你的帮助。但我很好奇，你为什么会选择帮助我们？"
      },
      {
        id: "ch10-9",
        character: "murongyanfeng",
        text: "帮助？我只是在保护我自己的领地。如果光明大陆沦陷了，明渊也会跟着遭殃。再说...",
        emotion: "calm"
      },
      {
        id: "ch10-10",
        character: "murongyanfeng",
        text: "再说，季灾和离火那两个家伙...我可不想让他们得逞。",
        emotion: "calm"
      }
    ]
  },
  {
    id: "chapter-11",
    title: "星界之门的守护者",
    description: "青玄的使命与陨落",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=celestial%20gate%20guardian%20anime%20style%20mystical%20atmosphere%20girl%20with%20umbrella&sign=4dc70b07b5c3d2a37336ebf35ed87860",
    content: [
      {
        id: "ch11-1",
        character: "narrator",
        text: "在光明大陆的最东端，云雾缭绕的星界山顶，矗立着一扇宏伟的星界之门。这扇由星辰之力凝聚而成的大门，是连接光明大陆与其他世界的唯一通道。而守护这扇门的，是一位神秘而强大的女子——青玄。"
      },
      {
        id: "ch11-2",
        character: "qingxuan",
        text: "星界之门...连接光明与暗影的桥梁，维持着宇宙万物的平衡。我，青玄，作为创世神的使者，必须用生命守护它，绝不能让任何人破坏这来之不易的和平。",
        emotion: "calm"
      },
      {
        id: "ch11-3",
        character: "narrator",
        text: "青玄身着飘逸的青蓝色长袍，手持由星尘凝聚而成的'流光伞'。她拥有操控风和木元素的强大力量，既能对敌人造成毁灭性的打击，又能为同伴提供治愈和保护。在漫长的岁月里，她默默地履行着自己的职责，成为了星界之门最可靠的守护者。"
      },
      {
        id: "ch11-4",
        character: "qingxuan",
        text: "季节的变迁，星辰的流转...我已记不清在这里守护了多少岁月。但我知道，只要星界之门还在，我的使命就不会结束。即使孤独，即使疲惫，我也会坚持下去。",
        emotion: "calm"
      },
      {
        id: "ch11-5",
        character: "narrator",
        text: "然而，在季灾的精心策划下，这一切都被打破了。在一个电闪雷鸣的雨夜，徐清岚（暗）带着暗影大军突然出现在星界山顶，发动了对青玄的突袭。"
      },
      {
        id: "ch11-6",
        character: "xuqinglan_dark",
        text: "青玄...你守护星界之门的日子已经结束了。今天，我要为暗影世界打开这条通道，让黑暗的力量席卷整个光明大陆！",
        emotion: "angry"
      },
      {
        id: "ch11-7",
        character: "qingxuan",
        text: "不...你不能这么做！这会破坏两界的平衡，导致无法挽回的后果！徐清岚，我能感受到你内心还有光明，不要被黑暗蒙蔽了双眼！",
        emotion: "surprised"
      },
      {
        id: "ch11-8",
        character: "narrator",
        text: "在激烈的战斗中，青玄展现出了惊人的实力，她操控着风和木元素，与暗影大军展开了殊死搏斗。然而，面对数量众多的敌人和实力强大的徐清岚（暗），青玄最终还是因为寡不敌众而受了重伤，从星界之门的高台上坠落，消失在茫茫云海之中...她的命运，成为了光明大陆上最令人牵挂的谜团。"
      }
    ]
  },
  {
    id: "chapter-12",
    title: "人类的记忆",
    description: "屹九的故事与光暗大战",
    thumbnail: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=cute%20anime%20boy%20with%20red%20string%20of%20lanterns%20happy%20expression%20traditional%20clothing&sign=13ea0695c553f9f0887ae8d92b3e0c94",
    content: [
      {
        id: "ch12-1",
        character: "narrator",
        text: "在遥远的人类世界，有一个名叫屹九的小男孩。他出生在京城的一个高官世家，有着圆滚滚的脸蛋、大大的眼睛和永远挂着笑容的嘴角。屹九最喜欢吃的就是糖葫芦，无论走到哪里，手里总是拿着一串红通通的糖葫芦，一边吃一边蹦蹦跳跳，可爱的模样让所有人都忍不住想要疼爱他。"
      },
      {
        id: "ch12-2",
        character: "yijiu",
        text: "糖葫芦～糖葫芦～真好吃！爹爹说糖葫芦是世界上最美味的东西！要是能让所有人都吃到这么美味的糖葫芦，那该有多好啊！",
        emotion: "happy"
      },
      {
        id: "ch12-3",
        character: "narrator",
        text: "然而，命运总是充满了意外。当光暗大战的战火蔓延到人类世界时，一场突如其来的空袭摧毁了屹九的家园。在混乱中，年幼的屹九不幸丧生，他纯真的灵魂被强大的能量卷入了光明大陆，成为了一个特殊的存在。"
      },
      {
        id: "ch12-4",
        character: "yijiu",
        text: "这...这是哪里？我为什么会在这里？我的糖葫芦呢？我想回家...我想爹爹和娘亲...",
        emotion: "surprised"
      },
      {
        id: "ch12-5",
        character: "qingyuan",
        text: "可怜的孩子...你的灵魂被卷入了这场光暗之战。不过，你的纯真和善良可以成为对抗黑暗的强大力量。光明之力被你的纯净心灵所吸引，它希望你能成为光明大陆的守护者。",
        emotion: "calm"
      },
      {
        id: "ch12-6",
        character: "narrator",
        text: "在清鸢的引导下，屹九的灵魂与光明大陆的植物力量融合，获得了新的生命形态。虽然变成了植物，但屹九依然保持着他纯真可爱的性格和对糖葫芦的喜爱。在战场上，他的特殊能力发挥了巨大的作用——敌人看到他呆萌可爱的模样，往往会不自觉地减弱攻击，甚至陷入迷惑状态。屹九成为了光明大陆上最特殊的守护者，用他独特的方式为光明而战。"
      },
      {
        id: "ch12-7",
        character: "yijiu",
        text: "大哥哥，大姐姐，屹九会用糖葫芦保护你们的！虽然屹九很小，但屹九也很勇敢哦！",
        emotion: "happy"
      }
    ]
  }
];

// 获取所有剧情章节的解锁状态
export const getUnlockedChapters = (): string[] => {
  try {
    // 尝试从localStorage获取解锁状态
    const savedUnlockedChapters = localStorage.getItem('story_unlocked_chapters');
    if (savedUnlockedChapters) {
      const unlocked = JSON.parse(savedUnlockedChapters);
      if (Array.isArray(unlocked)) {
        return unlocked;
      }
    }
    
    // 默认解锁前3个章节
    return STORY_CHAPTERS.slice(0, 3).map(chapter => chapter.id);
  } catch (error) {
    console.error('Failed to get unlocked chapters:', error);
    // 出错时返回默认解锁的章节
    return STORY_CHAPTERS.slice(0, 3).map(chapter => chapter.id);
  }
};

// 解锁新章节
export const unlockChapter = (chapterId: string): void => {
  try {
    // 获取当前已解锁的章节
    const currentUnlocked = getUnlockedChapters();
    
    // 检查章节是否已经解锁
    if (!currentUnlocked.includes(chapterId)) {
      // 添加新解锁的章节
      const newUnlocked = [...currentUnlocked, chapterId];
      
      // 保存到localStorage
      localStorage.setItem('story_unlocked_chapters', JSON.stringify(newUnlocked));
      
      console.log(`Chapter ${chapterId} unlocked`);
      
      // 触发storage事件，以便其他页面能及时更新
      window.dispatchEvent(new StorageEvent('storage', { key: 'story_unlocked_chapters' }));
    }
  } catch (error) {
    console.error('Failed to unlock chapter:', error);
  }
};

// 定义番外剧情类型
export interface SideStory extends StoryChapter {
  characterType: 'plant' | 'zombie';
  characterId: string;
}

// 完整的番外剧情
export const SIDE_STORIES: SideStory[] = [
  // 清鸢的背景故事
  {
    id: "side-qingyuan",
    title: "清鸢的抉择",
    description: "光明守护者的成长历程与内心挣扎",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/微信图片_20251016111846_103_92_20251016111910.jpg",
    content: [
      {
        id: "s1-1",
        character: "narrator",
        text: "在世界诞生之初，光明与暗影相互交融，共同维持着宇宙的平衡。在这两股力量的交汇处，诞生了两位守护者——清鸢与宿槐。"
      },
      {
        id: "s1-2",
        character: "wise_elder",
        text: "清鸢，你代表着光明与生命的力量。你的使命是守护这片大陆上的所有生灵，引导他们走向和谐与繁荣。"
      },
      {
        id: "s1-3",
        character: "qingyuan",
        text: "我明白了，长者。我会用我的生命守护这个世界，不让任何黑暗势力侵蚀这片土地。"
      },
      {
        id: "s1-4",
        character: "narrator",
        text: "随着时间的推移，人类文明逐渐发展壮大。然而，他们开始过度开发自然，破坏了大陆的生态平衡。清鸢看在眼里，心中充满了忧虑。"
      },
      {
        id: "s1-5",
        character: "qingyuan",
        text: "宿槐妹妹，你看，人类正在破坏我们守护的土地。我们必须想办法引导他们，让他们明白与自然和谐相处的重要性。"
      },
      {
        id: "s1-6",
        character: "su_huai",
        text: "姐姐，他们根本不会听我们的。这些人类只知道索取，不知道珍惜。也许，只有让一切都静止，才能真正保护这个世界。"
      },
      {
        id: "s1-7",
        character: "narrator",
        text: "清鸢没有想到，宿槐的内心已经产生了如此大的变化。她预感到，一场巨大的危机即将到来..."
      }
    ],
    characterType: "plant",
    characterId: "qingyuan"
  },
  
  // 宿槐的背景故事
  {
    id: "side-su_huai",
    title: "宿槐的坠落",
    description: "暗影女王的内心世界与转变历程",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/宿槐僵尸_20251017203937.jpg",
    content: [
      {
        id: "s2-1",
        character: "narrator",
        text: "在光明大陆的精灵森林中，曾经生活着一位温柔善良的精灵公主——明月。她与姐姐清鸢一起守护着这片土地的和平与繁荣。"
      },
      {
        id: "s2-2",
        character: "young_su_huai",
        text: "姐姐，你看，这些花朵开得多美啊！要是能让它们永远绽放，那该有多好。"
      },
      {
        id: "s2-3",
        character: "qingyuan",
        text: "傻妹妹，正因为花朵会凋零，它们的绽放才显得如此珍贵。生命的美好就在于它的短暂与无常。"
      },
      {
        id: "s2-4",
        character: "narrator",
        text: "然而，随着人类活动的加剧，精灵森林逐渐被破坏，许多美丽的生物失去了家园。明月的内心充满了痛苦与愤怒。"
      },
      {
        id: "s2-5",
        character: "su_huai",
        text: "为什么？为什么人类要这样对待这片土地？他们难道不知道，没有自然的滋养，他们也无法生存吗？"
      },
      {
        id: "s2-6",
        character: "narrator",
        text: "在无尽的痛苦与愤怒中，明月的内心逐渐被黑暗所吞噬。她改名为宿槐，决心用自己的方式守护这个世界——即使那意味着要与姐姐为敌..."
      }
    ],
    characterType: "zombie",
    characterId: "su_huai"
  },
  
  // 善•猫教主的背景故事
  {
    id: "side-shancatleader",
    title: "从暗影到光明",
    description: "一只小猫的救赎之旅",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/善•猫教主_20251018115946.jpg",
    content: [
      {
        id: "s3-1",
        character: "narrator",
        text: "在精灵森林的深处，生活着一只可爱的小黑猫。它经常在森林中穿梭，与各种小动物玩耍。"
      },
      {
        id: "s3-2",
        character: "young_su_huai",
        text: "哦，可怜的小猫，你怎么受伤了？来，让我帮你治疗。"
      },
      {
        id: "s3-3",
        character: "cat",
        text: "喵~（蹭了蹭宿槐的手）"
      },
      {
        id: "s3-4",
        character: "narrator",
        text: "小猫成为了宿槐的忠实伙伴，陪伴她度过了许多美好的时光。然而，随着宿槐的堕落，小猫也被黑暗力量侵蚀，变成了半猫半僵尸的诡异形态。"
      },
      {
        id: "s3-5",
        character: "qingyuan",
        text: "这只小猫还有救！它的内心仍有光明！我要用我的力量净化它。"
      },
      {
        id: "s3-6",
        character: "narrator",
        text: "清鸢用光明之力净化了小猫被黑暗侵蚀的灵魂，赋予它全新的生命形态。重生后的小猫获得了更加强大的光明之力，它决定用这份力量来弥补自己过去的过错。"
      },
      {
        id: "s3-7",
        character: "shancatleader",
        text: "喵呜！我现在是善•猫教主！我要用光明的力量保护这个世界！"
      }
    ],
    characterType: "plant",
    characterId: "shancatleader"
  },
  
  // 徐清岚的背景故事
  {
    id: "side-xuqinglan",
    title: "魔法少女的秘密",
    description: "来自人类世界的魔法少女如何与光明大陆产生联系",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚(魔法少女)_20251019101043.jpg",
    content: [
      {
        id: "s4-1",
        character: "narrator",
        text: "在人类世界的一个宁静小镇上，生活着一位名叫徐清岚的普通女孩。然而，她的命运从出生起就注定不平凡。"
      },
      {
        id: "s4-2",
        character: "xuqinglan",
        text: "爷爷，为什么我总是能看到奇怪的光芒？其他小朋友都说我在撒谎...",
        emotion: "sad"
      },
      {
        id: "s4-3",
        character: "wise_elder",
        text: "清岚，你不是在撒谎。你是被选中的孩子，拥有看见魔法能量的天赋。终有一天，你将肩负起重大的使命。"
      },
      {
        id: "s4-4",
        character: "narrator",
        text: "随着年龄的增长，清岚的梦境变得越来越清晰。她开始梦到一个被黑暗笼罩的世界，以及一位在痛苦中挣扎的白色身影。"
      },
      {
        id: "s4-5",
        character: "xuqinglan",
        text: "我必须去帮助她！那个世界需要我！爷爷，请告诉我怎么才能过去！",
        emotion: "determined"
      },
      {
        id: "s4-6",
        character: "wise_elder",
        text: "这是你的命运，清岚。带上这个星尘之笔，它会在关键时刻给予你力量。记住，真正的力量来自内心的信念。"
      }
    ],
    characterType: "plant",
    characterId: "xuqinglan"
  },
  
  // 青玄的背景故事
  {
    id: "side-qingxuan",
    title: "星界守护者的陨落",
    description: "星界之门守护者青玄的悲壮故事",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/青玄_20251020073321.jpg",
    content: [
      {
        id: "s5-1",
        character: "narrator",
        text: "在星界山顶，青玄已经守护星界之门千年。她是创世神的使者，发誓用生命维护两界的平衡。"
      },
      {
        id: "s5-2",
        character: "qingxuan",
        text: "星界之门...连接光明与暗影的桥梁，维持着宇宙万物的平衡。即使孤独，即使疲惫，我也会坚持下去。",
        emotion: "calm"
      },
      {
        id: "s5-3",
        character: "narrator",
        text: "然而，随着宿槐的堕落，星界之门的平衡被打破。青玄预感到了即将到来的危机。"
      },
      {
        id: "s5-4",
        character: "qingxuan",
        text: "黑暗的气息正在逼近...我必须加强星界之门的防御。无论如何，我都不能让暗影大军通过这里！",
        emotion: "determined"
      },
      {
        id: "s5-5",
        character: "narrator",
        text: "在那个电闪雷鸣的夜晚，徐清岚（暗）带着暗影大军突然出现，发动了对青玄的突袭。尽管青玄展现出了惊人的实力，但最终还是因为寡不敌众而坠落..."
      },
      {
        id: "s5-6",
        character: "qingxuan",
        text: "星界之力...护佑光明...即使我倒下，也绝不会让你们通过...",
        emotion: "determined"
      }
    ],
    characterType: "plant",
    characterId: "qingxuan"
  },
  
  // 慕容言风的背景故事
  {
    id: "side-murongyanfeng",
    title: "明渊的孤独守护者",
    description: "亦正亦邪的慕容言风背后的故事",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/慕容言风_20251020080449.jpg",
    content: [
      {
        id: "s6-1",
        character: "narrator",
        text: "在光明大陆的最边缘，有一个被称为'明渊'的神秘地方。这里是光明与暗影的交汇之处，也是通往星界之门的最后关键。"
      },
      {
        id: "s6-2",
        character: "murongyanfeng",
        text: "哈哈哈...又有不怕死的家伙闯进我的领地了？这里可不是你们该来的地方。",
        emotion: "calm"
      },
      {
        id: "s6-3",
        character: "narrator",
        text: "慕容言风曾经是光明大陆最杰出的战士之一，但在一次任务中被暗影力量侵蚀，从此隐居明渊，变得性格阴晴不定。"
      },
      {
        id: "s6-4",
        character: "ji_zai",
        text: "慕容言风，我们又见面了。加入我们吧，和我们一起征服光明大陆！",
        emotion: "happy"
      },
      {
        id: "s6-5",
        character: "murongyanfeng",
        text: "季灾，你还是这么自以为是。我慕容言风，从不会屈服于任何人！",
        emotion: "angry"
      },
      {
        id: "s6-6",
        character: "narrator",
        text: "尽管性格乖戾，但在关键时刻，慕容言风还是选择站在光明一方。他的力量对抵御僵尸起到了关键作用。"
      }
    ],
    characterType: "plant",
    characterId: "murongyanfeng"
  },
  
  // 奈奈生的背景故事
  {
    id: "side-nanaisei",
    title: "命运的预言者",
    description: "拥有预见能力的神秘少女奈奈生",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/奈奈生_20251020220122.jpg",
    content: [
      {
        id: "s7-1",
        character: "narrator",
        text: "在光明大陆的东部森林中，住着一位神秘的预言师少女——奈奈生。她拥有预见未来的能力，却也因此承受着常人无法想象的痛苦。"
      },
      {
        id: "s7-2",
        character: "nanaisei",
        text: "命运的齿轮已经开始转动，光明与黑暗的对决将决定这个世界的未来...",
        emotion: "calm"
      },
      {
        id: "s7-3",
        character: "narrator",
        text: "奈奈生的预言从未出错。当她预见到宿槐的堕落和徐清岚的到来时，便知道一场关乎整个光明大陆命运的战争即将爆发。"
      },
      {
        id: "s7-4",
        character: "nanaisei",
        text: "清岚，你的成长远超我的预期。光明之力在你体内流淌，你将成为对抗黑暗的关键。但要小心，黑暗也在寻找着你的弱点...",
        emotion: "surprised"
      },
      {
        id: "s7-5",
        character: "narrator",
        text: "尽管预见了无数的可能性，但奈奈生始终相信，真正的命运掌握在每个人自己的手中。她选择用自己的能力帮助徐清岚和清鸢，为光明大陆的未来而战。"
      }
    ],
    characterType: "plant",
    characterId: "nanaisei"
  },
  
  // 徐清岚（神）的背景故事
  {
    id: "side-xuqinglan_god",
    title: "神化的觉醒",
    description: "徐清岚如何突破极限，成为传说中的存在",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/徐清岚（神）_20251020165934.jpg",
    content: [
      {
        id: "s8-1",
        character: "narrator",
        text: "在与宿槐的最终决战中，徐清岚为了保护清鸢和善•猫教主，激发了体内沉睡的星界之力，完成了前所未有的神化觉醒。"
      },
      {
        id: "s8-2",
        character: "xuqinglan_god",
        text: "星界之力啊，请赐予我保护这个世界的力量！光明与暗影的平衡，由我来守护！",
        emotion: "determined"
      },
      {
        id: "s8-3",
        character: "narrator",
        text: "神化后的徐清岚获得了无与伦比的力量。她的星尘之笔进化成了星辰之杖，能够操控宇宙中最纯粹的能量。"
      },
      {
        id: "s8-4",
        character: "su_huai",
        text: "这...这不可能！你怎么可能获得如此强大的力量？",
        emotion: "surprised"
      },
      {
        id: "s8-5",
        character: "xuqinglan_god",
        text: "真正的力量不是来自外界，而是来自内心的信念和对伙伴的爱。宿槐，我会用这份力量，让你重新找回真正的自己！",
        emotion: "happy"
      },
      {
        id: "s8-6",
        character: "narrator",
        text: "在神化徐清岚的帮助下，清鸢终于成功净化了宿槐体内的黑暗能量。光明大陆再次恢复了和平与繁荣。"
      }
    ],
    characterType: "plant",
    characterId: "xuqinglan_god"
   },
  // 霞的背景故事
  {
    id: "side-xia",
    title: "来自暗影的守护者",
    description: "霞的成长历程与她的特殊使命",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/霞_20251021164140.jpg",
    content: [
      {
        id: "s9-1",
        character: "narrator",
        text: "在暗影大陆较为平缓的中轴地带，生活着一位名叫霞的少女。与其他被暗影力量完全侵蚀的居民不同，霞的内心始终保持着一丝光明与善良。"
      },
      {
        id: "s9-2",
        character: "xia",
        text: "妈妈，爸爸什么时候回来？我好想他...",
        emotion: "sad"
      },
      {
        id: "s9-3",
        character: "narrator",
        text: "霞的父亲在一次暗影大陆的战争中不幸离世，留下她与母亲相依为命。母女俩经常受到那些被'混乱'影响的人的欺负，但她们从未放弃对美好生活的向往。"
      },
      {
        id: "s9-4",
        character: "narrator",
        text: "直到那一天，Vexithra前往宿槐所在的明渊时，途径此地，遇到了正在被欺负的霞。Vexithra心中的善良被激发了出来，使用暗影冲锋与暗影狂怒，击杀了那些被混乱影响的人。"
      },
      {
        id: "s9-5",
        character: "xia",
        text: "谢谢...请问您是谁？我能追随您学习战斗吗？",
        emotion: "surprised"
      },
      {
        id: "s9-6",
        character: "narrator",
        text: "Vexithra并未做出回应，而是虚化身躯继续赶路。这一幕对霞的内心产生了极大的冲击。她第一次意识到，原来强大的力量可以用来保护自己和所爱的人。"
      },
      {
        id: "s9-7",
        character: "xia",
        text: "如果我也有这么强的能力就好了...这样就不会再被欺负了...",
        emotion: "determined"
      },
      {
        id: "s9-8",
        character: "narrator",
        text: "从那天起，霞开始了她的修行之路。她在暗影大陆中寻找各种古老的修炼方法，努力提升自己的实力。尽管过程充满了艰辛与危险，但她从未放弃。她相信总有一天，她会成为像Vexithra一样强大的守护者，保护那些无法保护自己的人。"
      }
    ],
    characterType: "zombie",
    characterId: "xia"
  },
  // Alibi的背景故事
  {
    id: "side-alibi",
    title: "时间的囚徒",
    description: "Alibi的过去与他对时间的独特理解",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/Alibi_20251022055207.jpg",
    content: [
      {
        id: "s10-1",
        character: "narrator",
        text: "在暗影大陆最阴暗的角落，曾经存在着一个名为'时光城'的繁荣文明。这个文明的居民掌握着操控时间的神秘力量，过着平静而幸福的生活。Alibi，曾经是这个文明中最杰出的时间守护者之一。"
      },
      {
        id: "s10-2",
        character: "alibi",
        text: "时间是最公平的，它对每个人都一视同仁...",
        emotion: "calm"
      },
      {
        id: "s10-3",
        character: "narrator",
        text: "然而，随着暗影力量的不断侵蚀，时光城的居民开始变得贪婪和疯狂。他们试图利用时间之力来延长自己的生命，甚至逆转死亡。这种对时间法则的违背最终导致了整个城市的毁灭。"
      },
      {
        id: "s10-4",
        character: "narrator",
        text: "Alibi是这场灾难中唯一的幸存者，但他也付出了惨重的代价。他的身体被转化为僵尸，永远被困在了生与死之间的状态。更可怕的是，他的意识被迫在时间的长河中不断穿梭，亲眼目睹着自己的家园被毁灭的过程一次又一次地上演。"
      },
      {
        id: "s10-5",
        character: "alibi",
        text: "我们被困在时间里，但时间本身也在消逝...",
        emotion: "sad"
      },
      {
        id: "s10-6",
        character: "narrator",
        text: "在无尽的痛苦与绝望中，Alibi逐渐掌握了操控时间的新方式。他学会了停滞时间，甚至可以在短时间内预测未来的走势。但这些能力的代价是他的记忆和人性逐渐被侵蚀，使他成为了如今这个既冷漠又矛盾的存在。"
      },
      {
        id: "s10-7",
        character: "narrator",
        text: "现在，Alibi在战场上寻找着某种救赎。他拒绝被宿槐直接控制，选择按照自己的意志行动。或许在他内心深处，还残留着一丝对过去的记忆和对救赎的渴望..."
      }
    ],
     characterType: "zombie",
    characterId: "alibi"
  },
  // 秋月的背景故事
   {
    id: "side-shantao",
    title: "桃花与时空",
   description: "山桃与时空城的故事",
    thumbnail: "https://lf-code-agent.coze.cn/obj/x-ai-cn/307170232066/attachment/Cache_-29e3261540d29512_20251023000220.jpg",
   content: [
      {
        id: "s12-1",
        character: "narrator",
        text: "在时空的长河中，有一座神秘的城市——时空城。这座城市位于时间与空间的交界处，没有时间的概念，也不受时间的约束。在这里，一切都是永恒的，包括居住在其中的居民。山桃，就是时空城的一位美丽少女。"
      },
      {
        id: "s12-2",
         character: "wise_elder",
        text: "山桃，你是时空城最特别的存在。你的木属性力量与时空之力完美融合，能够在时间的长河中自由穿梭。但你要记住，不要轻易干涉其他世界的事务，否则可能会引起时空混乱。",
        emotion: "calm"
      },
       {
        id: "s12-3",
        character: "su_huai",
         text: "时空城的山桃小姐，我是暗影女王宿槐。我来是想请你帮个忙。",
        emotion: "happy"
      },
       {
        id: "s12-4",
        character: "shantao",
         text: "暗影女王？我听说过你。你想让我做什么？",
        emotion: "surprised"
      },
       {
        id: "s12-5",
        character: "su_huai",
         text: "我想请你帮忙观察这场光明与暗影的战争，记录下所有的可能性。你的时空之力，应该能够做到这一点。",
        emotion: "calm"
      },
       {
        id: "s12-6",
        character: "narrator",
         text: "山桃陷入了沉思。她知道，时空城的居民不应该参与其他世界的战争。但宿槐的请求让她感到好奇，她想看看这场战争会有多少种可能性。最终，好奇心战胜了理智，她决定答应宿槐的请求。",
        emotion: "calm"
      },
       {
        id: "s12-7",
        character: "shantao",
         text: "三月的信笺揉成团，春风一哄，枝头便炸开粉红的暄言...这场战争，会有怎样的结局呢？",
        emotion: "curious"
      },
       {
        id: "s12-8",
        character: "narrator",
         text: "最终，山桃决定以观察者的身份参与这场战争。她不会直接帮助任何一方，只是默默地记录着每一种可能性。在战场上，她的木属性力量和时空之力结合，创造出了独特的战斗方式。她的桃花源技能能够为队友提供保护，而桃花护符则让她在危险中生存下来。虽然身处战场，但她的内心依然保持着对美好事物的向往，就像她手中那朵永远不会凋零的桃花一样。"
      }
    ],
     characterType: "zombie",
    characterId: "shantao"
  }
];