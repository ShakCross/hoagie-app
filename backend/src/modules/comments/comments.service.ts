import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../models/comment.model';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { HoagiesService } from '../hoagies/hoagies.service';

interface PaginationOptions {
  page: number;
  limit: number;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly hoagiesService: HoagiesService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const newComment = new this.commentModel(createCommentDto);
    const savedComment = await newComment.save();
    
    // Increment the comment count on the hoagie
    await this.hoagiesService.incrementCommentCount(createCommentDto.hoagie);
    
    return savedComment;
  }

  async findAll(options: PaginationOptions): Promise<{ comments: Comment[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      this.commentModel.find()
        .populate('user', 'name email')
        .populate('hoagie', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.commentModel.countDocuments().exec(),
    ]);

    return {
      comments,
      total,
    };
  }

  async findByHoagie(hoagieId: string, options: PaginationOptions): Promise<{ comments: Comment[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      this.commentModel.find({ hoagie: hoagieId })
        .populate('user', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.commentModel.countDocuments({ hoagie: hoagieId }).exec(),
    ]);

    return {
      comments,
      total,
    };
  }

  async findOne(id: string): Promise<Comment> {
    return this.commentModel.findById(id)
      .populate('user', 'name email')
      .populate('hoagie', 'name')
      .exec();
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true })
      .populate('user', 'name email')
      .populate('hoagie', 'name')
      .exec();
  }

  async remove(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    
    if (comment) {
      // Decrement the comment count on the hoagie
      await this.hoagiesService.decrementCommentCount(comment.hoagie.toString());
      
      return this.commentModel.findByIdAndDelete(id).exec();
    }
    
    return null;
  }
} 