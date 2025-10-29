import { Link } from 'react-router-dom';
// 使用普通动画替代framer-motion

export default function Empty() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="animate-fade-in text-center">
        <div className="text-8xl mb-6">
          <i className="fa-solid fa-seedling text-green-500"></i>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">页面不存在</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          您访问的页面不存在或已被移动。请返回主页继续游戏。
        </p>
        <div className="hover:scale-105 transition-transform duration-200">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg"
          >
            <i className="fa-solid fa-home mr-2"></i> 返回主页
          </Link>
        </div>
      </div>
      
      <div className="mt-16 text-center text-gray-500">
        <p>植物保卫战 © 2025</p>
      </div>
    </div>
  );
}