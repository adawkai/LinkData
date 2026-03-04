import { IsString } from "class-validator";

export class BlockTargetBodyDTO {
  @IsString()
  targetUserId!: string;
}

export class UnBlockTargetBodyDTO {
  @IsString()
  targetUserId!: string;
}
