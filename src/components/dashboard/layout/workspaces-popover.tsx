'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useUser } from '@/hooks/use-user';

export const workspaces: Workspaces[] = [];

export interface Workspaces {
  name: string;
  avatar: string;
}

export interface WorkspacesPopoverProps {
  anchorEl: null | Element;
  onChange?: (tenant: string) => void;
  onClose?: () => void;
  open?: boolean;
}

export function WorkspacesPopover({
  anchorEl,
  onChange,
  onClose,
  open = false,
}: WorkspacesPopoverProps): React.JSX.Element {
  const { user } = useUser();
  workspaces.push({ name: user?.enterpriseName || '', avatar: user?.enterprisePicture || '/assets/workspace-avatar-2.png' });
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '250px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {workspaces?.map((workspace) => (
        <MenuItem
          key={workspace.name}
          onClick={() => {
            onChange?.(workspace.name || '');
          }}
        >
          <ListItemAvatar>
            <Avatar src={workspace.avatar} sx={{ '--Avatar-size': '32px' }} variant="rounded" />
          </ListItemAvatar>
          {workspace.name}
        </MenuItem>
      ))}
    </Menu>
  );
}
