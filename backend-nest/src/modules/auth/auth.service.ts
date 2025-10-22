import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

  async register(data: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, phone: data.phone },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });

    const token = jwt.sign({ userId: user.id }, this.JWT_SECRET, { expiresIn: '7d' });

    return { user, token };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new BadRequestException('Invalid credentials');

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new BadRequestException('Invalid credentials');

    const token = jwt.sign({ userId: user.id }, this.JWT_SECRET, { expiresIn: '7d' });

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }
}
