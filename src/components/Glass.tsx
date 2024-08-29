import { forwardRef } from "react";

export default forwardRef<HTMLDivElement>(function Glass(_props, ref) {
  return (
    <div ref={ref} className="my-glass h-full w-full absolute z-[1]"></div>
  );
});
