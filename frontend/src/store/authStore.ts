import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginRequest, LoginResponse } from '../types/auth.types';
import { apiService } from '../services/api.service';
import { websocketService } from '../services/websocket.service';
import { notificationClientService } from '../services/notification.service';

interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.post<LoginResponse>('/auth/login', credentials);

          // Store tokens
          localStorage.setItem('accessToken', response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Connect to WebSocket
          websocketService.connect(response.accessToken);

          // Auto-subscribe to push notifications (non-blocking)
          if (!notificationClientService.isSubscribed() && notificationClientService.isSupported()) {
            setTimeout(() => {
              notificationClientService.requestPermissionAndSubscribe().catch(() => {});
            }, 2000);
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : 'Login failed. Please check your credentials.';

          set({
            isLoading: false,
            error: message,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });

          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await apiService.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear local storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          // Disconnect WebSocket
          websocketService.disconnect();

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await apiService.get<{ user: { id: string; username: string } }>(
            '/auth/me'
          );

          set({
            user: response.user,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Reconnect WebSocket if needed
          if (!websocketService.isConnected()) {
            websocketService.connect(token);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
