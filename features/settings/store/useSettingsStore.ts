import { create } from 'zustand';
import { AISettings } from '@/core/interfaces/ai.interface';

interface SettingsState {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    tone: 'friendly',
    length: 'medium',
    includeBusinessName: true,
    customContext: 'Wir sind ein traditionelles italienisches Restaurant in Berlin-Mitte, das Wert auf frische Zutaten legt.',
  },
  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));