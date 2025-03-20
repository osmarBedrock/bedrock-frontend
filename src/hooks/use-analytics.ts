import { AnalyticsRequest, AnalyticsService, PageSpeedInsightRequest, SearchConsoleRequest } from "@/lib/auth/services/analytics"
import { Metric, Range } from "@/types/analytics";
import { aggregateAnalyticsData, aggregateSeoData, customDataForSEO, dataForPieChart, makeDataForChart } from "@/utils/analytics";
import { useState } from "react";
export interface Metrics {
  value: number;
  name: string;
}
export const useAnalytics = (setRange: any, params: URLSearchParams, range: Range, initialValueMetric: Metric) => {

  const [ chartData, setChartData] = useState<any>();
  const [ loaderData, setLoaderData] = useState<boolean>(false);
  const [ loaderSessionData, setLoaderSessionData] = useState<boolean>(false);
  const [ loaderDataForTable, setLoaderDataForTable] = useState<boolean>(false);
  const [ loaderPerformanceMetrics, setLoaderPerformanceMetrics] = useState<boolean>(false);
  const [ hasErrors,  setHasErrors] = useState<boolean>(false);
  const [ sessionData, setSessionData] = useState<any>();
  const [ totalUsers, setTotalUsers] = useState<number>(0);
  const [ totalSessions, setTotalSessions] = useState<number>(0);
  const [ averageBounceRate, setAverageBounceRate] = useState<number>(0);
  const [ averageDuration, setAverageDuration] = useState<number>(0);
  const [ data, setData] = useState<any[]>([]);
  const [ metric, setMetric] = useState<Metric>(initialValueMetric);
  const [ dataChart, setDataChart] = useState<number>(0);
  const [ dataTable, setDataTable] = useState<number>(0);
  const [ totalClicks, setTotalClicks] = useState<number>(0);
  const [ totalImpressions, setTotalImpressions] = useState<number>(0);
  const [ averageCTR, setAverageCTR] = useState<number>(0);
  const [ averagePosition, setAveragePosition] = useState<number>(0);
  const [ dataForChart, setDataForChartAveragePosition] = useState<any>([]);
  const [ dataForTable, setDataForTable] = useState<any>([]);
  const [ performanceMetrics, setPerformanceMetrics ] = useState<Metrics[][]>([]);
  const [ accessibilityMetrics, setAccessibilityMetrics ] = useState<any[]>([]);
  const [ bestPracticesMetrics, setBestPracticesMetrics ] = useState<any[]>([]);
  const [ seoMetrics, setSEOMetrics ] = useState<any[]>([]);
  const [ generalMetrics, setGeneralMetrics ] = useState<any[]>([]);

  const fetchAnalyticsData = async () => {
    const viewId = "413032710";
    const isRealTime = true;
    const _range = (params.get("range") ?? "week") as Range; 
    setRange(_range);
    setLoaderData(true);
    setLoaderSessionData(true);

    try {
      const results = await Promise.allSettled([
        getAnalytics({
          range,
          viewId,
          metric: ["activeUsers", "sessions", "bounceRate", "averageSessionDuration"],
        }),
        getAnalytics({
          range,
          isRealTime,
          viewId,
          metric: ["activeUsers"],
        }),
        getAnalytics({
          range,
          viewId,
          metric: ["activeUsers"],
          dimensions: ["country"],
          keepEmptyRows: true,
        }),
        getAnalytics({
          viewId,
          range,
          dimensions:["sessionDefaultChannelGroup"],
          metric:["sessions"],
          keepEmptyRows: true
        })
      ]);

      // Procesar los resultados
      const [chartDataResult, activeUsersResult, usersByCountryResult,PieChartSessionResult] = results;

      if (chartDataResult.status === "fulfilled" && chartDataResult?.value) {
        setChartData(chartDataResult.value);
        const { totalUsers, totalSessions, averageBounceRate, averageDuration } = aggregateAnalyticsData(chartDataResult.value?.rows);
        const customData = makeDataForChart(chartDataResult.value, metric, _range);
        setData(customData);
        setLoaderData(false);
        setTotalUsers(totalUsers);
        setTotalSessions(totalSessions);
        setAverageBounceRate(averageBounceRate);
        setAverageDuration(averageDuration);
      } else {
        console.error("Error fetching chart data:", chartDataResult);
      }

      if(PieChartSessionResult.status === "fulfilled"&& PieChartSessionResult?.value){
        const dataPieChart = dataForPieChart(PieChartSessionResult?.value)
        setSessionData(dataPieChart);
        setLoaderSessionData(false);
      }

      if (activeUsersResult.status === "fulfilled") {
        console.log("Active Users:", activeUsersResult.value);
      } else {
        console.error("Error fetching active users:", activeUsersResult.reason);
      }

      if (usersByCountryResult.status === "fulfilled") {
        console.log("Users by Country:", usersByCountryResult.value);
      } else {
        console.error("Error fetching users by country:", usersByCountryResult.reason);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  const fetchSearchConsoleData = async () => {
    const siteUrl = "https://4uroofingtx.com/";
    const _range = (params.get("range") ?? "week") as Range; 
    setRange(_range);
    setLoaderDataForTable(true);

    try {
      const [ chartDataResult, queriesDataResult ] = await Promise.allSettled([
        getSearchConsole({
          range,
          rowLimit:90,
          siteUrl,
        }),
        getSearchConsole({
          range,
          rowLimit:50,
          siteUrl,
        })
      ]);
      if (chartDataResult.status === "fulfilled" && chartDataResult?.value) {
        const { totalClicksOrigin, totalImpressionsOrigin, averageCTROrigin, averagePositionOrigin } = aggregateSeoData(chartDataResult.value.chartData);
        setTotalClicks(totalClicksOrigin)
        setTotalImpressions(totalImpressionsOrigin)
        setAverageCTR(averageCTROrigin)
        setAveragePosition(averagePositionOrigin)
        setDataChart(chartDataResult.value.chartData)
        setDataTable(chartDataResult.value.queries);
        const data = customDataForSEO(chartDataResult.value.chartData, metric);
        setDataForTable(chartDataResult.value.queries)
        setDataForChartAveragePosition(data);
        setLoaderDataForTable(false);
      } else {
        console.error("Error fetching chart data:", chartDataResult);
      }

      if(queriesDataResult.status === "fulfilled"&& queriesDataResult?.value){
        
      }
    }catch(error){
      console.log('error', error)
    }
  };
  const fetchPageSpeedData = async () => {
    const defaultValue: any = {
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
    const siteUrl = "https://prestigesurgery.com/";
    setLoaderPerformanceMetrics(true);
    setHasErrors(false);
    try {
      const {accessibility, bestPractices, performance, seo, metrics} =defaultValue; // await getPageSpeedInsights({siteUrl});
      const metricsValues = []
      for (const key in metrics) {
        metricsValues.push({'value':(metrics[key]?.metricScore * 100), 'name':metrics[key]?.title, penalty: metrics[key]?.penalty })
      }
      setPerformanceMetrics([performance])
      setAccessibilityMetrics([accessibility])
      setBestPracticesMetrics([bestPractices])
      setSEOMetrics([seo])
      setGeneralMetrics(metricsValues?.filter(({value})=>value))
      setLoaderPerformanceMetrics(false);
    }catch(error: any){
      console.log('error-->', error)
      setHasErrors(true);
    }
  };

  const refreshDataSearchConsole = () => {
    setLoaderDataForTable(true);
    const _metric = (params.get("metric") ?? "impressions") as Metric; 
    setMetric(_metric);
    if(dataChart) {
      const _data = customDataForSEO(dataChart, _metric);
      setDataForChartAveragePosition(_data);
    }
    if(dataTable){
      setDataForTable(dataTable);
      setLoaderDataForTable(false);
    }
  }
  const refreshData = () => {
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

    const getAnalytics = async (bodyAnalytics: AnalyticsRequest ) => {
        try {
            return await AnalyticsService.handleAnalyticsRequest(bodyAnalytics);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getSearchConsole = async (bodySearchConsole: SearchConsoleRequest) => {
        try {
            return await AnalyticsService.handleSearchConsoleRequest(bodySearchConsole);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getPageSpeedInsights = async (bodyPageSpeed: PageSpeedInsightRequest) => {
        try {
            return await AnalyticsService.handlePageSpeedInsightsRequest(bodyPageSpeed);
        } catch (error) {
            console.log('error', error)
        }
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
        dataForChart,
        dataForTable,
        metric,
        setData,
        performanceMetrics,
        accessibilityMetrics,
        bestPracticesMetrics,
        seoMetrics,
        generalMetrics,
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