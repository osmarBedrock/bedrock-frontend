import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { CountrySessionsVsBounce } from '@/components/dashboard/analytics/country-sessions-vs-bounce-rate';
import type { Range } from '@/types/analytics';
import { useSearchParams } from 'react-router-dom';
import { useAnalytics } from '@/hooks/use-analytics';
import { Devices } from '@/components/dashboard/analytics/devices';
import { TopProducts } from '@/components/dashboard/e-commerce/top-products';
import { PerformanceChartCard } from '@/components/dashboard/overview/pie-chart-performance';

const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {
  const [range, setRange] = React.useState<Range>('week');
  const [params, _] = useSearchParams();

    const { data, metric,
    sessionData,
    fetchAnalyticsData,
    fetchSearchConsoleData,
    fetchPageSpeedData,
    dataForTable,
    performanceMetrics,
    loaderData,
    loaderSessionData,
    loaderDataForTable,
    loaderPerformanceMetrics,
    hasErrors
     } = useAnalytics(setRange, params, range,"activeUsers");

      React.useEffect( () => {
        void fetchPageSpeedData();
        void fetchAnalyticsData();
        void fetchSearchConsoleData();
      }, [])

  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Overview</Typography>
            </Box>
          </Stack>
          <Grid container spacing={4}>
          <Grid
              size={{
                lg: 8,
                xs: 12,
              }}
            >
              <CountrySessionsVsBounce
                data={data}
                range={range}
                metric={metric}
                loader={loaderData}
              />
            </Grid>
            <Grid
              size={{
                lg: 4,
                xs: 12,
              }}
            >
              <Devices
              loader={loaderSessionData}
                data={sessionData}
              />
            </Grid>
            <Grid
              size={{
                lg: 8,
                xs: 12,
              }}
            >
              <TopProducts
                loader={loaderDataForTable}
                data= {dataForTable}
              />
            </Grid>
            <Grid
              size={{
                md: 4,
                xs: 12,
              }}
            >
              <PerformanceChartCard hasErrors={hasErrors} loader={loaderPerformanceMetrics} metricsData={
                [{ chart: performanceMetrics, needComplement: true }]
                } />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </React.Fragment>
  );
}
