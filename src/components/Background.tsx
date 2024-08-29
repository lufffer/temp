"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAnimeStore } from "@/providers/store.provider";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";

function Background() {
  const { queryKey } = useAnimeStore((state) => state);

  const animes = useInfiniteQuery(animesQuery(queryKey));
  const favorites = useInfiniteQuery(favoritesQuery());

  const pages = useSetPages(animes, favorites);
  const anime = useSetAnime(pages);

  const img = anime?.images.webp.image_url || "";

  return (
    <div
      className="my-background"
      style={{
        backgroundImage: `url('${img}')`,
      }}
    ></div>
  );
}

export default Background;
