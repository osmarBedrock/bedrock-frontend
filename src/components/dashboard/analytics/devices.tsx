'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { UserCircle as UserCircleIcon } from '@phosphor-icons/react/dist/ssr/UserCircle';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { NoSsr } from '@/components/core/no-ssr';
import { Skeleton } from '@mui/material';
import type { SessionData } from '@/types/analytics';

export interface DevicesProps {
  data: SessionData[] | null | undefined;
  loader: boolean;
}
const COLORS = [
  "rgb(71, 71, 235)",
  "rgb(115, 51, 204)",
  "rgb(207, 163, 242)",
  "rgb(114, 7, 150)",
  "rgb(8, 120, 179)",
  "rgb(26, 115, 232)",
];

export function Devices({ data,loader }: DevicesProps): React.JSX.Element {
  const chartSize = 200;
  const chartTickness = 30;

  return (
    <Card>
      <CardHeader
        action={
          <IconButton>
            <DotsThreeIcon weight="bold" />
          </IconButton>
        }
        avatar={
          <Avatar>
            <UserCircleIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Sessions"
      />
      <CardContent>
        <Stack divider={<Divider />} spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {
              loader
              ? (
                <Skeleton variant="circular" width={150} height={150}  />
              )
              : (<NoSsr fallback={<Box sx={{ height: `${chartSize}px`, width: `${chartSize}px` }} />}>


                <PieChart height={chartSize} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} width={chartSize}>
                  <Pie
                    animationDuration={300}
                    cx={chartSize / 2}
                    cy={chartSize / 2}
                    data={data ?? []}
                    dataKey="value"
                    innerRadius={chartSize / 2 - chartTickness}
                    nameKey="name"
                    outerRadius={chartSize / 2}
                    strokeWidth={0}
                  >
                    {data?.map(
                      (entry, i): React.JSX.Element => (
                        <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]} />
                      )
                    )}
                  </Pie>
                  <Tooltip animationDuration={50} content={<TooltipContent />} />
                </PieChart>
              </NoSsr>)
            }
          </Box>
          {
          loader
            ? (
              <>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
              </>
            )
            : (<Legend payload={data} /> )
          }
        </Stack>
      </CardContent>
    </Card>
  );
}

interface LegendProps {
  payload?: SessionData[] | null;
}

function Legend({ payload }: LegendProps): React.JSX.Element {
  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
      {payload?.map(
        (entry): React.JSX.Element => (
          <div key={entry.name}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box sx={{ bgcolor: entry.color, borderRadius: '2px', height: '4px', width: '16px' }} />
              <Typography variant="body2">{entry.name}</Typography>
            </Stack>
            <Typography variant="h5">
              {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(entry.value / 100)}
            </Typography>
          </div>
        )
      )}
    </Box>
  );
}

interface TooltipContentProps {
  active?: boolean;
  payload?: { name: string; payload: { fill: string }; value: number }[];
  label?: string;
}

function TooltipContent({ active, payload }: TooltipContentProps): React.JSX.Element | null {
  if (!active) {
    return null;
  }

  return (
    <Paper sx={{ border: '1px solid var(--mui-palette-divider)', boxShadow: 'var(--mui-shadows-16)', p: 1 }}>
      <Stack spacing={2}>
        {payload?.map(
          (entry): React.JSX.Element => (
            <Stack direction="row" key={entry.name} spacing={3} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
                <Box sx={{ bgcolor: entry.payload.fill, borderRadius: '2px', height: '8px', width: '8px' }} />
                <Typography sx={{ whiteSpace: 'nowrap' }}>{entry.name}</Typography>
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(
                  entry.value / 100
                )}
              </Typography>
            </Stack>
          )
        )}
      </Stack>
    </Paper>
  );
}
