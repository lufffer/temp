import { createStore } from "zustand/vanilla";

export type AnimeState = {
  current: {
    anime: number;
    page: number;
  };
  queryKey: [string, string];
  query: string;
};

export type AnimeActions = {
  changeCurrent: (current: { anime: number; page: number }) => void;
  changeQueryKey: (queryKey: [string, string]) => void;
  changeQuery: (query: string) => void;
};

export type Store = AnimeState & AnimeActions;

export const defaultState: AnimeState = {
  current: {
    anime: 0,
    page: 0,
  },
  queryKey: ["now", ""],
  query: "",
};

export const createAnimeStore = (initState: AnimeState = defaultState) => {
  return createStore<Store>()((set) => ({
    ...initState,
    changeCurrent: (current) => set(() => ({ current })),
    changeQueryKey: (queryKey) => set(() => ({ queryKey })),
    changeQuery: (query) => set(() => ({ query })),
  }));
};
