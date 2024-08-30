import { forwardRef, ReactNode } from "react";

type Props = {
  className: string;
  children: ReactNode;
};

const Carousel = forwardRef<HTMLElement, Props>(function (
  { className, children },
  ref,
) {
  return (
    <nav className={`embla ${className}`} ref={ref}>
      <div className="embla__container">{children}</div>
    </nav>
  );
});

export { Carousel };
