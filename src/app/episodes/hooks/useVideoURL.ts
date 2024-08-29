import { useEffect, useState } from "react";
import { Episodes } from "@/types/episodes.type";
import { UseQueryResult } from "@tanstack/react-query";

function useVideoURL(episodes: UseQueryResult<Episodes, Error>) {
  const [URL, setURL] = useState("");

  useEffect(() => {
    if (episodes.status === "success") {
      setURL(episodes.data.sources[0]?.url);
    }
  }, [episodes.status, setURL]);

  return URL;
}

export { useVideoURL };
