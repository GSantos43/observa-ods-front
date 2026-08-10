import { defineStore } from 'pinia';
import { apiRequest, ApiError } from '@/services/api';

export interface AuthUser { id: string; name: string; email: string; role: 'ADMIN' | 'EDITOR'; active: boolean }
interface LoginResponse { accessToken: string; tokenType: 'Bearer'; user: AuthUser }
const TOKEN_KEY = 'observaods_access_token';

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: null as string | null, user: null as AuthUser | null, initialized: false, loading: false }),
  getters: { isAuthenticated: (state) => Boolean(state.token && state.user), isAdmin: (state) => state.user?.role === 'ADMIN' },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      try {
        const response = await apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        this.token = response.accessToken; this.user = response.user;
        if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, response.accessToken);
      } finally { this.loading = false; this.initialized = true; }
    },
    async restoreSession() {
      if (this.initialized) return;
      this.token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      if (!this.token) { this.initialized = true; return; }
      try { this.user = await apiRequest<AuthUser>('/auth/me', {}, this.token); }
      catch (error) { if (error instanceof ApiError && error.status === 401) this.logout(); else throw error; }
      finally { this.initialized = true; }
    },
    logout() { this.token = null; this.user = null; this.initialized = true; if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY); },
    async request<T>(path: string, options?: RequestInit) {
      try { return await apiRequest<T>(path, options, this.token); }
      catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          this.logout();
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') window.location.assign(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        }
        throw error;
      }
    },
  },
});
