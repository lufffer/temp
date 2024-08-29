import { useEffect, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { Music, Themes } from "@/types/themes.type";

function useSetMusic(themes: UseQueryResult<Themes, Error>): Music | null {
  const [music, setMusic] = useState<Music | null>(null);

  useEffect(() => {
    if (themes.status === "success") {
      setMusic(themes.data.data);
    }
  }, [themes.status]);

  return music;
}

export { useSetMusic };
