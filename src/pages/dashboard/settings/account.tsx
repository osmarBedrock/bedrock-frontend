import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { AccountDetails } from '@/components/dashboard/settings/account-details';
import { Privacy } from '@/components/dashboard/settings/privacy';
import { ThemeSwitch } from '@/components/dashboard/settings/theme-switch';
import { useClient } from '@/hooks/use-client';

const metadata = { title: `Account | Settings | Dashboard | ${config.site.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {
  const {user, updateUser} = useClient()

  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Stack spacing={4}>
        <div>
          <Typography variant="h4">Account</Typography>
        </div>
        <Stack spacing={4}>
          <AccountDetails user={user} updateFunction={updateUser} />
          <ThemeSwitch />
          <Privacy />
          {/* <DeleteAccount /> */}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
