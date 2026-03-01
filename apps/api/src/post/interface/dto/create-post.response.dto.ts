import { PostResponseDTO } from './post.response.dto';

export type CreatePostResponseDTO = {
  ok: boolean;
  post?: PostResponseDTO;
};

export type CreatePostErrorResponseDTO = {
  error: {
    code: string;
    message: string;
  };
};
