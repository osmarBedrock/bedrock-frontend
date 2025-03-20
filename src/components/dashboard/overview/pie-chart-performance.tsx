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
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip, TooltipProps } from "recharts";
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { Speedometer as SpeedometerIcon } from "@phosphor-icons/react/dist/ssr/Speedometer";

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
}

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

const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Accede a los datos del elemento seleccionado
    return (
      <div>
        <p>{` +${data.penalty}`}</p>
      </div>
    );
  }

  return null;
};
// Componente para la gráfica
const PerformanceChart: React.FC<PerformanceChartProps> = ({
  metrics,
  width = 300,
  height = 300,
  innerRadius = 90,
  needComplement = false
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const formattedData: any = metrics?.map(({ value, ...rest }) => [{
    ...rest,
    value,
    fill:
      value <= 49 ? "#f33" : value <= 89 ? "#fa3" : value <= 100 ? "#0c6" : "#ccc",
  },
  needComplement ? { value: 100 - value, fill: "var(--mui-palette-background-level1)", name: "" } : null])?.flat()?.filter(element=>element);
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {formattedData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry?.fill} />
            ))}
          </Pie>
          { formattedData[0]?.penalty && <Tooltip content={<CustomTooltip />} />}
        </PieChart>
      </ResponsiveContainer>
      <h3 style={{ color: formattedData[activeIndex]?.fill }}>{formattedData[activeIndex]?.name}</h3>
    </Box>
  );
};


// Tipado para el Card principal
export interface PerformanceChartCardProps {
  metricsData: MetricData[]; // Puede contener varias métricas
  loader: boolean;
  hasErrors: boolean;
}

// Componente principal para la card con 1 o más gráficos
export const PerformanceChartCard: React.FC<PerformanceChartCardProps> = ({
  metricsData,
  loader,
  hasErrors
}) => {
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
            {metricsData.map((metric: any, index: number) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <PerformanceChart metrics={metric.chart} needComplement={metric.needComplement}  />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
