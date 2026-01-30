import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService, EmailLanguage } from '../common/email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const TOKEN_EXPIRY_HOURS = 1;
const MAX_RESET_REQUESTS_PER_HOUR = 3;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userService.create(email, passwordHash, name);

    // Generate JWT token
    const token = this.generateToken(user.id ?? '', user.email ?? '');

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // check if user exists
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash ?? '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id ?? '', user.email ?? '');

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '7d',
    });
  }

  async validateUser(userId: string) {
    return this.userService.findById(userId);
  }

  async requestPasswordReset(
    email: string,
    language: EmailLanguage = 'en',
  ): Promise<{ message: string }> {
    this.logger.log(`Password reset requested for email: ${email}`);
    
    // Always return success message to prevent email enumeration
    const successMessage = 'If an account exists with that email, you will receive a reset link shortly';

    try {
      const user = await this.userService.findByEmail(email);
      this.logger.log(`User found: ${user ? 'yes' : 'no'}`);

      if (!user || !user.id) {
        // User doesn't exist, but return success to prevent enumeration
        return { message: successMessage };
      }

      // Check rate limiting
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentRequests = await this.prisma.passwordReset.count({
        where: {
          userId: user.id,
          createdAt: { gte: oneHourAgo },
        },
      });

      if (recentRequests >= MAX_RESET_REQUESTS_PER_HOUR) {
        this.logger.warn(`Rate limit exceeded for password reset: ${email}`);
        return { message: successMessage };
      }

      // Generate secure token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

      // Set expiry to 1 hour from now
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Save token to database
      await this.prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: hashedToken,
          expiresAt,
        },
      });

      // Generate reset link
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
      const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

      // Send email
      await this.emailService.sendPasswordResetEmail({
        to: email,
        userName: user.name,
        resetLink,
        language,
      });

      this.logger.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      this.logger.error(`Error in password reset request: ${error}`);
      // Still return success to prevent enumeration
    }

    return { message: successMessage };
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const resetRecord = await this.prisma.passwordReset.findUnique({
        where: { token: hashedToken },
      });

      if (!resetRecord) {
        return { valid: false };
      }

      // Check if token is expired
      if (new Date() > resetRecord.expiresAt) {
        return { valid: false };
      }

      // Check if token was already used
      if (resetRecord.used) {
        return { valid: false };
      }

      return { valid: true };
    } catch (error) {
      this.logger.error(`Error verifying reset token: ${error}`);
      return { valid: false };
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const resetRecord = await this.prisma.passwordReset.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    // Check if token is expired
    if (new Date() > resetRecord.expiresAt) {
      throw new BadRequestException('Reset link has expired');
    }

    // Check if token was already used
    if (resetRecord.used) {
      throw new BadRequestException('Reset link has already been used');
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Mark token as used first to prevent race conditions
    await this.prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    // Update user password
    await this.prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newPasswordHash },
    });

    this.logger.log(`Password reset completed for user: ${resetRecord.user.email}`);

    return { message: 'Password has been reset successfully' };
  }

  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.passwordReset.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true },
        ],
      },
    });

    this.logger.log(`Cleaned up ${result.count} expired/used password reset tokens`);
    return result.count;
  }
}
