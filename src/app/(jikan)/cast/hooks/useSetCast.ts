import { useEffect, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { Cast, Characters } from "@/types/characters.type";

function useSetCast(characters: UseQueryResult<Characters, Error>): Cast[] {
  const [cast, setCast] = useState<Cast[]>([]);

  useEffect(() => {
    if (characters.status === "success") {
      setCast(characters.data.data);
    }
  }, [characters.status]);

  return cast;
}

export { useSetCast };
