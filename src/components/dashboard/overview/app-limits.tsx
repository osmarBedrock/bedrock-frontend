'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Speedometer as SpeedometerIcon } from '@phosphor-icons/react/dist/ssr/Speedometer';
import { Lightning as LightningIcon } from '@phosphor-icons/react/dist/ssr/Lightning';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';

import { useAnalytics } from '@/hooks/use-analytics';
import { useSearchParams } from 'react-router-dom';
import type { Accessibility, DataPieChart, Range } from '@/types/analytics';
import type { ActiveShape } from 'recharts/types/util/types';
import type { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { formattedData } from '@/utils/analytics';
import { PerformanceData, ScoreData } from '@/types/apis';

export interface AppLimitsProps {
  usage: number;
}

export interface PerformanceChartProps {
  customData: Accessibility[] | PerformanceData[] | ScoreData[];
  height: number;
  width: number;
  stroke?: string;
  innerRadius?: number;
  needComplement?: boolean;
}


const renderActiveShape = (props: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { value: number };
  percent: number;
  value: number;
}):  ActiveShape<PieSectorDataItem> => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} fontSize={50} dy={18} textAnchor="middle" fill={fill}>
          {payload.value}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

function PerformanceChart({ customData, height, width, needComplement, stroke = "none", innerRadius= 60  }: PerformanceChartProps): React.JSX.Element {

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const onPieEnter = React.useCallback(
    (_: Accessibility, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const dataForPieChart: DataPieChart[] = formattedData(customData as Accessibility[], needComplement ?? false);


  return (
    <Grid container spacing={2} sx={{display: 'grid', justifyContent: 'center'}}>
    <ResponsiveContainer width={width} height={height}>
      <PieChart width={730} height={250}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape  as unknown as ActiveShape<PieSectorDataItem>}
          data={dataForPieChart}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          dataKey="value"
          stroke={stroke}
          onMouseEnter={onPieEnter}
        >
          {dataForPieChart.map((entry: DataPieChart, index: number) => (
            <Cell key={`cell-${index}` as unknown as string} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <h3 style={{ color: dataForPieChart[activeIndex]?.fill, justifySelf: 'center' }}>{dataForPieChart[activeIndex]?.name}</h3>
    </Grid>
  );
};

export function AppLimits(): React.JSX.Element {
  const [params, _] = useSearchParams();
  const [range, setRange] = React.useState<Range>('week');
  const { getPageSpeedInsights } = useAnalytics(setRange, params, range, "activeUsers");
  const [ performanceMetrics, setPerformanceMetrics ] = React.useState<PerformanceData[]>([]);
  const [ accessibilityMetrics, setAccessibilityMetrics ] = React.useState<ScoreData[]>([]);
  const [ bestPracticesMetrics, setBestPracticesMetrics ] = React.useState<ScoreData[]>([]);
  const [ seoMetrics, setSEOMetrics ] = React.useState<ScoreData[]>([]);

      React.useEffect( () => {

        const fetchPageSpeedData = async () => {
          const siteUrl = "https://prestigesurgery.com/";

          try {
            const { accessibility, bestPractices, performance, seo } = await getPageSpeedInsights({siteUrl});
            setPerformanceMetrics([performance])
            setAccessibilityMetrics([accessibility])
            setBestPracticesMetrics([bestPractices])
            setSEOMetrics([seo])
          }catch(error: unknown){
            throw new Error("Error fetching page speed data");
          }
        };
        void fetchPageSpeedData();
    }, []);

  const dataDetailed = [
    { name: "SI (Speed Index)", value: 80, fill: "#FFA500" },
    { name: "FCP (First Contentful Paint)", value: 75, fill: "#32CD32" },
    { name: "LCP (Largest Contentful Paint)", value: 50, fill: "#FF6347" },
    { name: "CLS (Cumulative Layout Shift)", value: 90, fill: "#008000" },
    { name: "TBT (Total Blocking Time)", value: 49, fill: "#00CED1" },
  ];

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
            <SpeedometerIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Page Speed Insights"
      />
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid size={3}>
              <PerformanceChart customData={performanceMetrics} width={200} height= {200} />
            </Grid>
            <Grid size={3}>
              <PerformanceChart customData={accessibilityMetrics}  width={200} height= {200} />
            </Grid>
            <Grid size={3}>
              <PerformanceChart customData={bestPracticesMetrics}  width={200} height= {200} />
            </Grid>
            <Grid size={3}>
              <PerformanceChart customData={seoMetrics}  width={200} height= {200} />
            </Grid>
          </Grid>
          <Grid container>
            <Grid size={6}>
              <PerformanceChart customData={dataDetailed} width={300} height= {400} needComplement={false} stroke={"#fff"} innerRadius={90}/>
            </Grid>
            <Grid size={6}>
              <PerformanceChart customData={performanceMetrics}  width={300} height= {400} innerRadius={90} />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="secondary" startIcon={<LightningIcon />} variant="contained">
          Upgrade plan
        </Button>
      </CardActions>
    </Card>
  );
}
