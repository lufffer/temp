"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Anime } from "@/types/animes.type";
import { fetchJikanAnimes } from "@/actions/jikanAnimes";
import { Thumb } from "@/components/Thumbs/components/Thumb";
import { SignedIn } from "@clerk/nextjs";
import { Star } from "@/app/components/Star";
import { useAnimeStore } from "@/providers/store.provider";

type Props = {
  slug: string[];
  favoritesAnimes: {
    data: Anime[];
  };
};

const LoadMoreAnimes = ({ slug, favoritesAnimes }: Props) => {
  const { animes, changeAnimes } = useAnimeStore((state) => state);
  const [page, setPage] = useState(2);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchJikanAnimes(slug[0], page, slug[1]).then((res) => {
        setHasNextPage(res.pagination.has_next_page);
        changeAnimes([...animes, ...res.data]);
      });
      setPage(page + 1);
    }
  }, [inView, hasNextPage]);

  return (
    <>
      {/* RenderThumbs cannot be used here in a client component */}
      {animes.map((anime, i: number) => {
        const img = anime.images.webp.image_url;

        return (
          <Thumb key={i + 25} className="my-thumb-poster" img={img} i={i + 25}>
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
      })}
      <div className="w-full flex flex-col items-center">
        <img ref={ref} src="/loader.gif" alt="Loading..." />
        <p className="text-white text-2xl">Loading...</p>
      </div>
    </>
  );
};

export { LoadMoreAnimes };
