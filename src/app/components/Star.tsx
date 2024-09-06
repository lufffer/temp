"use client";

import { add, remove } from "@/actions/jikanFavoritesAnimes";
import { Anime } from "@/types/animes.type";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  anime: Anime;
  isFavorite: boolean;
};

const size = 28;

const Star = ({ anime, isFavorite }: Props): React.ReactNode => {
  const router = useRouter();
  const handleClickToggleFavorite = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const img = e.currentTarget.firstElementChild as HTMLImageElement;
    if (!isFavorite) {
      img.src = window.location.origin + "/starActive.svg";
      add(anime);
    } else {
      img.src = window.location.origin + "/starInactive.svg";
      remove(anime);
    }
    router.refresh();
  };

  return (
    <button className="bg-none border-none" onClick={handleClickToggleFavorite}>
      <img
        src={isFavorite ? "/starActive.svg" : "/starInactive.svg"}
        height={size}
        width={size}
        className="my-star"
      />
    </button>
  );
};

export { Star };
