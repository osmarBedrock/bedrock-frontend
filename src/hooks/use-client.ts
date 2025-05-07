import { useState } from 'react';

import type { User } from '@/types/user';
import { AuthService } from '@/lib/auth/services/auth';

export const useClient = () => {
  const [user, setUser] = useState<User | null | undefined>(JSON.parse(localStorage.getItem('custom-auth-user') || 'null') as User | null);

  const fetchUserData = async (email: string) => {
    const { user: userFinal, error } = await AuthService.handleDataUser({ email });
    if (error) {
      throw error;
    }
    setUser(userFinal);
  };

  const updateUser = async (userUpdated: User) => {
    const { user: userFinal, website, error } = await AuthService.handleUpdateDataUser(userUpdated);
    if (error) {
      throw error;
    }
    const oldUser = JSON.parse(
      localStorage.getItem("custom-auth-user") || "null"
    ) as User | null;

    if(website && userFinal) {
      userFinal.website = website;
    }
    if(userFinal) {
      setUser({ ...oldUser, ...userFinal});
      localStorage.setItem('custom-auth-user', JSON.stringify(userFinal));
    }
  };

  return {
    fetchUserData,
    updateUser,
    user,
    setUser
  };
};
