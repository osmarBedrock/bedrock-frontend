import { SearchQueryResponseData } from "./analytics";

export interface AnalyticsResponse {
  dimensionHeaders: DimensionHeader[];
  metricHeaders:    MetricHeader[];
  rows:             Row[];
  totals:           Row[];
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

export interface SearchConsoleResponse {
  rows: SearchRow[];
  responseAggregationType: string;
  chartData?: SearchQueryResponseData["rows"];
  queries: QueryData[];
}

export interface QueryData {
  name: string;
  Clicks?: number;
  Impressions?: number;
  CTR?: number;
  Position?: number;
}

export interface SearchRow {
  keys: [string];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageSpeedInsightResponse {
  performance: PerformanceData;
  accessibility: ScoreData;
  bestPractices: ScoreData;
  seo: ScoreData;
}

export interface PerformanceData  {
  score: number;
  metrics: PerformanceMetrics;
}

export interface ScoreData {
  score: number;
}

export interface PerformanceMetrics {
  firstContentfulPaint: number;
  speedIndex: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
}