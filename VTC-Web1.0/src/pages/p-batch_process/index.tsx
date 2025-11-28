

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface BatchResult {
  url: string;
  platform: string;
  status: 'success' | 'failed' | 'processing';
  title?: string;
  id?: string;
  error?: string;
}

const BatchProcessPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [batchLinks, setBatchLinks] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [showProgressSection, setShowProgressSection] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [showCompleteActions, setShowCompleteActions] = useState(false);
  
  const processingIntervalRef = useRef<number | null>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '批量处理 - 链文';
    return () => { document.title = originalTitle; };
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
      }
    };
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 计算链接数量
  const getLinkCount = () => {
    return batchLinks.trim().split('\n').filter(link => link.trim()).length;
  };

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 批量粘贴
  const handlePasteBatch = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.split('\n').filter(line => line.trim() && line.includes('http'));
      if (lines.length > 0) {
        const currentValue = batchLinks.trim();
        const newValue = currentValue + (currentValue ? '\n' : '') + lines.join('\n');
        setBatchLinks(newValue);
      } else {
        alert('剪贴板中没有有效的链接');
      }
    } catch (err) {
      alert('无法访问剪贴板，请手动粘贴');
    }
  };

  // 清空输入
  const handleClearInput = () => {
    setBatchLinks('');
  };

  // 获取平台名称
  const getPlatformFromUrl = (url: string): string => {
    if (url.includes('bilibili')) return 'Bilibili';
    if (url.includes('youtube')) return 'YouTube';
    if (url.includes('douyin') || url.includes('tiktok')) return '抖音/TikTok';
    return '未知平台';
  };

  // 处理单个链接
  const processSingleLink = async (link: string, index: number, _total: number): Promise<BatchResult> => {
    return new Promise((resolve) => {
      // 模拟处理延迟（3-5秒）
      setTimeout(() => {
        // 模拟90%成功率
        const success = Math.random() > 0.1;
        
        if (success) {
          resolve({
            url: link,
            platform: getPlatformFromUrl(link),
            status: 'success',
            title: `视频标题 ${index + 1}`,
            id: `batch_result_${Date.now()}_${index}`
          });
        } else {
          resolve({
            url: link,
            platform: getPlatformFromUrl(link),
            status: 'failed',
            error: '提取失败，请检查链接是否有效'
          });
        }
      }, 3000 + Math.random() * 2000);
    });
  };

  // 批量处理主函数
  const startBatchProcessing = async (links: string[], _format: string) => {
    setIsProcessing(true);
    setBatchResults([]);
    setShowProgressSection(true);
    setCurrentProgress(0);
    setTotalLinks(links.length);
    setShowCompleteActions(false);
    
    const results: BatchResult[] = [];
    
    for (let i = 0; i < links.length; i++) {
      if (!isProcessing) break; // 如果已取消，停止处理
      
      const link = links[i];
      const platform = getPlatformFromUrl(link);
      
      // 添加处理中的状态
      results.push({
        url: link,
        platform,
        status: 'processing'
      });
      setBatchResults([...results]);
      
      // 处理当前链接
      const result = await processSingleLink(link, i, links.length);
      results[i] = result;
      setBatchResults([...results]);
      
      // 更新进度
      setCurrentProgress(i + 1);
    }
    
    if (isProcessing) {
      setIsProcessing(false);
      setShowCompleteActions(true);
    }
  };

  // 表单提交
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const links = batchLinks.trim().split('\n').filter(link => link.trim());
    
    if (links.length === 0) {
      alert('请至少输入一个视频链接');
      return;
    }
    
    if (links.length > 20) {
      alert('每次批量处理最多支持20个链接');
      return;
    }
    
    startBatchProcessing(links, selectedFormat);
  };

  // 取消批量处理
  const handleCancelBatch = () => {
    if (isProcessing) {
      setIsProcessing(false);
      alert('批量处理已取消');
    }
  };

  // 查看单个结果
  const handleViewResult = (index: number) => {
    const result = batchResults[index];
    if (result && result.status === 'success' && result.id) {
      navigate(`/extract-result?batchId=${result.id}&format=${selectedFormat}`);
    }
  };

  // 查看所有结果
  const handleViewAllResults = () => {
    const batchId = `batch_${Date.now()}`;
    navigate(`/extract-result?batchId=${batchId}&format=${selectedFormat}&batchResults=${encodeURIComponent(JSON.stringify(batchResults))}`);
  };

  // 批量下载
  const handleDownloadAll = () => {
    alert('批量下载功能开发中...');
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
                src="https://s.coze.cn/image/GzPpBThbXX8/" 
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
      <aside className={`fixed left-0 top-16 bottom-0 ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} bg-white/90 backdrop-blur-md border-r border-gray-200/50 z-40 transition-all duration-300`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/home" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-home text-lg w-5"></i>
            {!sidebarCollapsed && <span>首页</span>}
          </Link>
          <div className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 font-medium transition-all`}>
            <i className="fas fa-layer-group text-lg w-5"></i>
            {!sidebarCollapsed && <span>批量处理</span>}
          </div>
          <Link 
            to="/history" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-history text-lg w-5"></i>
            {!sidebarCollapsed && <span>历史记录</span>}
          </Link>
          <Link 
            to="/help" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-question-circle text-lg w-5"></i>
            {!sidebarCollapsed && <span>帮助教程</span>}
          </Link>
        </nav>
        
        {/* 底部用户信息 */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">今日已提取</div>
              <div className={`text-lg font-bold ${styles.gradientText}`}>12 次</div>
            </div>
          </div>
        )}
      </aside>

      {/* 主内容区 */}
      <main className={`${sidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen transition-all duration-300`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">批量处理</h2>
                <nav className="text-white/80 text-sm">
                  <Link to="/home" className="hover:text-white transition-colors">首页</Link>
                  <span className="mx-2">{'>'}</span>
                  <span>批量处理</span>
                </nav>
              </div>
              <div className="text-right text-white/80">
                <div className="text-sm">今日批量处理</div>
                <div className="text-2xl font-bold text-white">3 次</div>
              </div>
            </div>
          </div>

          {/* 批量链接输入区 */}
          <section className={`${styles.cardGradient} p-8 rounded-3xl shadow-card mb-8`}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">批量提取文案</h3>
              <p className="text-gray-600">每行输入一个视频链接，支持Bilibili、YouTube、抖音等平台</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* 批量链接输入 */}
              <div className="space-y-2">
                <label htmlFor="batch-links" className="block text-sm font-medium text-gray-700">视频链接列表 *</label>
                <div className="relative">
                  <textarea 
                    id="batch-links" 
                    name="batch-links" 
                    rows={8}
                    placeholder={`请每行输入一个视频链接，例如：
https://www.bilibili.com/video/BV1234567890
https://www.youtube.com/watch?v=abcdefghijk
https://v.douyin.com/abc123/`}
                    className={`w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl ${styles.inputFocus} text-base resize-none`}
                    value={batchLinks}
                    onChange={(e) => setBatchLinks(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={handlePasteBatch}
                    className="absolute right-3 bottom-3 p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <i className="fas fa-paste"></i>
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>支持Bilibili、YouTube、抖音、TikTok等平台</span>
                  <span>{getLinkCount()} 个链接</span>
                </div>
              </div>
              
              {/* 格式选择 */}
              <div className="space-y-2">
                <label htmlFor="batch-format-select" className="block text-sm font-medium text-gray-700">输出格式</label>
                <select 
                  id="batch-format-select" 
                  name="format" 
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl ${styles.inputFocus}`}
                >
                  <option value="markdown">Markdown格式</option>
                  <option value="timestamp">带时间戳文本</option>
                  <option value="plain">纯文本</option>
                </select>
              </div>
              
              {/* 批量提取按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className={`${styles.btnGradient} flex-1 py-4 px-6 text-white font-semibold rounded-xl shadow-glow`}
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      处理中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      开始批量提取
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={handleClearInput}
                  className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  <i className="fas fa-eraser mr-2"></i>
                  清空输入
                </button>
              </div>
            </form>
          </section>

          {/* 批量提取进度/结果预览区 */}
          {showProgressSection && (
            <section className={`${styles.cardGradient} p-6 rounded-3xl shadow-card`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">提取进度</h3>
                <button 
                  type="button" 
                  onClick={handleCancelBatch}
                  className="px-4 py-2 text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition-all"
                >
                  <i className="fas fa-stop mr-2"></i>
                  取消
                </button>
              </div>
              
              {/* 总体进度 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">总体进度</span>
                  <span className="text-sm text-gray-600">{currentProgress} / {totalLinks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${styles.progressBar} h-3 rounded-full`} 
                    style={{ width: `${(currentProgress / totalLinks) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* 批量处理结果列表 */}
              <div className="space-y-3">
                {batchResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`${styles.batchItem} p-4 border border-gray-200 rounded-lg ${
                      result.status === 'success' ? 'border-success' : 
                      result.status === 'failed' ? 'border-danger' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <i className="fas fa-globe text-gray-500 text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800 truncate" title={result.url}>{result.url}</div>
                            <div className="text-xs text-gray-500">{result.platform}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`text-sm ${
                          result.status === 'processing' ? 'text-warning' :
                          result.status === 'success' ? 'text-success' :
                          result.status === 'failed' ? 'text-danger' : 'text-gray-500'
                        }`}>
                          {result.status === 'processing' && (
                            <>
                              <i className="fas fa-spinner fa-spin mr-1"></i>
                              处理中
                            </>
                          )}
                          {result.status === 'success' && (
                            <>
                              <i className="fas fa-check-circle mr-1"></i>
                              成功
                            </>
                          )}
                          {result.status === 'failed' && (
                            <>
                              <i className="fas fa-times-circle mr-1"></i>
                              失败
                            </>
                          )}
                          {result.status === 'failed' && result.error && (
                            <div className="text-xs text-danger mt-1">{result.error}</div>
                          )}
                        </div>
                        {result.status === 'success' && (
                          <div>
                            <button 
                              onClick={() => handleViewResult(index)}
                              className="px-3 py-1 text-primary text-sm border border-primary rounded hover:bg-primary hover:text-white transition-all"
                            >
                              查看
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 完成后操作按钮 */}
              {showCompleteActions && (
                <div className="flex gap-4 mt-6">
                  <button 
                    type="button" 
                    onClick={handleViewAllResults}
                    className={`${styles.btnGradient} flex-1 py-3 px-6 text-white font-semibold rounded-xl`}
                  >
                    <i className="fas fa-eye mr-2"></i>
                    查看所有结果
                  </button>
                  <button 
                    type="button" 
                    onClick={handleDownloadAll}
                    className="flex-1 py-3 px-6 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all"
                  >
                    <i className="fas fa-download mr-2"></i>
                    批量下载
                  </button>
                </div>
              )}
            </section>
          )}

          {/* 使用提示 */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${styles.featureCard} p-6 rounded-2xl shadow-card`}>
              <div className="w-12 h-12 bg-gradient-tertiary rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-list text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">格式要求</h3>
              <p className="text-gray-600 text-sm">每行输入一个视频链接，系统将自动识别平台并进行处理</p>
            </div>
            <div className={`${styles.featureCard} p-6 rounded-2xl shadow-card`}>
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">处理时间</h3>
              <p className="text-gray-600 text-sm">每个视频处理时间约3-10秒，批量处理将按顺序进行</p>
            </div>
            <div className={`${styles.featureCard} p-6 rounded-2xl shadow-card`}>
              <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">安全保障</h3>
              <p className="text-gray-600 text-sm">您的视频链接和提取内容仅用于个人使用，我们严格保护您的隐私</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BatchProcessPage;

