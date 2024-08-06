import { add, remove } from "@/actions/favorites";
import { Anime } from "@/types/anime.type";
import React from "react";

type Props = {
  anime: Anime;
  isFavorite: boolean;
  onClick: (anime: Anime) => void;
};

const size = 28;

export default function Start({ anime, isFavorite, onClick }: Props) {
  const handleClickToggleFavorite = async (
    e: React.MouseEvent<HTMLImageElement>,
  ) => {
    if (!isFavorite) {
      e.currentTarget.src = window.location.origin + "/starActive.svg";
      onClick(anime!);
    } else {
      e.currentTarget.src = window.location.origin + "/starInactive.svg";
      remove(anime!);
    }
  };

  return (
    <img
      src={isFavorite ? "/starActive.svg" : "/starInactive.svg"}
      height={size}
      width={size}
      className="absolute bottom-2 right-2"
      onClick={handleClickToggleFavorite}
    />
  );
}
