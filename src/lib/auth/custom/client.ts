'use client';

import type { User } from '@/types/user';
import { AuthService } from '../services/auth';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  
  async signUp(client: SignUpParams): Promise<{ error?: any }> {
    try {
      const { token, user } = await AuthService.handleSignUpForm(client);
      localStorage.setItem('custom-auth-token', token);
      localStorage.setItem('custom-auth-user', JSON.stringify(user));
      return {};      
    } catch (error: any) {
      return { error };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ url?: string, error?: any }> {
    try {
      const { url } = await AuthService.googleAuthRedirect();
      return {url};
    } catch (error) {
      return { error };
    }
  }

  async handleTokenFormGoogle(code: string): Promise<{ token?: string, error?: any, user?: any }> {
    try {
      const { token, user, refreshToken } = await AuthService.handleAuthCallback(code);
      const { data } = await AuthService.handleDataUser({email:user.email});
      localStorage.setItem('custom-auth-token', token);
      localStorage.setItem('refresh-token', JSON.stringify(refreshToken));
      localStorage.setItem('custom-auth-user', JSON.stringify({...user, ...data}));
      return {  };
    } catch (error) {
      return { error };
    }
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: any }> {
    try {
      const { email, password } = params;
      const { token, user } = await AuthService.handleSignIn({email,password});
      localStorage.setItem('custom-auth-token', token);
      localStorage.setItem('custom-auth-user', JSON.stringify(user));
      return { };
    } catch (error: any) {
      console.log(error)
      return { error };
    }

  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    localStorage.removeItem('custom-auth-user');
    localStorage.removeItem('refresh-token');

    return {};
  }
}

export const authClient = new AuthClient();
