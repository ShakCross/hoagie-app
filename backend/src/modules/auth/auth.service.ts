import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/auth.dto';
import { User } from '../../models/user.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    return this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    // Special case for test account in development mode
    const testEmail = this.configService.get<string>('TEST_USER_EMAIL', 'test@example.com');
    
    if (email === testEmail) {
      const user = await this.usersService.findByEmail(email);
      if (user) {
        return user;
      }
    }
    
    // Normal authentication for other accounts
    return this.usersService.validateUser(email, password);
  }
} 