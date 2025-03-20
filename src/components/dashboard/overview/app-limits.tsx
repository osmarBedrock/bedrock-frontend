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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Cpu as CpuIcon } from '@phosphor-icons/react/dist/ssr/Cpu';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Speedometer as SpeedometerIcon } from '@phosphor-icons/react/dist/ssr/Speedometer';
import { Lightning as LightningIcon } from '@phosphor-icons/react/dist/ssr/Lightning';
import { RadialBarChart, RadialBar, Legend, Tooltip, PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';

import { NoSsr } from '@/components/core/no-ssr';
import { useAnalytics } from '@/hooks/use-analytics';
import { useSearchParams } from 'react-router-dom';
import { Range } from '@/types/analytics';

export interface AppLimitsProps {
  usage: number;
}

export interface PerformanceChartProps {
  customData: any[];
  height: number;
  width: number;
  stroke?: string;
  innerRadius?: number;
  needComplement?: boolean; 
}

export function AppLimits({ usage }: AppLimitsProps): React.JSX.Element {
  const chartSize = 240;
  const [params, setParams] = useSearchParams();
  const [range, setRange] = React.useState<Range>('week');
  const { getPageSpeedInsights } = useAnalytics(setRange, params, range, "activeUsers");
  const [ performanceMetrics, setPerformanceMetrics ] = React.useState<any[]>([]);
  const [ accessibilityMetrics, setAccessibilityMetrics ] = React.useState<any[]>([]);
  const [ bestPracticesMetrics, setBestPracticesMetrics ] = React.useState<any[]>([]);
  const [ seoMetrics, setSEOMetrics ] = React.useState<any[]>([]);

      React.useEffect( () => {
        
        const fetchPageSpeedData = async () => {
          const siteUrl = "https://prestigesurgery.com/";

          try {
            const {accessibility, bestPractices, performance, seo, metrics} = await getPageSpeedInsights({siteUrl});
            setPerformanceMetrics([performance])
            setAccessibilityMetrics([accessibility])
            setBestPracticesMetrics([bestPractices])
            setSEOMetrics([seo])
          }catch(error: any){
            console.log('error-->', error)
          }
        };
        fetchPageSpeedData();
    },[]);

  const dataDetailed = [
    { name: "SI (Speed Index)", value: 80, fill: "#FFA500" },
    { name: "FCP (First Contentful Paint)", value: 75, fill: "#32CD32" },
    { name: "LCP (Largest Contentful Paint)", value: 50, fill: "#FF6347" },
    { name: "CLS (Cumulative Layout Shift)", value: 90, fill: "#008000" },
    { name: "TBT (Total Blocking Time)", value: 49, fill: "#00CED1" },
  ];
  
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
  
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

const PerformanceChart = ({ customData, height, width, needComplement, stroke = "none", innerRadius= 60  }: PerformanceChartProps) => {
  const [dataChart, setDataChart] = React.useState<any>([]);

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const onPieEnter = React.useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  React.useEffect(() => {
    const formatData = customData.map(({ fill, value, ...rest }: any) => [
      { ...rest, value, fill: value > 0 && value <= 49 ? "#f33" 
          : value > 49 && value <= 89 ? "#fa3" 
          : value > 89 && value <= 100 ? "#0c6" 
          : "var(--mui-palette-background-level1)"
      },
      needComplement ?? { value: 100 - value, fill: "var(--mui-palette-background-level1)", name: "" } // Parte faltante
    ]).flat();
    setDataChart(formatData);
  }, [])

  return (
    <Grid container spacing={2} sx={{display: 'grid', justifyContent: 'center'}}>
    <ResponsiveContainer width={width} height={height}>
      <PieChart width={730} height={250}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={dataChart}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          dataKey="value"
          stroke={stroke}
          onMouseEnter={onPieEnter}
        >
          {(dataChart).map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <h3 style={{ color: dataChart[activeIndex]?.fill, justifySelf: 'center' }}>{dataChart[activeIndex]?.name}</h3>
    </Grid>
  );
};

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
