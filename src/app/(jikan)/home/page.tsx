"use client";

import React, { useState, useRef } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { SignedIn } from "@clerk/nextjs";
import { useAnimeStore } from "@/providers/store.provider";
import { getQueryClient } from "@/app/get-query-client";
import { add, remove } from "@/actions/favorites";
import { useSetPages } from "@/hooks/useSetPages";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import Selector from "@/components/Selector";
import Star from "../../components/Star";
import Loader from "../../components/Loader";
import QuickInfo from "../../components/QuickInfo";
import Slider, { handleToggleSlider } from "@/components/Slider";
import BorderedContainer from "@/components/BorderedContainer";
import Thumbs from "@/components/Thumbs/Thumbs";
import Thumb from "@/components/Thumbs/components/Thumb";
import InfiniteContainer from "@/components/InfiniteContainer";
import RoundedButton from "@/components/RoundedButton";
import { Anime, Pages } from "@/types/animes.type";

const size = 28;
const options = ["NOW", "UPCOMING", "TOP", "TOP AIRING", "ANIME", "FAVORITES"];

export default function Page() {
  const listRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { current, changeCurrent, queryKey } = useAnimeStore((state) => state);

  const animes = useInfiniteQuery(animesQuery(queryKey));
  const favorites = useInfiniteQuery(favoritesQuery());

  const queryClient = getQueryClient();
  const mutationAdd = useMutation({
    mutationFn: (anime: Anime) => add(anime),
    onSuccess: (res) =>
      queryClient.setQueryData(["favorites", ""], (data: Pages) => {
        data.pages[0].data.push(res);

        return { ...data };
      }),
  });
  const mutationRemove = useMutation({
    mutationFn: (anime: Anime) => remove(anime),
    onSuccess: (res) =>
      queryClient.setQueryData(["favorites", ""], (data: Pages) => {
        data.pages[0].data = data.pages[0].data.filter(
          (anime: Anime) => anime.mal_id !== res.mal_id,
        );

        return { ...data };
      }),
  });

  const hasNextPage = animes.hasNextPage;
  const pages = useSetPages(animes, favorites);

  const handleClickThumb = (page: number, anime: number): void => {
    changeCurrent({ anime, page });
  };

  const renderThumbs = (className: string): React.ReactNode => {
    const isCurrent = (i: number, j: number): boolean => {
      return current.page === i && current.anime === j;
    };

    const getBgImg = (i: number, j: number, image: string): string => {
      const img = `url('${image}')`;
      const glassImg = `var(--glass), url('${image}')`;

      return isCurrent(i, j) ? img : glassImg;
    };

    const getBorderWidth = (i: number, j: number): string => {
      return isCurrent(i, j) ? "2px" : "0";
    };

    const chooseAction = (action: string, anime: Anime): void => {
      action === "add"
        ? mutationAdd.mutate(anime)
        : mutationRemove.mutate(anime);
    };

    return (
      pages &&
      pages?.pages?.map((page, i) => (
        <React.Fragment key={i}>
          {page?.data?.map((anime: Anime, j: number): React.ReactNode => {
            const image = anime.images.webp.image_url;
            const bgImg = getBgImg(i, j, image);
            const borderWidth = getBorderWidth(i, j);

            return (
              <Thumb
                className={className}
                bgImg={bgImg}
                borderWidth={borderWidth}
                onClick={() => handleClickThumb(i, j)}
                key={anime.mal_id}
              >
                <SignedIn>
                  <Star
                    isFavorite={favorites?.data?.pages[0]?.data?.some(
                      (fav: Anime) => fav.mal_id === anime.mal_id,
                    )}
                    mutate={(action: string) => chooseAction(action, anime)}
                  />
                </SignedIn>
              </Thumb>
            );
          })}
        </React.Fragment>
      ))
    );
  };

  return (
    <>
      <QuickInfo />
      <Slider ref={listRef}>
        <header className="flex justify-between px-2">
          <BorderedContainer className="relative w-3/4">
            <Selector options={options} type="button" />
          </BorderedContainer>
          <RoundedButton
            className="relative"
            onClick={(e) => handleToggleSlider(e, isOpen, setIsOpen, listRef)}
          >
            <img
              src="/circle-chevron-up.svg"
              height={size}
              width={size}
              className="cursor-pointer"
              title="Open slider"
            />
          </RoundedButton>
        </header>
        <Thumbs options={{ dragFree: true, loop: true }}>
          {pages ? (
            renderThumbs("my-thumb-slide")
          ) : (
            <h2 className="my-loading-text">Loading...</h2>
          )}
        </Thumbs>
        <InfiniteContainer>
          {renderThumbs("my-thumb-poster")}
          {hasNextPage && <Loader />}
        </InfiniteContainer>
      </Slider>
    </>
  );
}
