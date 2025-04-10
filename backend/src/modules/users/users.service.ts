import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/user.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Create a test user if it doesn't exist
    await this.ensureTestUser();
  }

  private async ensureTestUser() {
    const testEmail = this.configService.get<string>('TEST_USER_EMAIL', 'test@example.com');
    const testPassword = this.configService.get<string>('TEST_USER_PASSWORD', 'test123');
    const testName = this.configService.get<string>('TEST_USER_NAME', 'Test User');

    // Check if test user already exists
    const existingUser = await this.userModel.findOne({ email: testEmail }).exec();
    
    if (!existingUser) {
      // Create the test user
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      const testUser = new this.userModel({
        name: testName,
        email: testEmail,
        password: hashedPassword
      });
      
      await testUser.save();
    } else {
      // Ensure the test user has the correct password
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await this.userModel.updateOne(
        { _id: existingUser._id }, 
        { $set: { password: hashedPassword } }
      );
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async searchByName(query: string): Promise<User[]> {
    try {
      const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };
      
      const safeQuery = escapeRegExp(query);
      const regex = new RegExp(safeQuery, 'i');
      
      const users = await this.userModel.find({ 
        name: regex 
      })
      .select('name email') // Only return necessary fields
      .limit(10) // Limit results for performance
      .exec();
      
      return users;
    } catch (error) {
      throw error;
    }
  }

  async create(userData: { name: string; email: string; password: string }): Promise<User> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    
    return newUser.save();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      // Explicitly include the password field for validation
      const user = await this.userModel.findOne({ email }).select('+password').exec();
      
      if (!user) {
        return null;
      }
      
      // Check if the password exists and matches
      if (user.password && await bcrypt.hash(password, 10) && await bcrypt.compare(password, user.password)) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
} 