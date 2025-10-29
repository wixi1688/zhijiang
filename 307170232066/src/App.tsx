import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import GuideBook from './pages/GuideBook';
import StoryPage from './pages/StoryPage';
import SideStoryPage from './pages/SideStoryPage';
import StoryBranchPage from './pages/StoryBranchPage';
import StoryMajorEventsPage from './pages/StoryMajorEventsPage';
import StoryIntroductionPage from './pages/StoryIntroductionPage';
import CharacterRelationships from './pages/CharacterRelationships';
import { ThemeProvider } from './contexts/ThemeContext';
import MusicPlayer from './components/MusicPlayer';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guidebook" element={<GuideBook />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/side-stories" element={<SideStoryPage />} />
        <Route path="/story-branch" element={<StoryBranchPage />} />
        <Route path="/story-branch/major-events" element={<StoryMajorEventsPage />} />
        <Route path="/story-branch/introduction" element={<StoryIntroductionPage />} />
          {/* 添加关卡重定向路由，确保直接访问runtime也能正常加载 */}
          <Route path="/runtime" element={<Home />} />
          {/* 人物关系页面 */}
          <Route path="/character-relationships" element={<CharacterRelationships />} />
      </Routes>
      
      {/* 音乐播放器组件 - 固定在右下角 */}
      <MusicPlayer />
    </ThemeProvider>
  );
}

export default App;