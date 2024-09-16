import { Animes } from "@/types/animes.type";

type Props = {
  animes: Animes;
  favorites: Animes;
};

// const opts = [
//   ["NOW", "/home/now"],
//   ["UPCOMING", "/home/upcoming"],
//   ["TOP", "/home/top"],
//   ["TOP AIRING", "/home/top_airing"],
//   ["ANIME", "/home/anime"],
//   ["FAVORITES", "/home/favorites"],
// ];

const Home = ({ animes, favorites }: Props) => {
  console.log(animes);
  console.log(favorites);

  return (
    <>
      <h1>Hola Mundo</h1>
      {/* <Title /> */}
      {/* <QuickInfo /> */}
      {/* <Slider opts={opts} type="link" slug={slug[1]}> */}
      {/*   <Thumbs options={{ dragFree: true, loop: true }}> */}
      {/*     <RenderThumbs */}
      {/*       slug={slug} */}
      {/*       classNameLink="my-thumb-slide-link" */}
      {/*       className="my-thumb-slide" */}
      {/*     /> */}
      {/*   </Thumbs> */}
      {/*   <InfiniteContainer> */}
      {/*     <RenderThumbs */}
      {/*       slug={slug} */}
      {/*       className="my-thumb-poster" */}
      {/*       classNameLink="my-thumb-poster-link" */}
      {/*     /> */}
      {/*     {/* <LoadMoreAnimes slug={slug} favoritesAnimes={favoritesAnimes} /> */}
      {/*   </InfiniteContainer> */}
      {/* </Slider> */}
    </>
  );
};

export default Home;
