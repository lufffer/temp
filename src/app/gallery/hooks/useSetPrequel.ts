import { Anime, DataAnime } from "@/types/animes.type";
import { Relations } from "@/types/relations.type";
import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function useSetPrequel(
  allFinished: boolean,
  possibles: UseQueryResult<DataAnime, Error>[],
): Anime | null | undefined {
  const [prequel, setPrequel] = useState<Anime | null>();

  useEffect(() => {
    if (allFinished) {
      const anime = possibles.find(
        (possible) => possible.data?.data.type === "TV",
      );
      setPrequel(anime ? anime?.data?.data : null);
    }
  }, [allFinished]);

  return prequel;
}

export { useSetPrequel };
