import { useState } from 'react';

import { AuthService } from '@/lib/auth/services/auth';

export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  clientId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  scope?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isLoginGoogle?: boolean;
}

export const useClient = () => {
  const [user, setUser] = useState<UserData>(JSON.parse(localStorage.getItem('custom-auth-user') || ''));

  const fetchUserData = async (email: string) => {
    try {
      const { data } = await AuthService.handleDataUser({ email });
      setUser(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const updateUser = async (user: UserData) => {
    try {
      const { data } = await AuthService.handleUpdateDataUser(user);
      const oldUser = JSON.parse(localStorage.getItem('custom-auth-user') || '');
      setUser({ ...oldUser, ...data });
      setUser(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    fetchUserData,
    updateUser,
    user,
  };
};
