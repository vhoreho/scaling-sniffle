import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Auth API
export const authApi = {
  register: async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password, name });
    return data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
  getMe: async (): Promise<{ user: User }> => {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data;
  },
};

// Posts API
export const postsApi = {
  getAll: async (): Promise<{ posts: Post[] }> => {
    const { data } = await api.get<{ posts: Post[] }>('/posts');
    return data;
  },
  getById: async (id: string): Promise<{ post: Post }> => {
    const { data } = await api.get<{ post: Post }>(`/posts/${id}`);
    return data;
  },
  create: async (title: string, content: string): Promise<{ post: Post }> => {
    const { data } = await api.post<{ post: Post }>('/posts', { title, content });
    return data;
  },
  update: async (id: string, title: string, content: string): Promise<{ post: Post }> => {
    const { data } = await api.put<{ post: Post }>(`/posts/${id}`, { title, content });
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

export default api;

