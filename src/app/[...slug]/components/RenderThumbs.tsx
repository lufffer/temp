import { Star } from "@/app/components/Star";
import { Thumb } from "@/components/Thumbs/components/Thumb";
import { Anime } from "@/types/animes.type";
import { SignedIn } from "@clerk/nextjs";

type Props = {
  animes: Anime[];
  favorites: Anime[];
  classNameLink: string;
  className: string;
  offset?: number;
};

const RenderThumbs = ({
  animes,
  favorites,
  classNameLink,
  className,
  offset = 0,
}: Props) => {
  return animes.map((anime, i: number) => {
    const id = anime.mal_id.toString();
    const title = anime.title.replaceAll(" ", "_").toLowerCase();
    const img = anime.images.webp.image_url;

    return (
      <Thumb
        key={i + offset}
        classNameLink={classNameLink}
        className={className}
        anime={{ id, title, img }}
        i={i + offset}
      >
        <SignedIn>
          <Star
            anime={anime}
            isFavorite={favorites?.some(
              (fav: Anime) => fav.mal_id === anime.mal_id,
            )}
          />
        </SignedIn>
      </Thumb>
    );
  });
};

export { RenderThumbs };
