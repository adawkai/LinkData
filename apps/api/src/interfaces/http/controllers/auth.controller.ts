import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../../../application/auth/dto/register.dto';
import { LoginDto } from '../../../application/auth/dto/login.dto';
import { RegisterUseCase } from 'src/application/auth/use-cases/register.usecase';
import { LoginUseCase } from 'src/application/auth/use-cases/login.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly register: RegisterUseCase,
    private readonly login: LoginUseCase,
  ) {}

  @Post('register')
  registerUser(@Body() dto: RegisterDto) {
    return this.register.execute(dto);
  }

  @Post('login')
  loginUser(@Body() dto: LoginDto) {
    return this.login.execute(dto);
  }
}
