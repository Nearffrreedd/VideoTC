

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { HistoryRecord, SortField, SortOrder, PlatformFilter, StatusFilter, TimeFilter, DeleteModalType } from './types';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // 模拟历史记录数据
  const [mockHistoryData, setMockHistoryData] = useState<HistoryRecord[]>([
    {
      id: 'rec001',
      url: 'https://www.bilibili.com/video/BV1234567890',
      platform: 'bilibili',
      platformName: 'Bilibili',
      time: '2024-01-15 14:30:25',
      status: 'success'
    },
    {
      id: 'rec002',
      url: 'https://www.youtube.com/watch?v=abcdefghijk',
      platform: 'youtube',
      platformName: 'YouTube',
      time: '2024-01-15 13:45:12',
      status: 'success'
    },
    {
      id: 'rec003',
      url: 'https://v.douyin.com/abc123/',
      platform: 'douyin',
      platformName: '抖音',
      time: '2024-01-15 12:20:33',
      status: 'failed'
    },
    {
      id: 'rec004',
      url: 'https://www.bilibili.com/video/BV0987654321',
      platform: 'bilibili',
      platformName: 'Bilibili',
      time: '2024-01-15 11:15:44',
      status: 'success'
    },
    {
      id: 'rec005',
      url: 'https://www.youtube.com/watch?v=lmnopqrstuv',
      platform: 'youtube',
      platformName: 'YouTube',
      time: '2024-01-14 16:50:18',
      status: 'success'
    },
    {
      id: 'rec006',
      url: 'https://v.douyin.com/def456/',
      platform: 'douyin',
      platformName: '抖音',
      time: '2024-01-14 15:30:22',
      status: 'success'
    },
    {
      id: 'rec007',
      url: 'https://www.bilibili.com/video/BV1357924680',
      platform: 'bilibili',
      platformName: 'Bilibili',
      time: '2024-01-14 14:15:35',
      status: 'failed'
    },
    {
      id: 'rec008',
      url: 'https://www.youtube.com/watch?v=wxyz123456',
      platform: 'youtube',
      platformName: 'YouTube',
      time: '2024-01-14 13:00:47',
      status: 'success'
    }
  ]);

  // 页面状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filteredData, setFilteredData] = useState<HistoryRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  
  // 搜索和筛选状态
  const [historySearch, setHistorySearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('');
  
  // UI状态
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalType, setDeleteModalType] = useState<DeleteModalType>('single');
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '提取历史 - 链文';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化和筛选数据
  useEffect(() => {
    applyFilters();
  }, [mockHistoryData, historySearch, platformFilter, statusFilter, timeFilter, sortField, sortOrder]);

  // 防抖函数
  const debounce = (func: Function, wait: number) => {
    let timeout: number;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // 应用所有筛选条件
  const applyFilters = () => {
    let filtered = [...mockHistoryData];
    
    // 搜索筛选
    if (historySearch) {
      const searchTerm = historySearch.toLowerCase();
      filtered = filtered.filter(record => 
        record.url.toLowerCase().includes(searchTerm) ||
        record.platformName.toLowerCase().includes(searchTerm)
      );
    }
    
    // 平台筛选
    if (platformFilter) {
      filtered = filtered.filter(record => record.platform === platformFilter);
    }
    
    // 状态筛选
    if (statusFilter) {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // 时间筛选
    if (timeFilter) {
      filtered = filtered.filter(record => checkTimeFilter(record.time, timeFilter));
    }
    
    // 应用排序
    applySorting(filtered);
    
    setFilteredData(filtered);
    setCurrentPage(1);
    setSelectedRecords(new Set());
  };

  // 时间筛选检查
  const checkTimeFilter = (recordTime: string, filter: TimeFilter): boolean => {
    const recordDate = new Date(recordTime);
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return recordDate.toDateString() === now.toDateString();
      case 'week':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return recordDate >= oneWeekAgo;
      case 'month':
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return recordDate >= oneMonthAgo;
      default:
        return true;
    }
  };

  // 应用排序
  const applySorting = (data: HistoryRecord[]) => {
    data.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'url':
          aValue = a.url.toLowerCase();
          bValue = b.url.toLowerCase();
          break;
        case 'platform':
          aValue = a.platformName;
          bValue = b.platformName;
          break;
        case 'time':
          aValue = new Date(a.time);
          bValue = new Date(b.time);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // 处理排序
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 处理搜索
  const handleSearch = debounce(() => {
    applyFilters();
  }, 300);

  // 处理页面大小变更
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(event.target.value));
    setCurrentPage(1);
  };

  // 改变页码
  const changePage = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 处理复选框选择
  const handleCheckboxChange = (recordId: string, checked: boolean) => {
    const newSelected = new Set(selectedRecords);
    if (checked) {
      newSelected.add(recordId);
    } else {
      newSelected.delete(recordId);
    }
    setSelectedRecords(newSelected);
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    const currentPageData = getCurrentPageData();
    if (checked) {
      setSelectedRecords(new Set(currentPageData.map(record => record.id)));
    } else {
      setSelectedRecords(new Set());
    }
  };

  // 获取当前页数据
  const getCurrentPageData = (): HistoryRecord[] => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  };

  // 生成页码按钮
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 显示删除模态框
  const showDeleteModalHandler = (type: DeleteModalType, recordId?: string) => {
    setDeleteModalType(type);
    setDeleteRecordId(recordId || null);
    setShowDeleteModal(true);
  };

  // 隐藏删除模态框
  const hideDeleteModalHandler = () => {
    setShowDeleteModal(false);
    setDeleteRecordId(null);
  };

  // 处理确认删除
  const handleConfirmDelete = () => {
    switch (deleteModalType) {
      case 'single':
        if (deleteRecordId) {
          deleteRecord(deleteRecordId);
        }
        break;
      case 'batch':
        deleteBatchRecords();
        break;
      case 'all':
        deleteAllRecords();
        break;
    }
    hideDeleteModalHandler();
  };

  // 删除单条记录
  const deleteRecord = (recordId: string) => {
    setMockHistoryData(prev => prev.filter(record => record.id !== recordId));
    setSelectedRecords(prev => {
      const newSet = new Set(prev);
      newSet.delete(recordId);
      return newSet;
    });
  };

  // 批量删除记录
  const deleteBatchRecords = () => {
    setMockHistoryData(prev => prev.filter(record => !selectedRecords.has(record.id)));
    setSelectedRecords(new Set());
  };

  // 清空所有记录
  const deleteAllRecords = () => {
    setMockHistoryData([]);
    setSelectedRecords(new Set());
  };

  // 跳转到提取结果页
  const handleViewRecord = (recordId: string) => {
    navigate(`/extract-result?recordId=${recordId}`);
  };

  // 获取排序图标
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return 'fas fa-sort ml-1';
    }
    return `fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-1`;
  };

  // 获取平台样式类名
  const getPlatformClassName = (platform: string) => {
    switch (platform) {
      case 'bilibili':
        return styles.platformBilibili;
      case 'youtube':
        return styles.platformYoutube;
      case 'douyin':
        return styles.platformDouyin;
      default:
        return '';
    }
  };

  // 获取状态样式类名
  const getStatusClassName = (status: string) => {
    return status === 'success' ? styles.statusSuccess : styles.statusFailed;
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    return status === 'success' ? '提取成功' : '提取失败';
  };

  const currentPageData = getCurrentPageData();
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, filteredData.length);
  const isAllSelected = currentPageData.length > 0 && selectedRecords.size === currentPageData.length;
  const isIndeterminate = selectedRecords.size > 0 && selectedRecords.size < currentPageData.length;

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/50 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
          
          {/* 中间：搜索框 */}
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
                src="https://s.coze.cn/image/v3epbvwUDdw/" 
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
          <div className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 font-medium transition-all`}>
            <i className="fas fa-history text-lg w-5"></i>
            {!isSidebarCollapsed && <span>历史记录</span>}
          </div>
          <Link 
            to="/help" 
            className={`${styles.navItemHover} flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-all`}
          >
            <i className="fas fa-question-circle text-lg w-5"></i>
            {!isSidebarCollapsed && <span>帮助教程</span>}
          </Link>
        </nav>
        
        {/* 底部统计信息 */}
        {!isSidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">总提取次数</div>
              <div className={`text-lg font-bold ${styles.gradientText}`}>{mockHistoryData.length} 次</div>
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
                <h2 className="text-3xl font-bold text-white mb-2">提取历史</h2>
                <nav className="text-white/80 text-sm">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>提取历史</span>
                </nav>
              </div>
              <div className="text-right text-white/80">
                <div className="text-sm">总记录数</div>
                <div className="text-2xl font-bold text-white">{mockHistoryData.length}</div>
              </div>
            </div>
          </div>

          {/* 工具栏区域 */}
          <section className={`${styles.cardGradient} p-6 rounded-2xl shadow-card mb-6`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索和筛选 */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input 
                    type="text" 
                    placeholder="搜索视频链接或平台..." 
                    value={historySearch}
                    onChange={(e) => {
                      setHistorySearch(e.target.value);
                      handleSearch();
                    }}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl ${styles.inputFocus}`}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                
                <div className="flex space-x-4">
                  <select 
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value as PlatformFilter)}
                    className={`px-4 py-3 border border-gray-300 rounded-xl ${styles.inputFocus}`}
                  >
                    <option value="">全部平台</option>
                    <option value="bilibili">Bilibili</option>
                    <option value="youtube">YouTube</option>
                    <option value="douyin">抖音</option>
                  </select>
                  
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className={`px-4 py-3 border border-gray-300 rounded-xl ${styles.inputFocus}`}
                  >
                    <option value="">全部状态</option>
                    <option value="success">提取成功</option>
                    <option value="failed">提取失败</option>
                  </select>
                  
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                    className={`px-4 py-3 border border-gray-300 rounded-xl ${styles.inputFocus}`}
                  >
                    <option value="">全部时间</option>
                    <option value="today">今天</option>
                    <option value="week">最近一周</option>
                    <option value="month">最近一月</option>
                  </select>
                </div>
              </div>
              
              {/* 批量操作 */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => showDeleteModalHandler('batch')}
                  disabled={selectedRecords.size === 0}
                  className="px-6 py-3 bg-danger text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <i className="fas fa-trash mr-2"></i>
                  批量删除
                </button>
                <button 
                  onClick={() => showDeleteModalHandler('all')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-broom mr-2"></i>
                  清空历史
                </button>
              </div>
            </div>
          </section>

          {/* 数据展示区域 */}
          <section className={`${styles.cardGradient} rounded-2xl shadow-card overflow-hidden`}>
            {/* 表格头部 */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">全选</span>
                  </label>
                  <span className="text-sm text-gray-500">已选择 <span>{selectedRecords.size}</span> 项</span>
                </div>
                <div className="text-sm text-gray-500">
                  共 <span>{filteredData.length}</span> 条记录
                </div>
              </div>
            </div>
            
            {/* 表格内容 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = isIndeterminate;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('url')}
                    >
                      视频链接
                      <i className={getSortIcon('url')}></i>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('platform')}
                    >
                      平台
                      <i className={getSortIcon('platform')}></i>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('time')}
                    >
                      提取时间
                      <i className={getSortIcon('time')}></i>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('status')}
                    >
                      状态
                      <i className={getSortIcon('status')}></i>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPageData.map(record => (
                    <tr key={record.id} className={styles.tableRowHover}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          value={record.id}
                          checked={selectedRecords.has(record.id)}
                          onChange={(e) => handleCheckboxChange(record.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate cursor-pointer hover:text-primary" title={record.url}>
                          <a href={record.url} target="_blank" rel="noopener noreferrer">
                            {record.url}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPlatformClassName(record.platform)}`}>
                          {record.platformName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClassName(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleViewRecord(record.id)}
                          className="text-primary hover:text-secondary transition-colors"
                        >
                          <i className="fas fa-eye mr-1"></i>查看
                        </button>
                        <button 
                          onClick={() => showDeleteModalHandler('single', record.id)}
                          className="text-danger hover:text-red-600 transition-colors"
                        >
                          <i className="fas fa-trash mr-1"></i>删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页区域 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">每页显示</span>
                  <select 
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className={`px-3 py-1 border border-gray-300 rounded text-sm ${styles.inputFocus}`}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="text-sm text-gray-700">条记录</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 transition-colors ${currentPage <= 1 ? styles.paginationDisabled : ''}`}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="flex space-x-1">
                    {generatePageNumbers().map(page => (
                      <button 
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-3 py-1 border border-gray-300 rounded text-sm transition-colors ${
                          page === currentPage ? styles.paginationActive : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 transition-colors ${currentPage >= totalPages ? styles.paginationDisabled : ''}`}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                
                <div className="text-sm text-gray-700">
                  显示第 <span>{startRecord}</span>-<span>{endRecord}</span> 条，共 <span>{filteredData.length}</span> 条
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center mr-4">
                    <i className="fas fa-exclamation-triangle text-danger text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">确认删除</h3>
                    <p className="text-sm text-gray-600">此操作不可撤销</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  {deleteModalType === 'single' && '您确定要删除这条记录吗？'}
                  {deleteModalType === 'batch' && `您确定要删除选中的 ${selectedRecords.size} 条记录吗？`}
                  {deleteModalType === 'all' && '您确定要清空所有历史记录吗？'}
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={hideDeleteModalHandler}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="flex-1 py-3 px-4 bg-danger text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

