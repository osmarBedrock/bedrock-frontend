'use client';

import * as React from 'react';
import { Box, Skeleton, Typography, Card, CardContent, CardHeader, Stack, Avatar } from '@mui/material';
import { 
  User as UsersIcon,
  TrafficCone as SessionsIcon,
  ArrowUUpLeft as BounceIcon,
  Clock as DurationIcon
} from '@phosphor-icons/react';

const iconStyles = {
  fontSize: '24px',
  width: '1em',
  height: '1em'
};

interface KpiItemProps {
  title: string;
  value: string;
  active?: boolean;
  onClick?: () => void;
  loading?: boolean;
}

function KpiItem({ title, value, active, onClick, loading }: KpiItemProps) {
  const getIcon = () => {
    const iconProps = {
      style: iconStyles,
      weight: "fill" as const
    };
    
    switch(title) {
      case 'Users': return <UsersIcon {...iconProps} />;
      case 'Sessions': return <SessionsIcon {...iconProps} />;
      case 'Bounce rate': return <BounceIcon {...iconProps} />;
      case 'Duration': return <DurationIcon {...iconProps} />;
      default: return <UsersIcon {...iconProps} />;
    }
  };

  return (
    <Box 
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: active ? 'rgba(117, 120, 255, 0.12)' : undefined,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { bgcolor: 'rgba(117, 120, 255, 0.08)' } : undefined,
        flex: 1,
        minWidth: { xs: '100%', sm: '200px' },
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      {loading ? (
        <>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="60%" height={24} />
            <Skeleton width="80%" height={40} sx={{ mt: 1 }} />
          </Box>
        </>
      ) : (
        <>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'var(--mui-palette-background-paper)',
              boxShadow: 'var(--mui-shadows-4)',
              color: active ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-primary)',
            }}
          >
            {getIcon()}
          </Avatar>
          <Box>
            <Typography color={active ? "primary.main" : "text.secondary"} variant="subtitle2">
              {title}
            </Typography>
            <Typography variant="h5" color={active ? "primary.main" : "text.primary"}>
              {value}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

interface SummaryProps {
  metric: string;
  setParams: (params: URLSearchParams) => URLSearchParams;
  totalUsers: number;
  totalSessions: number;
  averageBounceRate: number;
  averageDuration: number;
  loader: boolean;
  children?: React.ReactNode;
}

export function Summary({
  metric,
  setParams,
  totalUsers,
  totalSessions,
  averageBounceRate,
  averageDuration,
  loader,
  children
}: SummaryProps) {
  const handleMetricChange = (newMetric: string) => {
    setParams(params => {
      params.set("metric", newMetric);
      return params;
    });
  };

  return (
    <Card>
      <CardHeader title="Analytics Overview" />
      <CardContent>
        <Stack spacing={4}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between'
          }}>
            <KpiItem
              title="Users"
              value={new Intl.NumberFormat('en-US').format(totalUsers)}
              active={metric === 'activeUsers'}
              onClick={() => handleMetricChange('activeUsers')}
              loading={loader}
            />
            <KpiItem
              title="Sessions"
              value={new Intl.NumberFormat('en-US').format(totalSessions)}
              active={metric === 'sessions'}
              onClick={() => handleMetricChange('sessions')}
              loading={loader}
            />
            <KpiItem
              title="Bounce rate"
              value={new Intl.NumberFormat('en-US', { 
                style: 'percent', 
                maximumFractionDigits: 2 
              }).format(averageBounceRate / 100)}
              active={metric === 'bounceRate'}
              onClick={() => handleMetricChange('bounceRate')}
              loading={loader}
            />
            <KpiItem
              title="Duration"
              value={`${(averageDuration / 60).toFixed(2)} min`}
              active={metric === 'averageSessionDuration'}
              onClick={() => handleMetricChange('averageSessionDuration')}
              loading={loader}
            />
          </Box>

          {children ? <Box 
              sx={{ 
                height: '400px',
                '& .MuiCard-root': {
                  boxShadow: 'none',
                  borderRadius: 0,
                  padding: 0,
                  '& .MuiCardContent-root': {
                    padding: 0,
                    margin: 0
                  }
                }
              }}
            >
              {children}
            </Box> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}