import { Animes } from "@/types/anime.type";

type Params = {
  pageParam: number;
};

const getFetch = (url: string | null) => {
  return async ({ pageParam }: Params) => {
    if (url) {
      const res = await fetch(url + (pageParam || ""));

      return res.json();
    } else {
      return new Promise((resolve) => resolve(null));
    }
  };
};

const selectEndpoint = (key: string, query: string) => {
  let res = "";

  switch (key) {
    case "now":
      res = process.env.NEXT_PUBLIC_JIKAN_NOW!;
      break;
    case "upcoming":
      res = process.env.NEXT_PUBLIC_JIKAN_UPCOMING!;
      break;
    case "top":
      res = process.env.NEXT_PUBLIC_JIKAN_TOP!;
      break;
    case "top airing":
      res = process.env.NEXT_PUBLIC_JIKAN_TOP_AIRING!;
      break;
    case "anime":
      res = process.env.NEXT_PUBLIC_JIKAN_ANIME! + query + "&page=";
      break;
    case "favorites":
      return null;
  }

  return res;
};

const jikanOpts = (queryKey: [string, string]) => {
  const url = selectEndpoint(queryKey[0], queryKey[1]);

  return {
    queryKey,
    queryFn: getFetch(url),
    initialPageParam: 1,
    getNextPageParam: (data: Animes) => {
      return data?.pagination?.has_next_page
        ? data.pagination.current_page + 1
        : undefined;
    },
  };
};

export { jikanOpts };
