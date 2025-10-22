import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';

@Module({
  controllers: [ViewsController],
  providers: [ViewsService, PrismaService],
  exports: [ViewsService],
})
export class ViewsModule {}
