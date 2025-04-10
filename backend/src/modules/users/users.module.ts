import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.model';
import { UsersController } from './users.controller';
import { UserSearchController } from './user-search.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UsersController, UserSearchController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {} 