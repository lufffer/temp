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

const RenderThumbs = async ({
  slug,
  classNameLink,
  className,
  offset = 0,
}: Props) => {
  const jikanAnimes = await fetchJikanAnimes(slug, 1);
  const favoritesAnimes = await get();

  return jikanAnimes.data.map((anime, i: number) => {
    const img = anime.images.webp.image_url;

    return (
      <Thumb
        key={i + offset}
        classNameLink={classNameLink}
        className={className}
        img={img}
        i={i + offset}
        id={anime.mal_id.toString()}
        title={anime.title.toString().replaceAll(" ", "_").toLowerCase()}
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

export { RenderThumbs };
