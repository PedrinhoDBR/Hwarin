import { apiJson, apiVoid } from './api';

export type Chapter = {
  id: number;
  story_id: number;
  title: string;
  subtitle?: string | null;
  text?: string;
  content?: string;
  chapter_number: number;
  status?: string;
};

export type ChapterPayload = {
  story_id: number | string;
  title: string;
  text: string;
  subtitle?: string;
  chapter_number: number;
  status: string;
};

export function getChapter(id: string | number): Promise<Chapter> {
  return apiJson(`/api/chapters/${id}`, {}, 'Erro ao buscar capitulo');
}

export function getChaptersByStory(storyId: string | number): Promise<Chapter[]> {
  return apiJson(
    `/api/chapters/story/${storyId}`,
    {},
    'Erro ao buscar capitulos'
  );
}

export function createChapter(payload: ChapterPayload): Promise<Chapter> {
  return apiJson(
    '/api/chapters',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    'Erro ao criar capitulo'
  );
}

export function updateChapter(
  id: string | number,
  payload: ChapterPayload
): Promise<Chapter> {
  return apiJson(
    `/api/chapters/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    'Erro ao atualizar capitulo'
  );
}

export function deleteChapter(id: string | number): Promise<void> {
  return apiVoid(
    `/api/chapters/${id}`,
    {
      method: 'DELETE',
    },
    'Erro ao deletar capitulo'
  );
}
