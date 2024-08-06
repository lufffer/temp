import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { jikanOpts } from "@/services/jikan.service";
import { useAnimeStore } from "@/providers/store.provider";

export default function Loader() {
  const { queryKey } = useAnimeStore((state) => state);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    jikanOpts(queryKey),
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if ((inView && hasNextPage) || isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="w-full flex flex-col items-center">
      <img ref={ref} src="/loader.gif" alt="Loading..." />
      <p className="text-white text-2xl">Loading...</p>
    </div>
  );
}
