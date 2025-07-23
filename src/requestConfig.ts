import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { tokenStorage } from '@/services/ant-design-pro/api';

// Error handling function
const errorHandler = (error: any) => {
  const { response } = error;
  
  if (response && response.status) {
    const { status, data } = response;
    
    switch (status) {
      case 401:
        // Token expired or invalid, clear token and redirect to login
        tokenStorage.remove();
        message.error('登录已过期，请重新登录');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case 403:
        message.error('没有权限访问此资源');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
        message.error('服务器内部错误');
        break;
      default:
        // Show backend error message if available
        const errorMessage = data?.detail || `请求错误 ${status}`;
        message.error(errorMessage);
        break;
    }
  } else if (!response) {
    message.error('网络异常，请检查网络连接');
  }

  throw error;
};

// Request configuration
export const requestConfig: RequestConfig = {
  // Base URL configuration (optional if you want to set a default)
  // baseURL: 'http://localhost:8000',
  
  timeout: 10000,
  
  // Request interceptor
  requestInterceptors: [
    (config: any) => {
      // Add authentication header if token exists
      const token = tokenStorage.get();
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
      
      // Ensure Content-Type is set for POST requests
      if (config.method?.toLowerCase() === 'post' && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
      
      return config;
    },
  ],
  
  // Response interceptor
  responseInterceptors: [
    (response) => {
      return response;
    },
  ],
  
  // Error handler
  errorConfig: {
    errorHandler,
  },
};