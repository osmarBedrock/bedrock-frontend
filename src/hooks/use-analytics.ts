import { AnalyticsService } from "@/lib/auth/services/analytics"
import type { Accessibility, AnalyticsRequest, DataChart, Metric, Metrics, PageSpeedDefault, PageSpeedInsightRequest, Range, SearchConsoleRequest, SearchQueryResponseData, SessionData } from "@/types/analytics";
import type { AnalyticsResponse, PageSpeedInsightResponse, QueryData, SearchConsoleResponse } from "@/types/apis";
import { aggregateAnalyticsData, aggregateSeoData, customDataForSEO, dataForPieChart, makeDataForChart } from "@/utils/analytics";
import { useState } from "react";

export const useAnalytics = (setRange: (range: Range) => void, params: URLSearchParams, range: Range, initialValueMetric: Metric) => {

  const [ chartData, setChartData] = useState<AnalyticsResponse>();
  const [ loaderData, setLoaderData] = useState<boolean>(false);
  const [ loaderSessionData, setLoaderSessionData] = useState<boolean>(false);
  const [ loaderDataForTable, setLoaderDataForTable] = useState<boolean>(false);
  const [ loaderPerformanceMetrics, setLoaderPerformanceMetrics] = useState<boolean>(false);
  const [ hasErrors,  setHasErrors] = useState<boolean>(false);
  const [ sessionData, setSessionData] = useState<SessionData[] | null>();
  const [ totalUsers, setTotalUsers] = useState<number>(0);
  const [ totalSessions, setTotalSessions] = useState<number>(0);
  const [ averageBounceRate, setAverageBounceRate] = useState<number>(0);
  const [ averageDuration, setAverageDuration] = useState<number>(0);
  const [ data, setData] = useState<DataChart[]>([]);
  const [ metric, setMetric] = useState<Metric>(initialValueMetric);
  const [ dataChart, setDataChart] = useState<SearchQueryResponseData["rows"] | AnalyticsResponse>();
  const [ dataTable, setDataTable] = useState<QueryData[]>([]);
  const [ totalClicks, setTotalClicks] = useState<number>(0);
  const [ totalImpressions, setTotalImpressions] = useState<number>(0);
  const [ averageCTR, setAverageCTR] = useState<number>(0);
  const [ averagePosition, setAveragePosition] = useState<number>(0);
  const [ dataForChartAveragePosition, setDataForChartAveragePosition] = useState<QueryData[]>([]);
  const [ dataForTable, setDataForTable] = useState<QueryData[]>([]);
  const [ performanceMetrics, setPerformanceMetrics ] = useState<Accessibility[]>([]);
  const [ accessibilityMetrics, setAccessibilityMetrics ] = useState<Accessibility[]>([]);
  const [ bestPracticesMetrics, setBestPracticesMetrics ] = useState<Accessibility[]>([]);
  const [ seoMetrics, setSEOMetrics ] = useState<Accessibility[]>([]);
  const [ generalMetrics, setGeneralMetrics ] = useState<{value: number, name: string, penalty: number}[]>([]);

  const fetchAnalyticsData = async (): Promise<void> => {
    const isRealTime = true;
    const _range = (params.get("range") ?? "week") as Range;
    setRange(_range);
    setLoaderData(true);
    setLoaderSessionData(true);

    try {
      const results = await Promise.allSettled([
        getAnalytics({
          range,
          metric: ["activeUsers", "sessions", "bounceRate", "averageSessionDuration"],
        }),
        getAnalytics({
          range,
          isRealTime,
          metric: ["activeUsers"],
        }),
        getAnalytics({
          range,
          metric: ["activeUsers"],
          dimensions: ["country"],
          keepEmptyRows: true,
        }),
        getAnalytics({
          range,
          dimensions:["sessionDefaultChannelGroup"],
          metric:["sessions"],
          keepEmptyRows: true
        })
      ]);

      // Procesar los resultados
      const [chartDataResult, _, __, PieChartSessionResult] = results;

      if (chartDataResult.status === "fulfilled" && chartDataResult?.value) {
        setChartData(chartDataResult.value);
        const { totalUsers: totalUsersOrigin, totalSessions: totalSessionsOrigin, averageBounceRate: averageBounceRateOrigin, averageDuration: averageDurationOrigin } = aggregateAnalyticsData(chartDataResult.value?.rows);
        const customData = makeDataForChart(chartDataResult.value, metric, _range);
        setData(customData);
        setLoaderData(false);
        setTotalUsers(totalUsersOrigin);
        setTotalSessions(totalSessionsOrigin);
        setAverageBounceRate(averageBounceRateOrigin);
        setAverageDuration(averageDurationOrigin);
      } else {
        throw new Error("Error fetching chart data");
      }

      if(PieChartSessionResult.status === "fulfilled"&& PieChartSessionResult?.value){
        const dataPieChart = dataForPieChart(PieChartSessionResult?.value)
        setSessionData(dataPieChart);
        setLoaderSessionData(false);
      }

      // if (activeUsersResult.status === "fulfilled") {
      // } else {
      //   throw new Error("Error fetching active users");
      // }

      // if (usersByCountryResult.status === "fulfilled") {
      // } else {
      //   throw new Error("Error fetching users by country");
      // }
    } catch (error) {
      throw new Error("Unexpected error");
    }
  };

  const fetchSearchConsoleData = async (): Promise<void> => {
    const _range = (params.get("range") ?? "week") as Range;
    setRange(_range);
    setLoaderDataForTable(true);

    try {
      const [ chartDataResult, _ ] = await Promise.allSettled([
        getSearchConsole({
          range,
          rowLimit:90,
        }),
        getSearchConsole({
          range,
          rowLimit:50,
        })
      ]);

      if (chartDataResult.status === "fulfilled" && chartDataResult?.value) {
        const { totalClicksOrigin, totalImpressionsOrigin, averageCTROrigin, averagePositionOrigin } = aggregateSeoData(chartDataResult.value.chartData ?? []);
        setTotalClicks(totalClicksOrigin)
        setTotalImpressions(totalImpressionsOrigin)
        setAverageCTR(averageCTROrigin)
        setAveragePosition(averagePositionOrigin)
        setDataChart(chartDataResult.value.chartData)
        setDataTable(chartDataResult.value.queries);
        const newData = customDataForSEO(chartDataResult.value.chartData as unknown as AnalyticsResponse, metric);
        setDataForTable(chartDataResult.value.queries)
        setDataForChartAveragePosition(newData);
        setLoaderDataForTable(false);
      } else {
        throw new Error("Error fetching chart data");
      }

      // if(queriesDataResult.status === "fulfilled"&& queriesDataResult?.value){

      // }
    }catch(error){
      throw new Error(error as string);
    }
  };
  const fetchPageSpeedData = async (): Promise<void> => {
    const defaultValue: PageSpeedDefault = {
      "metrics": {
          "performance": {
              "score": 79,
              "title": "Performance"
          },
          "speedIndex": {
              "description": "Speed Index shows how quickly the contents of a page are visibly populated. [Learn more about the Speed Index metric](https://developer.chrome.com/docs/lighthouse/performance/speed-index/).",
              "time": "2.2 s",
              "title": "Speed Index",
              "penalty": 5,
              "metricScore": 0.52
          },
          "firstContentfulPaint": {
              "description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
              "time": "0.8 s",
              "title": "First Contentful Paint",
              "penalty": 0,
              "metricScore": 0.96
          },
          "largestContentfulPaint": {
              "description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
              "time": "2.8 s",
              "title": "Largest Contentful Paint",
              "penalty": 16,
              "metricScore": 0.37
          },
          "cumulativeLayoutShift": {
              "description": "Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more about the Cumulative Layout Shift metric](https://web.dev/articles/cls).",
              "time": "0.001",
              "title": "Cumulative Layout Shift",
              "penalty": 25,
              "metricScore": 1
          },
          "totalBlockingTime": {
              "description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
              "time": "30 ms",
              "title": "Total Blocking Time",
              "penalty": 30,
              "metricScore": 1
          }
      },
      "performance": {
          "value": 79,
          "name": "Performance"
      },
      "accessibility": {
          "value": 91,
          "name": "Accessibility"
      },
      "bestPractices": {
          "value": 96,
          "name": "Best Practices"
      },
      "seo": {
          "value": 92,
          "name": "SEO"
      }
    }
    setLoaderPerformanceMetrics(true);
    setHasErrors(false);
    try {
      const {accessibility, bestPractices, performance, seo, metrics} = defaultValue; // await getPageSpeedInsights({siteUrl});
      const metricsValues: {value: number, name: string, penalty: number}[] = []
      for (const key in metrics) {
        const _metric = metrics[key as keyof Metrics];
        metricsValues.push({
          value: ((_metric?.metricScore ?? 0) * 100),
          name: _metric?.title ?? "",
          penalty: _metric?.penalty ?? 0
        })
      }
      setPerformanceMetrics([performance])
      setAccessibilityMetrics([accessibility])
      setBestPracticesMetrics([bestPractices])
      setSEOMetrics([seo])
      setGeneralMetrics(metricsValues?.filter(({value})=>value))
      setLoaderPerformanceMetrics(false);
      }catch(error: unknown ){
        setHasErrors(true);
        throw new Error("Error fetching page speed data");
    }
  };

  const refreshDataSearchConsole = (): void => {
    setLoaderDataForTable(true);
    const _metric = (params.get("metric") ?? "impressions") as Metric;
    setMetric(_metric);
    if(dataChart) {
      const _data = customDataForSEO(dataChart as AnalyticsResponse, _metric);
      setDataForChartAveragePosition(_data);
    }
    if(dataTable){
      setDataForTable(dataTable);
      setLoaderDataForTable(false);
    }
  }
  const refreshData = (): void => {
    setLoaderData(true);
    const _metric = (params.get("metric") ?? "activeUsers") as Metric;
    const _range = (params.get("range") ?? "week") as Range;
    setMetric(_metric);
    if(chartData?.rows) {
      const customData = makeDataForChart(chartData, _metric,_range);
      setData(customData);
      setLoaderData(false);
    }
  }

    const getAnalytics = async (bodyAnalytics: AnalyticsRequest ): Promise<AnalyticsResponse> => {
      return await AnalyticsService.handleAnalyticsRequest(bodyAnalytics);
    }

    const getSearchConsole = async (bodySearchConsole: SearchConsoleRequest): Promise<SearchConsoleResponse> => {
      return await AnalyticsService.handleSearchConsoleRequest(bodySearchConsole);
    }

    const getPageSpeedInsights = async (bodyPageSpeed: PageSpeedInsightRequest): Promise<PageSpeedInsightResponse> => {
      return await AnalyticsService.handlePageSpeedInsightsRequest(bodyPageSpeed);
    }

    return {
        getAnalytics,
        getPageSpeedInsights,
        getSearchConsole,
        chartData,
        sessionData,
        totalUsers,
        totalSessions,
        averageBounceRate,
        averageDuration,
        data,
        totalClicks,
        totalImpressions,
        averageCTR,
        averagePosition,
        dataForChart: dataForChartAveragePosition,
        dataForTable,
        metric,
        setData,
        performanceMetrics: performanceMetrics ?? [],
        accessibilityMetrics: accessibilityMetrics ?? [],
        bestPracticesMetrics: bestPracticesMetrics ?? [],
        seoMetrics: seoMetrics ?? [],
        generalMetrics: generalMetrics ?? [],
        fetchPageSpeedData,
        fetchAnalyticsData,
        fetchSearchConsoleData,
        refreshDataSearchConsole,
        refreshData,
        loaderData,
        loaderSessionData,
        loaderDataForTable,
        loaderPerformanceMetrics,
        hasErrors
    }
}