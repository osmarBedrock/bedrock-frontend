'use client';

import * as React from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

import type { User } from '@/types/user';
import { logger } from '@/lib/default-logger';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

import type { UserContextValue } from '../types';

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [supabaseClient] = React.useState<SupabaseClient>(createSupabaseClient());

  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  React.useEffect(() => {
    function handleInitialSession(session: Session | null): void {
      const user = session?.user;
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
        firstName: (user.user_metadata?.full_name as string) || '',
        lastName: (user.user_metadata?.full_name as string) || '',
        avatar: (user.user_metadata?.avatar_url as string) || '',
        passwordHash: '',
        googleId: null,
        emailVerified: user.email_confirmed_at !== null,
        planType: '',
        stripeCustomerId: null,
        currentPeriodEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
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
      setState((prev) => ({
        ...prev,
        ...userData
      }));
    }

    function handleSignedIn(session: Session | null): void {
      const user = session?.user;
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
        firstName: (user.user_metadata?.full_name as string) || '',
        lastName: (user.user_metadata?.full_name as string) || '',
        avatar: (user.user_metadata?.avatar_url as string) || '',
        passwordHash: '',
        googleId: null,
        emailVerified: user.email_confirmed_at !== null,
        planType: '',
        stripeCustomerId: null,
        currentPeriodEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
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

      setState((prev) => ({
        ...prev,
        ...userData
      }));
    }

    function handleSignedOut(): void {
      setState((prev) => ({ ...prev, user: null, error: null, isLoading: false }));
    }

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      logger.debug('[Auth] onAuthStateChange:', event, session);

      if (event === 'INITIAL_SESSION') {
        handleInitialSession(session);
      }

      if (event === 'SIGNED_IN') {
        handleSignedIn(session);
      }

      if (event === 'SIGNED_OUT') {
        handleSignedOut();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabaseClient]);

  return <UserContext.Provider value={{ ...state }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
