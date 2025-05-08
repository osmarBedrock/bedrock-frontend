'use client';

import axios, { type AxiosError } from 'axios';
import type { User, Website, VerificationData, Integration } from '@/types/user';
import type { SignUpParams } from '@/lib/auth/custom/client';

const API_URL: string = import.meta.env.VITE_BACKEND_URL as string || 'http://localhost:8081';

if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error("La variable VITE_BACKEND_URL no está definida");
}

export const AuthService = {
    googleAuthRedirect: async (): Promise<{ url?: string, error?: AxiosError }> => {
      const response = await axios.get<{ url?: string, error?: AxiosError }>(`${API_URL}/api/user/google/auth`);
      return response.data;
    },

    handleAuthCallback: async (code: string): Promise<{ user?: User, updatedWebsite?: Website, integration?: Integration, verificationData?: VerificationData, website?: Website, error?: AxiosError }> => {
      const response = await axios.get<{ user?: User, updatedWebsite?: Website, integration?: Integration, verificationData?: VerificationData, website?: Website, error?: AxiosError }>(`${API_URL}/api/user/google/callback`, { params: { code } });
      return response.data;
    },

    handleSignUpForm: async (payload: SignUpParams): Promise <{token?: string, user?: User, website?: Website, error?: AxiosError}> => {
      const response = await axios.post<{token?: string, user?: User, website?: Website, error?: AxiosError}>(`${API_URL}/api/user/signup`, payload);
      return response.data;
    },

    handleSignIn: async (payload: {email: string, password: string}): Promise <{user?: User, token?: string, error?: AxiosError}> => {
      const response = await axios.post<{user?: User, token?: string, error?: AxiosError}>(`${API_URL}/api/user/signin`, payload);
      return response.data;
    },

    handleDataUser: async ({email}: {email: string}): Promise <{user?: User, error?: AxiosError}> => {
        const response = await axios.get<{user?: User, error?: AxiosError}>(`${API_URL}/api/user/`, {params: { email }});
        return response.data;
    },

    handleUpdateDataUser: async (user: User): Promise <{user?: User, website?: Website, error?: AxiosError}> => {
      const response = await axios.patch<{user?: User, website?: Website, error?: AxiosError}>(`${API_URL}/api/user/profile/${user?.id}`, {...user, id: user?.id} );
      return response.data;
    }
};