import React, { ReactNode, RefObject, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Glass from "../Glass";
import { SliderHeader } from "./SliderHeader";
import BorderedContainer from "../BorderedContainer";
import Selector from "../Selector";

type Props = {
  opts: string[];
  children: ReactNode;
};

const handleToggleSlider = (
  e: React.MouseEvent<HTMLButtonElement>,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ref: RefObject<HTMLDivElement>,
) => {
  const $list = ref.current!;
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

const Slider = ({ opts, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="my-slider">
      <SliderHeader>
        <BorderedContainer className="relative w-3/4">
          <Selector
            options={opts}
            type="button"
            onClick={(e) => handleToggleSlider(e, isOpen, setIsOpen, ref)}
          />
        </BorderedContainer>
      </SliderHeader>
      {children}
      {createPortal(<Glass ref={ref} />, document.body)}
    </section>
  );
};

export default Slider;
export { handleToggleSlider };
