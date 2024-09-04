import { useEffect, useState } from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { Animes } from "@/types/animes.type";

function useSetPages(
  animes: UseInfiniteQueryResult<InfiniteData<Animes, unknown>, Error>,
  favorites: UseInfiniteQueryResult<InfiniteData<Animes, unknown>, Error>,
): InfiniteData<Animes, unknown> | undefined {
  const [pages, setPages] = useState<InfiniteData<Animes, unknown> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (
      (animes.status === "success" || favorites.status === "success") &&
      animes.data
    ) {
      setPages(animes.data || favorites.data);
    }
  }, [animes.status, favorites.status]);

  return pages;
}

export { useSetPages };
