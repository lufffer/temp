import { QuickInfo } from "@/app/components/QuickInfo";
import InfiniteContainer from "@/components/InfiniteContainer";
import { Slider } from "@/components/Slider";
import { Thumbs } from "@/components/Thumbs/Thumbs";
import { Title } from "@/components/Title";
import { LoadMoreAnimes } from "../../_slug/components/LoadMoreAnimes";
import { get } from "@/actions/jikanFavoritesAnimes";
import { RenderThumbs } from "../../_slug/components/RenderThumbs";
import { fetchJikanAnimes } from "@/actions/jikanAnimes";
import { RenderEpisodes } from "./components/RenderEpisodes";

type Props = {
  slug: string[];
};

const opts = ["Favorites"];
const Episodes = async ({ slug }: Props) => {
  const jikanEpisodes = await fetchJikanAnimes(slug, 1);

  // const jikanAnimes = fetchJikanAnimes(slug[0], );
  // const jikanVideos = fetchJikanVideos();

  return (
    <>
      {/* <Title /> */}
      {/* <Slider opts={opts} type="link" slug={slug}> */}
      {/*   <Thumbs options={{ dragFree: true, loop: true }}> */}
      {/*     <RenderEpisodes */}
      {/*       slug={slug} */}
      {/*       classNameLink="my-thumb-slide-link" */}
      {/*       className="my-thumb-slide" */}
      {/*     /> */}
      {/*   </Thumbs> */}
      {/* <InfiniteContainer> */}
      {/*   <RenderThumbs */}
      {/*     slug={slug} */}
      {/*     className="my-thumb-poster" */}
      {/*     classNameLink="my-thumb-poster-link" */}
      {/*   /> */}
      {/* </InfiniteContainer> */}
      {/* </Slider> */}
    </>
  );
};

export default Episodes;
