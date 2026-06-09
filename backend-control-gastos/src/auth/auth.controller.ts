import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(@Body() body: any) {

    return this.authService.login(
      body.nombre,
      body.password,
    );
  }

  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
  ) {

    return this.authService.register(
      registerDto,
    );
  }
}