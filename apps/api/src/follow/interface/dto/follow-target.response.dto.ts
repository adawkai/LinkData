export type FollowTargetResponseDTO = {
  ok: true;
  status: 'FOLLOWING' | 'REQUESTED';
};

export type UnFollowTargetResponseDTO = {
  ok: true;
};

export type CancelFollowResponseDTO = {
  ok: true;
};

export type FollowTargetErrorResponseDTO = {
  error: {
    code: string;
    message: string;
  };
};

export type UnFollowTargetErrorResponseDTO = {
  error: {
    code: string;
    message: string;
  };
};

export type CancelFollowErrorResponseDTO = {
  error: {
    code: string;
    message: string;
  };
};
