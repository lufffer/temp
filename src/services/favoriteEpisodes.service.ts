import { get } from "@/actions/favoriteEpisodes";

const favoriteEpisodesQuery = () => {
  return {
    queryKey: ["favorite episodes", ""],
    queryFn: () => get(),
    initialPageParam: 1,
    getNextPageParam: () => undefined,
    maxPages: 1,
  };
};

export { favoriteEpisodesQuery };
