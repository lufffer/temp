"use client";

import { useContext, useEffect, useState } from "react";
import { useAnimeStore } from "@/providers/store.provider";
import { JikanAnimeContext } from "@/app/[...slug]/providers/jikanAnime.provider";

const Background = () => {
  const ctx = useContext(JikanAnimeContext);
  const { current } = useAnimeStore((state) => state);
  const [img, setImg] = useState("");

  useEffect(() => {
    if (ctx?.animes) {
      setImg(ctx.animes[current.anime].images.webp.image_url);
    }
  }, [ctx, current.anime]);

  return (
    <div
      className="my-background"
      style={{
        backgroundImage: `url('${img}')`,
      }}
    ></div>
  );
};

export default Background;
