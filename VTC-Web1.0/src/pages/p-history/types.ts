

export interface HistoryRecord {
  id: string;
  url: string;
  platform: 'bilibili' | 'youtube' | 'douyin';
  platformName: string;
  time: string;
  status: 'success' | 'failed';
}

export type SortField = 'url' | 'platform' | 'time' | 'status';
export type SortOrder = 'asc' | 'desc';

export type PlatformFilter = '' | 'bilibili' | 'youtube' | 'douyin';
export type StatusFilter = '' | 'success' | 'failed';
export type TimeFilter = '' | 'today' | 'week' | 'month';

export type DeleteModalType = 'single' | 'batch' | 'all';

