"use server";

import { Animes } from "@/types/animes.type";

const fetchJikanAnimes = async (season = "now"): Promise<Animes> => {
  let url = "";
  switch (season) {
    case "now":
      url = process.env.NEXT_PUBLIC_JIKAN_NOW!.replace("{{page}}", "1");
      break;
    case "upcoming":
      url = process.env.NEXT_PUBLIC_JIKAN_UPCOMING!.replace("{{page}}", "1");
      break;
    case "top":
      console.log(123123123);
      url = process.env.NEXT_PUBLIC_JIKAN_TOP!.replace("{{page}}", "1");
      break;
    case "top airing":
      url = process.env.NEXT_PUBLIC_JIKAN_TOP_AIRING!.replace("{{page}}", "1");
      break;
  }

  return await (await fetch(url)).json();
};

export { fetchJikanAnimes };
