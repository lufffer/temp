"use server";

const fetchJikanAnimes = async (page: number, q = "") => {
  let url = process.env.NEXT_PUBLIC_JIKAN_ANIME!;
  let processed = url.replace("{{page}}", page.toString()).replace("{{q}}", q);

  const res = await fetch(processed);

  return await res.json();
};

export { fetchJikanAnimes };
