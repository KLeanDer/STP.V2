import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') q = '',
    @Query('filters') filtersRaw?: string,
    @Query('sort') sortRaw?: string | string[],
    @Query('limit') limitRaw?: string,
    @Query('offset') offsetRaw?: string,
  ) {
    let filters: Record<string, unknown> | undefined;
    if (filtersRaw) {
      let parsedFilters: unknown;
      try {
        parsedFilters = JSON.parse(filtersRaw);
      } catch {
        throw new BadRequestException(
          'Invalid filters parameter. Expected JSON string.',
        );
      }

      if (
        parsedFilters &&
        typeof parsedFilters === 'object' &&
        !Array.isArray(parsedFilters)
      ) {
        filters = parsedFilters as Record<string, unknown>;
      } else {
        throw new BadRequestException(
          'Filters parameter must be a JSON object.',
        );
      }
    }

    let sort: string[] | undefined;
    if (Array.isArray(sortRaw)) {
      sort = sortRaw.filter(Boolean);
    } else if (sortRaw) {
      let parsedSort: unknown;
      try {
        parsedSort = JSON.parse(sortRaw);
      } catch {
        parsedSort = undefined;
      }

      if (Array.isArray(parsedSort)) {
        sort = parsedSort.filter(
          (value): value is string => typeof value === 'string',
        );
      } else {
        sort = sortRaw
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean);
      }
    }

    const limitNumber = limitRaw ? Number(limitRaw) : undefined;
    const offsetNumber = offsetRaw ? Number(offsetRaw) : undefined;

    return this.searchService.search(q, {
      filters,
      sort,
      limit:
        typeof limitNumber === 'number' && Number.isFinite(limitNumber)
          ? limitNumber
          : undefined,
      offset:
        typeof offsetNumber === 'number' && Number.isFinite(offsetNumber)
          ? offsetNumber
          : undefined,
    });
  }
}