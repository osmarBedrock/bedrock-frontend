'use client';

import { UserData } from '@/hooks/use-client';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081/api';

export const AuthService = {
    googleAuthRedirect: async () => {
        try {
            const response = await axios.get(`${API_URL}/google/auth`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener la URL de Google Auth:', error);
            throw error?.response?.data;
        }
    },
    
    handleAuthCallback: async (code: string): Promise<any> => {
        try {
            const response = await axios.post(`${API_URL}/google/callback`, { code });
            return response.data; // Token back por el backend
        } catch (error: any) {
            console.error('Error to get the url from google callback:', error);
            throw error?.response?.data;
        }
    },

    handleSignUpForm: async (payload: any): Promise <any> => {
        try {
            const response = await axios.post(`${API_URL}/client/signup`, payload);
            return response.data;
        } catch (error: any) {
            console.error('Error to connect with google services:', error);
            throw error?.response?.data;
        }
    },
    
    handleSignIn: async (payload: any): Promise <any> => {
        try {
            const response = await axios.post(`${API_URL}/client/signin`, payload);
            return response.data;
        } catch (error: any) {
            console.error('Error in the signin:', error);
            throw error?.response?.data;
        }
    },

    handleDataUser: async ({email}: any): Promise <any> => {
        try {
            const response = await axios.get(`${API_URL}/user/`, {params: { email }});
            return response;
        } catch (error: any) {
            console.error('Error in the signin:', error);
            throw error?.response?.data;
        }
    },

    handleUpdateDataUser: async (user: UserData): Promise <any> => {
        try {
            const response = await axios.patch(`${API_URL}/user/${user?.id}`, {...user, id: user?.id} );
            return response;
        } catch (error: any) {
            console.error('Error in the signin:', error);
            throw error?.response?.data;
        }
    }
};