import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';

@Injectable()
export class CreditCardsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCreditCardDto: CreateCreditCardDto) {
    return this.prisma.creditCard.create({
      data: {
        userId,
        name: createCreditCardDto.name,
        color: createCreditCardDto.color,
        textColor: createCreditCardDto.textColor || '#FFFFFF',
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.creditCard.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const creditCard = await this.prisma.creditCard.findUnique({
      where: { id },
    });

    if (!creditCard) {
      throw new NotFoundException(`Credit card with ID ${id} not found`);
    }

    if (creditCard.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this credit card',
      );
    }

    return creditCard;
  }

  async update(
    id: string,
    userId: string,
    updateCreditCardDto: UpdateCreditCardDto,
  ) {
    // Verify ownership
    await this.findOne(id, userId);

    return this.prisma.creditCard.update({
      where: { id },
      data: updateCreditCardDto,
    });
  }

  async remove(id: string, userId: string) {
    // Verify ownership
    await this.findOne(id, userId);

    return this.prisma.creditCard.delete({
      where: { id },
    });
  }
}
