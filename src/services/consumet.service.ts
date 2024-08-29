const selectEndpoint = (key: string, query: string, server: string) => {
  let res = "";

  switch (key) {
    case "search":
      res = process.env.NEXT_PUBLIC_ANIWATCH_SEARCH! + query + "?page=1";
      break;
    case "info":
      res = process.env.NEXT_PUBLIC_ANIWATCH_INFO! + query;
      break;
    case "episodes":
      res =
        process.env.NEXT_PUBLIC_ANIWATCH_EPISODE! + query + `?server=${server}`;
      break;
    case "servers":
      res = process.env.NEXT_PUBLIC_ANIWATCH_SERVERS! + query;
      break;
  }

  return res;
};

const get = async (url: string) => {
  const res = await fetch(url);

  return res.json();
};

const consumet = (queryKey: [string, string], server: string = "") => {
  const url = selectEndpoint(queryKey[0], queryKey[1], server);
  return {
    queryKey,
    queryFn: () => get(url),
    enabled: !!queryKey[1],
  };
};

export { consumet };
