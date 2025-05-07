export type Range = "day" | "week" | "month" | "quarter";

export type Metric =
  | "position"
  | "clicks"
  | "impressions"
  | "ctr"
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


export interface RunReportResponseData {
    dimensionHeaders: DimensionHeader[];
    metricHeaders: MetricHeader[];
    metadata: Record<string, string>;
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
  keys?: [string];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
  dimensionValues: Value[];
  metricValues:    Value[];
}

export interface Value {
  value: string;
}

export type SearchMetric = "clicks" | "impressions" | "ctr" | "position";

export interface AnalyticsRequest {
  range: Range;
  metric: Metric[];
  websiteId?: string;
  isRealTime?: boolean;
  dimensions?: string[];
  keepEmptyRows?: boolean;
}

export interface SearchConsoleRequest {
  range: Range;
  rowLimit: number;
}

export interface PageSpeedInsightRequest {
  siteUrl: string;
}
export interface PageSpeedDefault {
  metrics:       Metrics;
  performance:   Accessibility;
  accessibility: Accessibility;
  bestPractices: Accessibility;
  seo:           Accessibility;
}

export interface Accessibility {
  value: number;
  name:  string;
  penalty?: number;
}

export interface Metrics {
  performance:            Performance;
  speedIndex:             CumulativeLayoutShift;
  firstContentfulPaint:   CumulativeLayoutShift;
  largestContentfulPaint: CumulativeLayoutShift;
  cumulativeLayoutShift:  CumulativeLayoutShift;
  totalBlockingTime:      CumulativeLayoutShift;
}

export interface CumulativeLayoutShift {
  description: string;
  time:        string;
  title:       string;
  penalty:     number;
  metricScore: number;
}

export interface Performance {
  score: number;
  title: string;
  penalty?:     number;
  metricScore?: number;
}

export interface DataChart {
  Date?: string;
  Sessions?: number;
  "Bounce Rate"?: number;
  Duration?: number;
  Users?: number;
}

export interface SessionData {
  name: string;
  value: number;
  color: string;
}

export interface ChartMetricsData {
  chart: Accessibility[];
  needComplement: boolean;
}

export interface DataPieChart {
  value: number;
  name:  string;
  fill: string;
  penalty?: number;
}