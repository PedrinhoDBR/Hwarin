import type { AuthUser } from '../types/auth';

import { apiJson, apiVoid } from './api';

export type Author = {
  id: number;
  username: string;
  email?: string;
  role?: string;
  avatar_url?: string | null;
  bio?: string | null;
};

export type ProfilePayload = {
  username: string;
  avatar_url: string;
  bio: string;
};

export type FollowStatus = {
  is_following: boolean;
  followers_count: number;
};

export function getMe(): Promise<AuthUser> {
  return apiJson('/api/auth/me', {}, 'Erro ao validar sessao');
}

export function updateProfile(payload: ProfilePayload): Promise<AuthUser> {
  return apiJson(
    '/api/users/me',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    'Erro ao salvar perfil'
  );
}

export function getAuthor(id: string | number): Promise<Author> {
  return apiJson(`/api/users/${id}`, {}, 'Erro ao buscar autor');
}

export function getFollowedAuthors(): Promise<Author[]> {
  return apiJson('/api/users/following', {}, 'Erro ao buscar autores seguidos');
}

export function getAuthorFollowStatus(id: string | number): Promise<FollowStatus> {
  return apiJson(`/api/users/${id}/follow-status`, {}, 'Erro ao buscar status');
}

export function followAuthor(id: string | number): Promise<void> {
  return apiVoid(
    `/api/users/${id}/follow`,
    {
      method: 'POST',
    },
    'Erro ao atualizar autor seguido'
  );
}

export function unfollowAuthor(id: string | number): Promise<void> {
  return apiVoid(
    `/api/users/${id}/follow`,
    {
      method: 'DELETE',
    },
    'Erro ao atualizar autor seguido'
  );
}
