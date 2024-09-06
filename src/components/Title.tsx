"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { useHash } from "@/app/[...slug]/hooks/useHash";
import { useAnimeStore } from "@/providers/store.provider";

const Title = () => {
  const { animes } = useAnimeStore((state) => state);
  const [title, setTitle] = useState("");
  const hash = useHash();

  useEffect(() => {
    if (animes.length > 0) {
      const i = Number(window.location.hash.slice(1) ?? 0);
      setTitle(animes[i].title);
    }
  }, [animes, hash]);

  return (
    <Marquee>
      <h2 className="my-title">{title}</h2>
    </Marquee>
  );
};

export { Title };
