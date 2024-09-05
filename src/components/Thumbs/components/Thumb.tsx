"use client";

import { ReactNode } from "react";
import { useAnimeStore } from "@/providers/store.provider";

type Props = {
  className: string;
  img: string;
  i: number;
  children: ReactNode;
};

function Thumb({ className, img, i, children }: Props) {
  const { current, changeCurrent } = useAnimeStore((state) => state);
  const bg = (current.anime !== i ? "var(--glass)," : "") + `url('${img}')`;
  const bw = current.anime === i ? "2px" : "0px";

  const handleClickChangeCurrent = () => {
    changeCurrent({ page: current.page, anime: i });
  };

  return (
    <div
      className={className}
      style={{
        backgroundImage: bg,
        borderWidth: bw,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={handleClickChangeCurrent}
    >
      {children}
    </div>
  );
}

export default Thumb;
