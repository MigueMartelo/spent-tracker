import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Partial<User> | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        passwordHash: user.passwordHash,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  async findById(id: string): Promise<Partial<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to find user by id');
    }
  }

  async create(
    email: string,
    passwordHash: string,
    name?: string,
  ): Promise<Partial<User>> {
    try {
      const newUser = await this.prisma.user.create({
        data: { email, passwordHash, name },
      });

      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name ?? undefined,
      };
    } catch (error) {
      // Handle Prisma unique constraint violation (duplicate email)
      // Check if error has code property and it's P2002 (unique constraint violation)
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User with this email already exists');
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
