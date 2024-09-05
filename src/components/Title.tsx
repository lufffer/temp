"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { JikanAnimeContext } from "@/app/[...slug]/providers/jikanAnime.provider";
import { useAnimeStore } from "@/providers/store.provider";

type Props = {
  children: ReactNode;
};

const Title = () => {
  const ctx = useContext(JikanAnimeContext);
  const { current } = useAnimeStore((state) => state);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (ctx?.animes) {
      setTitle(ctx.animes[current.anime].title);
    }
  }, [ctx]);

  return (
    <Marquee>
      <h2 className="my-title">{title}</h2>
    </Marquee>
  );
};

export { Title };
