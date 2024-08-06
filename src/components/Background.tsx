"use client";

import { useAnimeStore } from "@/providers/store.provider";
import { jikanOpts } from "@/services/jikan.service";
import { favoritesOpts } from "@/services/favorites.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Background() {
  const { current, queryKey } = useAnimeStore((state) => state);
  const { data: animes } = useInfiniteQuery(jikanOpts(queryKey));
  const { data: favorites } = useInfiniteQuery(favoritesOpts());
  const ptr = animes ? animes : favorites;
  const anime = ptr?.pages[current.page].data[current.anime];
  const image = anime?.images.webp.image_url;

  return (
    <div
      className="my-background"
      style={{
        backgroundImage: `url('${image}')`,
      }}
    ></div>
  );
}
