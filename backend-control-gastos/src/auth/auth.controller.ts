import { Controller, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: any, @Req() req: Request) {
    console.log('LOGIN RECIBIDO');
    console.log(body);

    return this.authService.login(
      body.nombre,
      body.password,
      req.ip || '',
      req.headers['user-agent']?.toString() || '',
    );
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}