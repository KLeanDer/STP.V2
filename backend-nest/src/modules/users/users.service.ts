import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  async createUser(data: { name: string; email: string; password: string; phone?: string }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // ⚠️ для MVP без bcrypt, потом обернём
        phone: data.phone ?? null,
      },
    });
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        about: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }
}
