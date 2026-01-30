import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl });

    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  get user() {
    return this.client.user;
  }

  get expense() {
    return this.client.expense;
  }

  get creditCard() {
    return this.client.creditCard;
  }

  get category() {
    return this.client.category;
  }

  get budget() {
    return this.client.budget;
  }

  get budgetItem() {
    return this.client.budgetItem;
  }

  get passwordReset() {
    return this.client.passwordReset;
  }
}
