export interface Story {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  synopsis?: string | null;
  status?: string | null;
  language?: string | null;
  cover?: string | null;
  cover_url?: string | null;
  master_story_id?: number | null;
  tags?: string[];
  genres?: string[];
  author?: {
    id: number;
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
  } | null;
}

export type StoryPayload = {
  title: string;
  subtitle?: string;
  synopsis: string;
  language: string;
  status: string;
  cover?: string;
  master_story_id?: number | null;
  genres: string[];
  tags: string[];
};
