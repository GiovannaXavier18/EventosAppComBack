import api from './api';
import type { LoginPayload, RegisterPayload, User, AuthResponse } from '../types/api';

export const registerRequest = (userData: RegisterPayload) => {
  return api.post('/Auth/register', userData);
};

export const loginRequest = (credentials: LoginPayload) => {
  return api.post<AuthResponse>('/Auth/login', credentials);
};

export const logoutRequest = () => {
  return api.post('/Auth/logout');
};

export const checkAuthStatusRequest = () => {
  return api.get<User>('/Auth/me');
};