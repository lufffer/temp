import { Posts } from "@/types/gelbooru.type";
import { getFetch, get } from "@/actions/gelbooru";

export const gelbooruOpts = (title: string) => {
  return {
    queryKey: ["gelbooru", title],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return getFetch(title, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (data: Posts, pages: any, page: number) => {
      const limit = data["@attributes"].limit;
      const count = data["@attributes"].count;

      return limit < count ? page + 1 : undefined;
    },
    enabled: !!title,
  };
};

export const gelbooruTagsOpts = (title: string) => {
  return {
    queryKey: ["gelbooru", "tags", title],
    queryFn: () => get(title),
    enabled: !!title,
  };
};
