import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, PrismaService],
})
export class RecommendationsModule {}
