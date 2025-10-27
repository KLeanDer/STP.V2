import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtWsGuard } from './jwt-ws.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, JwtAuthGuard, JwtWsGuard],
  exports: [JwtAuthGuard, JwtWsGuard], // чтобы использовать в других модулях
})
export class AuthModule {}
