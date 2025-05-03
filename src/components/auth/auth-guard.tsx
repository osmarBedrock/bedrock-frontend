'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

import { config } from '@/config';
import { paths } from '@/paths';
import { AuthStrategy } from '@/lib/auth/strategy';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { useAccountStatus } from '@/hooks/useAccountStatus';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Readonly<AuthGuardProps>): React.JSX.Element {
  const navigate = useNavigate();
  const { user, error, isLoading } = useUser();
  const { status } = useAccountStatus();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const [loggedState, setLoggedState] = React.useState<string>('');

  // Debug: Estado único por renderizado
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const currentState = JSON.stringify({
        user: user ? 'Authenticated' : 'Guest',
        status,
        loading: isLoading ? 'Checking' : 'Ready',
        error: error || 'None'
      });

      if (currentState !== loggedState) {
        console.log('[AuthGuard State]', {
          user: user ? 'Authenticated' : 'Guest',
          status,
          loading: isLoading ? 'Checking' : 'Ready',
          error: error || 'None'
        });
        setLoggedState(currentState);
      }
    }
  }, [user, status, isLoading, error, loggedState]);

  const checkPermissions = React.useCallback(async (): Promise<void> => {
    try {
      if (isLoading) return;

      if (error) {
        setIsChecking(false);
        return;
      }

      if (!user) {
        logger.debug('[AuthGuard] Redirecting to login...');
        const signInPaths = {
          [AuthStrategy.CUSTOM]: paths.auth.custom.signIn,
          [AuthStrategy.AUTH0]: paths.auth.auth0.signIn,
          [AuthStrategy.COGNITO]: paths.auth.cognito.signIn,
          [AuthStrategy.FIREBASE]: paths.auth.firebase.signIn,
          [AuthStrategy.SUPABASE]: paths.auth.supabase.signIn,
        };
        navigate(signInPaths[config.auth.strategy] || paths.auth.custom.signIn, { 
          replace: true 
        });
        return;
      }

      setIsChecking(false);
    } catch (err) {
      logger.error('[AuthGuard] Check error:', err);
      setIsChecking(false);
    }
  }, [isLoading, error, user, navigate]);

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);
  
  if (isChecking || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Authentication error: {error}
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Redirecting to login...
      </Alert>
    );
  }

  switch (status) {
    case 'inactive':
      return (
        <Alert severity="warning" sx={{ m: 2 }}>
          Please complete your registration to access this content
        </Alert>
      );

    case 'pending':
      return (
        <Alert severity="info" sx={{ m: 2 }}>
          Your account is being verified. Please wait...
        </Alert>
      );

    case 'active':
      return <>{children}</>;

    default:
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Invalid account state
        </Alert>
      );
  }
}