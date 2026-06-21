import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import ChapterEditor from '../components/create/ChapterEditor';
import StoryForm from '../components/create/StoryForm';
import PageHeader from '../components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/useToast';
import {
  createStory,
  getStory,
  updateStory,
} from '../services/stories';
import type { Story, StoryPayload } from '../types/story';

type StoryFormData = StoryPayload & {
  is_collaborative?: boolean;
};

function toStoryPayload(formData: StoryFormData): StoryPayload {
  return {
    title: formData.title,
    subtitle: formData.subtitle,
    synopsis: formData.synopsis,
    language: formData.language,
    status: formData.status,
    cover: formData.cover,
    genres: formData.genres,
    tags: formData.tags,
    master_story_id: formData.master_story_id,
  };
}

export default function CreateStory() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { id } = useParams();
  const isEditing = id !== 'new' && id !== undefined;

  const [createdStory, setCreatedStory] = useState<Story | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  const { data: story, isLoading: isLoadingStory } = useQuery<Story | null>({
    queryKey: ['story', id],
    enabled: isEditing,
    queryFn: async () => {
      if (!id) return null;
      return getStory(id);
    },
  });

  const activeStory = createdStory ?? story;

  const saveStory = useMutation<Story, Error, StoryPayload>({
    mutationFn: (storyData) =>
      isEditing && id
        ? updateStory(id, storyData)
        : createStory(storyData),
    onError: (error) => {
      showToast(error.message || 'Erro ao salvar historia', 'error');
    },
    onSuccess: (data) => {
      showToast('Historia salva com sucesso!', 'success');
      setCreatedStory(data);
      setActiveTab('chapters');

      if (!isEditing) {
        navigate(`/story/${data.id}`, {
          replace: true,
        });
      }
    },
  });

  function handleSaveStory(formData: StoryFormData) {
    saveStory.mutate(toStoryPayload(formData));
  }

  if (isLoadingStory) {
    return (
      <div className="min-h-screen">
        <PageHeader title={isEditing ? 'Editar historia' : 'Nova historia'} />
        <section className="p-6 text-foreground">Carregando historia...</section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={isEditing ? 'Editar historia' : 'Nova historia'} />

      <section className="justify-center overflow-x-hidden p-6 text-foreground">
        <div className="w-full max-w-full rounded-3xl border border-white/20 bg-black/60">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 border border-border/30 bg-secondary/30">
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Informacoes
                </TabsTrigger>

                <TabsTrigger
                  value="chapters"
                  disabled={!activeStory}
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Capitulos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <StoryForm
                  initialData={
                    story
                      ? {
                          title: story.title ?? '',
                          subtitle: story.subtitle ?? '',
                          synopsis: story.synopsis ?? '',
                          language: story.language ?? '',
                          status: story.status ?? '',
                          cover: story.cover ?? '',
                          genres: story.genres ?? [],
                          tags: story.tags ?? [],
                          master_story_id: story.master_story_id,
                        }
                      : undefined
                  }
                  onSubmit={handleSaveStory}
                  isLoading={saveStory.isPending}
                />
              </TabsContent>

              <TabsContent value="chapters">
                {activeStory && (
                  <ChapterEditor
                    storyId={activeStory.id}
                    onDone={() => navigate(`/historia/${activeStory.id}`)}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <ToastContainer />
      </section>
    </div>
  );
}
