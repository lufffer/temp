"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Anime } from "@/types/animes.type";

type Props = {
  value: Anime[];
  children: ReactNode;
};

type JikanAnimeType = {
  animes: Anime[];
  setAnimes: Dispatch<SetStateAction<Anime[]>>;
};

const JikanAnimeContext = createContext<JikanAnimeType | null>(null);

const JikanAnime = ({ value, children }: Props) => {
  const [animes, setAnimes] = useState<Anime[]>(value);

  return (
    <JikanAnimeContext.Provider
      value={{ animes: animes, setAnimes: setAnimes }}
    >
      {children}
    </JikanAnimeContext.Provider>
  );
};

export { JikanAnime, JikanAnimeContext };
