import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';
import { SignUpForm } from '@/components/auth/supabase/sign-up-form';

const metadata = { title: `Sign up | Supabase | Auth | ${config.site.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {
  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <GuestGuard>
        <SplitLayout>
          <SignUpForm />
        </SplitLayout>
      </GuestGuard>
    </React.Fragment>
  );
}
