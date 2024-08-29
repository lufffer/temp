import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Anime } from "@/types/animes.type";

function useSetTitle(
  allFinished: boolean,
  prequel: Anime | undefined | null,
  anime: Anime | undefined,
): [string, Dispatch<SetStateAction<string>>] {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (allFinished && prequel !== undefined) {
      if (prequel === null) {
        let title = anime?.title || "";
        title = title?.replaceAll(" ", "_");
        title = title?.replaceAll('"', "");
        setTitle(() => title.toLowerCase());
      } else {
        let title = prequel?.title || "";
        title = title?.replaceAll(" ", "_");
        title = title?.replaceAll('"', "");
        setTitle(() => title.toLowerCase());
      }
    }
  }, [allFinished, prequel, anime]);

  return [title, setTitle];
}

export { useSetTitle };
