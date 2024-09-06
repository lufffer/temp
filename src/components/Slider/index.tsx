"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Glass from "../Glass";
import { SliderHeader } from "./SliderHeader";
import BorderedContainer from "../BorderedContainer";
import Selector from "../Selector";
import RoundedButton from "../RoundedButton";

type Props = {
  opts: string[];
  type: "link" | "button" | "marquee";
  slug: string[];
  children: React.ReactNode;
};

const size = 28;

const Slider = ({ opts, type, slug, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [portal, setPortal] = useState(<></>);

  useEffect(() => {
    setPortal(createPortal(<Glass ref={ref} />, document.body));
  }, []);

  const handleToggleSlider = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  return (
    <section className="my-slider">
      <SliderHeader className="flex justify-between">
        <BorderedContainer className="relative w-3/4">
          <Selector options={opts} type={type} slug={slug[0]} />
        </BorderedContainer>
        <RoundedButton className="relative" onClick={handleToggleSlider}>
          <img
            src="/circle-chevron-up.svg"
            height={size}
            width={size}
            className="cursor-pointer"
            title="Open slider"
          />
        </RoundedButton>
      </SliderHeader>
      {children}
      {portal}
    </section>
  );
};

export { Slider };
