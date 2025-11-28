

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'warning' | 'error';
}

const TextEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [currentFindIndex, setCurrentFindIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'success'
  });

  const textEditorRef = useRef<HTMLTextAreaElement>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '文案编辑 - 链文';
    return () => { document.title = originalTitle; };
  }, []);

  // 加载文案内容
  useEffect(() => {
    const contentId = searchParams.get('contentId') || 'content1';
    
    // 模拟加载文案内容
    const mockContents: Record<string, string> = {
      'content1': '这是一段示例文案内容。\n\n您可以在这里进行编辑、修改和格式化。\n\n支持加粗、斜体、下划线等基本格式。',
      'content2': '【00:00】大家好，欢迎来到我的频道！\n【00:15】今天我们要讨论的是如何提高工作效率。\n【01:30】首先，我们需要制定一个明确的计划...',
      'content3': '# 视频标题\n\n这是一个Markdown格式的文案示例。\n\n## 主要内容\n\n- 第一点\n- 第二点\n- 第三点\n\n**重点强调**：保持专注是关键。'
    };
    
    const content = mockContents[contentId] || '这是一段示例文案内容。您可以在这里进行编辑和修改。';
    setTextContent(content);
    updateCharCount(content);
  }, [searchParams]);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 在小屏幕上自动隐藏侧边栏
        const sidebar = document.querySelector('#sidebar') as HTMLElement;
        const mainContent = document.querySelector('#main-content') as HTMLElement;
        if (sidebar && mainContent) {
          sidebar.style.transform = 'translateX(-100%)';
          mainContent.classList.remove(styles.mainContentExpanded, styles.mainContentCollapsed);
          mainContent.style.marginLeft = '0';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化时检查一次

    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'b':
            e.preventDefault();
            applyFormatting('bold');
            break;
          case 'i':
            e.preventDefault();
            applyFormatting('italic');
            break;
          case 'u':
            e.preventDefault();
            applyFormatting('underline');
            break;
          case 'z':
            e.preventDefault();
            document.execCommand('undo', false, null);
            break;
          case 'y':
            e.preventDefault();
            document.execCommand('redo', false, null);
            break;
          case 'f':
            e.preventDefault();
            setShowFindReplaceModal(true);
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [textContent]);

  // 字数统计
  const updateCharCount = (content: string) => {
    const charCount = content.length;
    const wordCount = content.trim().split(/\s+/).filter(word => word).length;
    setCharCount(charCount);
    setWordCount(wordCount);
  };

  // 文本变化处理
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextContent(value);
    updateCharCount(value);
  };

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 返回按钮
  const handleBack = () => {
    navigate(-1);
  };

  // 格式化功能
  const applyFormatting = (type: 'bold' | 'italic' | 'underline') => {
    if (textEditorRef.current) {
      textEditorRef.current.focus();
      
      switch(type) {
        case 'bold':
          document.execCommand('bold', false, null);
          break;
        case 'italic':
          document.execCommand('italic', false, null);
          break;
        case 'underline':
          document.execCommand('underline', false, null);
          break;
      }
      
      // 重新获取内容以更新字数统计
      setTimeout(() => {
        if (textEditorRef.current) {
          const newContent = textEditorRef.current.value;
          setTextContent(newContent);
          updateCharCount(newContent);
        }
      }, 0);
    }
  };

  // 查找下一个
  const handleFindNext = () => {
    if (!findText || !textEditorRef.current) return;
    
    const content = textContent;
    let newIndex = content.indexOf(findText, currentFindIndex + 1);
    
    if (newIndex === -1) {
      newIndex = content.indexOf(findText, 0);
      if (newIndex === -1) {
        showNotification('未找到匹配内容', 'warning');
        return;
      }
    }
    
    setCurrentFindIndex(newIndex);
    textEditorRef.current.focus();
    textEditorRef.current.setSelectionRange(newIndex, newIndex + findText.length);
  };

  // 替换
  const handleReplace = () => {
    if (!findText || !textEditorRef.current) return;
    
    const start = textEditorRef.current.selectionStart;
    const end = textEditorRef.current.selectionEnd;
    const selectedText = textContent.substring(start, end);
    
    if (selectedText === findText) {
      const newContent = textContent.substring(0, start) + replaceText + textContent.substring(end);
      setTextContent(newContent);
      textEditorRef.current.value = newContent;
      textEditorRef.current.setSelectionRange(start, start + replaceText.length);
      updateCharCount(newContent);
      showNotification('已替换', 'success');
    } else {
      showNotification('请先选择要替换的文本', 'warning');
    }
  };

  // 全部替换
  const handleReplaceAll = () => {
    if (!findText) return;
    
    const newContent = textContent.replace(new RegExp(findText, 'g'), replaceText);
    const replacedCount = (textContent.match(new RegExp(findText, 'g')) || []).length;
    
    setTextContent(newContent);
    if (textEditorRef.current) {
      textEditorRef.current.value = newContent;
    }
    updateCharCount(newContent);
    showNotification(`已替换 ${replacedCount} 处`, 'success');
  };

  // 保存
  const handleSave = async () => {
    setIsSaving(true);
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    showNotification('文案已保存', 'success');
  };

  // 下载
  const handleDownload = () => {
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '文案内容.txt';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('文案已下载', 'success');
  };

  // 复制
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      showNotification('文案已复制到剪贴板', 'success');
    } catch (err) {
      showNotification('复制失败，请手动复制', 'error');
    }
  };

  // 显示通知
  const showNotification = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
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
                src="https://s.coze.cn/image/lCj-ywvSTnI/" 
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
      <aside 
        id="sidebar"
        className={`fixed left-0 top-16 bottom-0 ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} bg-white/90 backdrop-blur-md border-r border-gray-200/50 z-40 transition-all duration-300`}
      >
        <nav className="p-4 space-y-2">
          <Link 
            to="/home" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-home text-lg w-5"></i>
            {!sidebarCollapsed && <span>首页</span>}
          </Link>
          <Link 
            to="/batch-process" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-layer-group text-lg w-5"></i>
            {!sidebarCollapsed && <span>批量处理</span>}
          </Link>
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
      <main 
        id="main-content"
        className={`${sidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen transition-all duration-300`}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">文案编辑</h2>
                <nav className="text-white/80 text-sm">
                  <Link to="/home" className="hover:text-white transition-colors">首页</Link>
                  <span className="mx-2">{'>'}</span>
                  <Link to="/extract-result" className="hover:text-white transition-colors">提取结果</Link>
                  <span className="mx-2">{'>'}</span>
                  <span>文案编辑</span>
                </nav>
              </div>
              <button 
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
              >
                <i className="fas fa-arrow-left"></i>
                <span>返回</span>
              </button>
            </div>
          </div>

          {/* 文案编辑区 */}
          <section className={`${styles.cardGradient} p-6 rounded-3xl shadow-card mb-6`}>
            {/* 编辑器工具栏 */}
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl mb-4">
              <button 
                onClick={() => applyFormatting('bold')}
                className={`${styles.toolbarBtn} p-2 rounded-lg text-gray-600 hover:text-primary`} 
                title="加粗 (Ctrl+B)"
              >
                <i className="fas fa-bold"></i>
              </button>
              <button 
                onClick={() => applyFormatting('italic')}
                className={`${styles.toolbarBtn} p-2 rounded-lg text-gray-600 hover:text-primary`} 
                title="斜体 (Ctrl+I)"
              >
                <i className="fas fa-italic"></i>
              </button>
              <button 
                onClick={() => applyFormatting('underline')}
                className={`${styles.toolbarBtn} p-2 rounded-lg text-gray-600 hover:text-primary`} 
                title="下划线 (Ctrl+U)"
              >
                <i className="fas fa-underline"></i>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <button 
                onClick={() => document.execCommand('undo', false, null)}
                className={`${styles.toolbarBtn} p-2 rounded-lg text-gray-600 hover:text-primary`} 
                title="撤销 (Ctrl+Z)"
              >
                <i className="fas fa-undo"></i>
              </button>
              <button 
                onClick={() => document.execCommand('redo', false, null)}
                className={`${styles.toolbarBtn} p-2 rounded-lg text-gray-600 hover:text-primary`} 
                title="重做 (Ctrl+Y)"
              >
                <i className="fas fa-redo"></i>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <button 
                onClick={() => setShowFindReplaceModal(true)}
                className={`${styles.toolbarBtn} p-2 rounded-lg text-gray-600 hover:text-primary`} 
                title="查找替换 (Ctrl+F)"
              >
                <i className="fas fa-search"></i>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-sm text-gray-500">字数: {charCount}</span>
                <span className="text-sm text-gray-500">词数: {wordCount}</span>
              </div>
            </div>

            {/* 文案编辑器 */}
            <div className="relative">
              <textarea 
                ref={textEditorRef}
                value={textContent}
                onChange={handleTextChange}
                className={`${styles.textEditor} w-full h-96 p-4 rounded-xl resize-none text-gray-800 placeholder-gray-400`}
                placeholder="在这里编辑您的文案内容..."
                spellCheck={false}
              />
            </div>
          </section>

          {/* 操作按钮区 */}
          <section className={`${styles.cardGradient} p-6 rounded-3xl shadow-card`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`${styles.btnGradient} flex-1 py-3 px-6 text-white font-semibold rounded-xl shadow-glow`}
              >
                <i className={`fas ${isSaving ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i>
                {isSaving ? '保存中...' : '保存文案'}
              </button>
              <button 
                onClick={handleDownload}
                className="flex-1 py-3 px-6 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all"
              >
                <i className="fas fa-download mr-2"></i>
                下载文案
              </button>
              <button 
                onClick={handleCopy}
                className="flex-1 py-3 px-6 border-2 border-tertiary text-tertiary font-semibold rounded-xl hover:bg-tertiary hover:text-white transition-all"
              >
                <i className="fas fa-copy mr-2"></i>
                复制文案
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* 查找替换弹窗 */}
      {showFindReplaceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.cardGradient} p-6 rounded-2xl shadow-card max-w-md w-full`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">查找替换</h3>
                <button 
                  onClick={() => setShowFindReplaceModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="find-input" className="block text-sm font-medium text-gray-700 mb-2">查找</label>
                  <input 
                    type="text" 
                    id="find-input"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${styles.inputFocus}`}
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="replace-input" className="block text-sm font-medium text-gray-700 mb-2">替换为</label>
                  <input 
                    type="text" 
                    id="replace-input"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${styles.inputFocus}`}
                  />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleFindNext}
                    className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    查找下一个
                  </button>
                  <button 
                    onClick={handleReplace}
                    className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-secondary transition-all"
                  >
                    替换
                  </button>
                  <button 
                    onClick={handleReplaceAll}
                    className="flex-1 py-2 px-4 bg-success text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    全部替换
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 通知提示 */}
      <div className={`${styles.notification} ${notification.show ? styles.show : ''} bg-white rounded-lg shadow-card p-4 border-l-4 ${
        notification.type === 'success' ? 'border-success' : 
        notification.type === 'warning' ? 'border-warning' : 'border-danger'
      }`}>
        <div className="flex items-center space-x-3">
          <i className={`fas text-lg ${
            notification.type === 'success' ? 'fa-check-circle text-success' :
            notification.type === 'warning' ? 'fa-exclamation-triangle text-warning' :
            'fa-times-circle text-danger'
          }`}></i>
          <div>
            <div className="font-medium text-gray-800">
              {notification.type === 'success' ? '操作成功' :
               notification.type === 'warning' ? '警告' : '错误'}
            </div>
            <div className="text-sm text-gray-600">{notification.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditorPage;

