// ARCHIVO: apps/web/src/modules/users/services/users.service.ts
// DESCRIPCIÓN: Servicio de integración con la API de usuarios en MedicOS con desempaquetado de ApiResponse.

import { apiClient } from '@/shared/lib/apiClient';
import type { User } from '../types/user.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
}

export interface UpdateCredentialsPayload {
  userId: string;
  password: string;
}

export interface UpdateRolePayload {
  userId: string;
  role: string;
}

export interface UpdateStatusPayload {
  userId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    const res = await apiClient<ApiResponse<User[]>>('/users');
    return res.data ?? [];
  },

  createUser: async (payload: CreateUserPayload): Promise<User> => {
    const res = await apiClient<ApiResponse<User>>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  updateUserRole: async (payload: UpdateRolePayload): Promise<User> => {
    const res = await apiClient<ApiResponse<User>>(`/users/${payload.userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: payload.role }),
    });
    return res.data;
  },

  updateUserCredentials: async (payload: UpdateCredentialsPayload): Promise<{ id: string; email: string }> => {
    const res = await apiClient<ApiResponse<{ id: string; email: string }>>(`/users/${payload.userId}/credentials`, {
      method: 'PATCH',
      body: JSON.stringify({ password: payload.password }),
    });
    return res.data;
  },

  updateUserStatus: async (payload: UpdateStatusPayload): Promise<{ id: string; status: string }> => {
    const res = await apiClient<ApiResponse<{ id: string; status: string }>>(`/users/${payload.userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: payload.status }),
    });
    return res.data;
  },

  deleteUser: async (userId: string): Promise<{ id: string }> => {
    const res = await apiClient<ApiResponse<{ id: string }>>(`/users/${userId}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};