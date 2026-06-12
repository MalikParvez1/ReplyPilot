import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Review } from '@/core/interfaces/review.interface';
import { AISettings } from '@/core/interfaces/ai.interface';

export function useReviews() {
  const queryClient = useQueryClient();

  // 1. Rezensionen laden
  const reviewsQuery = useQuery<Review[]>({
    queryKey: ['reviews', 'unanswered'],
    queryFn: async () => {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Fehler beim Laden der Rezensionen');
      return res.json();
    },
  });

  // 2. KI Antwort generieren
  const generateMutation = useMutation({
    mutationFn: async ({ reviewId, settings }: { reviewId: string; settings: AISettings }) => {
      const res = await fetch('/api/reviews/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, settings }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'unanswered'] });
    },
  });

  // 3. Antwort veröffentlichen (Optimistic Update eingebaut!)
  const publishMutation = useMutation({
    mutationFn: async ({ reviewId, replyText }: { reviewId: string; replyText: string }) => {
      const res = await fetch('/api/reviews/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, replyText }),
      });
      return res.json();
    },
    // Optimistic Update: Wir entfernen das Review sofort aus der UI-Liste
    onMutate: async ({ reviewId }) => {
      await queryClient.cancelQueries({ queryKey: ['reviews', 'unanswered'] });
      const previousReviews = queryClient.getQueryData<Review[]>(['reviews', 'unanswered']);
      
      queryClient.setQueryData<Review[]>(
        ['reviews', 'unanswered'],
        (old) => old?.filter((r) => r.id !== reviewId) || []
      );
      
      return { previousReviews };
    },
    onError: (err, variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(['reviews', 'unanswered'], context.previousReviews);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'unanswered'] });
    },
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    generateReply: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    publishReply: publishMutation.mutate,
    isPublishing: publishMutation.isPending,
  };
}