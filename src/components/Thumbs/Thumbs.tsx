import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { useAnimeStore } from "@/providers/store.provider";

type Props = {
  options: EmblaOptionsType;
  children: React.ReactNode;
};

export default function Thumbs({ options, children }: Props): React.ReactNode {
  const path = usePathname();
  const { current } = useAnimeStore((state) => state);
  const [emblaAnimeRef, emblaAnimeApi] = useEmblaCarousel(options);

  useEffect(() => {
    if (emblaAnimeApi) {
      emblaAnimeApi.scrollTo(current.anime);
    }
  });

  return (
    <nav className="embla my-embla-thumbs" ref={emblaAnimeRef}>
      <div className="embla__container">{children}</div>
    </nav>
  );
}
