import { useEffect, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { DataAnime } from "@/types/animes.type";

function useWatchQueries(
  queries: UseQueryResult<DataAnime, Error>[],
  isFetched: boolean,
  content: string,
): boolean {
  const [allFinished, setAllFinished] = useState(false);

  useEffect(() => {
    if (queries.length > 0) {
      if (queries.every((query) => query.isSuccess)) {
        setAllFinished(true);
      }
    } else if (content === "0") {
      setAllFinished(true);
    }
  }, [queries, length, isFetched]);

  return allFinished;
}

export { useWatchQueries };
