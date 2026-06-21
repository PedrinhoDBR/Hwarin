import { AUTH_STORAGE_KEY } from '../context/AuthContext';
import type { AuthUser, LoginResponse } from '../types/auth';

import { publicApiJson } from './api';

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

type LoginApiResponse = {
  user?: AuthUser;
  token?: string;
  accessToken?: string;
  jwt?: string;
};

function extractToken(data: LoginApiResponse): string | null {
  const candidates = [data.token, data.accessToken, data.jwt];
  const token = candidates.find(
    (value) => typeof value === 'string' && value.length > 0
  );

  return typeof token === 'string' ? token : null;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await publicApiJson<LoginApiResponse>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    },
    'Erro no login'
  );

  const token = extractToken(data);

  if (!data.user || !token) {
    throw new Error('Login realizado sem token JWT valido.');
  }

  return {
    user: data.user,
    token,
  };
}

export async function registerUser(payload: RegisterPayload) {
  return publicApiJson(
    '/api/users/',
    {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        role: 'user',
      }),
    },
    'Erro ao criar cadastro'
  );
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
