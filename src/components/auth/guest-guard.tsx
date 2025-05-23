'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const navigate = useNavigate();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if(user?.website?.domain){
      logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard 1');
      navigate(paths.dashboard.overview, { replace: true });
      return;
    }

    if (user) {
      logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard 2');
      navigate({
        pathname: paths.dashboard.settings.account,
        search: `?code=${(searchParams.get('code') ?? '')}` // Agrega el parámetro solo si existe
      }, { replace: true });
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
