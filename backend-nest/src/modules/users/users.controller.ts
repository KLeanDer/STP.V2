import { Controller, Get, Post, Put, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  async createUser(@Body() body: { name: string; email: string; password: string; phone?: string }) {
    return this.usersService.createUser(body);
  }

  // 👤 обновление профиля (только авторизованный пользователь)
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user.userId; // JwtStrategy возвращает { userId }
    return this.usersService.updateProfile(userId, dto);
  }
}
