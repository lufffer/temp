"use client";

import React from "react";
import { useRef } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { SignedIn } from "@clerk/nextjs";
import { useAnimeStore } from "@/providers/store.provider";
import Bold from "@/components/Bold";
import Field from "@/components/Field";
import Selector from "@/components/Selector";
import Star from "./components/Star";
import Loader from "./components/Loader";
import { getQueryClient } from "@/app/get-query-client";
import { add } from "@/actions/favorites";
import { jikanOpts } from "@/services/jikan.service";
import { favoritesOpts } from "@/services/favorites.service";
import { Anime } from "@/types/anime.type";

const size = 28;

export default function Summary() {
  const listRef = useRef<HTMLDivElement>(null);
  const opacityRef = useRef<HTMLDivElement>(null);
  const [emblaAnimeRef] = useEmblaCarousel({ dragFree: true, loop: true });
  const { current, changeCurrent, queryKey } = useAnimeStore((state) => state);
  const queryClient = getQueryClient();
  const { data: animes, hasNextPage } = useInfiniteQuery(jikanOpts(queryKey));
  const { data: favorites } = useInfiniteQuery(favoritesOpts());
  const mutation = useMutation({
    mutationFn: (anime: Anime) => add(anime),
    onSuccess: (res) =>
      queryClient.setQueryData(["favorites", ""], () => [...res]),
  });
  const ptr = animes ? animes : favorites;
  const currentAnime = ptr?.pages[current.page].data[current.anime];
  const title = currentAnime?.title;
  const rank = currentAnime?.rank;
  const episodes = currentAnime?.episodes;
  const status = currentAnime?.status;
  const from = currentAnime?.aired.from?.split("T")[0] || "--/--/--";
  const to = currentAnime?.aired.to?.split("T")[0] || "--/--/--";
  const summary = [
    ["RANK", rank],
    ["EPISODES", episodes],
    ["STATUS", status],
    ["FROM", from],
    ["TO", to],
  ];
  const options = [
    "NOW",
    "UPCOMING",
    "TOP",
    "TOP AIRING",
    "ANIME",
    "FAVORITES",
  ];

  let isAnimeListOpen = false;
  const handleOpenList = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimeListOpen) {
      opacityRef.current!.style.backdropFilter = "blur(0)";
      opacityRef.current!.style.backgroundColor = "transparent";
      listRef.current!.style.transform = "translateY(-170px)";
      listRef.current!.style.paddingTop = "1rem";
      listRef.current!.style.backdropFilter = "blur(0rem)";
      e.currentTarget.style.transform = "rotate(0deg)";
    } else {
      opacityRef.current!.style.backdropFilter = "blur(2rem)";
      opacityRef.current!.style.backgroundColor = "rgba(0,0,0,0.75)";
      listRef.current!.style.transform = "translateY(-100%)";
      listRef.current!.style.paddingTop = "7rem";
      listRef.current!.style.backdropFilter = "blur(0.5rem)";
      e.currentTarget.style.transform = "rotate(180deg)";
    }

    isAnimeListOpen = !isAnimeListOpen;
  };

  return (
    <section
      ref={opacityRef}
      className="py-11 backdrop-blur-0 transition-all duration-1000"
    >
      <div className="custom-height relative z-10 w-full overflow-hidden flex flex-col opacity-100">
        {/* Show anime title  */}
        <h2 className="text-xl font-bold text-white text-center my-2">
          {title}
        </h2>
        {/* Show anime info  */}
        <div className="text-white">
          <table>
            <tbody>
              {summary.map((data) => (
                <tr key={data[0]}>
                  <Field>
                    <Bold>{data[0]}:</Bold>
                  </Field>
                  <Field>{data[1]}</Field>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Show anime list  */}
        <div
          ref={listRef}
          className="w-full flex flex-col absolute z-50 top-full -translate-y-[175px] h-svh overflow-hidden gap-0 pt-4 transition-all duration-1000 ease-in-out"
        >
          <div className="flex justify-between ps-2">
            <div className="relative flex justify-center w-3/4 border-white border-2 rounded-2xl">
              <Selector options={options} />
            </div>
            <button
              onClick={handleOpenList}
              className="transition-transform duration-1000 z-10 me-2"
            >
              <img
                src="/circle-chevron-up.svg"
                width={size}
                height={size}
                className="cursor-pointer"
              />
            </button>
          </div>
          <div className="embla mt-4 h-[100px]" ref={emblaAnimeRef}>
            <div className="embla__container">
              {ptr &&
                ptr.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.data.map((anime: Anime, j: number) => {
                      const image = anime.images.webp.image_url;

                      return (
                        <div
                          className={
                            "embla__slide mr-4 flex-grow-0 flex-shrink-0 basis-[45%] h-24 rounded-xl"
                          }
                          style={{
                            backgroundImage:
                              current.page === i && current.anime === j
                                ? `url('${image}')`
                                : `var(--glass), url('${image}')`,
                            backgroundPosition: "center",
                            borderColor: "white",
                            borderWidth:
                              current.page === i && current.anime === j
                                ? "2px"
                                : "0",
                          }}
                          onClick={() => changeCurrent({ anime: j, page: i })}
                          key={anime.mal_id}
                        ></div>
                      );
                    })}
                  </React.Fragment>
                ))}
            </div>
          </div>
          {/* Infinite scroll */}
          <div className="w-full h-[1px] flex-grow overflow-scroll relative z-50 flex flex-wrap justify-center my-4 gap-6">
            {ptr &&
              ptr.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.map((anime: Anime, j: number) => {
                    const image = anime.images.webp.image_url;

                    return (
                      <div
                        className="relative w-[150px] h-[200px]"
                        style={{
                          backgroundImage:
                            current.page === i && current.anime === j
                              ? `url('${image}')`
                              : `var(--glass), url('${image}')`,
                          backgroundPosition: "center",
                          borderColor: "white",
                          borderWidth:
                            current.page === i && current.anime === j
                              ? "2px"
                              : "0",
                        }}
                        onClick={() => changeCurrent({ anime: j, page: i })}
                        key={anime.mal_id}
                      >
                        <SignedIn>
                          <Star
                            isFavorite={favorites?.pages[0].data.some(
                              (fav: Anime) => fav.mal_id === anime.mal_id,
                            )}
                            anime={anime}
                            onClick={mutation.mutate}
                          />
                        </SignedIn>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            {hasNextPage && <Loader />}
          </div>
        </div>
      </div>
    </section>
  );
}
