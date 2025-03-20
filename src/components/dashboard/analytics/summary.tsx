import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';

export function Summary({metric, setParams, totalUsers, totalSessions, averageBounceRate, averageDuration, loader}:any): React.JSX.Element {

  const handleRange = (
    event: React.MouseEvent<HTMLElement>,
    newMetric: string | null,
  ) => {
    setParams((params: any) => {
      params.set("metric", newMetric);
      return params;
    });
  };

  return (
    <ToggleButtonGroup
      value={metric}
      exclusive
      onChange={handleRange}
      sx={{
        backgroundColor: "var(--mui-palette-background-paper)",
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
      }}
    >
      <ToggleButton
        value="activeUsers"
        sx={{
          textTransform: 'capitalize',
          display: 'grid',
          justifyContent: 'flex-start',
          borderRight: { xs: 'none',},
          borderBottom: { md: 'none' },
          pb: { xs: 2, md: 0 },
        }}
      >
        {
          loader
          ?
            <>
              <Box sx={{ display: 'flex', width:'100%' }}>
                <Skeleton animation="wave" width={95} />
              </Box>
              <Box sx={{ display: 'flex', width:'100%' }}>
                <Skeleton animation="wave" width={110} height={40} />
              </Box>
            </>
          :
            <>
              <Typography display={'flex'} color="text.secondary">Users</Typography>
              <Typography display={'flex'} variant="h3">{new Intl.NumberFormat('en-US').format(totalUsers)}</Typography>
            </>
        }
      </ToggleButton>
      <ToggleButton
        value="sessions"
        sx={{
          display: 'grid',
          justifyContent: 'flex-start',
          borderRight: { xs: 'none',},
          borderBottom: { md: 'none' },
          textTransform: 'capitalize',
          pb: { xs: 2, md: 0 },
        }}
      >{
          loader
          ?
            <>
              <Box sx={{ display: 'flex', width:'100%' }}>
                <Skeleton animation="wave" width={95} />
              </Box>
              <Box sx={{ display: 'flex', width:'100%' }}>
                <Skeleton animation="wave" width={110} height={40} />
              </Box>
            </>
          :
            <>
        <Typography display={'flex'} color="text.secondary">Sessions</Typography>
        <Typography display={'flex'} variant="h3">{new Intl.NumberFormat('en-US').format(totalSessions)}</Typography></>
        }
      </ToggleButton>
      <ToggleButton
        value="bounceRate"
        sx={{
          display: 'grid',
          justifyContent: 'flex-start',
          borderRight: { xs: 'none',},
          borderBottom: { md: 'none' },
          textTransform: 'capitalize',
          pb: { xs: 2, md: 0 },
        }}
      >{
          loader
          ?
            <>
              <Box sx={{ display: 'flex', width:'100%' }}>
                <Skeleton animation="wave" width={95} />
              </Box>
              <Box sx={{ display: 'flex', width:'100%' }}>
                <Skeleton animation="wave" width={110} height={40} />
              </Box>
            </>
          :
            <>
        <Typography display={'flex'} color="text.secondary">Bounce rate</Typography>
        <Typography display={'flex'} variant="h3">
          {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(averageBounceRate / 100)}
        </Typography></>
        }
      </ToggleButton>
      <ToggleButton
        value="averageSessionDuration" 
        sx={{
          display: 'grid',
          textTransform: 'capitalize',
          justifyContent: 'flex-start',
        }}
      >{
          loader
          ?
            <>
              <Box sx={{ display: 'flex', width:'100%' }}>
                <Skeleton animation="wave" width={95} />
              </Box>
              <Box sx={{ display: 'flex', width:'100%' }}>
                <Skeleton animation="wave" width={110} height={40} />
              </Box>
            </>
          :
            <>
        <Typography display={'flex'} color="text.secondary">Duration</Typography>
        <Typography display={'flex'} variant="h3">{ Number((averageDuration / 60).toFixed(2))} min</Typography></>
        }
      </ToggleButton>
    </ToggleButtonGroup>
    
  );
}
