import { createStore } from "zustand/vanilla";
import { Anime } from "@/types/animes.type";

export type AnimeState = {
  animes: Anime[];
};

export type AnimeActions = {
  changeAnimes: (animes: Anime[]) => void;
};

export type Store = AnimeState & AnimeActions;

export const defaultState: AnimeState = {
  animes: [],
};

export const createAnimeStore = (initState: AnimeState = defaultState) => {
  return createStore<Store>()((set) => ({
    ...initState,
    changeAnimes: (animes) => set(() => ({ animes })),
  }));
};
