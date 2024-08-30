import { ReactNode, useState } from "react";
import { calculateAspectRatioFit, shimmer, toBase64 } from "../utils/images";

type Props = {
  w: number;
  h: number;
  url: string;
  alt: string;
  original: string;
};

function LazyImg({ w, h, url, alt, original }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <img
        src={`data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`}
        width={w}
        height={h}
        className="rounded-2xl absolute z-10"
        style={{ display: isLoaded ? "none" : "block" }}
      />
      <img
        loading="lazy"
        src={url}
        alt={alt}
        width={w}
        height={h}
        onLoad={() => setIsLoaded(true)}
        onClick={() => {
          window.open(original, "_blank", "noreferrer=true");
        }}
        className="rounded-2xl relative z-0"
      />
    </>
  );
}

export { LazyImg };
