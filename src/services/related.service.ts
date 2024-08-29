const get = async (id: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_JIKAN_VIDEO! + id + "/relations",
  );

  return res.json();
};

export const relationOpts = (id: string) => {
  return {
    queryKey: ["relations", id],
    queryFn: () => get(id),
    enabled: !!id,
  };
};
