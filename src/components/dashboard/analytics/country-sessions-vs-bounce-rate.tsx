'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import type { Range, Metric, DataChart } from "@/types/analytics";

import { NoSsr } from '@/components/core/no-ssr';
import { formatLabel, getDataKey, tooltipFormatter } from '@/utils/analytics';
import { Skeleton } from '@mui/material';

const bars = [
  { name: 'Sessions', dataKey: 'v1', color: 'var(--mui-palette-primary-main)' },
  { name: 'Bounce rate', dataKey: 'v2', color: 'var(--mui-palette-primary-100)' },
] satisfies { name: string; dataKey: string; color: string }[];

export interface CountrySessionsVsBounceProps {
  data: DataChart[];
  metric: Metric;
  range: Range;
  loader: boolean;
}

export function CountrySessionsVsBounce({ data, metric, range, loader }: CountrySessionsVsBounceProps): React.JSX.Element {
  const chartHeight = 320;

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
            <ChartPieIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Website Traffic"
      />
      <CardContent>
        {loader ?
        (<Skeleton variant="rounded" width="100%" animation="wave" height={chartHeight}/>)
        :
        (<Stack divider={<Divider />} spacing={3}>
          <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
            <ResponsiveContainer height={chartHeight}>
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
                <Tooltip
                  formatter={tooltipFormatter}
                  labelFormatter={(label: string) => formatLabel(range, label)}
                  contentStyle={{ backgroundColor: "rgba(255,255,255,0.92)" }}
                />

                <Area
                  type="bump"
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
        </Stack>)
         }
      </CardContent>
    </Card>
  );
}


function Legend(): React.JSX.Element {
  return (
    <Stack direction="row" spacing={2}>
      {bars?.map((bar) => (
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
