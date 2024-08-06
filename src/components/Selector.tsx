import { useEffect } from "react";
import { useAnimeStore } from "@/providers/store.provider";
import useEmblaCarousel from "embla-carousel-react";

type Props = {
  options: string[];
};

const size = 28;

export default function Selector({ options }: Props) {
  const [emblaOptionsRef, emblaOptionsApi] = useEmblaCarousel();
  const { queryKey, changeQueryKey, query } = useAnimeStore((state) => state);

  useEffect(() => {
    if (queryKey[0] === "anime") {
      emblaOptionsApi?.scrollTo(options.findIndex((opt) => opt === "ANIME"));
    }
  }, [queryKey, emblaOptionsApi]);

  const handleMoveNext = () => {
    emblaOptionsApi?.scrollNext();
  };

  const handleMovePrev = () => {
    emblaOptionsApi?.scrollPrev();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLSpanElement;
    const option = target.textContent!.toLowerCase();

    changeQueryKey([option, option === "anime" ? query : ""]);
  };

  return (
    <div className="embla" ref={emblaOptionsRef}>
      <div className="embla__container">
        {options.map((option, i) => (
          <div className="embla__slide my-allow-overflow basis-full" key={i}>
            <button onClick={handleClick} className="w-full">
              <span
                className={`font-bold flex items-center justify-center py-1 ${option.toLowerCase() === queryKey[0] ? "text-pink-200" : "text-white"}`}
              >
                {option}
              </span>
            </button>
          </div>
        ))}
      </div>
      <button className="my-rounded-button left-0" onClick={handleMovePrev}>
        <img src="/circle-chevron-left.svg" width={size} height={size} />
      </button>
      <button className="my-rounded-button right-0" onClick={handleMoveNext}>
        <img src="/circle-chevron-right.svg" width={size} height={size} />
      </button>
    </div>
  );
}
