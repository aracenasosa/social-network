import apiClient from "@/lib/axios";
import { FeedResponse } from "@/types/post.types";

export const postService = {
  getFeed: async (limit: number = 10, cursor?: string) => {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("order", "desc");

    if (cursor) {
      params.append("cursor", cursor);
    }

    const { data } = await apiClient.get<FeedResponse>(
      `/posts/feed?${params.toString()}`,
    );
    return data;
  },
};
