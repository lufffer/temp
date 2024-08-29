import { get } from "@/actions/favorites";

const favoritesQuery = () => {
  return {
    queryKey: ["favorites", ""],
    queryFn: () => get(),
    initialPageParam: 1,
    getNextPageParam: () => undefined,
    maxPages: 1,
  };
};

export { favoritesQuery };
