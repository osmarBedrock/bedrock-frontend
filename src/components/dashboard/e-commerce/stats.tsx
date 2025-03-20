'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { CursorClick as CursorClickIcon } from '@phosphor-icons/react/dist/ssr/CursorClick';
import { LegoSmiley as LegoSmileyIcon } from '@phosphor-icons/react/dist/ssr/LegoSmiley';
import { Waveform as WaveformIcon } from '@phosphor-icons/react/dist/ssr/Waveform';
import { HandArrowUp as HandArrowUpIcon } from '@phosphor-icons/react/dist/ssr/HandArrowUp';
import { CartesianGrid, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { NoSsr } from '@/components/core/no-ssr';
import { getDataKeySEO, tooltipFormatterSEO } from '@/utils/analytics';
import { SetURLSearchParams } from 'react-router-dom';
import { Skeleton } from '@mui/material';

export interface StatsProps {
  data: { name: string; v1: number; v2: number }[];
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  setParams: SetURLSearchParams;
  params: URLSearchParams;
  loader: boolean;
}

let statButtons = [
  {
    icon: CursorClickIcon ,
    title: 'Total Clicks',
    key: 'clicks',
    value: 0
  },
  {
    icon: LegoSmileyIcon ,
    title: 'Total Impressions',
    key: 'impressions',
    value: 0
  },
  {
    icon: WaveformIcon ,
    title: 'Average CTR',
    key: 'ctr',
    value: 0
  },
  {
    icon: HandArrowUpIcon ,
    title: 'Average Position',
    key: 'position',
    value: 0
  },
]

export function Stats({ data, totalClicks , totalImpressions , averageCTR , averagePosition, setParams, params, loader }: StatsProps): React.JSX.Element {
  const chartHeight = 320;
  const metric: any = params.get('metric') ?? 'impressions';

  statButtons[0].value = totalClicks;
  statButtons[1].value = totalImpressions;
  statButtons[2].value = averageCTR;
  statButtons[3].value = averagePosition;
  

  return (
    <Card>
      <CardHeader title="Stats at a glance" />
      <CardContent>
        <Stack divider={<Divider />} spacing={3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            divider={<Divider flexItem orientation="vertical" sx={{ borderBottomWidth: { xs: '1px', md: 0 } }} />}
            spacing={3}
            sx={{ justifyContent: 'space-between' }}
          >
            { loader 
            ?
              statButtons.map(()=> <SummaryFailed />)
            :
              statButtons.map((statButton)=>
                <Summary icon={statButton?.icon} title={statButton?.title} key={statButton.key} value={statButton.value} metric={statButton.key} setParams={setParams} params={params} />
              )
            }
          </Stack>
                  {loader ? 
                  (<Skeleton variant="rounded" width="100%" animation="wave" height={chartHeight}/>) 
          :
          <ResponsiveContainer width="100%" height={chartHeight}>
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
                  formatter={tooltipFormatterSEO}
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
                  dataKey={getDataKeySEO(metric)}
                  fill="url(#gradientFill)"
                />
              </AreaChart>
          </ResponsiveContainer>}
          <Legend />
        </Stack>
      </CardContent>
    </Card>
  );
}

interface SummaryProps {
  icon: Icon;
  title: string;
  metric: string;
  value: number;
  setParams: SetURLSearchParams;
  params: URLSearchParams;
}

function Summary({ icon: Icon, title, value, setParams, metric, params }: SummaryProps): React.JSX.Element {
  const isMyMetric = (params.get('metric') ?? 'impressions') === metric;
  const handleClick = () => {
    setParams((params: any) => {
      params.set("metric", metric);
      return params;
    });
  }
  return (
    <Stack onClick={handleClick} direction="row" spacing={3} sx={{ alignItems: 'center', cursor: 'pointer', padding: '8px', borderRadius: '10px', bgcolor: isMyMetric ? 'rgba(117 120 255 / calc(0.16 + 0.08))': null }}>
      <Avatar
        sx={{
          '--Avatar-size': '54px',
          '--Icon-fontSize': 'var(--icon-fontSize-lg)',
          bgcolor: 'var(--mui-palette-background-paper)',
          boxShadow: 'var(--mui-shadows-8)',
          color: 'var(--mui-palette-text-primary)',
        }}
      >
        <Icon fontSize="var(--Icon-fontSize)" />
      </Avatar>
      <div>
        <Typography color={ isMyMetric ? "var(--mui-palette-primary-main)": "text.secondary"} variant="overline">
          {title}
        </Typography>
        <Typography variant="h5" color={ isMyMetric ? "var(--mui-palette-primary-main)": "text.primary" }>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
            value
          )}
        </Typography>
      </div>
    </Stack>
  );
}

function SummaryFailed(): React.JSX.Element {
  
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', cursor: 'pointer', padding: '8px', borderRadius: '10px', width: '100%' }}>
      <Skeleton variant="circular" width={70} height={70} />
      <div>
        <Box sx={{ display: 'flex', width:'100%' }}>
          <Skeleton animation="wave" width={90} />
        </Box>
        <Box sx={{ display: 'flex', width:'100%' }}>
          <Skeleton animation="wave" width={90} />
        </Box>
      </div>
    </Stack>
  );
}

interface DotProps {
  hover?: boolean;
  active?: string;
  cx?: number;
  cy?: number;
  payload?: { name: string };
  stroke?: string;
}

function Dot({ active, cx, cy, payload, stroke }: DotProps): React.JSX.Element | null {
  if (active && payload?.name === active) {
    return <circle cx={cx} cy={cy} fill={stroke} r={6} />;
  }

  return null;
}

function Legend(): React.JSX.Element {
  return (
    <Stack direction="row" spacing={2}>
      {/* {lines.map((line) => (
        <Stack direction="row" key={line.name} spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: line.color, borderRadius: '2px', height: '4px', width: '16px' }} />
          <Typography color="text.secondary" variant="caption">
            {line.name}
          </Typography>
        </Stack>
      ))} */}
    </Stack>
  );
}
interface TooltipContentProps {
  active?: boolean;
  payload?: { name: string; dataKey: string; value: number; stroke: string }[];
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
          (entry, index): React.JSX.Element => (
            <Stack direction="row" key={entry.name} spacing={3} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
                <Box sx={{ bgcolor: entry.stroke, borderRadius: '2px', height: '8px', width: '8px' }} />
                <Typography sx={{ whiteSpace: 'nowrap' }}>{entry.name}</Typography>
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {index === 0
                  ? entry.value
                  : new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    }).format(entry.value)}
              </Typography>
            </Stack>
          )
        )}
      </Stack>
    </Paper>
  );
}
