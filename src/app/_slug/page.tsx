import { fetchJikanAnimes } from "@/actions/jikanAnimes";
import { JikanAnime } from "./providers/jikanAnime.provider";
import Background from "@/components/Background";
import Main from "@/components/Main";
import Home from "../home/_pages/Homes/Home";
import Episodes from "../home/_pages/Episodesisodes";
import { Suspense } from "react";
import { fetchJikanAnime } from "@/actions/jikanAnime";
import { Anime, Animes, DataAnime } from "@/types/animes.type";

type Props = {
  params: {
    slug: string[];
  };
};

const Page = async ({ params }: Props) => {
  console.log(params);
  let jikanAnime: DataAnime | Animes;
  let gogoInfo: any;
  let content = <></>;

  switch (params.slug[0]) {
    case "home":
      jikanAnime = await fetchJikanAnimes(params.slug, 1);
      content = <Home slug={params.slug} />;
      break;
    case "episodes":
      jikanAnime = await fetchJikanAnime(params.slug);
      gogoInfo = await fetchJikanAnime(params.slug);
      console.log(
        "--------------------------------------------------------------",
      );
      console.log(jikanAnime);
      console.log(
        "--------------------------------------------------------------",
      );
      content = <Episodes slug={params.slug} />;
      break;
  }

  return (
    <JikanAnime value={jikanAnime.data}>
      <Background />
      <Main>
        <Suspense
          fallback={
            <div className="w-full flex flex-col items-center justify-center">
              <img src="/loader.gif" alt="Loading..." />
              <p className="text-pink-300 text-2xl">Loading...</p>
            </div>
          }
        >
          {content}
        </Suspense>
      </Main>
    </JikanAnime>
  );
};

export default Page;
