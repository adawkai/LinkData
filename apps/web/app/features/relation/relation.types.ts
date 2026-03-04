import type {
  AcceptFollowErrorResponseDTO,
  AcceptFollowResponseDTO,
  RejectFollowErrorResponseDTO,
  RejectFollowResponseDTO,
  BlockTargetErrorResponseDTO,
  BlockTargetResponseDTO,
  FollowTargetErrorResponseDTO,
  FollowTargetResponseDTO,
  UnBlockTargetErrorResponseDTO,
  UnBlockTargetResponseDTO,
  UnFollowTargetErrorResponseDTO,
  UnFollowTargetResponseDTO,
  RelationResponseDTO,
  RelationErrorResponseDTO,
} from "@social/shared";

export type FollowTargetResponse =
  | FollowTargetResponseDTO
  | FollowTargetErrorResponseDTO;

export type UnFollowTargetResponse =
  | UnFollowTargetResponseDTO
  | UnFollowTargetErrorResponseDTO;

export type BlockTargetResponse =
  | BlockTargetResponseDTO
  | BlockTargetErrorResponseDTO;

export type UnBlockTargetResponse =
  | UnBlockTargetResponseDTO
  | UnBlockTargetErrorResponseDTO;

export type AcceptFollowRequestResponse =
  | AcceptFollowResponseDTO
  | AcceptFollowErrorResponseDTO;

export type RejectFollowRequestResponse =
  | RejectFollowResponseDTO
  | RejectFollowErrorResponseDTO;

export type RelationResponse = RelationResponseDTO | RelationErrorResponseDTO;

export type FollowTargetError = FollowTargetErrorResponseDTO;
