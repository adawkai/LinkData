import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

import { PostResponseDTO } from "./post.response.dto";

export class PostListResponseDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostResponseDTO)
  items!: PostResponseDTO[];

  @IsString()
  nextCursor!: string | null;
}
