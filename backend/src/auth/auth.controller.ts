import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { EmailLanguage } from '../common/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @CurrentUser()
    user: User & { id: string; email: string; name: string | null },
  ) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    // Extract language from Accept-Language header (defaults to 'en')
    const language: EmailLanguage = acceptLanguage?.startsWith('es') ? 'es' : 'en';
    return this.authService.requestPasswordReset(forgotPasswordDto.email, language);
  }

  @Get('verify-reset-token/:token')
  async verifyResetToken(@Param('token') token: string) {
    return this.authService.verifyResetToken(token);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }
}
