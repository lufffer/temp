"use client";

import { useAnimeStore } from "@/providers/store.provider";
import { Anime } from "@/types/animes.type";
import { useEffect } from "react";

type Props = {
  value: Anime | Anime[];
  children: React.ReactNode;
};

const JikanAnime = ({ value, children }: Props) => {
  const { changeAnimes } = useAnimeStore((state) => state);

  useEffect(() => {
    changeAnimes(value);
  }, []);

  return <>{children}</>;
};

export { JikanAnime };
