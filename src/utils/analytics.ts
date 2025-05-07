import { format, parse, sub } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import type { Formatter } from "recharts/types/component/DefaultTooltipContent";
import type { Range, Metric, RunReportResponseData, Row, ReportSession, SearchQueryResponseData, SearchMetric, DataPieChart, Accessibility } from "@/types/analytics";
import type { AnalyticsResponse, QueryData } from "@/types/apis";

export type DataKey = "Duration" | "Bounce Rate" | "Sessions" | "Users";

export function displayDuration(seconds: number): string {
    if (seconds < 60) {
      return `${parseFloat(`${seconds}`).toFixed(0)}s`;
    }
    const minutes = seconds / 60;
    return `${minutes.toFixed(1)} min`;
  }

export const tooltipFormatter: Formatter<number, DataKey> = (value, name) => {
    switch (name) {
      case "Users": {
        return value;
      }
      case "Sessions": {
        return value;
      }
      case "Bounce Rate": {
        return `${value.toFixed(2)}%`;
      }
      case "Duration": {
        return displayDuration(value);
      }
    }
};

export const formatLabel = (range: Range, label: string): string => {
    if (range === "quarter") {
      const dateFormat = "do MMM";

      const endOfWeek = parse(label, dateFormat, new Date());
      const startOfWeek = sub(endOfWeek, { days: 7 });

      return `${format(startOfWeek, dateFormat)} - ${format(
        endOfWeek,
        dateFormat
      )}`; // "12th Jul - 19th Jul"
    }
    return label; // "19th Jul"
};

export function getDataKey(metric: Metric): DataKey {
    switch (metric) {
      case "averageSessionDuration": {
        return "Duration";
      }
      case "bounceRate": {
        return "Bounce Rate";
      }
      case "sessions": {
        return "Sessions";
      }
      default:
        return "Users";
    }
}

export function getDateLabel(
    range: Range,
    rowIndex: number,
    rows: Row[],
    timezone: string
  ): string {
    const rowsCount = rows?.length;

    if (range === "quarter") {
      const minIndex = parseInt(rows?.[0]?.dimensionValues[0].value);
      const difference = rowIndex - minIndex + 1;

      const yesterday = sub(new Date(), { days: 1 });

      const weeksToSubtract = rowsCount - difference;
      const targetWeekEnd = sub(yesterday, { weeks: weeksToSubtract });

      const label = formatInTimeZone(targetWeekEnd, timezone, "do MMM");

      return label;
    }

    const yesterday = sub(new Date(), { days: 1 });

    const daysToSubtract = rowsCount - (rowIndex + 1);
    const targetDate = sub(yesterday, { days: daysToSubtract });

    const label = formatInTimeZone(targetDate, timezone, "do MMM");
    return label;
}

export const makeDataForChart = (chartData: AnalyticsResponse, metric: Metric, range: Range): {
  Date?: string;
  Sessions?: number;
  "Bounce Rate"?: number;
  Duration?: number;
  Users?: number;
}[] => chartData?.rows?.map((row: Row, index: number, rows: Row[] ): {
  Date?: string;
  Sessions?: number;
  "Bounce Rate"?: number;
  Duration?: number;
  Users?: number;
} => {
  const dimensionValue = row.dimensionValues[0].value;
  const timeZone = chartData?.metadata?.timeZone;

  switch (metric) {
    case "sessions": {
      return {
        Date: getDateLabel(range, parseInt(dimensionValue), rows, timeZone),
        Sessions: parseInt(row.metricValues[1].value),
      };
    }
    case "bounceRate": {
      return {
        Date: getDateLabel(range, parseInt(dimensionValue), rows, timeZone),
        "Bounce Rate": parseFloat(row.metricValues[2].value) * 100,
      };
    }
    case "averageSessionDuration": {
      return {
        Date: getDateLabel(range, parseInt(dimensionValue), rows, timeZone),
        Duration: parseFloat(row.metricValues[3].value),
      };
    }

    default: {
      return {
        Date: getDateLabel(range, parseInt(dimensionValue), rows, timeZone),
        Users: parseInt(row.metricValues[0].value),
      };
    }
  }
});

const COLORS = [
  "rgb(71, 71, 235)",
  "rgb(115, 51, 204)",
  "rgb(207, 163, 242)",
  "rgb(114, 7, 150)",
  "rgb(8, 120, 179)",
  "rgb(26, 115, 232)",
];

export const dataForPieChart = (data: ReportSession): {
  name: string;
  value: number;
  color: string;
}[] | null => {
  return data?.rows?.map((row, i) => ({
    name: row.dimensionValues[0].value,
    value: Number(row.metricValues[0].value),
    color: COLORS[i]
  })) ?? null;
}

export function aggregateAnalyticsData(
  rows: NotUndefined<RunReportResponseData["rows"]>
): {
  totalUsers: number;
  totalSessions: number;
  averageBounceRate: number;
  averageDuration: number;
} {
  const totalUsers = rows?.reduce(
    (prev, curr) => parseInt(curr.metricValues[0].value) + prev,
    0
  ) || 0;

  const totalSessions = rows?.reduce(
    (prev, curr) => parseInt(curr.metricValues[1].value) + prev,
    0
  ) || 0;

  const averageBounceRate =
    rows?.reduce(
      (prev, curr) => parseFloat(curr.metricValues[2].value) * 100 + prev,
      0
    ) / rows?.length || 0;

  const averageDuration =
    rows?.reduce(
      (prev, curr) => parseFloat(curr.metricValues[3].value) + prev,
      0
    ) / rows?.length || 0;

  return {
    totalUsers,
    totalSessions,
    averageBounceRate,
    averageDuration,
  };
}

export const formattedData = (chart: Accessibility[], needComplement: boolean): DataPieChart[] => chart?.flatMap(({ value, name, penalty }) => {
  const mainElement = {
    value: value ?? 0,
    name: name ?? '',
    penalty: penalty ?? 0,
    fill: value <= 49 ? "#f33" : value <= 89 ? "#fa3" : value <= 100 ? "#0c6" : "#ccc",
  };

  const complementElement = needComplement
    ? [{
        value: 100 - mainElement.value,
        fill: "var(--mui-palette-background-level1)",
        name: "",
        penalty: 0,
      }]
    : [];

  return [mainElement, ...complementElement];
})?.filter((element: DataPieChart) => Boolean(element)) ?? [];

export function aggregateSeoData(rows: SearchQueryResponseData["rows"]) : {
  totalClicksOrigin: number;
  totalImpressionsOrigin: number;
  averageCTROrigin: number;
  averagePositionOrigin: number;
} {
  const totalClicksOrigin = rows.reduce((prev, curr) => curr.clicks + prev, 0);

  const totalImpressionsOrigin = rows.reduce(
    (prev, curr) => curr.impressions + prev,
    0
  );

  const averageCTROrigin =
    rows.reduce((prev, curr) => curr.ctr * 100 + prev, 0) / rows.length;

  const averagePositionOrigin =
    rows.reduce((prev, curr) => curr.position + prev, 0) / rows.length;

  return {
    totalClicksOrigin,
    totalImpressionsOrigin,
    averageCTROrigin,
    averagePositionOrigin,
  };
}
export function getDateLabelForSEO(dateString: string): string {
  const label = formatInTimeZone(dateString, "America/Denver", "do MMM");
  return label;
}

export const customDataForSEO = (chartData: AnalyticsResponse, metric: string): QueryData[] => chartData?.rows?.map((row: Row) => {
  switch (metric) {
    case "impressions": {
      return {
        name: getDateLabelForSEO(row.keys?.[0] ?? new Date().toISOString()),
        Impressions: row.impressions,
      };
    }
    case "ctr": {
      return {
        name: getDateLabelForSEO(row.keys?.[0] ?? new Date().toISOString()),
        CTR: row.ctr,
      };
    }
    case "position": {
      return {
        name: getDateLabelForSEO(row.keys?.[0] ?? new Date().toISOString()),
        Position: row.position,
      };
    }
    default: {
      return {
        name: getDateLabelForSEO(row.keys?.[0] ?? new Date().toISOString()),
        Clicks: row.clicks,
      };
    }
  }
});


export function getDataKeySEO(metric: SearchMetric): Metric {
  switch (metric) {
    case "clicks": {
      return "clicks";
    }
    case "impressions": {
      return "impressions";
    }
    case "ctr": {
      return "ctr";
    }
    case "position":
      return "position";
  }
}


export const tooltipFormatterSEO: Formatter<number, DataKey> = (value: number, name: string): string => {
  switch (name) {
    case "Clicks": {
      return value.toString();
    }
    case "Impressions": {
      return value.toString();
    }
    case "CTR": {
      let ctr = (value * 100).toFixed(2);
      if (ctr === "0.00") {
        ctr = "0";
      }
      return `${ctr}%`;
    }
    case "Position": {
      return value.toFixed(1).toString();
    }
  }
  return value.toFixed(1).toString();
};

export type NotUndefined<T> = T extends undefined ? never : T;