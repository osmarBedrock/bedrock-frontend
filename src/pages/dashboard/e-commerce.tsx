import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { Stats } from '@/components/dashboard/e-commerce/stats';
import { TopProducts } from '@/components/dashboard/e-commerce/top-products';
import { useAnalytics } from '@/hooks/use-analytics';
import type { Range } from '@/types/analytics';
import { useSearchParams } from 'react-router-dom';
import { RangeButton } from '@/components/dashboard/analytics/range-button';
import { Devices } from '@/components/dashboard/analytics/devices';

const metadata = { title: `E-commerce | Dashboard | ${config.site.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {

  const [params, setParams] = useSearchParams();
  const [range, setRange] = React.useState<Range>('week');

  const { totalClicks,
    totalImpressions,
    averageCTR,
    averagePosition,
    dataForChart,
    loaderDataForTable,
    loaderSessionData,
    sessionData,
    dataForTable,
    fetchAnalyticsData,
    fetchSearchConsoleData,
     refreshDataSearchConsole } = useAnalytics(setRange, params, range, 'impressions');

    React.useEffect( () => {
      void fetchSearchConsoleData();
      void fetchAnalyticsData();

  }, [params.get("range")])

  React.useEffect( () => {
    refreshDataSearchConsole();
  }, [params.get("metric")])

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
              <Typography variant="h4">SEO Performance</Typography>
            </Box>
            <div>
              <RangeButton range={range} setRange={setRange} setParams={setParams} params={params} />
            </div>
          </Stack>
          <Grid container spacing={4}>
            <Grid size={12}>
              <Stats
                data={dataForChart}
                totalClicks={totalClicks}
                totalImpressions={totalImpressions}
                averageCTR={averageCTR}
                averagePosition={averagePosition}
                setParams={setParams}
                params={params}
                loader={loaderDataForTable}
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
            {/* <Grid
              size={{
                lg: 8,
                xs: 12,
              }}
            >
              <Conversions
                data={[
                  { name: 'Direct calls', value: 35690 },
                  { name: 'Quote requests', value: 14859 },
                  { name: 'Ads', value: 45120 },
                  { name: 'Affiliate links', value: 3950 },
                  { name: 'Email campaigns', value: 12011 },
                  { name: 'Other', value: 5486 },
                ]}
              />
            </Grid> */}
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
            {/* <Grid
              size={{
                lg: 8,
                xs: 12,
              }}
            >
              <SalesByCountry
                sales={[
                  { countryCode: 'us', countryName: 'United States', value: 60 },
                  { countryCode: 'es', countryName: 'Spain', value: 20 },
                  { countryCode: 'uk', countryName: 'United Kingdom', value: 10 },
                  { countryCode: 'de', countryName: 'Germany', value: 5 },
                  { countryCode: 'ca', countryName: 'Canada', value: 5 },
                ]}
              />
            </Grid> */}
          </Grid>
        </Stack>
      </Box>
    </React.Fragment>
  );
}
