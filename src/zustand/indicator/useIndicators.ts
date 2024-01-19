import { create } from 'zustand';
import { type Indicators } from '~/types/indicator';

interface State {
  indicators: Indicators | null;
  setIndicators: (indicators: Indicators) => void;
}

export const useIndicators = create<State>()((set, _get) => ({
  indicators: null,
  setIndicators: async (indicators: Indicators) => {
    set({ indicators });
  },
}));
