import { get } from "@/actions/favoriteImages";

const favoriteImagesQuery = () => {
  return {
    queryKey: ["favorite images", ""],
    queryFn: () => get(),
    initialPageParam: 1,
    getNextPageParam: () => undefined,
    maxPages: 1,
  };
};

export { favoriteImagesQuery };
