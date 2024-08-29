"use client";

import { createPortal } from "react-dom";
import { useAnimeStore } from "@/providers/store.provider";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import { themesQuery } from "./services/themes.service";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";
import { useSetMusic } from "./hooks/useSetMusic";
import Glass from "@/components/Glass";

function Music() {
  const { queryKey } = useAnimeStore((state) => state);
  const animesRes = useInfiniteQuery(animesQuery(queryKey));
  const favoritesRes = useInfiniteQuery(favoritesQuery());

  const ptr = useSetPages(animesRes, favoritesRes);
  const anime = useSetAnime(ptr);

  const mal_id = anime?.mal_id || null;
  const themes = useQuery(themesQuery(mal_id));
  const music = useSetMusic(themes);

  return (
    <div className="overflow-scroll h-[75svh] my-4">
      <h2 className="my-4 font-bold text-white text-center">~OPENINGS~</h2>
      <ul className="my-glass rounded-2xl text-center text-white">
        {music?.openings.map((op) => <li key={op}>{op}</li>)}
      </ul>
      <h2 className="my-4 font-bold text-white text-center">~ENDINGS~</h2>
      <ul className="my-glass rounded-2xl text-center text-white">
        {music?.endings.map((ed) => <li key={ed}>{ed}</li>)}
      </ul>
      {createPortal(<Glass />, document.body)}
    </div>
  );
}

export default Music;
