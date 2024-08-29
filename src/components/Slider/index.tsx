import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import Glass from "../Glass";

type Props = {
  children: React.ReactNode;
};

const handleToggleSlider = (
  e: React.MouseEvent<HTMLButtonElement>,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  listRef: React.RefObject<HTMLDivElement>,
) => {
  const $list = listRef.current!;
  const $slider = e.currentTarget.parentElement!.parentElement!;

  if (isOpen) {
    const computedStyles = getComputedStyle(document.body);
    const translation = computedStyles.getPropertyValue("--translation");

    $list.style.backdropFilter = "blur(0)";
    $list.style.backgroundColor = "transparent";
    $slider.style.transform = `translateY(-${translation})`;
    $slider.style.paddingTop = "1rem";
    $slider.style.backdropFilter = "blur(0rem)";
    e.currentTarget.style.transform = "rotate(0deg)";
  } else {
    $list.style.backdropFilter = "blur(16px)";
    $list.style.backgroundColor = "rgba(0,0,0,0.75)";
    $slider.style.transform = "translateY(-100%)";
    $slider.style.paddingTop = "7rem";
    $slider.style.backdropFilter = "blur(8px)";
    e.currentTarget.style.transform = "rotate(180deg)";
  }

  setIsOpen(!isOpen);
};

export default forwardRef<HTMLDivElement, Props>(function Slider(
  { children },
  ref,
) {
  return (
    <div className="my-slider">
      {children}
      {createPortal(<Glass ref={ref} />, document.body)}
    </div>
  );
});

export { handleToggleSlider };
