"use client";

import React, { useCallback, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useAnimeStore } from "@/providers/store.provider";
import BorderedContainer from "@/components/BorderedContainer";
import Selector from "@/components/Selector";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";
import { gelbooruOpts, gelbooruTagsOpts } from "./services/gelbooru";
import { useSetRelated } from "../episodes/hooks/useSetRelated";
import { relationOpts } from "@/services/related.service";
import { animeOpts } from "./services/jikan";
import { useSetPrequels } from "./hooks/useSetPrequels";
import { useSetPrequel } from "./hooks/useSetPrequel";
import { Anime } from "@/types/animes.type";
import { useWatchQueries } from "./hooks/useWatchQueries";
import { useSetTitle } from "./hooks/useSetTitle";
import { useSetPosts } from "./hooks/useSetPosts";
import { useSetTags } from "./hooks/useSetTags";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Slider, { handleToggleSlider } from "@/components/Slider";
import RoundedButton from "@/components/RoundedButton";
import Thumbs from "@/components/Thumbs/Thumbs";
import InfiniteContainer from "@/components/InfiniteContainer";
import { Post } from "@/types/gelbooru.type";
import Thumb from "@/components/Thumbs/components/Thumb";
import { SignedIn } from "@clerk/nextjs";
import Star from "../components/Star";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { calculateAspectRatioFit, shimmer, toBase64 } from "./utils/images";
import { LazyImg } from "./components/LazyImg";
import { favoriteImagesQuery } from "./services/favoritesImages";
import { getQueryClient } from "../get-query-client";
import { add, remove } from "@/actions/favoriteImages";

const size = 28;

function Page() {
  const [emblaImageRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [emblaThumbsRef, emblaApiThumbs] = useEmblaCarousel({ dragFree: true });

  const SliderRef = useRef<HTMLDivElement>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const [current, setCurrent] = useState({ page: 0, image: 0 });

  const { queryKey } = useAnimeStore((state) => state);
  const animesRes = useInfiniteQuery(animesQuery(queryKey));
  const favoritesRes = useInfiniteQuery(favoritesQuery());

  const favoriteImages = useInfiniteQuery(favoriteImagesQuery());
  const [isFavorites, setIsFavorites] = useState(false);

  const queryClient = getQueryClient();
  const mutationAdd = useMutation({
    mutationFn: (id: number) => add({ id }),
    onSuccess: (res) =>
      queryClient.setQueryData(["favorite images", ""], (data: any) => {
        data.pages[0].data.push(res);

        return { ...data };
      }),
  });
  const mutationRemove = useMutation({
    mutationFn: (id: number) => remove({ id }),
    onSuccess: (res) =>
      queryClient.setQueryData(["favorite images", ""], (data: any) => {
        data.pages[0].data = data.pages[0].data.filter(
          (data: { id: number }) => data.id !== res.id,
        );

        return { ...data };
      }),
  });

  const ptr = useSetPages(animesRes, favoritesRes);
  const anime = useSetAnime(ptr);

  const mal_id = anime?.mal_id.toString() || "";

  const relations = useQuery(relationOpts(mal_id));
  const [ids, content, setContent] = useSetPrequels(relations);
  const possibles = useQueries(animeOpts(ids));
  const allFinished = useWatchQueries(possibles, relations.isFetched, content);
  const prequel = useSetPrequel(allFinished, possibles);
  const [title, setTitle] = useSetTitle(allFinished, prequel, anime);
  const gelbooru = useInfiniteQuery(gelbooruOpts(title));
  const gelbooruTagsRes = useQuery(gelbooruTagsOpts(title));
  const tags = useSetTags(gelbooruTagsRes);

  useEffect(() => {
    if (gelbooru.status === "success" && gelbooruTagsRes.status === "success") {
      console.log(anime);
      if (
        gelbooru.data.pages[0]["@attributes"].count === 0 &&
        content === "0"
      ) {
        if (title.split("_").length > 1) {
          setTitle(
            gelbooruTagsRes.data.tag
              ? gelbooruTagsRes.data.tag[0].name
              : title.slice(0, title.lastIndexOf("_")),
          );
        } else {
          let title = anime!.title_english;
          title = title?.replaceAll(" ", "_");
          title = title?.replaceAll('"', "");
          setTitle(() => title.toLowerCase());
        }
      } else if (
        gelbooru.data.pages[0]["@attributes"].count === 0 &&
        content === "1"
      ) {
        let title = prequel!.title_english;
        title = title?.replaceAll(" ", "_");
        title = title?.replaceAll('"', "");
        setTitle(() => title.toLowerCase());
      }
    }
  }, [gelbooru.status, gelbooruTagsRes.status, content]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", (a) => {
      const slide = emblaApi?.selectedScrollSnap();
      setCurrent({ page: Math.floor(slide / 100), image: slide });
      emblaApiThumbs!.scrollTo(slide);
    });
  }, [emblaApi]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const value = target.innerText;

    if (value !== "Favorites") {
      setTitle(value);
    }

    setIsFavorites(!isFavorites);
  };

  const chooseAction = (action: string, id: number): void => {
    action === "add" ? mutationAdd.mutate(id) : mutationRemove.mutate(id);
  };

  const renderImages = (): React.ReactNode => {
    return (
      gelbooru?.data?.pages?.length > 0 &&
      gelbooru?.data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page &&
            page.post &&
            page?.post
              .filter((post) => {
                if (isFavorites) {
                  return favoriteImages?.data?.pages[0]?.data?.find(
                    (data: { id: number }) => data.id === post.id,
                  );
                }

                return true;
              })
              .map((post: Post): React.ReactNode => {
                const original = post.file_url;
                const image =
                  post.sample_url || post.preview_url || post.file_url;

                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-center min-w-0 ms-4 me-4 flex-grow-0 flex-shrink-0 basis-full relative"
                  >
                    <LazyImg
                      w={
                        calculateAspectRatioFit(
                          post.width,
                          post.height,
                          window.innerWidth,
                          window.innerHeight * 0.45,
                        ).width
                      }
                      h={
                        calculateAspectRatioFit(
                          post.width,
                          post.height,
                          window.innerWidth,
                          window.innerHeight * 0.45,
                        ).height
                      }
                      alt={post.title}
                      url={image}
                      original={original}
                    ></LazyImg>
                  </div>
                );
              })}
        </React.Fragment>
      ))
    );
  };

  const handleClickThumb = (i: number, j: number, image: string) => {
    setCurrent({ page: i, image: j });
    emblaApi?.scrollTo(i * 100 + j);
  };

  const renderThumbs = (className: string): React.ReactNode => {
    const isCurrent = (i: number, j: number): boolean => {
      return current.page === i && current.image === j;
    };

    const getBgImg = (i: number, j: number, image: string): string => {
      const img = `url('${image}')`;
      const glassImg = `var(--glass), url('${image}')`;

      return isCurrent(i, j) ? img : glassImg;
    };

    const getBorderWidth = (i: number, j: number): string => {
      return isCurrent(i, j) ? "2px" : "0";
    };

    return gelbooru?.data?.pages.map((page, i) => (
      <React.Fragment key={i}>
        {page &&
          page.post &&
          page?.post
            .filter((post) => {
              if (isFavorites) {
                return favoriteImages?.data?.pages[0]?.data?.find(
                  (data: { id: number }) => data.id === post.id,
                );
              }

              return true;
            })
            .map((post: Post, j: number): React.ReactNode => {
              const image =
                post.sample_url || post.preview_url || post.file_url;
              const bgImg = getBgImg(i, j, image);
              const borderWidth = getBorderWidth(i, j);

              return (
                <Thumb
                  className={className}
                  bgImg={bgImg}
                  borderWidth={borderWidth}
                  onClick={() => handleClickThumb(i, j, image)}
                  key={post.id}
                >
                  <SignedIn>
                    <Star
                      isFavorite={favoriteImages?.data?.pages[0]?.data?.some(
                        (data: { id: number }) => data.id === post.id,
                      )}
                      mutate={(action: string) => chooseAction(action, post.id)}
                    />
                  </SignedIn>
                </Thumb>
              );
            })}
      </React.Fragment>
    ));
  };

  return (
    <>
      <nav
        className="mt-4 w-full h-[45vh] overflow-hidden cursor-grab"
        ref={emblaImageRef}
      >
        <div className="embla__container">{renderImages()}</div>
      </nav>
      <Slider ref={SliderRef}>
        <header className="flex justify-between px-2">
          <BorderedContainer className="relative w-3/4">
            <Selector onClick={handleClick} options={tags} type="marquee" />
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

        <nav className="embla my-embla-thumbs" ref={emblaThumbsRef}>
          <div className="embla__container">
            {gelbooru.isSuccess ? (
              renderThumbs("my-thumb-slide")
            ) : (
              <h2 className="my-loading-text">Loading...</h2>
            )}
          </div>
        </nav>
        <InfiniteContainer>{renderThumbs("my-thumb-poster")}</InfiniteContainer>
      </Slider>
    </>
  );
}

export default Page;
