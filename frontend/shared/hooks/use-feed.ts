import { useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import { FeedResponse } from "@/shared/types/post.types";

export const useFeed = (limit: number = 10) => {
  return useInfiniteQuery<FeedResponse, Error>({
    queryKey: ["feed", limit],
    queryFn: ({ pageParam }) => postService.getFeed(limit, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
};

