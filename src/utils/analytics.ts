import { format, parse, sub } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import type { Formatter } from "recharts/types/component/DefaultTooltipContent";
import type { Range, Metric, RunReportResponseData, Row, ReportSession, SearchQueryResponseData, SearchMetric } from "@/types/analytics";

export type DataKey = "Duration" | "Bounce Rate" | "Sessions" | "Users";

export function displayDuration(seconds: number) {
    if (seconds < 60) {
      return parseFloat(`${seconds}`).toFixed(0) + "s";
    } else {
      const minutes = seconds / 60;
      return `${minutes.toFixed(1)} min`;
    }
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
        return value.toFixed(2) + "%";
      }
      case "Duration": {
        return displayDuration(value);
      }
    }
};

export const formatLabel = (range: Range, label: string) => {
    if (range === "quarter") {
      const dateFormat = "do MMM";
  
      const endOfWeek = parse(label, dateFormat, new Date());
      const startOfWeek = sub(endOfWeek, { days: 7 });
  
      return `${format(startOfWeek, dateFormat)} - ${format(
        endOfWeek,
        dateFormat
      )}`; // "12th Jul - 19th Jul"
    } else {
      return label; // "19th Jul"
    }
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
    timezone: string = "America/Denver" // default to MDT
  ) {
    const rowsCount = rows?.length;
  
    if (range === "quarter") {
      const minIndex = parseInt(rows?.[0]?.dimensionValues[0].value);
      const difference = rowIndex - minIndex + 1;
  
      const yesterday = sub(new Date(), { days: 1 });
  
      const weeksToSubtract = rowsCount - difference;
      const targetWeekEnd = sub(yesterday, { weeks: weeksToSubtract });
  
      const label = formatInTimeZone(targetWeekEnd, timezone, "do MMM");
  
      return label;
    } else {
      const yesterday = sub(new Date(), { days: 1 });
  
      const daysToSubtract = rowsCount - (rowIndex + 1);
      const targetDate = sub(yesterday, { days: daysToSubtract });
  
      const label = formatInTimeZone(targetDate, timezone, "do MMM");
      return label;
    }
}

export const makeDataForChart =(chartData: any, metric: any, range: Range) => chartData?.rows?.map((row: Row, _: any, rows: any ) => {
  const dimensionValue = row.dimensionValues[0].value;
  const timeZone = chartData?.metadata?.timeZone;

  switch (metric) {
    case "sessions": {
      console.log('1', 1)
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

export const dataForPieChart = (data: ReportSession) => {
  
  return data?.rows?.map((row, i) => ({
    name: row.dimensionValues[0].value,
    value: Number(row.metricValues[0].value),
    color: COLORS[i]
  })) ?? null;
}

export function aggregateAnalyticsData(
  rows: NotUndefined<RunReportResponseData["rows"]>
) {
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


export function aggregateSeoData(rows: SearchQueryResponseData["rows"]) {
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
export function getDateLabelForSEO(dateString: string) {
  const label = formatInTimeZone(dateString, "America/Denver", "do MMM");
  return label;
}

export const customDataForSEO = (chartData: any, metric: string) => chartData?.map((row: any) => {
  switch (metric) {
    case "clicks":
    default: {
      return {
        name: getDateLabelForSEO(row.keys[0]),
        Clicks: row.clicks,
      };
    }
    case "impressions": {
      return {
        name: getDateLabelForSEO(row.keys[0]),
        Impressions: row.impressions,
      };
    }
    case "ctr": {
      return {
        name: getDateLabelForSEO(row.keys[0]),
        CTR: row.ctr,
      };
    }
    case "position": {
      return {
        name: getDateLabelForSEO(row.keys[0]),
        Position: row.position,
      };
    }
  }
});


export function getDataKeySEO(metric: SearchMetric) {
  switch (metric) {
    case "clicks": {
      return "Clicks";
    }
    case "impressions": {
      return "Impressions";
    }
    case "ctr": {
      return "CTR";
    }
    case "position":
      return "Position";
  }
}


export const tooltipFormatterSEO: Formatter<number, DataKey> = (value: any, name: string) => {
  switch (name) {
    case "Clicks": {
      return value;
    }
    case "Impressions": {
      return value;
    }
    case "CTR": {
      let ctr = (value * 100).toFixed(2);
      if (ctr === "0.00") {
        ctr = "0";
      }
      return ctr + "%";
    }
    case "Position": {
      return value.toFixed(1);
    }
  }
};

export type NotUndefined<T> = T extends undefined ? never : T;