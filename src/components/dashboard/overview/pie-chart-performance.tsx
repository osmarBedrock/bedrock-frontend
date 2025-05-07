"use client";

import * as React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Skeleton,
  Grid,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip, type TooltipProps } from "recharts";
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { Speedometer as SpeedometerIcon } from "@phosphor-icons/react/dist/ssr/Speedometer";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import type { ChartMetricsData, DataPieChart } from "@/types/analytics";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import type { ActiveShape } from "recharts/types/util/types";
import { formattedData } from "@/utils/analytics";

// Tipado de datos para el gráfico
export interface Metrics {
  value: number;
  name?: string;
  penalty?: number;
}

export interface MetricData {
  chart: Metrics[][];
  needComplement: boolean;
}

export interface PerformanceChartProps {
  metrics: Metrics[];
  width?: number;
  height?: number;
  innerRadius?: number;
  needComplement?: boolean;
  loader?: boolean;
  hasErrors?: boolean;
  metricsData: MetricData[];
}

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    payload: {
      value: number;
      name: string;
      penalty?: number;
    };
  }[];
}

export interface ChartSectionProps {
  metrics: Metrics[];
  width?: number;
  height?: number;
  innerRadius?: number;
  needComplement?: boolean;
  activeIndex?: number;
  onPieEnter?: (data: Metrics, index: number) => void;
}

const renderActiveShape = (props: {
  stroke: string;
  fill: string;
  legendType: string;
  cx: number;
  cy: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  paddingAngle: number;
  labelLine: boolean;
  hide: boolean;
  minAngle: number;
  isAnimationActive: boolean;
  animationBegin: number;
  animationDuration: number;
  animationEasing: string;
  nameKey: string;
  blendStroke: boolean;
  rootTabIndex: number;
  midAngle: number;
  percent: number;
  value: number;
  payload: {
    value: number;
  };
}): ActiveShape<PieSectorDataItem> => {
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

function CustomTooltip({ active, payload }: CustomTooltipProps): React.JSX.Element{
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p>{` +${data.penalty}`}</p>
      </div>
    );
  }
  return <>
  </>;
};


// Componente para la gráfica
function PerformanceChart({
  chart,
  needComplement = false
}: ChartMetricsData): React.JSX.Element {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const width = 300;
  const height = 300;
  const innerRadius = 90;

  const onPieEnter = (_: string, index: number): void => {
    setActiveIndex(index);
  };

  const dataForPieChart: DataPieChart[] = formattedData(chart, needComplement);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape as unknown as ActiveShape<PieSectorDataItem>}
            data={dataForPieChart}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {dataForPieChart.map((entry: DataPieChart, index: number) => (
              <Cell key={`cell-${index}` as unknown as string} fill={entry?.fill} />
            ))}
          </Pie>
          { dataForPieChart[0]?.penalty && <Tooltip content={<CustomTooltip />} />}
        </PieChart>
      </ResponsiveContainer>
      <h3 style={{ color: dataForPieChart[activeIndex]?.fill }}>{dataForPieChart[activeIndex]?.name}</h3>
    </Box>
  );
};


// Tipado para el Card principal
export interface PerformanceChartCardProps {
  metricsData: ChartMetricsData[]; // Puede contener varias métricas
  loader: boolean;
  hasErrors: boolean;
}

// Componente principal para la card con 1 o más gráficos
export function PerformanceChartCard ({
  metricsData,
  loader,
  hasErrors
}: PerformanceChartCardProps): React.JSX.Element {
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
        subheader="Diagnose performance issues"
        title="Page Speed Insights"
      />
      <CardContent>
        {loader ? (
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Skeleton variant="circular" width={150} height={150} />
          </Box>
        ) : hasErrors ? (
          <Box sx={{ textAlign: "center", color: "red" }}>Error al cargar datos</Box>
        ) : (
          <Grid container spacing={2} justifyContent="center" >
            {metricsData.map((metric:  ChartMetricsData, index: number) => (
              <Grid item key={index  as unknown as number} xs={12} sm={6} md={4}>
                <PerformanceChart chart={metric.chart} needComplement={metric.needComplement}  />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
