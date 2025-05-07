'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';

import { NoSsr } from '@/components/core/no-ssr';
import { getDataKey } from '@/utils/analytics';
import type { Metric } from "@/types/analytics";

const bars = [
  { name: 'This year', dataKey: 'v1', color: 'var(--mui-palette-primary-400)' },
  { name: 'Last year', dataKey: 'v2', color: 'var(--mui-palette-primary-600)' },
] satisfies { name: string; dataKey: string; color: string }[];

export interface AppUsageProps {
  data: { name: string; v1: number; v2: number }[];
}

export function AppUsage({ data }: Readonly<AppUsageProps>): React.JSX.Element {
  const [metric, __] = React.useState<Metric>("activeUsers");


  const chartHeight = 300;

  return (
    <Card>
      <CardHeader title="App usage" />
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Stack spacing={3} sx={{ flex: '0 0 auto', justifyContent: 'space-between', width: '240px' }}>
            <Stack spacing={2}>
              <Typography color="success.main" variant="h2">
                +28%
              </Typography>
              <Typography color="text.secondary">
                increase in app usage with{' '}
                <Typography color="text.primary" component="span">
                  6,521
                </Typography>{' '}
                new products purchased
              </Typography>
            </Stack>
            <div>
              <Typography color="text.secondary" variant="body2">
                <Typography color="primary.main" component="span" variant="subtitle2">
                  This year
                </Typography>{' '}
                is forecasted to increase in your traffic by the end of the current month
              </Typography>
            </div>
          </Stack>
          <Stack divider={<Divider />} spacing={2} sx={{ flex: '1 1 auto' }}>
            <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B165E9" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B165E9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="Date" />
                <CartesianGrid stroke="#DFE9EF" vertical={false} />
                {/* <Tooltip
                  formatter={tooltipFormatter}
                  labelFormatter={(label) => formatLabel(range, label)}
                  contentStyle={{ backgroundColor: "rgba(255,255,255,0.92)" }}
                /> */}

                <Area
                  type="linear"
                  fillOpacity={1}
                  strokeWidth={2}
                  stroke="#4738DE"
                  dot={{
                    strokeWidth: 2,
                    fill: "#FFFFFF",
                    r: 4,
                  }}
                  dataKey={getDataKey(metric)}
                  fill="url(#gradientFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
            </NoSsr>
            <Legend />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Legend(): React.JSX.Element {
  return (
    <Stack direction="row" spacing={2}>
      {bars.map((bar) => (
        <Stack direction="row" key={bar.name} spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: bar.color, borderRadius: '2px', height: '4px', width: '16px' }} />
          <Typography color="text.secondary" variant="caption">
            {bar.name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

