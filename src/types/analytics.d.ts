export type Range = "day" | "week" | "month" | "quarter";

export type Metric =
  | "position"
  | "clicks"
  | "impressions"
  | "ctr"
  | "position"
  | "activeUsers"
  | "sessions"
  | "bounceRate"
  | "averageSessionDuration";


interface SearchRow {
  keys: [string];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchQueryResponseData {
  rows: SearchRow[];
  responseAggregationType: string;
}

export interface Row {
    dimensionValues: DimensionValue[];
    metricValues: MetricValue[];
}

export interface RunReportResponseData {
    dimensionHeaders: DimensionHeader[];
    metricHeaders: MetricHeader[];
    metadata: Record<string, any>;
    kind: "analyticsData#runReport";
    rowCount?: number;
    rows?: Row[];
}

export interface ReportSession {
  dimensionHeaders: DimensionHeader[];
  metricHeaders:    MetricHeader[];
  rows:             Row[];
  rowCount:         number;
  metadata:         Metadata;
  kind:             string;
}

export interface DimensionHeader {
  name: string;
}

export interface Metadata {
  currencyCode: string;
  timeZone:     string;
}

export interface MetricHeader {
  name: string;
  type: string;
}

export interface Row {
  dimensionValues: Value[];
  metricValues:    Value[];
}

export interface Value {
  value: string;
}

export type SearchMetric = "clicks" | "impressions" | "ctr" | "position";
