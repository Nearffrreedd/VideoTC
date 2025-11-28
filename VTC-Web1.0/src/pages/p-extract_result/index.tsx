

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface BatchResult {
  id: string;
  url: string;
  platform: string;
  title: string;
  status: 'success' | 'failed';
  length: string;
  time: string;
}

interface MockContent {
  markdown: string;
  timestamp: string;
  plain: string;
}

const ExtractResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentFormat, setCurrentFormat] = useState('markdown');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBatchItem, setSelectedBatchItem] = useState<BatchResult | null>(null);
  const [isCopySuccess, setIsCopySuccess] = useState(false);

  // 模拟数据
  const mockContent: MockContent = {
    markdown: `
# 视频标题：如何高效学习前端开发

## 引言
大家好，今天我想和大家分享一下如何高效学习前端开发。前端开发是一个非常有趣且充满挑战的领域，需要我们不断学习和实践。

## 学习路径
1. **基础知识**：HTML、CSS、JavaScript
2. **框架学习**：React、Vue、Angular
3. **项目实践**：多做项目，积累经验

## 总结
学习前端开发需要耐心和毅力，希望今天的分享对大家有帮助。
    `,
    timestamp: `
[00:00:00] 大家好，今天我想和大家分享一下如何高效学习前端开发。
[00:00:15] 前端开发是一个非常有趣且充满挑战的领域，需要我们不断学习和实践。
[00:01:20] 首先，我们需要掌握基础知识，包括HTML、CSS和JavaScript。
[00:02:30] 然后，学习主流框架如React、Vue、Angular。
[00:03:45] 最重要的是多做项目，通过实践来巩固所学知识。
[00:05:10] 学习前端开发需要耐心和毅力，希望今天的分享对大家有帮助。
    `,
    plain: `
大家好，今天我想和大家分享一下如何高效学习前端开发。前端开发是一个非常有趣且充满挑战的领域，需要我们不断学习和实践。

首先，我们需要掌握基础知识，包括HTML、CSS和JavaScript。然后，学习主流框架如React、Vue、Angular。最重要的是多做项目，通过实践来巩固所学知识。

学习前端开发需要耐心和毅力，希望今天的分享对大家有帮助。
    `
  };

  const mockBatchResults: BatchResult[] = [
    {
      id: 'batch-1',
      url: 'https://www.bilibili.com/video/BV1234567890',
      platform: 'Bilibili',
      title: '前端开发入门指南',
      status: 'success',
      length: '850字',
      time: '2024-01-15 14:30:25'
    },
    {
      id: 'batch-2',
      url: 'https://www.youtube.com/watch?v=abcdefghijk',
      platform: 'YouTube',
      title: 'React Hooks 详解',
      status: 'success',
      length: '1200字',
      time: '2024-01-15 14:31:10'
    },
    {
      id: 'batch-3',
      url: 'https://v.douyin.com/abcd1234/',
      platform: '抖音',
      title: 'CSS动画效果教程',
      status: 'failed',
      length: '',
      time: '2024-01-15 14:32:15'
    }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '提取结果 - 链文';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化页面状态
  useEffect(() => {
    const batchId = searchParams.get('batchId');
    const batchResults = searchParams.get('batchResults');
    
    if (batchId || batchResults) {
      setIsBatchMode(true);
    } else {
      setIsBatchMode(false);
      const formatParam = searchParams.get('format');
      if (formatParam && ['markdown', 'timestamp', 'plain'].includes(formatParam)) {
        setCurrentFormat(formatParam);
      }
    }
  }, [searchParams]);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 事件处理函数
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleFormatChange = (format: string) => {
    setCurrentFormat(format);
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleDownloadContent = () => {
    const content = mockContent[currentFormat as keyof MockContent] || mockContent.markdown;
    const filename = `文案_${new Date().toLocaleString('zh-CN').replace(/\//g, '-').replace(/:/g, '-')}.txt`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  const handleCopyContent = async () => {
    const content = mockContent[currentFormat as keyof MockContent] || mockContent.markdown;
    try {
      await navigator.clipboard.writeText(content);
      setIsCopySuccess(true);
      setTimeout(() => setIsCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleEditContent = () => {
    const content = mockContent[currentFormat as keyof MockContent] || mockContent.markdown;
    const title = selectedBatchItem ? selectedBatchItem.title : '如何高效学习前端开发';
    
    const params = new URLSearchParams({
      content: encodeURIComponent(content),
      title: encodeURIComponent(title),
      format: currentFormat
    });
    
    navigate(`/text-editor?${params.toString()}`);
  };

  const handleShareContent = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleCopyShareLink = async () => {
    const shareLink = 'https://lianwen.app/share/abc123';
    try {
      await navigator.clipboard.writeText(shareLink);
      // 显示复制成功状态
      console.log('分享链接已复制');
    } catch (error) {
      console.error('复制分享链接失败:', error);
    }
  };

  const handleFullscreen = () => {
    const contentDisplay = document.querySelector('#content-display');
    if (contentDisplay && contentDisplay.requestFullscreen) {
      contentDisplay.requestFullscreen();
    } else if (contentDisplay && (contentDisplay as any).webkitRequestFullscreen) {
      (contentDisplay as any).webkitRequestFullscreen();
    } else if (contentDisplay && (contentDisplay as any).msRequestFullscreen) {
      (contentDisplay as any).msRequestFullscreen();
    }
  };

  const handleViewBatchItem = (batchId: string) => {
    const batchItem = mockBatchResults.find(item => item.id === batchId);
    if (batchItem) {
      setSelectedBatchItem(batchItem);
      setIsBatchMode(false);
    }
  };

  const handleRetryBatchItem = (batchId: string) => {
    console.log('重试提取失败的视频:', batchId);
    // 实现重试逻辑
  };

  const handleShareModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowShareModal(false);
    }
  };

  // 获取当前文案内容
  const getCurrentContent = () => {
    return mockContent[currentFormat as keyof MockContent] || mockContent.markdown;
  };

  // 获取当前视频信息
  const getCurrentVideoInfo = () => {
    if (selectedBatchItem) {
      return {
        title: selectedBatchItem.title,
        platform: selectedBatchItem.platform,
        time: selectedBatchItem.time,
        length: selectedBatchItem.length
      };
    }
    
    return {
      title: '如何高效学习前端开发',
      platform: searchParams.get('platform') || 'Bilibili',
      time: new Date().toLocaleString('zh-CN'),
      length: '约 1200 字'
    };
  };

  const videoInfo = getCurrentVideoInfo();

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
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg ${styles.inputFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          {/* 右侧：用户操作 */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://s.coze.cn/image/eZmsZGPDV_E/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full border-2 border-primary/20"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">张小明</span>
              <button className="p-1 rounded hover:bg-gray-100">
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
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
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
                <h2 className="text-3xl font-bold text-white mb-2">提取结果</h2>
                <nav className="text-white/80 text-sm">
                  {isBatchMode ? (
                    <Link to="/batch-process" className="hover:text-white transition-colors">批量处理</Link>
                  ) : (
                    <Link to="/home" className="hover:text-white transition-colors">首页</Link>
                  )}
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>提取结果</span>
                </nav>
              </div>
              <button 
                onClick={handleBackToHome}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
              >
                <i className="fas fa-arrow-left"></i>
                <span>返回首页</span>
              </button>
            </div>
          </div>

          {/* 批量提取结果列表（仅批量时显示） */}
          {isBatchMode && (
            <section className="mb-8">
              <div className={`${styles.cardGradient} p-6 rounded-2xl shadow-card`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">批量提取结果</h3>
                <div className="space-y-3">
                  {mockBatchResults.map((item) => (
                    <div key={item.id} className={`${styles.batchItem} ${styles.cardGradient} p-4 rounded-xl shadow-card cursor-pointer`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <i className="fas fa-video text-white"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm truncate max-w-md">{item.title}</h4>
                            <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                              <span>{item.platform}</span>
                              <span>{item.time}</span>
                              {item.status === 'success' && <span>{item.length}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${item.status === 'success' ? 'text-success' : 'text-danger'}`}>
                            {item.status === 'success' ? (
                              <>
                                <i className="fas fa-check-circle"></i> 提取成功
                              </>
                            ) : (
                              <>
                                <i className="fas fa-times-circle"></i> 提取失败
                              </>
                            )}
                          </span>
                          {item.status === 'success' ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewBatchItem(item.id);
                              }}
                              className="px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-secondary transition-colors"
                            >
                              查看
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRetryBatchItem(item.id);
                              }}
                              className="px-3 py-1 bg-warning text-white text-xs rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                              重试
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 文案展示区 */}
          {!isBatchMode && (
            <section className={`${styles.cardGradient} p-6 rounded-2xl shadow-card mb-6`}>
              {/* 视频信息 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <i className="fas fa-video text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{videoInfo.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{videoInfo.platform}</span>
                      <span>{videoInfo.time}</span>
                      <span>{videoInfo.length}</span>
                    </div>
                  </div>
                  <a 
                    href={selectedBatchItem?.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary transition-colors"
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>

              {/* 格式切换 */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">显示格式：</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleFormatChange('markdown')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentFormat === 'markdown' ? styles.formatBtnActive : styles.formatBtnInactive
                      }`}
                    >
                      <i className="fas fa-code mr-2"></i>Markdown
                    </button>
                    <button 
                      onClick={() => handleFormatChange('timestamp')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentFormat === 'timestamp' ? styles.formatBtnActive : styles.formatBtnInactive
                      }`}
                    >
                      <i className="fas fa-clock mr-2"></i>带时间戳
                    </button>
                    <button 
                      onClick={() => handleFormatChange('plain')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentFormat === 'plain' ? styles.formatBtnActive : styles.formatBtnInactive
                      }`}
                    >
                      <i className="fas fa-file-alt mr-2"></i>纯文本
                    </button>
                  </div>
                </div>
              </div>

              {/* 文案内容 */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button 
                      onClick={handleCopyContent}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" 
                      title="复制内容"
                    >
                      <i className="fas fa-copy text-gray-600"></i>
                    </button>
                    <button 
                      onClick={handleFullscreen}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" 
                      title="全屏查看"
                    >
                      <i className="fas fa-expand text-gray-600"></i>
                    </button>
                  </div>
                  <div 
                    id="content-display"
                    className="bg-gray-50 rounded-xl p-6 min-h-[300px] overflow-auto font-mono text-sm leading-relaxed"
                  >
                    <pre className="whitespace-pre-wrap break-words">{getCurrentContent()}</pre>
                  </div>
                </div>
              </div>

              {/* 操作按钮区 */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleDownloadContent}
                  className={`${styles.btnGradient} flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-xl shadow-glow`}
                >
                  <i className="fas fa-download"></i>
                  <span>下载文案</span>
                </button>
                <button 
                  onClick={handleCopyContent}
                  className={`flex items-center space-x-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all ${
                    isCopySuccess ? styles.copySuccess : ''
                  }`}
                >
                  <i className="fas fa-copy"></i>
                  <span>{isCopySuccess ? '已复制' : '复制文案'}</span>
                </button>
                <button 
                  onClick={handleEditContent}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-tertiary text-tertiary font-semibold rounded-xl hover:bg-tertiary hover:text-white transition-all"
                >
                  <i className="fas fa-edit"></i>
                  <span>编辑文案</span>
                </button>
                <button 
                  onClick={handleShareContent}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-secondary text-secondary font-semibold rounded-xl hover:bg-secondary hover:text-white transition-all"
                >
                  <i className="fas fa-share-alt"></i>
                  <span>分享文案</span>
                </button>
              </div>
            </section>
          )}

          {/* 分享弹窗 */}
          {showShareModal && (
            <div 
              onClick={handleShareModalClick}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">分享文案</h3>
                  <button 
                    onClick={handleCloseShareModal}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">分享链接</label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value="https://lianwen.app/share/abc123" 
                      readOnly 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button 
                      onClick={handleCopyShareLink}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleCopyShareLink}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    复制链接
                  </button>
                  <button 
                    onClick={handleCloseShareModal}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExtractResultPage;

