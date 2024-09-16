import { fetchJikanAnime } from "@/actions/jikanAnime";
import { fetchJikanAnimes } from "@/actions/jikanAnimes";
import { get } from "@/actions/jikanFavoritesAnimes";
import { Star } from "@/app/components/Star";
import { Thumb } from "@/components/Thumbs/components/Thumb";
import { Anime } from "@/types/animes.type";
import { SignedIn } from "@clerk/nextjs";

type Props = {
  slug: string[];
  classNameLink: string;
  className: string;
  offset?: number;
};

const RenderEpisodes = async ({
  slug,
  classNameLink,
  className,
  offset = 0,
}: Props) => {
  const jikanAnime = await fetchJikanAnime(slug);
  const jikanEpisodes = await fetchJikanAnimes(slug, 1);
  const favoritesAnimes = await get();

  return jikanEpisodes.data.map((anime, i: number) => {
    const img = jikanAnime.data.images.webp.image_url;

    return (
      <Thumb
        key={i + offset}
        classNameLink={classNameLink}
        className={className}
        img={img}
        i={i + offset}
        id={anime.mal_id.toString().replaceAll(" ", "_").toLowerCase()}
      >
        <SignedIn>
          <Star
            anime={anime}
            isFavorite={favoritesAnimes?.data?.some(
              (fav: Anime) => fav.mal_id === anime.mal_id,
            )}
          />
        </SignedIn>
      </Thumb>
    );
  });
};

export { RenderEpisodes };
