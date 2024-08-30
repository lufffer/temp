import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAnimeStore } from "@/providers/store.provider";
import { useInView } from "react-intersection-observer";
import { animesQuery } from "@/services/jikan.service";
import { gelbooruOpts } from "../gallery/services/gelbooru";

type Props = {
  requester: "home" | "gallery";
  title?: string;
};

export default function Loader({ requester, title }: Props) {
  console.log(title);
  const { queryKey } = useAnimeStore((state) => state);
  const { fetchNextPage, hasNextPage } = useInfiniteQuery(
    requester === "home" ? animesQuery(queryKey) : gelbooruOpts(title!),
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className="w-full flex flex-col items-center">
      <img ref={ref} src="/loader.gif" alt="Loading..." />
      <p className="text-white text-2xl">Loading...</p>
    </div>
  );
}
