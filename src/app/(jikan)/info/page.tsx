"use client";

import { createPortal } from "react-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAnimeStore } from "@/providers/store.provider";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";
import Glass from "@/components/Glass";
import QuickInfo from "@/app/components/QuickInfo";
import { videoOpts } from "@/services/video.service";
import { useSetPromos } from "./hooks/useSetPromos";
import BorderedContainer from "@/components/BorderedContainer";
import Selector from "@/components/Selector";
import { useEffect, useState } from "react";

function Page() {
  const { queryKey } = useAnimeStore((state) => state);

  const animesRes = useInfiniteQuery(animesQuery(queryKey));
  const favoritesRes = useInfiniteQuery(favoritesQuery());

  const ptr = useSetPages(animesRes, favoritesRes);
  const anime = useSetAnime(ptr);

  const mal_id = anime?.mal_id.toString() || "";

  const videos = useQuery(videoOpts(mal_id));
  const promos = useSetPromos(videos);

  const cover = anime?.images.webp.image_url;
  const synopsis = anime?.synopsis;

  const [trailer, setTrailer] = useState("");

  useEffect(() => {
    if (anime) {
      setTrailer(anime.trailer.embed_url);
    }
  }, [anime]);

  const handleClickChangePromo = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.target as HTMLSpanElement;
    const value = target.innerText;

    setTrailer(
      promos.find((promo) => promo.title === value)!.trailer.embed_url,
    );
  };

  return (
    <div className="overflow-scroll h-[75svh] my-4">
      <img src={cover} alt="Anime cover" className="my-cover" />
      <QuickInfo extra={true} className="text-center w-full" />
      <h2 className="my-4 font-bold text-white text-center">~SYNOPSIS~</h2>
      <p className="text-white text-center px-4">{synopsis}</p>
      <h2 className="my-4 font-bold text-white text-center">~TRAILER~</h2>

      {promos.length > 0 ? (
        <BorderedContainer className="relative mx-auto w-3/4">
          <Selector
            type="button"
            options={promos?.map((promo) => promo.title)}
            onClick={handleClickChangePromo}
          ></Selector>
        </BorderedContainer>
      ) : (
        <></>
      )}
      <iframe
        id="ytplayer"
        src={trailer}
        className="my-trailer"
        allowFullScreen
      ></iframe>
      {createPortal(<Glass />, document.body)}
    </div>
  );
}

export default Page;
