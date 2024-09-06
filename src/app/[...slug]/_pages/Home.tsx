import { QuickInfo } from "@/app/components/QuickInfo";
import InfiniteContainer from "@/components/InfiniteContainer";
import { Slider } from "@/components/Slider";
import { Thumbs } from "@/components/Thumbs/Thumbs";
import { Title } from "@/components/Title";
import { LoadMoreAnimes } from "../components/LoadMoreAnimes";
import { get } from "@/actions/jikanFavoritesAnimes";
import { RenderThumbs } from "../components/RenderThumbs";

type Props = {
  slug: string[];
};

const opts = ["NOW", "UPCOMING", "TOP", "TOP AIRING", "ANIME", "FAVORITES"];

const Home = async ({ slug }: Props) => {
  const favoritesAnimes = await get();

  return (
    <>
      <Title />
      <QuickInfo />
      <Slider opts={opts} type="link" slug={slug}>
        <Thumbs options={{ dragFree: true, loop: true }}>
          <RenderThumbs
            slug={slug}
            classNameLink="my-thumb-slide-link"
            className="my-thumb-slide"
          />
        </Thumbs>
        <InfiniteContainer>
          <RenderThumbs
            slug={slug}
            className="my-thumb-poster"
            classNameLink="my-thumb-poster-link"
          />
          <LoadMoreAnimes slug={slug} favoritesAnimes={favoritesAnimes} />
        </InfiniteContainer>
      </Slider>
    </>
  );
};

export default Home;
