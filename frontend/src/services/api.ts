import { AUTH_STORAGE_KEY } from '../context/AuthContext';
import type { LoginResponse } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL ?? '';

type JsonRecord = Record<string, unknown>;

async function readJsonResponse(response: Response): Promise<JsonRecord> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getErrorMessage(data: JsonRecord, fallback: string): string {
  if (typeof data.detail === 'string') {
    return data.detail;
  }

  if (typeof data.error === 'string') {
    return data.error;
  }

  if (typeof data.message === 'string') {
    return data.message;
  }

  return fallback;
}

function clearStoredSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function normalizeJsonInit(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);

  if (typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return {
    ...init,
    headers,
  };
}

export function getStoredToken(): string | null {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as Partial<LoginResponse>;
    return typeof session.token === 'string' ? session.token : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;

    return payload.exp < now;
  } catch {
    return true;
  }
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getStoredToken();

  if (!token) {
    clearStoredSession();
    throw new Error('Sem sessao');
  }

  if (isTokenExpired(token)) {
    clearStoredSession();
    throw new Error('Sessao expirada');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const url = typeof input === 'string' ? `${API_URL}${input}` : input;
  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearStoredSession();
    throw new Error('Nao autorizado');
  }

  return response;
}

export async function publicApiJson<T>(
  input: string,
  init: RequestInit = {},
  fallback = 'Erro na requisicao'
): Promise<T> {
  const response = await fetch(`${API_URL}${input}`, normalizeJsonInit(init));
  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, fallback));
  }

  return data as T;
}

export async function apiJson<T>(
  input: string,
  init: RequestInit = {},
  fallback = 'Erro na requisicao'
): Promise<T> {
  const response = await authFetch(input, normalizeJsonInit(init));
  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, fallback));
  }

  return data as T;
}

export async function apiVoid(
  input: string,
  init: RequestInit = {},
  fallback = 'Erro na requisicao'
): Promise<void> {
  const response = await authFetch(input, normalizeJsonInit(init));

  if (!response.ok) {
    const data = await readJsonResponse(response);
    throw new Error(getErrorMessage(data, fallback));
  }
}
