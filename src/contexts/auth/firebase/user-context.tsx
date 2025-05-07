'use client';

import * as React from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

import type { User } from '@/types/user';
import { getFirebaseAuth } from '@/lib/auth/firebase/client';
import { logger } from '@/lib/default-logger';

import type { UserContextValue } from '../types';

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [firebaseAuth] = React.useState<Auth>(getFirebaseAuth());

  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      logger.debug('[Auth] onAuthStateChanged:', user);

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
        id: Number(user.uid),
        email: user.email || '',
        firstName: (user.displayName) || '',
        lastName: (user.displayName) || '',
        avatar: (user.photoURL) || '',
        passwordHash: '',
        googleId: null,
        emailVerified: user.emailVerified || false,
        planType: '',
        stripeCustomerId: null,
        currentPeriodEnd: null,
        isProfileComplete: false,
        enterpriseName: '',
        enterprisePicture: null,
        verificationData: {
          dnsRecord: '',
          verificationUrl: ''
        },
        websites: [],
        website: {
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

    });

    return () => {
      unsubscribe();
    };
  }, [firebaseAuth]);

  return <UserContext.Provider value={{ ...state }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
