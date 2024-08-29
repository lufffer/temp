import React from "react";

type Props = {
  isFavorite: boolean;
  mutate: (action: string) => void;
};

const size = 28;

export default function Start({ isFavorite, mutate }: Props): React.ReactNode {
  const handleClickToggleFavorite = async (
    e: React.MouseEvent<HTMLImageElement>,
  ) => {
    if (!isFavorite) {
      e.currentTarget.src = window.location.origin + "/starActive.svg";
      mutate("add");
    } else {
      e.currentTarget.src = window.location.origin + "/starInactive.svg";
      mutate("remove");
    }
  };

  return (
    <img
      src={isFavorite ? "/starActive.svg" : "/starInactive.svg"}
      height={size}
      width={size}
      className="my-star"
      onClick={handleClickToggleFavorite}
    />
  );
}
