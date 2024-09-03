"use client";

import React, { ReactNode, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { useAnimeStore } from "@/providers/store.provider";
import BorderedContainer from "@/components/BorderedContainer";
import Selector from "@/components/Selector";
import { animesQuery } from "@/services/jikan.service";
import { favoritesQuery } from "@/services/favorites.service";
import { useSetPages } from "@/hooks/useSetPages";
import { useSetAnime } from "@/hooks/useSetAnime";
import { gelbooruOpts, gelbooruTagsOpts } from "./services/gelbooru";
import { relationOpts } from "@/services/related.service";
import { animeOpts } from "./services/jikan";
import { useSetPrequels } from "./hooks/useSetPrequels";
import { useSetPrequel } from "./hooks/useSetPrequel";
import { useWatchQueries } from "./hooks/useWatchQueries";
import { useSetTitle } from "./hooks/useSetTitle";
import { useSetTags } from "./hooks/useSetTags";
import { useRef, useState } from "react";
import Slider, { handleToggleSlider } from "@/components/Slider";
import RoundedButton from "@/components/RoundedButton";
import InfiniteContainer from "@/components/InfiniteContainer";
import { Post } from "@/types/gelbooru.type";
import Thumb from "@/components/Thumbs/components/Thumb";
import { SignedIn } from "@clerk/nextjs";
import Star from "../components/Star";
import useEmblaCarousel from "embla-carousel-react";
import { calculateAspectRatioFit } from "./utils/images";
import { LazyImg } from "./components/LazyImg";
import { favoriteImagesQuery } from "./services/favoritesImages";
import { getQueryClient } from "../get-query-client";
import { add, remove } from "@/actions/favoriteImages";
import { SliderHeader } from "@/components/Slider/SliderHeader";
import { Carousel } from "@/components/Carousel";
import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import Loader from "../components/Loader";

const replaces = [
  [" ", "_"],
  ["'", ""],
  ['"', ""],
  ["°", ""],
];

function Page() {
  const [emblaImageRef, emblaImageApi] = useEmblaCarousel({ loop: true });
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
  const [ids, content, adaptation, parentStory] = useSetPrequels(relations);
  const possibles = useQueries(animeOpts(ids));
  const allFinished = useWatchQueries(possibles, relations.isFetched, content);
  const prequel = useSetPrequel(allFinished, possibles);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const gelbooru = useInfiniteQuery(gelbooruOpts(title));
  const gelbooruTagsRes = useQuery(gelbooruTagsOpts(tag));
  const tags = useSetTags(gelbooruTagsRes);

  const hasNextPage = gelbooru.hasNextPage;

  const [isFiltering, setIsFiltering] = useState(true);

  const [possibilities, setPossibilities] = useState<string[]>([]);

  const [notFound, setNotFound] = useState(false);

  // Try to make a better algorithm.
  //
  // IDEA
  //
  // Become "possibles" an array of array, every inner array will contain all the different titles in order of possibilities.
  // Then we would need an useEffect to respond to possibilities.length because we would need to pop every inner array every time we
  // test all the array's titles. Also the useEffect need to respond to an index for the inner array current title that will be used by
  // a "setTag" to change the tag and try to fetch possibles tags, take in account that the useEffect needs to check every time it restart
  // that there is not a title with just one word, the only exception is the first time. Also every time it restart we need to check if
  // is neccessary to pop an inner array.
  // Then we would need another useEffect to respond to "gelbooruTagsRes" and check if we have results or not. If there is result we need
  // to filter the result by type, "type === 3" (It seems the 3 is for anime), and if after filter there are data, then sort by count,
  // "count !== 0", if so, then "setTitle", else, we need to change index and test next title.

  const isNumber = (c: string) => {
    switch (c) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        return true;
    }

    return false;
  };

  const processTitle = (title: string) => {
    replaces.forEach(
      (replace) => (title = title.replaceAll(replace[0], replace[1])),
    );

    const score = title.indexOf("-");
    if (score && score > 0 && isNumber(title[score - 1])) {
      title = title.slice(0, score) + "_" + title.slice(score + 1);
    }

    return title.toLowerCase();
  };

  const slicedTitle = (title: string) => {
    const colon = title.lastIndexOf(":");
    const question = title.lastIndexOf("?");
    const underscore = title.lastIndexOf("_");
    const score = title.lastIndexOf("-");
    const number = /\d/.test(title);

    if (
      (colon === question && colon === underscore && colon === score) ||
      (underscore && number && title.split("_").length === 2)
    ) {
      return title;
    }

    if (
      (underscore > colon && underscore > question && underscore > score) ||
      (colon === question && colon === score)
    ) {
      title = title.slice(0, underscore);
    } else if (colon > question && colon > score) {
      title = title.slice(0, colon);
    } else if (question > colon && question > score) {
      title = title.slice(0, question);
    } else if (score > question && score > colon) {
      title = title.slice(0, score);
    }

    if (title[title.length - 1] === ":" || title[title.length - 1] === "?") {
      title = title.slice(0, -1);
    }

    return title;
  };

  useEffect(() => {
    let possibilities = [];

    if (prequel === undefined) {
      return;
    } else if (prequel === null) {
      if (anime!.title) {
        possibilities.push(anime!.title);
      }
      if (anime!.title_english) {
        possibilities.push(anime!.title_english);
      }
      if (anime!.title_synonyms.length > 0) {
        possibilities.push(
          ...anime!.title_synonyms.filter((synonym) => synonym.includes(" ")),
        );
      }
    } else {
      if (prequel.title) {
        possibilities.push(prequel.title);
      }
      if (prequel.title_english) {
        possibilities.push(prequel.title_english);
      }
      if (prequel.title_synonyms.length > 0) {
        possibilities.push(
          ...prequel.title_synonyms.filter((synonym) => synonym.includes(" ")),
        );
      }
    }

    if (parentStory) {
      possibilities = [parentStory];
    }

    if (adaptation) {
      if (!parentStory || !adaptation.includes(" "))
        possibilities = [adaptation];
    }

    possibilities.forEach(
      (possibility, i, arr) => (arr[i] = processTitle(possibility)),
    );
    setPossibilities(possibilities);
  }, [prequel]);

  const index = useRef(0);
  const lapses = useRef(0);
  const usingSynonyms = useRef(false);

  useEffect(() => {
    if (possibilities.length > 0 && !title) {
      if (
        gelbooruTagsRes.isSuccess &&
        gelbooruTagsRes.data["@attributes"].count !== 0
      ) {
        const filtered = gelbooruTagsRes.data.tag.filter(
          (tag) => tag.type === 3,
        );

        if (filtered.length === 0) {
          if (anime!.title_synonyms.length > 0 && !usingSynonyms) {
            usingSynonyms.current = true;
            setPossibilities(
              anime!.title_synonyms.map((title) => processTitle(title)),
            );
            setTag("");
            gelbooruTagsRes.data["@attributes"].count = 0;
          } else {
            setPossibilities((old) => {
              const sliced = possibilities.map((title) => slicedTitle(title));
              if (old.every((title, i) => title === sliced[i])) {
                setNotFound(true);
              } else {
                setTag("");
                return sliced;
              }

              return old;
            });
          }
        } else {
          usingSynonyms.current = false;
          filtered.sort((a, b) => b.count - a.count);
          setTitle(filtered[0].name);
          setNotFound(false);
        }

        index.current = 0;
        lapses.current = 0;
      } else if (tag === "" || !gelbooruTagsRes.isPending) {
        let possibility: string;
        if (lapses.current > 0) {
          possibility = possibilities[index.current] = slicedTitle(
            possibilities[index.current],
          );
        } else {
          if (possibilities[index.current].includes("я")) {
            possibility = "milgram";
          } else if (possibilities[index.current] === "monster") {
            possibility = "monster_(manga)";
          } else {
            possibility = possibilities[index.current];
          }
        }
        let length = 0;
        setTag((old) => {
          if (old === possibility) {
            if (prequel && !usingSynonyms.current) {
              const newTitles = prequel.title_synonyms.filter((title) =>
                title.includes(" "),
              );

              newTitles.forEach(
                (title, i, arr) => (arr[i] = processTitle(title)),
              );

              index.current = 0;
              lapses.current = 0;

              setPossibilities(newTitles);

              return newTitles[0];
            } else if (
              anime!.title_synonyms.length > 0 &&
              !usingSynonyms.current
            ) {
              setPossibilities(
                anime!.title_synonyms.map((title) => processTitle(title)),
              );
              length = anime!.title_synonyms.length;
            } else {
              setPossibilities((old) => {
                const sliced = possibilities.map((title) => slicedTitle(title));
                if (old.every((value, i) => value === sliced[i])) {
                  setNotFound(true);
                } else {
                  setTag("");
                  return sliced;
                }

                return old;
              });
            }
          }

          return possibility;
        });

        index.current++;

        if (index.current === (length > 0 ? length : possibilities.length)) {
          index.current = 0;
          lapses.current++;
          setPossibilities([...new Set(possibilities)]);
        }
      }
    }
  }, [possibilities, gelbooruTagsRes.status, tag]);

  useEffect(() => {
    if (
      !gelbooru.isSuccess &&
      gelbooruTagsRes.isSuccess &&
      gelbooruTagsRes.data &&
      gelbooruTagsRes.data.tag &&
      (gelbooruTagsRes.data.tag[0].count === 0 ||
        gelbooruTagsRes.data.tag[0].type !== 3) &&
      title
    ) {
      setPossibilities([slicedTitle(tag)]);
      setTag(slicedTitle(tag));
      index.current = 0;
      lapses.current = 0;
      gelbooruTagsRes.data["@attributes"].count = 0;
      setTitle("");
    }
  }, [title, gelbooru.status, gelbooruTagsRes.status]);

  useEffect(() => {
    if (!emblaImageApi) return;

    emblaImageApi.on("select", () => {
      const slide = emblaImageApi?.selectedScrollSnap();
      setCurrent({ page: Math.floor(slide / 100), image: slide });
      emblaApiThumbs!.scrollTo(slide);
    });
  }, [emblaImageApi]);

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

  const handleClickThumb = (i: number, j: number) => {
    setCurrent({ page: i, image: j });
    emblaImageApi?.scrollTo(i * 100 + j);
  };

  const handleClickFilter = () => {
    setIsFiltering(!isFiltering);
  };

  const renderImages = (): ReactNode => {
    return gelbooru?.data?.pages.map((page, i) => (
      <React.Fragment key={i}>
        {page?.post
          ?.filter((post) => {
            if (isFavorites) {
              return favoriteImages?.data?.pages[0]?.data?.find(
                (data: { id: number }) => data.id === post.id,
              );
            }

            return true;
          })
          .filter((post) => {
            if (isFiltering) {
              return post.rating !== "explicit" &&
                post.rating !== "questionable"
                ? true
                : false;
            }

            return true;
          })
          .map((post: Post): ReactNode => {
            const original = post.file_url;
            const image = post.sample_url || post.preview_url || post.file_url;

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
    ));
  };

  const renderThumbs = (className: string): ReactNode => {
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
        {page?.post
          ?.filter((post) => {
            if (isFavorites) {
              return favoriteImages?.data?.pages[0]?.data?.find(
                (data: { id: number }) => data.id === post.id,
              );
            }

            return true;
          })
          .filter((post) => {
            if (isFiltering) {
              return post.rating !== "explicit" &&
                post.rating !== "questionable"
                ? true
                : false;
            }

            return true;
          })
          .map((post: Post, j: number): ReactNode => {
            const image = post.sample_url || post.preview_url || post.file_url;
            const bgImg = getBgImg(i, j, image);
            const borderWidth = getBorderWidth(i, j);

            return (
              <Thumb
                className={className}
                bgImg={bgImg}
                borderWidth={borderWidth}
                onClick={() => handleClickThumb(i, j)}
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
      <div className="relative">
        <Carousel
          className="mt-4 w-full h-[45vh] overflow-hidden cursor-grab relative"
          ref={emblaImageRef}
        >
          {renderImages()}
        </Carousel>
        <RoundedButton
          className="absolute right-2 top-4 bg-white rounded-full text-center"
          onClick={handleClickFilter}
        >
          {isFiltering ? (
            <Icon src="/filter-active.svg" title="Filter" />
          ) : (
            <Icon src="/filter-inactive.svg" title="Filter" />
          )}
        </RoundedButton>
      </div>
      <Slider ref={SliderRef}>
        <SliderHeader className="flex justify-between px-2">
          <BorderedContainer className="relative w-3/4">
            <Selector onClick={handleClick} options={tags} type="marquee" />
          </BorderedContainer>

          <RoundedButton
            className="relative"
            onClick={(e) =>
              handleToggleSlider(e, isSliderOpen, setIsSliderOpen, SliderRef)
            }
          >
            <Icon src="/circle-chevron-up.svg" title="Open slider" />
          </RoundedButton>
        </SliderHeader>

        <Carousel className="my-embla-thumbs" ref={emblaThumbsRef}>
          {gelbooru.isSuccess ? (
            renderThumbs("my-thumb-slide")
          ) : notFound ? (
            <h2 className="my-loading-text">Not Found</h2>
          ) : (
            <Loading />
          )}
        </Carousel>
        <InfiniteContainer>
          {renderThumbs("my-thumb-poster")}
          {hasNextPage && <Loader requester="gallery" title={title} />}
        </InfiniteContainer>
      </Slider>
    </>
  );
}

export default Page;
