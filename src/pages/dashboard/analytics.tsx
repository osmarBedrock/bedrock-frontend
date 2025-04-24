import * as React from 'react';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { CountrySessionsVsBounce } from '@/components/dashboard/analytics/country-sessions-vs-bounce-rate';
import { Devices } from '@/components/dashboard/analytics/devices';
import { InboundOutbound } from '@/components/dashboard/analytics/inbound-outbound';
import { Insight } from '@/components/dashboard/analytics/insight';
import { Summary } from '@/components/dashboard/analytics/summary';
import { RangeButton } from '@/components/dashboard/analytics/range-button';
import type { Range } from '@/types/analytics';
import { useAnalytics } from '@/hooks/use-analytics';
import { AppLimits } from '@/components/dashboard/overview/app-limits';
import { PerformanceChartCard } from '@/components/dashboard/overview/pie-chart-performance';

const metadata: Metadata = {
  title: `Analytics | Dashboard | ${config.site.name}`,
};

export function Page(): React.JSX.Element {
  const [params, setParams] = useSearchParams();
  const [range, setRange] = React.useState<Range>('week');

  const {
    averageBounceRate,
    averageDuration,
    data,
    fetchAnalyticsData,
    loaderData,
    loaderSessionData,
    metric,
    refreshData,
    sessionData,
    totalSessions,
    totalUsers,
    loaderPerformanceMetrics,
    hasErrors,
    accessibilityMetrics,
    bestPracticesMetrics,
    seoMetrics,
    performanceMetrics,
    generalMetrics,
    fetchPageSpeedData,
  } = useAnalytics(setRange, params, range, 'activeUsers');

  React.useEffect(() => {
    fetchAnalyticsData();
    fetchPageSpeedData();
  }, [params.get('range')]);

  React.useEffect(() => {
    refreshData();
  }, [params.get('metric')]);

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
              <Typography variant="h4">Analytics</Typography>
            </Box>
            <div>
              <RangeButton range={range} setRange={setRange} setParams={setParams} params={params} />
            </div>
          </Stack>

          <Grid2 container spacing={4}>
            <Grid2 item xs={12}>
              <Summary
                metric={metric}
                setParams={setParams}
                totalUsers={totalUsers}
                totalSessions={totalSessions}
                averageBounceRate={averageBounceRate}
                averageDuration={averageDuration}
                loader={loaderData}
              >
                <CountrySessionsVsBounce
                  data={data}
                  range={range}
                  metric={metric}
                  loader={loaderData}
                />
              </Summary>
            </Grid2>

            <Grid2 item xs={12}>
              <PerformanceChartCard
                hasErrors={hasErrors}
                loader={loaderPerformanceMetrics}
                metricsData={[
                  { chart: accessibilityMetrics, needComplement: true },
                  { chart: bestPracticesMetrics, needComplement: true },
                  { chart: seoMetrics, needComplement: true },
                  { chart: performanceMetrics, needComplement: true },
                  { chart: generalMetrics, needComplement: false },
                ]}
              />
            </Grid2>
          </Grid2>
        </Stack>
      </Box>
    </React.Fragment>
  );
}
