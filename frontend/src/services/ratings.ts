import { apiJson } from './api';

export type Rating = {
  id?: number;
  story_id: number;
  user_id: number;
  value: number;
  description?: string;
  content?: string;
  author_name?: string;
  author_avatar?: string | null;
};

export type RatingPayload = {
  story_id: number;
  value: number;
  description: string;
};

export function getStoryComments(storyId: string | number): Promise<Rating[]> {
  return apiJson(
    `/api/ratings/comments?story_id=${storyId}`,
    {},
    'Erro ao buscar comentarios'
  );
}

export function getStoryRatings(storyId: string | number): Promise<Rating[]> {
  return apiJson(`/api/ratings?story_id=${storyId}`, {}, 'Erro ao buscar avaliacoes');
}

export function saveRating(payload: RatingPayload): Promise<Rating> {
  return apiJson(
    '/api/ratings',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    'Erro ao salvar comentario'
  );
}
