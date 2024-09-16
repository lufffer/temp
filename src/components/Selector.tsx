"use client";

import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import RoundedButton from "./RoundedButton";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Marquee from "react-fast-marquee";

type Props = {
  options: string[][];
  type: "button" | "link" | "marquee";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const size = 28;

function Selector({ options, type, onClick }: Props) {
  const path = usePathname();
  const searchParams = useSearchParams();
  console.log(searchParams);
  const [emblaOptionsRef, emblaOptionsApi] = useEmblaCarousel();

  useEffect(() => {
    if (searchParams.size > 0) {
      // const index = options.indexOf(slug.replaceAll("_", " ").toUpperCase());
      emblaOptionsApi?.scrollTo(0);
    }
  }, [emblaOptionsApi]);

  const handleMoveNext = () => {
    emblaOptionsApi?.scrollNext();
  };

  const handleMovePrev = () => {
    emblaOptionsApi?.scrollPrev();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLSpanElement;
    const option = target.textContent!.toLowerCase();
  };

  const isCurrentPath = (opt: string) => {
    opt = "/" + opt;

    return (
      opt?.toLowerCase() === path ||
      ("/" === path && opt?.toLowerCase() === "/home")
    );
  };

  return (
    <div className="embla" ref={emblaOptionsRef}>
      <div className="embla__container">
        {options.map((option, i) => {
          const opt = option;

          return (
            <div className="embla__slide my-allow-overflow basis-full" key={i}>
              {type === "button" ? (
                <button
                  onClick={onClick || handleClick}
                  className="w-full py-1"
                >
                  <span
                    className={`my-selector-option`}
                    // style={{
                    //   color: isCurrentQueryKey(opt)
                    //     ? "var(--primary-light)"
                    //     : "var(--light)",
                    // }}
                  >
                    {opt}
                  </span>
                </button>
              ) : type === "marquee" ? (
                <Marquee
                  className={`my-selector-option`}
                  // style={{
                  //   color: isCurrentQueryKey(opt)
                  //     ? "var(--primary-light)"
                  //     : "var(--light)",
                  // }}
                >
                  <button
                    onClick={onClick || handleClick}
                    className="w-full px-16"
                  >
                    {opt}
                  </button>
                </Marquee>
              ) : (
                <button className="w-full py-1">
                  <Link
                    href={opt[1].replaceAll(" ", "_").toLowerCase()}
                    className={`my-selector-option`}
                    style={{
                      color: isCurrentPath(opt[0])
                        ? "var(--primary-light)"
                        : "var(--light)",
                    }}
                  >
                    <span className="mx-auto text-center">{opt[0]}</span>
                  </Link>
                </button>
              )}
            </div>
          );
        })}
      </div>
      <RoundedButton
        className="absolute top-1/2 -translate-y-1/2 left-0"
        onClick={handleMovePrev}
      >
        <img src="/circle-chevron-left.svg" width={size} height={size} />
      </RoundedButton>
      <RoundedButton
        className="absolute top-1/2 -translate-y-1/2 right-0"
        onClick={handleMoveNext}
      >
        <img src="/circle-chevron-right.svg" width={size} height={size} />
      </RoundedButton>
    </div>
  );
}

export default Selector;
