import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hoagie, HoagieDocument } from '../../models/hoagie.model';
import { CreateHoagieDto, UpdateHoagieDto } from './dto/hoagie.dto';

interface PaginationOptions {
  page: number;
  limit: number;
  creator?: string;
}

@Injectable()
export class HoagiesService {
  constructor(
    @InjectModel(Hoagie.name) private hoagieModel: Model<HoagieDocument>,
  ) {}

  async create(createHoagieDto: CreateHoagieDto): Promise<Hoagie> {
    const newHoagie = new this.hoagieModel(createHoagieDto);
    return newHoagie.save();
  }

  async findAll(options: PaginationOptions): Promise<{ hoagies: Hoagie[]; total: number }> {
    const { page, limit, creator } = options;
    const skip = (page - 1) * limit;
    
    // Create filter object for MongoDB query
    let filter = {};
    if (creator) {
      try {
        filter = { creator: new Types.ObjectId(creator) };
      } catch (error) {
        console.error('Invalid ObjectId for creator:', creator, error);
        filter = { creator };
      }
    }
    
    const [hoagies, total] = await Promise.all([
      this.hoagieModel.find(filter)
        .populate('creator', 'name email')
        .populate('collaborators', 'name email')
        .select('name ingredients picture creator collaborators commentCount createdAt updatedAt')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.hoagieModel.countDocuments(filter).exec(),
    ]);

    return {
      hoagies,
      total,
    };
  }

  async findOne(id: string): Promise<Hoagie> {
    return this.hoagieModel.findById(id)
      .populate('creator', 'name email')
      .populate('collaborators', 'name email')
      .select('name ingredients picture creator collaborators commentCount createdAt updatedAt')
      .lean()
      .exec();
  }

  async update(id: string, updateHoagieDto: UpdateHoagieDto): Promise<Hoagie> {
    return this.hoagieModel.findByIdAndUpdate(id, updateHoagieDto, { new: true })
      .populate('creator', 'name email')
      .populate('collaborators', 'name email')
      .select('name ingredients picture creator collaborators commentCount createdAt updatedAt')
      .lean()
      .exec();
  }

  async remove(id: string): Promise<Hoagie> {
    return this.hoagieModel.findByIdAndDelete(id).exec();
  }

  async incrementCommentCount(hoagieId: string): Promise<void> {
    await this.hoagieModel.findByIdAndUpdate(hoagieId, { $inc: { commentCount: 1 } }).exec();
  }

  async decrementCommentCount(hoagieId: string): Promise<void> {
    await this.hoagieModel.findByIdAndUpdate(hoagieId, { $inc: { commentCount: -1 } }).exec();
  }

  async addCollaborator(hoagieId: string, userId: string): Promise<Hoagie> {
    // Convert string IDs to ObjectIds
    const objectIdHoagieId = new Types.ObjectId(hoagieId);
    const objectIdUserId = new Types.ObjectId(userId);

    // Add userId to collaborators array if not already there
    const updatedHoagie = await this.hoagieModel.findByIdAndUpdate(
      objectIdHoagieId,
      { $addToSet: { collaborators: objectIdUserId } },
      { new: true }
    )
    .populate('creator', 'name email')
    .populate('collaborators', 'name email')
    .select('name ingredients picture creator collaborators commentCount createdAt updatedAt')
    .lean()
    .exec();

    if (!updatedHoagie) {
      throw new Error(`Hoagie with ID ${hoagieId} not found`);
    }

    return updatedHoagie;
  }

  async removeCollaborator(hoagieId: string, userId: string): Promise<Hoagie> {
    // Convert string IDs to ObjectIds
    const objectIdHoagieId = new Types.ObjectId(hoagieId);
    const objectIdUserId = new Types.ObjectId(userId);

    // Remove userId from collaborators array
    const updatedHoagie = await this.hoagieModel.findByIdAndUpdate(
      objectIdHoagieId,
      { $pull: { collaborators: objectIdUserId } },
      { new: true }
    )
    .populate('creator', 'name email')
    .populate('collaborators', 'name email')
    .select('name ingredients picture creator collaborators commentCount createdAt updatedAt')
    .lean()
    .exec();

    if (!updatedHoagie) {
      throw new Error(`Hoagie with ID ${hoagieId} not found`);
    }

    return updatedHoagie;
  }
} 