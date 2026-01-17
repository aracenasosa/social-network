export interface PostAuthor {
  _id: string;
  userName: string;
  fullName: string;
  avatarUrl: string;
}

export interface PostMedia {
  type: "image" | "video";
  url: string;
}

export interface Post {
  _id: string;
  text: string;
  author: PostAuthor;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  media: PostMedia[];
}

export interface FeedResponse {
  items: Post[];
  nextCursor?: string;
}
