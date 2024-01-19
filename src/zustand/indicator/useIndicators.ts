import { create } from 'zustand';
import { type Indicator } from '~/types/indicator';

interface State {
  indicators: Array<Indicator>;
  setIndicators: (indicators: Array<Indicator>) => void;
}

export const useIndicators = create<State>()((set, _get) => ({
  indicators: [],
  setIndicators: async (indicators: Array<Indicator>) => {
    set({ indicators });
  },
}));
