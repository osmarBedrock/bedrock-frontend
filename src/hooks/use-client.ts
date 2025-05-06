import { useState } from 'react';

import type { User } from '@/types/user';
import { AuthService } from '@/lib/auth/services/auth';

export const useClient = () => {
  const [user, setUser] = useState<User>(JSON.parse(localStorage.getItem('custom-auth-user') || ''));

  const fetchUserData = async (email: string) => {
    try {
      const { data } = await AuthService.handleDataUser({ email });
      setUser(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const updateUser = async (userUpdated: User) => {
    try {
      const { data } = await AuthService.handleUpdateDataUser(userUpdated);
      const oldUser = JSON.parse(localStorage.getItem('custom-auth-user') || '');
      setUser({ ...oldUser, ...data.user, website: data.website });
      localStorage.setItem('custom-auth-user', JSON.stringify(user));
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    fetchUserData,
    updateUser,
    user,
    setUser
  };
};
