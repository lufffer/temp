"use client";

import { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
};

export default function Menu({ isOpen }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    ref.current!.style.transform = isOpen
      ? "translateX(0%)"
      : "translateX(100%)";
  }, [isOpen]);

  return (
    <nav ref={ref} className="menu">
      <ul className="text-white text-2xl">
        <li>Summary</li>
      </ul>
    </nav>
  );
}
