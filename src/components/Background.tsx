"use client";

import { useEffect, useState } from "react";
import { useHash } from "@/app/[...slug]/hooks/useHash";
import { useAnimeStore } from "@/providers/store.provider";

const Background = () => {
  const { animes } = useAnimeStore((state) => state);
  const [img, setImg] = useState("");
  const hash = useHash();

  useEffect(() => {
    if (animes.length > 0) {
      console.log(animes);
      setImg(animes[hash].images.webp.image_url);
    }
  }, [animes, hash]);

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
