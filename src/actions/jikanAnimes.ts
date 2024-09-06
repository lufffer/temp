"use server";

import { Animes } from "@/types/animes.type";
import { get } from "./jikanFavoritesAnimes";

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
    case "upcoming":
      url = process.env.NEXT_PUBLIC_JIKAN_UPCOMING!;
      break;
    case "top":
      url = process.env.NEXT_PUBLIC_JIKAN_TOP!;
      break;
    case "top_airing":
      url = process.env.NEXT_PUBLIC_JIKAN_TOP_AIRING!;
      break;
    case "anime":
      url = process.env.NEXT_PUBLIC_JIKAN_ANIME!;
      break;
    case "favorites":
      return await get();
    default:
      url = !slug ? process.env.NEXT_PUBLIC_JIKAN_NOW! : "";
  }

  let processed = url
    .replace("{{page}}", page.toString())
    .replace("{{q}}", q.replaceAll("_", " "));

  const res = await fetch(processed);
  return await res.json();
};

export { fetchJikanAnimes };
