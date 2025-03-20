'use client';

import axios from 'axios';
import type { Range } from '@/types/analytics';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081/api';

export interface AnalyticsRequest {
    range: Range;
    googleToken?: string;
    dimensions?: string[];
    metric?: string[];
    viewId?: string; 
    isRealTime?: boolean;
    keepEmptyRows?: boolean;
}

export interface SearchConsoleRequest {
    range: Range;
    googleToken?: string;
    siteUrl?: string;
    rowLimit?: number;
}

export interface PageSpeedInsightRequest {
    googleToken?: string;
    siteUrl?: string;
}

export const AnalyticsService = {

    handleAnalyticsRequest: async (params: AnalyticsRequest) => {
        try {
            params.googleToken = JSON.parse(localStorage.getItem('refresh-token') ?? '');
            const response = await axios.post(`${API_URL}/google/analytics`, { ...params });
            return response.data;
        } catch (error: any) {
            console.error('Error to get analytics:', error);
            throw error?.response?.data;
        }
    },

    
    handleSearchConsoleRequest: async (params: SearchConsoleRequest) => {
        try {
            params.googleToken = JSON.parse(localStorage.getItem('refresh-token') ?? '');
            const response = await axios.post(`${API_URL}/google/searchConsole`, { ...params });
            return response.data;
        } catch (error: any) {
            console.error('Error to get analytics:', error);
            throw error?.response?.data;
        }
    },

    
    handlePageSpeedInsightsRequest: async (params: PageSpeedInsightRequest) => {
        try {
            params.googleToken = JSON.parse(localStorage.getItem('refresh-token') ?? '');
            const response = await axios.post(`${API_URL}/google/pageSpeed`, { ...params });
            return response.data;
        } catch (error: any) {
            console.error('Error to get analytics:', error);
            throw error?.response?.data;
        }
    },
}