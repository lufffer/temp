import { get } from "@/actions/favorites";

const favoritesOpts = () => {
  return {
    queryKey: ["favorites", ""],
    queryFn: () => get(),
    initialPageParam: 1,
    getNextPageParam: () => undefined,
  };
};

export { favoritesOpts };
