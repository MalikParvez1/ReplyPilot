import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AISettings } from '@/core/interfaces/ai.interface';

export function useAISettings() {
  const queryClient = useQueryClient();

  // Settings laden
  const settingsQuery = useQuery<AISettings>({
    queryKey: ['settings', 'ai'],
    queryFn: async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Fehler beim Laden der Einstellungen');
      return res.json();
    },
  });

  // Settings speichern
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<AISettings>) => {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error('Fehler beim Speichern der Einstellungen');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', 'ai'], data);
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    updateSettings: updateSettingsMutation.mutate,
    isSaving: updateSettingsMutation.isPending,
  };
}
