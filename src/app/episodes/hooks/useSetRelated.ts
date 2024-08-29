import { Relation, Relations } from "@/types/relations.type";
import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function useSetRelated(
  relations: UseQueryResult<Relations, Error>,
): Relation[] {
  const [related, setRelated] = useState<Relation[]>([]);

  useEffect(() => {
    if (relations.status === "success") {
      const related = relations.data.data.filter((data) => {
        if (data.relation === "Prequel" || data.relation === "Sequel")
          return true;
      });

      setRelated(related);
    }
  }, [relations.status, setRelated]);

  return related;
}

export { useSetRelated };
