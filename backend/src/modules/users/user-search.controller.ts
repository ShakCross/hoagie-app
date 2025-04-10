import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user-search')
export class UserSearchController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async search(@Query('q') query: string) {
    if (!query || query.length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }
    
    try {
      const results = await this.usersService.searchByName(query);
      return results;
    } catch (error) {
      throw new BadRequestException('Failed to search users');
    }
  }

  @Get('test')
  async test() {
    return { message: 'User search API is working' };
  }
} 