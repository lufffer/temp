"use client";

import { useHash } from "@/app/home/hooks/useHash";

type Props = {
  classNameLink: string;
  className: string;
  anime: { id: string; title: string; img: string };
  i: number;
  children: React.ReactNode;
};

const Thumb = ({ classNameLink, className, anime, i, children }: Props) => {
  const { id, title, img } = anime;
  const hash = useHash();
  const bg = (hash !== i ? "var(--glass)," : "") + `url('${img}')`;
  const bw = hash === i ? "2px" : "0px";

  const handleClick = () => {
    const pathname = window.location.pathname;
    const url = `${pathname}?title=${title}&id=${id}#${i}`;

    window.history.replaceState(null, "", url);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <a className={classNameLink} onClick={handleClick}>
      <div
        className={className}
        style={{
          backgroundImage: bg,
          borderWidth: bw,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {children}
      </div>
    </a>
  );
};

export { Thumb };
