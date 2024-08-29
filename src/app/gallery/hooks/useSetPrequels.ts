import { Relations } from "@/types/relations.type";
import { UseQueryResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

function useSetPrequels(
  relations: UseQueryResult<Relations, Error>,
): [string[], string, Dispatch<SetStateAction<string>>] {
  const [ids, setIds] = useState<string[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (relations.status === "success") {
      const data = relations.data.data;
      const prequels = data.filter((data) => data.relation === "Prequel");
      const entry = prequels.map((prequel) => prequel.entry);
      const entries = entry?.map((entry) => entry.map((entry) => entry))[0];
      const ids = entries?.map((entry) => entry.mal_id.toString()) || [];
      setIds(ids);
      setContent(ids.length === 0 ? "0" : "1");
    }
  }, [relations.status]);

  return [ids, content, setContent];
}

export { useSetPrequels };
