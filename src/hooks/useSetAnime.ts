import { useEffect, useState } from "react";
import { useAnimeStore } from "@/providers/store.provider";
import { Anime, Animes } from "@/types/animes.type";
import { InfiniteData } from "@tanstack/react-query";

export function useSetAnime(
  pages: InfiniteData<Animes, unknown> | undefined,
  title?: string,
): Anime | undefined {
  const { current } = useAnimeStore((state) => state);
  const [anime, setAnime] = useState<Anime | undefined>(undefined);

  useEffect(() => {
    if (pages) {
      setAnime(
        title
          ? pages?.pages[current?.page]?.data.find(
              (anime) => anime.title === title,
            )
          : pages?.pages[current?.page]?.data[current?.anime],
      );
    }
  }, [pages, current]);

  return anime;
}
