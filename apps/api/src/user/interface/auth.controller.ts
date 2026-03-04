import { Body, Controller, Post } from '@nestjs/common';

// Use Cases
import { RegisterUseCase } from '@/user/application/usecase/register.usecase';
import { LoginUseCase } from '@/user/application/usecase/login.usecase';

// DTOs
import {
  UserRegisterBodyDTO,
  UserLoginBodyDTO,
  UserRegisterResponseDTO,
  UserLoginResponseDTO,
} from '@social/shared';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly register: RegisterUseCase,
    private readonly login: LoginUseCase,
  ) {}

  @Post('register')
  registerUser(
    @Body() dto: UserRegisterBodyDTO,
  ): Promise<UserRegisterResponseDTO> {
    const input = {
      email: dto.email,
      username: dto.username,
      password: dto.password,
      name: dto.name,
    };
    return this.register.execute(input);
  }

  @Post('login')
  loginUser(@Body() dto: UserLoginBodyDTO): Promise<UserLoginResponseDTO> {
    const input = {
      usernameOrEmail: dto.usernameOrEmail,
      password: dto.password,
    };
    return this.login.execute(input);
  }
}
