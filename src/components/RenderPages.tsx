import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { Fragment } from "react";
import Thumb from "./Thumbs/components/Thumb";
import { SignedIn } from "@clerk/nextjs";
import Star from "@/app/components/Star";
import { Post } from "@/types/gelbooru.type";

function loopPages<Type>(
  data: UseInfiniteQueryResult<InfiniteData<Type, unknown>, Error>,
  favorites: UseInfiniteQueryResult<InfiniteData<Type, unknown>, Error>,
  isFavorites: boolean,
  className: string,
  current: any,
  setCurrent: any,
  handleClickThumb: any,
  chooseAction: any,
): React.ReactNode[] {
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

  return (
    data?.data?.pages?.map((page, i: number) => {
      return (
        <Fragment key={i}>
          {page?.post
            ?.filter((post) => {
              if (isFavorites) {
                return favorites?.data?.pages[0]?.data?.find(
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
                  onClick={() => handleClickThumb(i, j)}
                  key={post.id}
                >
                  <SignedIn>
                    <Star
                      isFavorite={favorites?.data?.pages[0]?.data?.some(
                        (data: { id: number }) => data.id === post.id,
                      )}
                      mutate={(action: string) => chooseAction(action, post.id)}
                    />
                  </SignedIn>
                </Thumb>
              );
            })}
        </Fragment>
      );
    }) ?? [<h1>Hola</h1>]
  );
}

export { loopPages };
