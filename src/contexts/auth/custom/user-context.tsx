'use client';

import * as React from 'react';

import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/custom/client';
import { logger } from '@/lib/default-logger';

import type { UserContextValue } from '../types';

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const { user, error } = await authClient.getUser();

      if (error) {
        logger.error(error);
        setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
        return;
      }

      if (!user) {
        setState((prev) => ({
          ...prev,
          user: null,
          error: null,
          isLoading: false
        }));
        return;
      }

      const userData: User = {
        id: Number(user.id),
        email: user.email || '',
        firstName: (user.firstName) || '',
        lastName: (user.lastName) || '',
        avatar: (user.avatar) || '',
        passwordHash: '',
        googleId: null,
        emailVerified: user.emailVerified || false,
        planType: '',
        stripeCustomerId: null,
        currentPeriodEnd: null,
        isProfileComplete: false,
        enterpriseName: user.enterpriseName || '',
        enterprisePicture: null,
        verificationData: user.verificationData || {
          dnsRecord: '',
          verificationUrl: ''
        },
        websites: user.websites || [],
        website: user.website || {
          id: 0,
          domain: '',
          propertyId: '',
          verificationCode: '',
          isVerified: false,
          userId: 0,
          googleAccessToken: '',
          googleRefreshToken: '',
          semrushApiKey: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };


      setState((prev) => ({ ...prev, user: userData, error: null, isLoading: false }));
    } catch (err) {
      logger.error(err);
      setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
