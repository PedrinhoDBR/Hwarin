import { apiJson, apiVoid } from './api';

export type StoryFollow = {
  id: number;
  user_id: number;
  story_id: number;
};

export function getStoryFollows(storyId: string | number): Promise<StoryFollow[]> {
  return apiJson(`/api/follows?story_id=${storyId}`, {}, 'Erro ao buscar seguidores');
}

export function followStory(storyId: string | number): Promise<void> {
  return apiVoid(
    `/api/follows?story_id=${storyId}`,
    {
      method: 'POST',
    },
    'Erro ao atualizar historia seguida'
  );
}

export function unfollowStory(storyId: string | number): Promise<void> {
  return apiVoid(
    `/api/follows/${storyId}`,
    {
      method: 'DELETE',
    },
    'Erro ao atualizar historia seguida'
  );
}
