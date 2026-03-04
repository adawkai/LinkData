import { IsBoolean, IsEnum } from "class-validator";

export enum RelationStatus {
  NONE = "NONE",
  FOLLOWING = "FOLLOWING",
  REQUESTED = "REQUESTED",
}

export class RelationResponseDTO {
  @IsEnum(RelationStatus)
  followStatus!: RelationStatus;

  @IsBoolean()
  blocked!: boolean;
}
