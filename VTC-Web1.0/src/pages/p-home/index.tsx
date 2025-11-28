

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [platform, setPlatform] = useState('auto');
  const [format, setFormat] = useState('markdown');
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '链文 - 视频文案提取工具';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('http')) {
        setVideoUrl(text);
      } else {
        alert('剪贴板中没有有效的链接');
      }
    } catch (err) {
      alert('无法访问剪贴板，请手动粘贴');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl) {
      alert('请输入视频链接');
      return;
    }

    setIsExtracting(true);

    setTimeout(() => {
      navigate(`/extract-result?url=${encodeURIComponent(videoUrl)}&platform=${platform}&format=${format}`);
    }, 2000);
  };

  const handleBatchProcessClick = () => {
    navigate('/batch-process');
  };

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = (e.target as HTMLInputElement).value;
      console.log('搜索：', searchTerm);
    }
  };

  const handleNotificationClick = () => {
    console.log('打开通知面板');
  };

  const handleUserDropdownClick = () => {
    console.log('打开个人中心菜单');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/50 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-link text-white text-sm"></i>
              </div>
              <h1 className={`text-xl font-bold ${styles.gradientText}`}>链文</h1>
            </div>
          </div>
          
          {/* 中间：搜索框（可选） */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索历史记录..." 
                onKeyPress={handleGlobalSearch}
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg ${styles.inputFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          {/* 右侧：用户操作 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNotificationClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://s.coze.cn/image/Sxw1RpQ5ECg/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full border-2 border-primary/20"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">张小明</span>
              <button 
                onClick={handleUserDropdownClick}
                className="p-1 rounded hover:bg-gray-100"
              >
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} bg-white/90 backdrop-blur-md border-r border-gray-200/50 z-40 transition-all duration-300`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/home" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 font-medium transition-all`}
          >
            <i className="fas fa-home text-lg w-5"></i>
            {!isSidebarCollapsed && <span>首页</span>}
          </Link>
          <Link 
            to="/batch-process" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-layer-group text-lg w-5"></i>
            {!isSidebarCollapsed && <span>批量处理</span>}
          </Link>
          <Link 
            to="/history" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-history text-lg w-5"></i>
            {!isSidebarCollapsed && <span>历史记录</span>}
          </Link>
          <Link 
            to="/help" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-question-circle text-lg w-5"></i>
            {!isSidebarCollapsed && <span>帮助教程</span>}
          </Link>
        </nav>
        
        {/* 底部用户信息 */}
        {!isSidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">今日已提取</div>
              <div className={`text-lg font-bold ${styles.gradientText}`}>12 次</div>
            </div>
          </div>
        )}
      </aside>

      {/* 主内容区 */}
      <main className={`${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen transition-all duration-300`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">欢迎回来，张小明</h2>
                <nav className="text-white/80 text-sm">
                  <span>首页</span>
                </nav>
              </div>
              <div className="text-right text-white/80">
                <div className="text-sm">今日提取次数</div>
                <div className="text-2xl font-bold text-white">12</div>
              </div>
            </div>
          </div>

          {/* 功能介绍区 */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${styles.featureCard} p-6 rounded-2xl shadow-card`}>
                <div className="w-12 h-12 bg-gradient-tertiary rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-bolt text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">高效提取</h3>
                <p className="text-gray-600 text-sm">一键提取视频文案，告别繁琐的手动操作，节省大量时间</p>
              </div>
              <div className={`${styles.featureCard} p-6 rounded-2xl shadow-card`}>
                <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-globe text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">多平台支持</h3>
                <p className="text-gray-600 text-sm">覆盖Bilibili、YouTube、抖音等主流视频平台</p>
              </div>
              <div className={`${styles.featureCard} p-6 rounded-2xl shadow-card`}>
                <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-file-alt text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">多种格式</h3>
                <p className="text-gray-600 text-sm">支持Markdown、带时间戳文本等多种输出格式</p>
              </div>
            </div>
          </section>

          {/* 链接输入区 */}
          <section className={`${styles.cardGradient} p-8 rounded-3xl shadow-card mb-8`}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">开始提取文案</h3>
              <p className="text-gray-600">粘贴视频链接，选择格式，一键获取文案内容</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* 视频链接输入 */}
              <div className="space-y-2">
                <label htmlFor="video-url" className="block text-sm font-medium text-gray-700">视频链接 *</label>
                <div className="relative">
                  <input 
                    type="url" 
                    id="video-url" 
                    name="video-url" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="请粘贴Bilibili、YouTube、抖音等平台的视频链接"
                    className={`w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl ${styles.inputFocus} text-lg`}
                  />
                  <button 
                    type="button" 
                    onClick={handlePasteClick}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <i className="fas fa-paste"></i>
                  </button>
                </div>
              </div>
              
              {/* 平台和格式选择 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="platform-select" className="block text-sm font-medium text-gray-700">视频平台</label>
                  <select 
                    id="platform-select" 
                    name="platform" 
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl ${styles.inputFocus}`}
                  >
                    <option value="auto">自动识别</option>
                    <option value="bilibili">Bilibili</option>
                    <option value="youtube">YouTube</option>
                    <option value="douyin">抖音</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="format-select" className="block text-sm font-medium text-gray-700">输出格式</label>
                  <select 
                    id="format-select" 
                    name="format" 
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl ${styles.inputFocus}`}
                  >
                    <option value="markdown">Markdown格式</option>
                    <option value="timestamp">带时间戳文本</option>
                    <option value="plain">纯文本</option>
                  </select>
                </div>
              </div>
              
              {/* 提取按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit" 
                  disabled={isExtracting}
                  className={`${styles.btnGradient} flex-1 py-4 px-6 text-white font-semibold rounded-xl shadow-glow`}
                >
                  {isExtracting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      提取中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      立即提取文案
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={handleBatchProcessClick}
                  className="flex-1 py-4 px-6 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  <i className="fas fa-layer-group mr-2"></i>
                  批量处理
                </button>
              </div>
            </form>
          </section>

          {/* 使用教程入口 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${styles.cardGradient} p-6 rounded-2xl shadow-card`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-play text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">使用教程</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">观看详细教程，快速掌握链文的使用方法</p>
              <Link 
                to="/help" 
                className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors"
              >
                查看教程
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            
            <div className={`${styles.cardGradient} p-6 rounded-2xl shadow-card`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-tertiary rounded-lg flex items-center justify-center">
                  <i className="fas fa-question-circle text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">常见问题</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">遇到问题？查看常见问题解答，快速找到解决方案</p>
              <Link 
                to="/help" 
                className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors"
              >
                查看FAQ
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

