export type CreatePostResponseDTO = {
  ok: boolean;
};

export type CreatePostErrorResponseDTO = {
  error: {
    code: string;
    message: string;
  };
};
