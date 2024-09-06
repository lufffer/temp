"use client";

import { useHash } from "@/app/[...slug]/hooks/useHash";

type Props = {
  classNameLink: string;
  className: string;
  img: string;
  i: number;
  children: React.ReactNode;
};

const Thumb = ({ classNameLink, className, img, i, children }: Props) => {
  const hash = useHash();
  const bg = (hash !== i ? "var(--glass)," : "") + `url('${img}')`;
  const bw = hash === i ? "2px" : "0px";

  return (
    <a href={`#${i}`} className={classNameLink}>
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
