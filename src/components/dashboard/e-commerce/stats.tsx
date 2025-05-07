'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { CursorClick as CursorClickIcon } from '@phosphor-icons/react/dist/ssr/CursorClick';
import { LegoSmiley as LegoSmileyIcon } from '@phosphor-icons/react/dist/ssr/LegoSmiley';
import { Waveform as WaveformIcon } from '@phosphor-icons/react/dist/ssr/Waveform';
import { HandArrowUp as HandArrowUpIcon } from '@phosphor-icons/react/dist/ssr/HandArrowUp';
import { CartesianGrid, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { tooltipFormatterSEO } from '@/utils/analytics';
import type{ SetURLSearchParams } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import type { Metric } from '@/types/analytics';
import type { QueryData } from '@/types/apis';

export interface StatsProps {
  data: QueryData[];
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  setParams: SetURLSearchParams;
  params: URLSearchParams;
  loader: boolean;
}

const statButtons = [
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
  const metric: Metric = params.get('metric') as Metric;

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
              statButtons.map((_, index)=> <SummaryFailed key={index as unknown as number} />)
            :
              statButtons.map((statButton)=>
                <Summary icon={statButton?.icon} title={statButton?.title} key={statButton.key} value={statButton.value} metric={statButton.key as Metric} setParams={setParams} params={params} />
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
                  dataKey={metric}
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
  metric: Metric;
  value: number;
  setParams: SetURLSearchParams;
  params: URLSearchParams;
}

function Summary({ icon: Icon, title, value, setParams, metric, params }: SummaryProps): React.JSX.Element {
  const isMyMetric = (params.get('metric') ?? 'impressions') === metric;
  const handleClick = (): void => {
    setParams((searchParams: URLSearchParams) => {
      searchParams.set("metric", metric);
      return searchParams;
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
