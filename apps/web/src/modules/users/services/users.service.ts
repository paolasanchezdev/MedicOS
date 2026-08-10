import { apiClient } from '@/shared/lib/apiClient';
import type { UserRoleInput } from '../schemas/user.schemas';
import type { User } from '../types/user.types';

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    return apiClient<User[]>('/users');
  },

  updateUserRoles: async (payload: UserRoleInput): Promise<void> => {
    return apiClient<void>(`/users/${payload.userId}/roles`, {
      method: 'PATCH',
      body: JSON.stringify({ roles: payload.roles }),
    });
  },
};