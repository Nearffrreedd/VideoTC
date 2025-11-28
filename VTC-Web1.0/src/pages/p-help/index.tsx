

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const HelpPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'tutorial' | 'faq'>('tutorial');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '帮助与教程 - 链文';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleTabChange = (tab: 'tutorial' | 'faq') => {
    setActiveTab(tab);
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
                src="https://s.coze.cn/image/6k-fKVx8cdY/" 
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 font-medium transition-all`}
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
                <h2 className="text-3xl font-bold text-white mb-2">帮助与教程</h2>
                <nav className="text-white/80 text-sm">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>帮助与教程</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 内容导航区 */}
          <section className="mb-8">
            <div className={`${styles.cardGradient} p-6 rounded-2xl shadow-card`}>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleTabChange('tutorial')}
                  className={`${styles.tabButton} ${activeTab === 'tutorial' ? 'active' : 'border border-gray-300 text-gray-700'} px-6 py-3 rounded-lg font-medium`}
                >
                  <i className="fas fa-play-circle mr-2"></i>
                  使用教程
                </button>
                <button 
                  onClick={() => handleTabChange('faq')}
                  className={`${styles.tabButton} ${activeTab === 'faq' ? 'active' : 'border border-gray-300 text-gray-700'} px-6 py-3 rounded-lg font-medium`}
                >
                  <i className="fas fa-question-circle mr-2"></i>
                  常见问题
                </button>
              </div>
            </div>
          </section>

          {/* 使用教程内容 */}
          {activeTab === 'tutorial' && (
            <section className={`${styles.contentTab} active`}>
              <div className={`${styles.cardGradient} p-8 rounded-3xl shadow-card mb-8`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">链文使用教程</h3>
                  <p className="text-gray-600">详细了解如何使用链文的各项功能</p>
                </div>

                {/* 单链接提取教程 */}
                <div className="mb-12">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-link text-white text-sm"></i>
                    </div>
                    单链接文案提取
                  </h4>
                  
                  <div className="space-y-6 ml-11">
                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">1. 准备视频链接</h5>
                      <p className="text-gray-600 mb-3">从Bilibili、YouTube、抖音等平台复制视频链接。确保链接格式正确，例如：</p>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                        <code>https://www.bilibili.com/video/BV1234567890</code><br />
                        <code>https://s.coze.cn/image/CN6cs7SQ4lY/</code><br />
                        <code>https://v.douyin.com/abc123/</code>
                      </div>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">2. 粘贴链接到输入框</h5>
                      <p className="text-gray-600 mb-3">在首页的视频链接输入框中粘贴复制的链接，或点击粘贴按钮自动粘贴剪贴板内容。</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <img 
                          src="https://s.coze.cn/image/ZROpPNl1XwM/" 
                          alt="粘贴链接示例" 
                          className="w-full rounded-lg shadow-sm"
                        />
                      </div>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">3. 选择输出格式</h5>
                      <p className="text-gray-600 mb-3">从下拉菜单中选择您需要的输出格式：</p>
                      <ul className="space-y-2 text-gray-600">
                        <li><strong>Markdown格式：</strong>适合文档编辑和发布</li>
                        <li><strong>带时间戳文本：</strong>包含原始时间信息，便于参考</li>
                        <li><strong>纯文本：</strong>简洁的文本格式</li>
                      </ul>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">4. 点击提取按钮</h5>
                      <p className="text-gray-600 mb-3">点击"立即提取"按钮，系统将自动识别视频平台并开始提取文案。</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <img 
                          src="https://s.coze.cn/image/m5uvFwWXMN8/" 
                          alt="提取按钮示例" 
                          className="w-full rounded-lg shadow-sm"
                        />
                      </div>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">5. 查看和使用结果</h5>
                      <p className="text-gray-600 mb-3">提取完成后，您可以：</p>
                      <ul className="space-y-2 text-gray-600">
                        <li>查看提取的文案内容</li>
                        <li>切换不同的显示格式</li>
                        <li>下载文案到本地</li>
                        <li>复制文案内容</li>
                        <li>编辑文案（点击编辑按钮）</li>
                        <li>分享文案链接</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 批量处理教程 */}
                <div className="mb-12">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-layer-group text-white text-sm"></i>
                    </div>
                    批量文案提取
                  </h4>
                  
                  <div className="space-y-6 ml-11">
                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">1. 进入批量处理页面</h5>
                      <p className="text-gray-600 mb-3">点击左侧导航栏的"批量处理"或首页的"批量处理"按钮进入批量处理页面。</p>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">2. 输入多个视频链接</h5>
                      <p className="text-gray-600 mb-3">在文本框中输入多个视频链接，每行一个链接。支持同时处理5个以上的视频链接。</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <img 
                          src="https://s.coze.cn/image/Y8bzI_oA_Zc/" 
                          alt="批量输入示例" 
                          className="w-full rounded-lg shadow-sm"
                        />
                      </div>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">3. 选择输出格式</h5>
                      <p className="text-gray-600 mb-3">选择统一的输出格式，所有视频将按照此格式提取文案。</p>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">4. 开始批量提取</h5>
                      <p className="text-gray-600 mb-3">点击"开始批量提取"按钮，系统将逐一处理每个视频链接。</p>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">5. 处理结果</h5>
                      <p className="text-gray-600 mb-3">批量处理完成后，您可以：</p>
                      <ul className="space-y-2 text-gray-600">
                        <li>查看每个视频的提取状态</li>
                        <li>单独下载每个文案</li>
                        <li>批量下载所有成功的文案</li>
                        <li>查看失败原因并重新提取</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 历史记录管理教程 */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-tertiary rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-history text-white text-sm"></i>
                    </div>
                    历史记录管理
                  </h4>
                  
                  <div className="space-y-6 ml-11">
                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">1. 查看历史记录</h5>
                      <p className="text-gray-600 mb-3">点击左侧导航栏的"历史记录"查看所有提取记录，包括视频链接、平台、提取时间和状态。</p>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">2. 搜索和筛选</h5>
                      <p className="text-gray-600 mb-3">使用搜索框按视频链接或平台搜索特定记录，或使用筛选条件按时间、状态筛选。</p>
                    </div>

                    <div className={styles.tutorialStep}>
                      <h5 className="font-semibold text-gray-800 mb-2">3. 管理记录</h5>
                      <p className="text-gray-600 mb-3">对历史记录进行管理：</p>
                      <ul className="space-y-2 text-gray-600">
                        <li>点击"查看"重新查看提取结果</li>
                        <li>点击"删除"删除单条记录</li>
                        <li>批量选择并删除多条记录</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 常见问题内容 */}
          {activeTab === 'faq' && (
            <section className={`${styles.contentTab} active`}>
              <div className={`${styles.cardGradient} p-8 rounded-3xl shadow-card`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">常见问题解答</h3>
                  <p className="text-gray-600">快速找到您遇到的问题的解决方案</p>
                </div>

                <div className="space-y-6">
                  {/* 提取相关问题 */}
                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-magic text-primary mr-3"></i>
                      支持哪些视频平台？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      目前支持Bilibili、YouTube、抖音、TikTok等主流视频平台。系统会自动识别视频链接所属平台，您也可以手动选择平台以提高识别准确性。
                    </p>
                  </div>

                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-clock text-primary mr-3"></i>
                      提取文案需要多长时间？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      提取时间取决于视频长度和网络状况，一般短视频（5分钟以内）需要10-30秒，长视频（1小时以上）可能需要2-5分钟。批量提取时会按顺序处理每个视频。
                    </p>
                  </div>

                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-exclamation-triangle text-primary mr-3"></i>
                      为什么提取失败？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      提取失败可能有以下原因：视频链接无效或已删除、视频设置了隐私权限、网络连接问题、平台API限制等。您可以检查链接有效性后重试，或联系客服获取帮助。
                    </p>
                  </div>

                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-file-alt text-primary mr-3"></i>
                      支持哪些输出格式？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      目前支持三种输出格式：Markdown格式（适合文档编辑）、带时间戳文本（保留原始时间信息）、纯文本（简洁格式）。您可以在提取结果页面随时切换不同格式查看。
                    </p>
                  </div>

                  {/* 账户相关问题 */}
                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-user text-primary mr-3"></i>
                      如何注册和登录？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      点击页面右上角的登录/注册按钮，选择注册方式（手机号或邮箱），设置密码即可完成注册。注册成功后可直接登录使用所有功能。
                    </p>
                  </div>

                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-lock text-primary mr-3"></i>
                      我的数据安全吗？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      我们高度重视用户数据安全，所有数据传输采用HTTPS加密，密码采用加盐哈希存储。您的提取记录仅您可见，我们不会将您的数据用于任何商业用途。
                    </p>
                  </div>

                  {/* 批量处理问题 */}
                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-layer-group text-primary mr-3"></i>
                      批量处理有数量限制吗？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      普通用户单次批量处理最多支持10个视频链接，VIP用户可支持更多。建议单次处理不超过20个链接以获得最佳体验。
                    </p>
                  </div>

                  {/* 其他问题 */}
                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-headset text-primary mr-3"></i>
                      遇到问题如何联系客服？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      您可以通过以下方式联系我们：在页面右下角点击客服按钮、发送邮件至support@lianwen.com、关注我们的官方微信公众号"链文助手"。我们会在24小时内回复您的问题。
                    </p>
                  </div>

                  <div className={`${styles.faqItem} p-6 rounded-xl`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="fas fa-star text-primary mr-3"></i>
                      如何反馈建议或bug？
                    </h4>
                    <p className="text-gray-600 ml-8">
                      您可以通过客服系统、邮件或官方社群向我们反馈建议或bug。我们非常重视用户反馈，会认真考虑每一条建议，并及时修复发现的问题。
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default HelpPage;

