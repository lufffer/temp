"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { useHash } from "@/app/home/hooks/useHash";
import { Anime } from "@/types/animes.type";

type Props = {
  animes: Anime[];
};

const Title = ({ animes }: Props) => {
  const hash = useHash();
  const title = animes[hash].title;

  return (
    <Marquee>
      <h2 className="my-title">{title}</h2>
    </Marquee>
  );
};

export { Title };
