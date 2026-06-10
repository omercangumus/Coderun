// Auth hook — useAuthStore'u kullanıcı dostu bir API ile sarar

import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, status, error, login, register, logout, checkAuth, clearError } =
    useAuthStore();

  return {
    user,
    status,
    error,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
};
