const get = async (id: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_JIKAN_VIDEO! + id + "/videos",
  );

  return res.json();
};

export const videoOpts = (id: string) => {
  return {
    queryKey: ["videos", id],
    queryFn: () => get(id),
    enabled: !!id,
  };
};
