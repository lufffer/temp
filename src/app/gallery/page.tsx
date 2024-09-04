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
import { isLetter, isNumber } from "./utils/strings";

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

  const [allPossibilities, setAllPossibilities] = useState<string[][]>([]);
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

  const [index, setIndex] = useState(0);
  const [lapses, setLapses] = useState(0);

  const memo = useRef<string[]>([]);

  useEffect(() => {
    if (anime) {
      memo.current = [];
    }
  }, [anime]);

  useEffect(() => {
    if (prequel !== undefined) {
      setNotFound(false);
      setIndex(0);
      setLapses(0);

      let candidates = [];

      if (parentStory) {
        candidates.push([parentStory]);
      }
      if (adaptation) {
        candidates.push([adaptation]);
      }
      if (prequel) {
        const aux = [];
        if (prequel!.title) {
          aux.push(prequel!.title);
        }
        if (prequel!.title_english) {
          aux.push(prequel!.title_english);
        }
        if (prequel!.title_synonyms.length > 0) {
          aux.push(...prequel!.title_synonyms.filter((t) => isLetter(t[0])));
        }
        candidates.push(aux);
      } else {
        const aux = [];
        if (anime!.title) {
          aux.push(anime!.title);
        }
        if (anime!.title_english) {
          aux.push(anime!.title_english);
        }
        if (anime!.title_synonyms.length > 0) {
          aux.push(...anime!.title_synonyms.filter((t) => isLetter(t[0])));
        }
        candidates.push(aux);
      }

      console.log(candidates);

      setAllPossibilities(candidates);
    }
  }, [prequel]);

  useEffect(() => {
    if (allPossibilities.length > 0) {
      console.log(allPossibilities);
      setPossibilities(
        allPossibilities[0]
          .map((p) => processTitle(p))
          .filter((t) => !memo.current.includes(t)),
      );
      setIndex(0);
      setLapses(0);
    } else {
      setNotFound(true);
    }
  }, [allPossibilities]);

  useEffect(() => {
    let processed: string[] = [];
    if (index === 0 && lapses > 0) {
      if (possibilities.length > 0) {
        if (allPossibilities.length > 1) {
          processed = possibilities.filter((p) => p.split("_").length > 2);
          processed = processed.filter((p) => p.includes("_"));
        } else {
          processed = possibilities.filter((p) => p.includes("_"));
        }
        console.log(processed);
        if (processed.length > 0) {
          processed = [...new Set(processed)];
          processed = processed.map((p) => slicedTitle(p));
          processed = processed.filter((p) => !memo.current.includes(p));
          processed.length > 0
            ? setPossibilities(processed)
            : setAllPossibilities((old) => old.slice(1));
        } else {
          setAllPossibilities((old) => old.slice(1));
        }
      }
    }
  }, [lapses]);

  useEffect(() => {
    if (possibilities.length > 0) {
      if (possibilities[index] === "monster") {
        setTag("monster_(manga)");
      } else if (possibilities[index].includes("ᴙ")) {
        setTag("milgram");
      } else {
        setTag(possibilities[index]);
      }
      memo.current.push(possibilities[index]);
    }
  }, [index, possibilities]);

  useEffect(() => {
    if (gelbooruTagsRes.isSuccess) {
      if (gelbooruTagsRes.data["@attributes"].count !== 0) {
        const filtered = gelbooruTagsRes.data.tag.filter((t) => t.type === 3);
        console.log(filtered);
        if (filtered.length === 0) {
          setIndex((old) => {
            let aux = old + 1;
            if (aux === possibilities.length) {
              aux = 0;
              setLapses(lapses + 1);
            }

            return aux;
          });
        } else {
          filtered.sort((a, b) => b.count - a.count);
          console.log(filtered);
          setTitle(filtered[0].name);
        }
      } else {
        setIndex((old) => {
          let aux = old + 1;
          console.log(possibilities);
          console.log(possibilities.length);
          console.log(aux);
          if (aux === possibilities.length) {
            aux = 0;
            setLapses((old) => old + 1);
          }

          return aux;
        });
      }
    }
  }, [gelbooruTagsRes.status]);

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
      <Slider opts={tags} type="marquee">
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
