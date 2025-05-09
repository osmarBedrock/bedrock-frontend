'use client';

import type { AnalyticsResponse, PageSpeedInsightResponse, SearchConsoleResponse } from '@/types/apis';
import { type AxiosResponse } from 'axios';
import type { AnalyticsRequest, PageSpeedInsightRequest, SearchConsoleRequest } from '@/types/analytics';
import api from './api';

const API_URL: string = import.meta.env.VITE_BACKEND_URL as string || 'http://localhost:8081';

if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error("La variable VITE_BACKEND_URL no está definida");
}

// Sistema de caché mejorado
const cache = {
  responses: new Map<string, { data: AnalyticsResponse | SearchConsoleResponse | PageSpeedInsightResponse; timestamp: number }>(), // Respuestas completadas
  pending: new Map<string, Promise<AnalyticsResponse | SearchConsoleResponse | PageSpeedInsightResponse>>() // Peticiones en curso
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos de vida en caché

// Generación de clave de caché consistente
const getCacheKey = (endpoint: string, params: AnalyticsRequest | SearchConsoleRequest | PageSpeedInsightRequest): string => {
  const keyStrategies = {
    analytics: ['range'], // Solo usa 'range' como clave
    searchConsole: ['range', 'siteUrl'],
    pageSpeed: ['siteUrl']
  };

  const service = endpoint.includes('searchConsole') ? 'searchConsole'
               : endpoint.includes('pageSpeed') ? 'pageSpeed'
               : 'analytics';

  return `${service}-${
    keyStrategies[service]
      .filter((field: string) => params[field as keyof typeof params])
      .map((field: string) => `${field}:${JSON.stringify(params[field as keyof typeof params])}`)
      .join('|')
  }`;
};

// Núcleo del sistema de caché mejorado
const executeRequest = async <T>(endpoint: string, params: AnalyticsRequest | SearchConsoleRequest | PageSpeedInsightRequest): Promise<T> => {
  const key = getCacheKey(endpoint, params);
  const url = `${API_URL}/api/${endpoint}`;

  // 1. Verificar respuesta en caché (válida)
  const cachedResponse = cache.responses.get(key);
  if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_TTL)) {
    return cachedResponse.data as T;
  }

  // 2. Verificar si ya hay una solicitud pendiente para esta clave
  if (cache.pending.has(key)) {
    return cache.pending.get(key) as Promise<T>;
  }

  try {

    // 4. Crear y almacenar la promesa de la solicitud
    const requestPromise: Promise<T> = api.post(url, params)
      .then((response: AxiosResponse<T>) => {
        // Almacenar en caché solo si la respuesta es exitosa
        if (response.status >= 200 && response.status < 300) {
          cache.responses.set(key, {
            data: response.data as AnalyticsResponse | SearchConsoleResponse | PageSpeedInsightResponse,
            timestamp: Date.now()
          });
        }
        return response.data;
      })
      .finally(() => {
        // Limpiar la solicitud pendiente cuando se complete (éxito o error)
        cache.pending.delete(key);
      });

    // Registrar la solicitud pendiente
    cache.pending.set(key, requestPromise as Promise<AnalyticsResponse | SearchConsoleResponse | PageSpeedInsightResponse>);

    return await requestPromise;
  } catch (error) {
    // Asegurarse de limpiar la solicitud pendiente en caso de error
    cache.pending.delete(key);
    throw error;
  }
};

export const AnalyticsService = {
  handleAnalyticsRequest: (params: AnalyticsRequest) =>
    executeRequest<AnalyticsResponse>('google/analytics', params),

  handleSearchConsoleRequest: (params: SearchConsoleRequest) =>
    executeRequest<SearchConsoleResponse>('google/searchConsole', params),

  handlePageSpeedInsightsRequest: (params: PageSpeedInsightRequest) =>
    executeRequest<PageSpeedInsightResponse>('google/pageSpeed', params),

  // Herramientas para desarrollo
  clearCache: () => {
    cache.responses.clear();
    cache.pending.clear();
  },

  getCacheState: () => ({
    cached: Array.from(cache.responses.keys()),
    pending: Array.from(cache.pending.keys())
  })
};
