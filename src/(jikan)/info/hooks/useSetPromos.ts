import { useEffect, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { Promo, Videos } from "@/types/videos.type";

function useSetPromos(videos: UseQueryResult<Videos, Error>): Promo[] {
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    if (videos.status === "success") {
      setPromos(videos.data.data.promo);
    }
  }, [videos.status]);

  return promos;
}

export { useSetPromos };
