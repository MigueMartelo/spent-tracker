import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        userId,
        name: createCategoryDto.name,
        color: createCategoryDto.color,
        textColor: createCategoryDto.textColor ?? '#FFFFFF',
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('You do not have access to this category');
    }

    return category;
  }

  async update(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    // Verify ownership
    await this.findOne(id, userId);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string, userId: string) {
    // Verify ownership
    await this.findOne(id, userId);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
