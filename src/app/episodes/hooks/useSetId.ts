import { Result, Search } from "@/types/searches.type";
import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function useSetId(search: UseQueryResult<Search, unknown>, title: string) {
  const [id, setId] = useState("");

  useEffect(() => {
    if (search.status === "success" && title) {
      setId(
        search.data.results.find((result: Result) => result.title === title).id,
      );
    }
  }, [search.status, title]);

  return id;
}

export { useSetId };
