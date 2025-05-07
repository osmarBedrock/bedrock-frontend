'use client';

import type { User, Website, Integration, VerificationData } from '@/types/user';
import { AuthService } from '../services/auth';
import type { AxiosError } from 'axios';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  enterpriseName: string;
  domain: string;
  email: string;
  password: string;
  terms?: boolean;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

export class AuthClient {

  async signUp(client: SignUpParams): Promise<{ error?: AxiosError }> {
    const { token, user, website } = await AuthService.handleSignUpForm(client);
    localStorage.setItem('custom-auth-token', token ?? '');
    localStorage.setItem('custom-auth-user', JSON.stringify({...user, website }));
    return { };
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ url?: string, error?: AxiosError }> {
    const { url } = await AuthService.googleAuthRedirect();
    return {url};
  }

  async handleTokenFormGoogle(code: string): Promise<{ token?: string, error?: AxiosError, user?: User, updatedWebsite?: Website, integration?: Integration, verificationData?: VerificationData, website?: Website }> {
    const { user, updatedWebsite, integration, verificationData, website } = await AuthService.handleAuthCallback(code);
    localStorage.setItem('custom-auth-token', JSON.stringify({ token: {
      accessToken: integration?.accessToken,
      refreshToken: integration?.refreshToken,
      expiresAt: integration?.expiresAt
    }}));
    localStorage.setItem('custom-auth-user', JSON.stringify({...user, updatedWebsite, verificationData, website}));
    return {  };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: AxiosError }> {
    const { email, password } = params;
    const { token, user, error } = await AuthService.handleSignIn({email,password});
    if (error) {
      throw error;
    }
    localStorage.setItem('custom-auth-token', token ?? '');
    localStorage.setItem('custom-auth-user', JSON.stringify(user));
    return { };
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: string | null, user?: User, error?: AxiosError }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');
    const user: User | null = JSON.parse(localStorage.getItem('custom-auth-user') || 'null') as User;

    if (!token) {
      return { data: null };
    }

    if(!user) {
      return { data: null };
    }

    return { data: token, user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    localStorage.removeItem('custom-auth-user');
    localStorage.removeItem('refresh-token');

    return {};
  }
}

export const authClient = new AuthClient();
