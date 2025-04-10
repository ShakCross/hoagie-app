import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('user-search')
export class UserSearchController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async search(@Query('q') query: string) {
    if (!query || query.length < 2) {
      throw new BadRequestException('Query must be at least 2 characters');
    }

    const results = await this.usersService.searchByName(query);
    
    return results;
  }

  // Test endpoint - returns mock user data for frontend development
  @Get('test')
  getMockResults() {
    return [
      { _id: 'user1', name: 'Test User', email: 'test@example.com' },
      { _id: 'user2', name: 'Andre User', email: 'andre@example.com' },
      { _id: 'user3', name: 'Alice Smith', email: 'alice@example.com' },
      { _id: 'user4', name: 'Bob Johnson', email: 'bob@example.com' },
    ];
  }
} 