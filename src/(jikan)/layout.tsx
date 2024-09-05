import { useAnimeStore } from "@/providers/store.provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";
import Title from "@/components/Title";
import { fetchJikanAnimes } from "@/actions/jikanAnimes";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  // const { queryKey } = useAnimeStore((state) => state);
  //
  // const animes = useInfiniteQuery(animesQuery(queryKey));
  // const favorites = useInfiniteQuery(favoritesQuery());
  //
  // const pages = useSetPages(animes, favorites);
  // const anime = useSetAnime(pages);

  const jikanAnime = await fetchJikanAnimes("now", 1);
  const anime = jikanAnime.data[0];
  const title = anime?.title || "";

  return (
    <>
      <Title>{title}</Title>
      {children}
    </>
  );
}
