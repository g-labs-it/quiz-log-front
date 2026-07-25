import { useMemo, useState, useEffect, useCallback } from 'react';

import axiosInstance from 'src/utils/axios';

import { AuthContext } from './auth-context';

import type { UserType, AuthStateType } from '../types';

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthStateType>({
    loading: true,
    user: null,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        const response = await axiosInstance.get('/auth/me');
        const user = response.data.data as UserType;

        setState({
          loading: false,
          user,
        });
      } else {
        setState({
          loading: false,
          user: null,
        });
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('accessToken');
      setState({
        loading: false,
        user: null,
      });
    }
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  // LOGIN
  const login = useCallback(async (data: any) => {
    const response = await axiosInstance.post('/auth/login', data);
    const { token, user } = response.data.data;

    localStorage.setItem('accessToken', token);

    setState({
      loading: false,
      user,
    });
  }, []);

  // REGISTER
  const register = useCallback(async (data: any) => {
    const response = await axiosInstance.post('/auth/register', data);
    const { token, user } = response.data.data;

    localStorage.setItem('accessToken', token);

    setState({
      loading: false,
      user,
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setState({
        loading: false,
        user: null,
      });
    }
  }, []);

  // UPDATE PROFILE
  const updateProfile = useCallback(async (data: any) => {
    // Always use POST with FormData — PHP only populates $_FILES on POST requests.
    // PUT+multipart/form-data causes file uploads to arrive broken regardless of _method spoofing.
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });

    const response = await axiosInstance.post('/auth/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const updatedUser = response.data.data as UserType;
    setState((prevState) => ({
      ...prevState,
      user: updatedUser,
    }));
  }, []);

  // CHANGE PASSWORD
  const changePassword = useCallback(async (data: any) => {
    await axiosInstance.put('/auth/change-password', data);
    setState((prevState) => {
      if (prevState.user) {
        return {
          ...prevState,
          user: {
            ...prevState.user,
            needs_password_change: false,
          },
        };
      }
      return prevState;
    });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    await axiosInstance.post('/auth/forgot-password', { email });
  }, []);

  // RESET PASSWORD
  const resetPassword = useCallback(async (data: any) => {
    await axiosInstance.post('/auth/reset-password', data);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      isAuthenticated: !!state.user,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      forgotPassword,
      resetPassword,
    }),
    [
      state.user,
      state.loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      forgotPassword,
      resetPassword,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
