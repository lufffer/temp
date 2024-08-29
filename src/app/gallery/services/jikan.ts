const get = async (id: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_JIKAN_ANIME! + id);

  return res.json();
};

export const animeOpts = (ids: string[]) => {
  return {
    queries: ids?.map((id) => {
      return {
        queryKey: ["anime", id],
        queryFn: () => get(id),
      };
    }),
  };
};
