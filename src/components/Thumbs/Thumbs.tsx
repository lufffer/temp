"use client";

import { useEffect } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { useHash } from "@/app/home/hooks/useHash";

type Props = {
  options: EmblaOptionsType;
  children: React.ReactNode;
};

const Thumbs = ({ options, children }: Props): React.ReactNode => {
  const [emblaAnimeRef, emblaAnimeApi] = useEmblaCarousel(options);
  const hash = useHash();

  useEffect(() => {
    if (emblaAnimeApi) {
      if (hash < 25) {
        emblaAnimeApi.scrollTo(hash);
      }
    }
  });

  return (
    <nav className="embla my-embla-thumbs" ref={emblaAnimeRef}>
      <div className="embla__container">{children}</div>
    </nav>
  );
};

export { Thumbs };
