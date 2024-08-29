"use client";

import React, { useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useAnimeStore } from "@/providers/store.provider";
import { consumet } from "@/services/consumet.service";
import { favoritesQuery } from "@/services/favorites.service";
import { animesQuery } from "@/services/jikan.service";
import { videoOpts } from "@/services/video.service";
import { relationOpts } from "@/services/related.service";
import { favoriteEpisodesQuery } from "@/services/favoriteEpisodes.service";
import Selector from "@/components/Selector";
import BorderedContainer from "@/components/BorderedContainer";
import Video from "./components/Video";
import Slider, { handleToggleSlider } from "@/components/Slider";
import RoundedButton from "@/components/RoundedButton";
import Thumbs from "@/components/Thumbs/Thumbs";
import Thumb from "@/components/Thumbs/components/Thumb";
import InfiniteContainer from "@/components/InfiniteContainer";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";
import { useVideoURL } from "./hooks/useVideoURL";
import { useSetRelated } from "./hooks/useSetRelated";
import { useSetEpisodes } from "./hooks/useSetEpisodes";
import { useSetId } from "./hooks/useSetId";
import { useSetEpisode } from "./hooks/useSetEpisode";
import { SignedIn } from "@clerk/nextjs";
import Star from "@/app/components/Star";
import { getQueryClient } from "@/app/get-query-client";
import { add, remove } from "@/actions/favoriteEpisodes";
import { Episode } from "@/types/info.type";

const size = 28;
const serversOptions = ["gogocdn", "streamsb", "vidstreaming"];

export default function Page() {
  const SliderRef = useRef<HTMLDivElement>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const { queryKey, changeQuery, changeQueryKey, changeCurrent } =
    useAnimeStore((state) => state);

  const animes = useInfiniteQuery(animesQuery(queryKey));
  const favorites = useInfiniteQuery(favoritesQuery());
  const favoriteEpisodes = useInfiniteQuery(favoriteEpisodesQuery());
  const [isFavorites, setIsFavorites] = useState(false);

  const queryClient = getQueryClient();
  const mutationAdd = useMutation({
    mutationFn: (id: string) => add({ id }),
    onSuccess: (res) =>
      queryClient.setQueryData(["favorite episodes", ""], (data: any) => {
        data.pages[0].data.push(res);

        return { ...data };
      }),
  });
  const mutationRemove = useMutation({
    mutationFn: (id: string) => remove({ id }),
    onSuccess: (res) =>
      queryClient.setQueryData(["favorite episodes", ""], (data: any) => {
        data.pages[0].data = data.pages[0].data.filter(
          (data: { id: string }) => data.id !== res.id,
        );

        return { ...data };
      }),
  });

  const pages = useSetPages(animes, favorites);
  const anime = useSetAnime(pages, queryKey[1]);

  const title = anime?.title || "";
  const mal_id = anime?.mal_id.toString() || "";
  const image = anime?.images.webp.image_url || "";

  const relations = useQuery(relationOpts(mal_id));
  const related = useSetRelated(relations);
  const relatedOptions = [title];
  related?.forEach((obj) => {
    obj.entry.forEach((entry) => relatedOptions.push(entry.name));
  });
  relatedOptions.push("Favorites");

  const videos = useQuery(videoOpts(mal_id));
  const episodes = useSetEpisodes(videos);

  const search = useQuery(consumet(["search", title], title));
  const animeId = useSetId(search, title);

  const info = useQuery(consumet(["info", animeId]));
  const [currentEp, setCurrentEp] = useState(0);
  const episode = useSetEpisode(info, currentEp);

  const [server, setServer] = useState(serversOptions[0]);
  const episodesId = useQuery(consumet(["episodes", episode], server));
  const URL = useVideoURL(episodesId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLSpanElement;
    const opt = target.textContent!.toLowerCase();

    setServer(opt);
  };

  const handleClickChangeEpisode = (index: number) => {
    setCurrentEp(index);
  };

  const handleClickSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const value = target.textContent;

    if (value && value !== "Favorites" && value !== title) {
      setIsFavorites(false);
      changeQueryKey(["anime", value]);
      changeQuery(value);
      changeCurrent({ anime: 0, page: 0 });
    } else if (value && value === "Favorites") {
      setIsFavorites(true);
    } else if (value && value === title) {
      setIsFavorites(false);
    }
  };

  const renderThumbs = (className: string) => {
    const isCurrent = (j: number) => {
      return currentEp === j;
    };

    const getBgImg = (j: number, image: string) => {
      const img = `url('${image}')`;
      const glassImg = `var(--glass), url('${image}')`;

      return isCurrent(j) ? img : glassImg;
    };

    const getBorderWidth = (j: number) => {
      return isCurrent(j) ? "2px" : "0";
    };

    const chooseAction = (action: string, id: string): void => {
      action === "add" ? mutationAdd.mutate(id) : mutationRemove.mutate(id);
    };

    return info?.data?.episodes
      ?.filter((episode: Episode) => {
        if (isFavorites) {
          return favoriteEpisodes?.data?.pages[0]?.data?.find(
            (data: { id: string }) => data.id === episode.id,
          );
        }

        return true;
      })
      .map((episode: Episode, i: number) => {
        const img = episodes[i]?.images.jpg.image_url || image;
        const bgImg = getBgImg(i, img);
        const borderWidth = getBorderWidth(i);

        return (
          <Thumb
            className={className}
            bgImg={bgImg}
            borderWidth={borderWidth}
            onClick={() => handleClickChangeEpisode(i)}
            key={episode.id}
          >
            <h3 className="w-full px-3 text-white text-2xl font-bold select-none">
              EPISODE
            </h3>
            <h3 className="text-white px-3 text-2xl font-bold">
              #{episode.number}
            </h3>
            <SignedIn>
              <Star
                isFavorite={favoriteEpisodes?.data?.pages[0]?.data?.some(
                  (data: { id: string }) => data.id === episode.id,
                )}
                mutate={(action: string) => chooseAction(action, episode.id)}
              />
            </SignedIn>
          </Thumb>
        );
      });
  };

  return (
    <>
      <BorderedContainer className="relative w-3/4 mx-auto mt-2">
        <Selector
          onClick={handleClick}
          options={serversOptions}
          type="button"
        />
      </BorderedContainer>

      <div className="my-video-container">
        {URL ? (
          <Video url={URL} episodes={episodesId} />
        ) : (
          <h2 className="my-loading-text">Loading...</h2>
        )}
      </div>

      <Slider ref={SliderRef}>
        <header className="flex justify-between px-2">
          <BorderedContainer className="relative w-3/4">
            {relatedOptions.length > 0 && (
              <Selector
                options={relatedOptions}
                type="marquee"
                onClick={handleClickSearch}
              />
            )}
          </BorderedContainer>
          <RoundedButton
            className="relative"
            onClick={(e) =>
              handleToggleSlider(e, isSliderOpen, setIsSliderOpen, SliderRef)
            }
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
        <Thumbs options={{ dragFree: true }}>
          {info && info.data ? (
            renderThumbs("my-thumb-slide")
          ) : (
            <h2 className="my-loading-text">Loading...</h2>
          )}
        </Thumbs>
        <InfiniteContainer>{renderThumbs("my-thumb-poster")}</InfiniteContainer>
      </Slider>

      {search.status === "success" && search.data.results.length === 0 && (
        <h2 className="text-2xl text-white text-center font-bold mt-12">
          There's no episodes for this anime
        </h2>
      )}
    </>
  );
}
