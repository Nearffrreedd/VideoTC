import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

import P_login_register from '../pages/p-login_register';
import P_home from '../pages/p-home';
import P_extract_result from '../pages/p-extract_result';
import P_text_editor from '../pages/p-text_editor';
import P_history from '../pages/p-history';
import P_batch_process from '../pages/p-batch_process';
import P_help from '../pages/p-help';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

function Listener() {
  const location = useLocation();
  useEffect(() => {
    const pageId = 'P-' + location.pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', location.pathname, ', search:', location.search);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: location.pathname,
        search: location.search,
      }, '*');
    }
  }, [location]);

  return <Outlet />;
}

// 使用 createBrowserRouter 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <Listener />,
    children: [
      {
    path: '/',
    element: <Navigate to='/login-register' replace={true} />,
  },
      {
    path: '/login-register',
    element: (
      <ErrorBoundary>
        <P_login_register />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/home',
    element: (
      <ErrorBoundary>
        <P_home />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/extract-result',
    element: (
      <ErrorBoundary>
        <P_extract_result />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/text-editor',
    element: (
      <ErrorBoundary>
        <P_text_editor />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/history',
    element: (
      <ErrorBoundary>
        <P_history />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/batch-process',
    element: (
      <ErrorBoundary>
        <P_batch_process />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/help',
    element: (
      <ErrorBoundary>
        <P_help />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '*',
    element: <NotFoundPage />,
  },
    ]
  }
]);

export default router;