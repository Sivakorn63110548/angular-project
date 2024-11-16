import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  userService: any;
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: { username: string; password: string }) {
    return this.authService.login(loginData);
  }

  @Post('register')
  async register(@Body() user_detail: RegisterDto) {
    return this.authService.register(user_detail);
  }
  
  @Get('profile')
  async getProfile(@Req() request: Request) {
    const userId = request.query.userId;
    const profile = await this.authService.getProfile(userId);
    return profile;
  }
}


