import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { PageHeader } from '../components';
import ChapterList from '../components/story/ChapterList';
import CommentsSection from '../components/story/CommentsSection';
import StoryHeader from '../components/story/StoryHeader';
import {
  getChaptersByStory,
  type Chapter,
} from '../services/chapters';
import {
  followStory,
  getStoryFollows,
  type StoryFollow,
  unfollowStory,
} from '../services/follows';
import {
  getStoryComments,
  getStoryRatings,
  type Rating,
} from '../services/ratings';
import { getStory } from '../services/stories';
import { getMe } from '../services/users';
import type { AuthUser } from '../types/auth';
import type { Story } from '../types/story';

export default function StoryDetails() {
  const storyId = window.location.pathname.split('/historia/')[1]?.split('/')[0];
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const { data: story, isLoading: loadingStory } = useQuery<Story>({
    queryKey: ['story', storyId],
    enabled: Boolean(storyId),
    queryFn: () => getStory(storyId ?? ''),
  });

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ['chapters', storyId],
    enabled: Boolean(storyId),
    queryFn: () => getChaptersByStory(storyId ?? ''),
  });

  const { data: comments = [] } = useQuery<Rating[]>({
    queryKey: ['comments', storyId],
    enabled: Boolean(storyId),
    queryFn: () => getStoryComments(storyId ?? ''),
  });

  const { data: ratings = [] } = useQuery<Rating[]>({
    queryKey: ['ratings', storyId],
    enabled: Boolean(storyId),
    queryFn: () => getStoryRatings(storyId ?? ''),
  });

  const { data: follows = [] } = useQuery<StoryFollow[]>({
    queryKey: ['follows', storyId],
    enabled: Boolean(storyId),
    queryFn: () => getStoryFollows(storyId ?? ''),
  });

  const isFollowing = Boolean(
    user && follows.some((follow) => follow.user_id === user.id)
  );

  const followMutation = useMutation({
    mutationFn: () => {
      if (!storyId) {
        throw new Error('Historia nao encontrada');
      }

      return isFollowing ? unfollowStory(storyId) : followStory(storyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows', storyId] });
      queryClient.invalidateQueries({ queryKey: ['stories-library-following'] });
    },
  });

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : 0;

  if (loadingStory) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Historia" />
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Historia" />
        <div className="flex min-h-80 items-center justify-center">
          <p className="text-muted-foreground">Historia nao encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={story.title || 'Historia'} />
      <div className="max-w-6xl space-y-6 p-6">
        <StoryHeader
          story={story}
          averageRating={averageRating}
          isFollowing={isFollowing}
          onFollow={() => followMutation.mutate()}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ChapterList chapters={chapters} storyId={storyId} />
            <CommentsSection
              comments={comments}
              ratings={ratings}
              storyId={storyId}
              user={user}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
              <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider">
                Estatisticas
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seguidores</span>
                  <span className="font-medium">{follows.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capitulos</span>
                  <span className="font-medium">
                    {chapters.filter((chapter) => chapter.status === 'publicado').length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nota</span>
                  <span className="font-medium">
                    {averageRating > 0 ? `${averageRating.toFixed(1)}/5.0` : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comentarios</span>
                  <span className="font-medium">{comments.length}</span>
                </div>
              </div>
            </div>

            {Boolean(story.genres?.length) && (
              <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
                <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider">
                  Generos
                </h3>

                <div className="flex flex-wrap gap-2">
                  {story.genres?.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
