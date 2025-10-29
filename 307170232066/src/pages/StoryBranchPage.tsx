import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const StoryBranchPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // 定义分支选项
  const branchOptions = [
    {
      id: 'major-events',
      title: '重大事件时间线',
      description: '跟随时间脉络，探索光明与暗影之战的关键转折点，见证历史上那些改变世界命运的重要时刻',
      icon: 'fa-landmark',
      color: 'from-blue-600 to-indigo-600',
      accentColor: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-800/50'
    },
    {
      id: 'introduction',
      title: '世界设定探索',
      description: '深入了解游戏世界的完整设定、各势力背景、角色关系和丰富的世界观体系',
      icon: 'fa-book-open',
      color: 'from-purple-600 to-pink-600',
      accentColor: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-800/50'
    }
  ];

  // 处理分支选择
  const handleBranchSelect = (branchId: string) => {
    navigate(`/story-branch/${branchId}`);
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
          className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      {/* 页面头部 */}
      <header className="max-w-6xl mx-auto mb-12 relative z-10">
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            剧情分支
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            选择一个分支，深入探索光明与暗影之战的精彩故事。了解游戏世界的重大事件和详细设定。
          </p>
        </motion.div>
      </header>
      
      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto pb-16 relative z-10">
        {/* 分支选项 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {branchOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className={`
                relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300
                ${option.bgColor} hover:shadow-xl hover:shadow-blue-900/20 ${option.borderColor} border group
                backdrop-blur-sm hover:-translate-y-1
              `}
              onClick={() => handleBranchSelect(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 装饰光晕 */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl z-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              
               {/* 内容 */}
               <div className="p-8 relative z-10">
                 {/* 图标 */}
                 <motion.div 
                   className={`w-16 h-16 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-blue-900/20`}
                   whileHover={{ scale: 1.1, rotate: 5 }}
                   transition={{ type: "spring", stiffness: 400 }}
                 >
                   <i className={`fa-solid ${option.icon}`}></i>
                 </motion.div>
                 
                 {/* 标题 */}
                 <h2 className="text-2xl font-bold text-white mb-3 relative inline-block">
                   {option.title}
                   <motion.div 
                     className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                     initial={{ width: 0 }}
                     whileInView={{ width: "100%" }}
                     transition={{ duration: 0.8 }}
                   />
                 </h2>
                 
                 {/* 描述 */}
                 <p className="text-gray-300 mb-6 leading-relaxed">
                   {option.description}
                 </p>
                 
                 {/* 功能标签 */}
                 <div className="flex flex-wrap gap-2 mb-6">
                   {option.id === 'major-events' ? (
                     <>
                       <span className="px-3 py-1 bg-blue-900/40 text-blue-300 rounded-full text-xs font-medium">时间线展示</span>
                       <span className="px-3 py-1 bg-blue-900/40 text-blue-300 rounded-full text-xs font-medium">关键战役</span>
                       <span className="px-3 py-1 bg-blue-900/40 text-blue-300 rounded-full text-xs font-medium">历史转折点</span>
                     </>
                   ) : (
                     <>
                       <span className="px-3 py-1 bg-purple-900/40 text-purple-300 rounded-full text-xs font-medium">世界观</span>
                       <span className="px-3 py-1 bg-purple-900/40 text-purple-300 rounded-full text-xs font-medium">角色背景</span>
                       <span className="px-3 py-1 bg-purple-900/40 text-purple-300 rounded-full text-xs font-medium">势力介绍</span>
                     </>
                   )}
                 </div>
                 
                 {/* 探索按钮 */}
                 <motion.div 
                   className={`inline-flex items-center ${option.accentColor} font-medium group`}
                   whileHover={{ x: 5 }}
                   transition={{ type: "spring", stiffness: 400 }}
                 >
                   <span className="relative overflow-hidden">
                     开始探索
                     <motion.span 
                       className="absolute inset-0 bg-white/10"
                       initial={{ x: "-100%" }}
                       whileHover={{ x: 0 }}
                       transition={{ duration: 0.3 }}
                     />
                   </span>
                   <motion.span 
                     className="ml-2"
                     animate={{ x: [0, 3, 0] }}
                     transition={{ 
                       duration: 1.5,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }}
                   >
                     <i className="fa-solid fa-arrow-right group-hover:text-white transition-colors duration-300"></i>
                   </motion.span>
                 </motion.div>
              </div>
              
              {/* 装饰元素 */}
              <motion.div 
                className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* 剧情背景介绍 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden"
        >
          {/* 装饰元素 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          
           <h2 className="text-xl font-bold mb-4 text-white flex items-center relative z-10">
            <i className="fa-solid fa-info-circle text-purple-400 mr-2"></i>
            探索游戏的深度世界
          </h2>
          <p className="text-gray-300 mb-4 relative z-10">
            剧情分支系统为您提供了深入探索游戏世界观的途径。通过"重大事件时间线"，您可以了解光明与暗影之战的历史发展；通过"世界设定探索"，您可以深入了解游戏中的各个角色、势力和地理环境。
          </p>
          <p className="text-gray-300 relative z-10">
            我们会持续更新剧情内容，随着游戏的推进和新角色的加入，您将能够探索更多隐藏的故事和秘密。完成特定任务还可能解锁独家的限定剧情内容。
          </p>
        </motion.div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800/90 backdrop-blur-sm text-gray-300 py-6 text-center relative z-10 border-t border-gray-700">
        <p>© 2025 光明与暗影之战 - 探索完整的故事线</p>
      </footer>
    </div>
  );
};

export default StoryBranchPage;