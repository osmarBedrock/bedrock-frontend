import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { ResetPasswordForm } from '@/components/auth/cognito/reset-password-form';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';

const metadata = { title: `Reset password | Cognito | Auth | ${config.site.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {
  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <GuestGuard>
        <SplitLayout>
          <ResetPasswordForm />
        </SplitLayout>
      </GuestGuard>
    </React.Fragment>
  );
}
