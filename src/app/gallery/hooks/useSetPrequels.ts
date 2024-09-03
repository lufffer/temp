import { Relations } from "@/types/relations.type";
import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function useSetPrequels(
  relations: UseQueryResult<Relations, Error>,
): [string[], string, string, string] {
  const [ids, setIds] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [adaptation, setAdaptation] = useState("");
  const [parentStory, setParentStory] = useState("");

  useEffect(() => {
    if (relations.status === "success") {
      const data = relations.data.data;
      const prequels = data.filter((data) => {
        if (data.relation === "Parent Story") {
          setParentStory(data.entry[0].name);
        } else if (data.relation === "Adaptation") {
          setAdaptation(data.entry[0].name);
        } else if (data.relation === "Prequel") {
          return true;
        }

        return false;
      });
      const entry = prequels.map((prequel) => prequel.entry);
      const entries = entry?.map((entry) => entry.map((entry) => entry))[0];
      const ids = entries?.map((entry) => entry.mal_id.toString()) || [];
      setIds(ids);
      setContent(ids.length === 0 ? "0" : "1");
    }
  }, [relations.status]);

  return [ids, content, adaptation, parentStory];
}

export { useSetPrequels };
