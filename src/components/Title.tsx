import React from "react";
import Marquee from "react-fast-marquee";

type Props = {
  children: React.ReactNode;
};

export default function Title({ children }: Props) {
  return (
    <Marquee>
      <h2 className="my-title">{children}</h2>
    </Marquee>
  );
}
