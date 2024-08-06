"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { type Store, createAnimeStore } from "@/zustand/store";

export type AnimeStoreApi = ReturnType<typeof createAnimeStore>;

export const AnimeStoreContext = createContext<AnimeStoreApi | undefined>(
  undefined,
);

export type AnimeStoreProviderProps = {
  children: ReactNode;
};

export const AnimeStoreProvider = ({ children }: AnimeStoreProviderProps) => {
  const storeRef = useRef<AnimeStoreApi>();
  if (!storeRef.current) storeRef.current = createAnimeStore();

  return (
    <AnimeStoreContext.Provider value={storeRef.current}>
      {children}
    </AnimeStoreContext.Provider>
  );
};

export const useAnimeStore = <T,>(selector: (store: Store) => T): T => {
  const animeStoreContext = useContext(AnimeStoreContext);
  if (!animeStoreContext)
    throw new Error(`useAnimeStore must be used within a AnimeStoreProvider`);

  return useStore(animeStoreContext, selector);
};
