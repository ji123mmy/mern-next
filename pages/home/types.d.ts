interface Comment {
  id: string;
  body: string;
  username: string;
  createdAt: string;
}

interface Like {
  id: string;
  username: string;
  createdAt: string;
}

export interface Post {
  id: string;
  body: string;
  username: string;
  createdAt: string;
  comments: [Comment];
  likes: [Like];
  likeCount: number;
  commentCount: number;
}
