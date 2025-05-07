'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { ListMagnifyingGlass as BagSimpleIcon } from '@phosphor-icons/react/dist/ssr/ListMagnifyingGlass';

import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';
import { Skeleton } from '@mui/material';
import type { QueryData } from '@/types/apis';

export interface Queries {
  keys:        string[];
  clicks:      number;
  impressions: number;
  ctr:         number;
  position:    number;
}

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>

        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="subtitle2">{row.keys[0]}</Typography>
          {/* <Typography color="text.secondary" variant="body2">
            in {row.category}
          </Typography> */}
        </Box>
      </Stack>
    ),
    name: 'Name',
  },
  {
    formatter: (row): React.ReactNode => (
      <div>
        <Typography variant="subtitle2">
          {new Intl.NumberFormat('en-US').format(
            row.clicks
          )}
        </Typography>
      </div>
    ),
    name: 'Clicks',
  },
  {
    formatter: (row): React.ReactNode => (
      <div>
        <Typography variant="subtitle2">
          {new Intl.NumberFormat('en-US').format(
            row.impressions
          )}
        </Typography>
      </div>
    ),
    name: 'Impressions',
  },
  {
    formatter: (row): React.ReactNode => (
      <div>
        <Typography variant="subtitle2">
          {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 }).format(
            row.ctr
          )}
        </Typography>
      </div>
    ),
    name: 'CTR',
  },
  {
    formatter: (row): React.ReactNode => (
      <div>
        <Typography variant="subtitle2">
          {new Intl.NumberFormat('en-US', {  maximumFractionDigits: 2 }).format(
            row.position
          )}
        </Typography>
      </div>
    ),
    name: 'Position',
  },
  // {
  //   formatter: (_, index): React.ReactNode => (
  //     <Box
  //       sx={{
  //         bgcolor: 'var(--mui-palette-background-level2)',
  //         borderRadius: 1.5,
  //         px: 1,
  //         py: 0.5,
  //         display: 'inline-block',
  //       }}
  //     >
  //       <Typography variant="subtitle2">#{index + 1}</Typography>
  //     </Box>
  //   ),
  //   name: 'Rank',
  //   width: '60px',
  //   align: 'right',
  // },
] satisfies ColumnDef<Queries>[];

export interface ProductsProps {
  data: QueryData[];
  loader: boolean;
}

export function TopProducts({ data, loader }: ProductsProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader
        action={
          <Button color="secondary" endIcon={<ArrowRightIcon />} size="small">
            See all
          </Button>
        }
        avatar={
          <Avatar>
            <BagSimpleIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Top Queries"
      />
      <Box sx={{ overflowX: 'auto', '--mui-palette-TableCell-border': 'transparent' }}>
        {
          loader
          ? (
            <Box sx={{ padding: 5 }}>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Box sx={{ display: 'flex', justifyContent:'end' }}>
                <Skeleton animation="wave" width="40%" />
              </Box>
            </Box>
          )
          : ( <DataTable<QueryData> columns={columns as unknown as ColumnDef<QueryData>[]} hideHead rows={data} /> )
        }
      </Box>
    </Card>
  );
}
