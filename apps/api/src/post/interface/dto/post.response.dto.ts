import { UserResponseDTO } from '@/user/interface/dto/user.response.dto';

export type PostResponseDTO = {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: UserResponseDTO;
};

export type FeedResponseDTO = {
  items: PostResponseDTO[];
  nextCursor: string | null;
};
