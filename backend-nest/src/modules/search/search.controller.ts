import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q: string, @Query() filters: Record<string, string>) {
    return this.searchService.search(q, filters);
  }
}
