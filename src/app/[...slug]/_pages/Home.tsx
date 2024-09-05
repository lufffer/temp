import { fetchJikanAnimes } from "@/actions/jikanAnimes";
import QuickInfo from "@/app/components/QuickInfo";
import Slider from "@/components/Slider";
import Thumb from "@/components/Thumbs/components/Thumb";
import Thumbs from "@/components/Thumbs/Thumbs";
import { Title } from "@/components/Title";

type Props = {
  slug: string;
};

const opts = ["NOW", "UPCOMING", "TOP", "TOP AIRING", "ANIME", "FAVORITES"];

const Home = async ({ slug }: Props) => {
  const jikanAnimes = await fetchJikanAnimes(slug, 1);

  return (
    <>
      <Title />
      <QuickInfo />
      <Slider opts={opts} type="button" slug={slug}>
        <Thumbs options={{ dragFree: true, loop: true }}>
          {jikanAnimes.data.map((anime, i: number) => (
            <Thumb
              key={i}
              className="my-thumb-slide"
              img={anime.images.webp.image_url}
              i={i}
            />
          ))}
        </Thumbs>
      </Slider>
    </>
  );
};

export default Home;
