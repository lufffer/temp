import { useEffect, useState } from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { Post, Posts } from "@/types/gelbooru.type";

function useSetPosts(
  gelbooru: UseInfiniteQueryResult<InfiniteData<Posts, unknown>>,
): Post[] {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (gelbooru.status === "success") {
      setPosts(old => [...old, ]gelbooru.data?.pages[0].post || []);
    }
  }, [gelbooru.status]);

  return posts;
}

export { useSetPosts };
