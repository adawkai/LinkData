import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

import { UserResponseDTO } from "./user.response.dto";

export class ListUserResponseDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserResponseDTO)
  items!: UserResponseDTO[];

  @IsString()
  nextCursor!: string | null;
}
