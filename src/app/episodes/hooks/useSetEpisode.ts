import { useEffect, useState } from "react";
import { Info } from "@/types/info.type";
import { UseQueryResult } from "@tanstack/react-query";

function useSetEpisode(
  info: UseQueryResult<Info, unknown>,
  currentEpisode: number,
): string {
  const [episode, setEpisode] = useState("");

  useEffect(() => {
    if (info.status === "success") {
      setEpisode(info.data.episodes[currentEpisode].id);
    }
  }, [info.status, currentEpisode]);

  return episode;
}

export { useSetEpisode };
