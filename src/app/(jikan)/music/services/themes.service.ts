const get = async (id: number | null) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_JIKAN_THEMES! + id + "/themes",
  );

  return res.json();
};

const themesQuery = (id: number | null) => {
  return {
    queryKey: ["themes", id],
    queryFn: () => get(id),
    enabled: !!id,
  };
};

export { themesQuery };
