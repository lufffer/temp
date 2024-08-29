"use client";

import { useAnimeStore } from "@/providers/store.provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";
import Title from "@/components/Title";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { queryKey } = useAnimeStore((state) => state);

  const animes = useInfiniteQuery(animesQuery(queryKey));
  const favorites = useInfiniteQuery(favoritesQuery());

  const pages = useSetPages(animes, favorites);
  const anime = useSetAnime(pages);

  const title = anime?.title || "Hola";

  return (
    <>
      <Title>{title}</Title>
      {children}
    </>
  );
}
