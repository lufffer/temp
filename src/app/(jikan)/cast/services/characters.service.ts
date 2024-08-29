const get = async (id: number | null) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_JIKAN_CHARACTERS! + id + "/characters",
  );

  return res.json();
};

const charactersQuery = (id: number | null) => {
  return {
    queryKey: ["characters", id],
    queryFn: () => get(id),
    enabled: !!id,
  };
};

export { charactersQuery };
