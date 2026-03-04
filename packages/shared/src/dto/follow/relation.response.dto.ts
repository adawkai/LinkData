import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsObject, ValidateNested } from "class-validator";
import { ErrorResponseDTO } from "../error.response.dto";

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

export class RelationErrorResponseDTO {
  @IsObject()
  @ValidateNested()
  @Type(() => ErrorResponseDTO)
  error!: ErrorResponseDTO;
}
