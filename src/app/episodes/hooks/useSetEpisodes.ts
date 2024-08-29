import { useEffect, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { Episode, Videos } from "@/types/videos.type";

function useSetEpisodes(videos: UseQueryResult<Videos, Error>): Episode[] {
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    if (videos.status === "success") {
      setEpisodes(videos.data.data.episodes);
    }
  }, [videos.status, setEpisodes]);

  return episodes;
}

export { useSetEpisodes };
