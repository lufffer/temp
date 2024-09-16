import { Title } from "@/components/Title";
import { Animes } from "@/types/animes.type";
import { fetchJikanAnimes } from "./actions/jikanAnimes";
import Background from "@/components/Background";
import Main from "@/components/Main";
import { QuickInfo } from "../components/QuickInfo";
import { Slider } from "@/components/Slider";
import { Thumbs } from "@/components/Thumbs/Thumbs";
import { RenderThumbs } from "../[...slug]/components/RenderThumbs";
import { get } from "@/actions/favorites";
import { ReadonlyURLSearchParams } from "next/navigation";

const opts = [
  ["NOW", "?season=now"],
  ["UPCOMING", "?season=upcoming"],
  ["TOP", "?season=top"],
  ["TOP AIRING", "?season=top_airing"],
  ["ANIME", "?season=anime"],
  ["FAVORITES", "?season=favorites"],
];

const Home = async (params: ReadonlyURLSearchParams) => {
  console.log(params.searchParams.season);
  const jikanAnimes = await fetchJikanAnimes(params.searchParams.season);
  const favoritesAnimes = await get();

  return (
    <>
      <Background animes={jikanAnimes.data} />
      <Main>
        <Title animes={jikanAnimes.data} />
        <QuickInfo animes={jikanAnimes.data} />
        <Slider opts={opts} type="link">
          <Thumbs options={{ dragFree: true, loop: true }}>
            <RenderThumbs
              favorites={favoritesAnimes.data}
              animes={jikanAnimes.data}
              classNameLink="my-thumb-slide-link"
              className="my-thumb-slide"
            />
          </Thumbs>
        </Slider>
      </Main>
    </>
  );
};

export default Home;
