"use client";

import { useHash } from "@/app/home/hooks/useHash";
import { Anime } from "@/types/animes.type";

type Props = {
  animes: Anime[];
};

const Background = ({ animes }: Props) => {
  const hash = useHash();
  const img = animes[hash].images.webp.image_url;

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
