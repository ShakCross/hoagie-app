import axios from 'axios';
import { User, Hoagie, Comment, PaginatedResponse, AuthResponse, RegisterData, LoginData } from '../types';

// Get API URL from environment
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Ensure API_URL is defined
if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL environment variable is not defined. Please check your .env file.');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const authService = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

// Hoagie services
export const hoagieService = {
  getHoagies: async (page = 1, limit = 10): Promise<PaginatedResponse<Hoagie>> => {
    const response = await api.get<{ hoagies: Hoagie[], total: number }>(`/hoagies?page=${page}&limit=${limit}`);
    return {
      items: response.data.hoagies,
      total: response.data.total,
      page,
      limit,
      totalPages: Math.ceil(response.data.total / limit),
    };
  },

  getUserHoagies: async (userId: string, page = 1, limit = 10): Promise<PaginatedResponse<Hoagie>> => {
    const url = `/hoagies?creator=${userId}&page=${page}&limit=${limit}`;
    
    try {
      const response = await api.get<{ hoagies: Hoagie[], total: number }>(url);
      
      return {
        items: response.data.hoagies,
        total: response.data.total,
        page,
        limit,
        totalPages: Math.ceil(response.data.total / limit),
      };
    } catch (error) {
      throw error;
    }
  },

  getHoagie: async (id: string): Promise<Hoagie> => {
    const response = await api.get<Hoagie>(`/hoagies/${id}`);
    return response.data;
  },

  createHoagie: async (data: { name: string; ingredients: string[]; picture?: string, creator: string }): Promise<Hoagie> => {
    try {
      const response = await api.post<Hoagie>('/hoagies', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateHoagie: async (id: string, data: { name?: string; ingredients?: string[]; picture?: string }): Promise<Hoagie> => {
    const response = await api.put<Hoagie>(`/hoagies/${id}`, data);
    return response.data;
  },

  deleteHoagie: async (id: string): Promise<void> => {
    await api.delete(`/hoagies/${id}`);
  },

  addCollaborator: async (hoagieId: string, userId: string, requestUserId: string): Promise<Hoagie> => {
    const response = await api.post<Hoagie>(
      `/hoagies/${hoagieId}/collaborators?userId=${requestUserId}`, 
      { userId }
    );
    return response.data;
  },

  removeCollaborator: async (hoagieId: string, collaboratorId: string, requestUserId: string): Promise<Hoagie> => {
    const response = await api.delete<Hoagie>(
      `/hoagies/${hoagieId}/collaborators/${collaboratorId}?userId=${requestUserId}`
    );
    return response.data;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      // First test if the users API is accessible
      try {
        await api.get('/user-search/test');
      } catch (error) {
        throw error;
      }
      
      const url = `/user-search?q=${encodeURIComponent(query)}`;
      const response = await api.get<User[]>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Comment services
export const commentService = {
  getComments: async (hoagieId: string, page = 1, limit = 10): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<{ comments: Comment[], total: number }>(`/comments?hoagie=${hoagieId}&page=${page}&limit=${limit}`);
    return {
      items: response.data.comments,
      total: response.data.total,
      page,
      limit,
      totalPages: Math.ceil(response.data.total / limit),
    };
  },

  createComment: async (data: { text: string; user: string; hoagie: string }): Promise<Comment> => {
    const response = await api.post<Comment>('/comments', data);
    return response.data;
  },

  updateComment: async (id: string, data: { text: string }): Promise<Comment> => {
    const response = await api.put<Comment>(`/comments/${id}`, data);
    return response.data;
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};

export default api; 