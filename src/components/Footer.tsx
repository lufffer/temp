"use client";

import { useRef, useState } from "react";
import Hamburger from "hamburger-react";
import Selector from "./Selector";
import BorderedContainer from "./BorderedContainer";
import { useRouter } from "next/navigation";

const options = ["Home", "Episodes", "Info", "Music", "Cast", "Gallery"];
const size = 28;

export default function Footer() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (toggled: boolean) => {
    const footer = footerRef.current!;

    footer.scrollLeft = toggled ? window.innerWidth * 0.9 : 0;
  };

  const handleClick = () => {
    const value = inputRef.current!.value;

    router.push(`/home/anime/${value.replaceAll(" ", "_")}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <footer ref={footerRef} className="my-footer">
      <div className="flex my-allow-overflow basis-full justify-between items-center w-full ps-2">
        <form
          className="w-3/4 h-[36px] relative border-2 border-white rounded-2xl"
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            type="search"
            className="w-full h-full ps-4 pe-8 text-white bg-transparent rounded-2xl"
          />
          <button
            className="absolute top-1/2 right-0 -translate-y-1/2"
            onClick={handleClick}
          >
            <img src="/search.svg" width={size} height={size} />
          </button>
        </form>
        <Hamburger
          color="#fff"
          toggled={isOpen}
          toggle={setIsOpen}
          onToggle={handleToggle}
        />
      </div>
      <div className="relative flex justify-end pe-2 custom-width flex-grow-0 flex-shrink-0">
        <BorderedContainer className="relative w-full">
          <Selector options={options} type="link" />
        </BorderedContainer>
      </div>
    </footer>
  );
}
