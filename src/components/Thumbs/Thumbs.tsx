import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";

type Props = {
  options: EmblaOptionsType;
  children: React.ReactNode;
};

export default function Thumbs({ options, children }: Props): React.ReactNode {
  const [emblaAnimeRef] = useEmblaCarousel(options);

  return (
    <nav className="embla my-embla-thumbs" ref={emblaAnimeRef}>
      <div className="embla__container">{children}</div>
    </nav>
  );
}
