import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hoagie, HoagieSchema } from '../../models/hoagie.model';
import { HoagiesController } from './hoagies.controller';
import { HoagiesService } from './hoagies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hoagie.name, schema: HoagieSchema }
    ])
  ],
  controllers: [HoagiesController],
  providers: [HoagiesService],
  exports: [HoagiesService],
})
export class HoagiesModule {} 