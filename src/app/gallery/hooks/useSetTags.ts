import { useEffect, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { Tags } from "@/types/gelbooru.type";

function useSetTags(res: UseQueryResult<Tags, Error>): string[] {
  const [tags, setTags] = useState<string[]>(["Favorites"]);

  useEffect(() => {
    if (res.status === "success" && res.data.tag) {
      setTags((old) => {
        const tags = res.data.tag.map((tag) => tag.name);
        tags.unshift("Favorites");
        return tags;
      });
    }
  }, [res.status, res.isRefetching]);

  return tags;
}

export { useSetTags };
