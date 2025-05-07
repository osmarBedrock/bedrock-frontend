'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useClient } from '@/hooks/use-client';


export function WorkspacesSwitch(): React.JSX.Element {
  const {user} = useClient()
  return (
    <React.Fragment>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          border: '1px solid var(--Workspaces-border-color)',
          borderRadius: '12px',
          cursor: 'pointer',
          p: '4px 8px',
        }}
      >
        <Stack direction="row" spacing={2}>
          <Avatar src={user?.enterprisePicture || '/assets/company-image-3.jpg'} variant="rounded" />
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="var(--Workspaces-title-color)" variant="caption">
            Workspace
          </Typography>
          <Typography color="var(--Workspaces-name-color)" variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
            {user?.enterpriseName}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
