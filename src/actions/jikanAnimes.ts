"use server";

import { Animes } from "@/types/animes.type";

const fetchJikanAnimes = async (
  slug: string,
  page: number,
  q = "",
): Promise<Animes> => {
  let url = "";
  switch (slug) {
    case "now":
      url = process.env.NEXT_PUBLIC_JIKAN_NOW!;
      break;
    default:
      url = !slug ? process.env.NEXT_PUBLIC_JIKAN_NOW! : "";
  }

  let processed = url.replace("{{page}}", page.toString()).replace("{{q}}", q);

  const res = await fetch(processed);
  return await res.json();
};

export { fetchJikanAnimes };
