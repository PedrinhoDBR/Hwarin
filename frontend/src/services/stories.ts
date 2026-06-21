import type { Story, StoryPayload } from '../types/story';

import { apiJson, apiVoid } from './api';

export type StorySearchFilters = {
  query?: string;
  status?: string;
  language?: string;
  genre?: string;
  tag?: string;
};

function buildStoriesEndpoint(filters: StorySearchFilters = {}) {
  const params = new URLSearchParams();

  if (filters.query) params.set('q', filters.query);
  if (filters.status) params.set('status', filters.status);
  if (filters.language) params.set('language', filters.language);
  if (filters.genre) params.set('genre', filters.genre);
  if (filters.tag) params.set('tag', filters.tag);

  const queryString = params.toString();
  return queryString ? `/api/stories?${queryString}` : '/api/stories';
}

export function getStories(filters?: StorySearchFilters): Promise<Story[]> {
  return apiJson(buildStoriesEndpoint(filters), {}, 'Erro ao buscar historias');
}

export function getStory(id: string | number): Promise<Story> {
  return apiJson(`/api/stories/${id}`, {}, 'Erro ao buscar historia');
}

export function getMyStories(): Promise<Story[]> {
  return apiJson('/api/stories/me', {}, 'Erro ao buscar historias');
}

export function getFollowedStories(): Promise<Story[]> {
  return apiJson('/api/stories/following', {}, 'Erro ao buscar historias seguidas');
}

export function getStoriesByAuthor(authorId: string | number): Promise<Story[]> {
  return apiJson(
    `/api/stories/author/${authorId}`,
    {},
    'Erro ao buscar historias do autor'
  );
}

export function createStory(payload: StoryPayload): Promise<Story> {
  return apiJson(
    '/api/stories',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    'Erro ao salvar historia'
  );
}

export function updateStory(
  id: string | number,
  payload: StoryPayload
): Promise<Story> {
  return apiJson(
    `/api/stories/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    'Erro ao salvar historia'
  );
}

export function deleteStory(id: string | number): Promise<void> {
  return apiVoid(
    `/api/stories/${id}`,
    {
      method: 'DELETE',
    },
    'Erro ao deletar historia'
  );
}
