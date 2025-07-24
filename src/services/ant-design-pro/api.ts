// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

// Backend API Types
interface SignUpRequest {
  login: string;    // email
  name: string;
  password: string;
}

interface SignUpResponse {
  id: number;
  login: string;
  name: string;
  created_dt: string;   // ISO date string
  updated_dt: string;   // ISO date string
  deleted_dt: string | null;
}

interface LoginRequest {
  login: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string; // always "bearer"
}

interface ErrorResponse {
  detail: string;
}


/** 获取当前的用户 GET /api/currentUser */
 export async function currentUser(options?: { [key: string]: any }) {
   return request<{
     data: API.CurrentUser;
   }>('/api/currentUser', {
     method: 'GET',
     ...(options || {}),
   });
 }

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** POST /api/v1/users/register */
export async function signup(
  body: SignUpRequest,
  options?: { [key: string]: any }
): Promise<SignUpResponse> {
  return request('/api/v1/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST /api/v1/users/login */
export async function login(
  body: LoginRequest, 
  options?: { [key: string]: any }
): Promise<LoginResponse> {
  return request('/api/v1/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// Token management utilities
export const tokenStorage = {
  set: (token: string) => {
    localStorage.setItem('access_token', token);
  },
  get: (): string | null => {
    return localStorage.getItem('access_token');
  },
  remove: () => {
    localStorage.removeItem('access_token');
  }
};

// Helper function to add Authorization header to requests
export const getAuthHeaders = () => {
  const token = tokenStorage.get();
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`
  };
};

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
