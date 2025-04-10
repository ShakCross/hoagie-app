import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  Query, 
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { HoagiesService } from './hoagies.service';
import { CreateHoagieDto, UpdateHoagieDto, AddCollaboratorDto } from './dto/hoagie.dto';
import { User, UserDocument } from '../../models/user.model';
import { Document } from 'mongoose';

interface ErrorWithMessage {
  message: string;
}

@Controller('hoagies')
export class HoagiesController {
  constructor(private readonly hoagiesService: HoagiesService) {}

  @Post()
  async create(@Body() createHoagieDto: CreateHoagieDto) {
    try {
      return await this.hoagiesService.create(createHoagieDto);
    } catch (error: unknown) {
      const err = error as ErrorWithMessage;
      throw new BadRequestException(err.message);
    }
  }

  @Get()
  async findAll(
    @Query('page') page = 1, 
    @Query('limit') limit = 10,
    @Query('creator') creator?: string
  ) {
    console.log('HoagiesController findAll - Request parameters:', {
      page,
      limit,
      creator,
      timestamp: new Date().toISOString()
    });
    
    return this.hoagiesService.findAll({
      page: +page,
      limit: +limit,
      creator
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const hoagie = await this.hoagiesService.findOne(id);
    if (!hoagie) {
      throw new NotFoundException(`Hoagie with ID ${id} not found`);
    }
    return hoagie;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHoagieDto: UpdateHoagieDto) {
    try {
      const hoagie = await this.hoagiesService.update(id, updateHoagieDto);
      if (!hoagie) {
        throw new NotFoundException(`Hoagie with ID ${id} not found`);
      }
      return hoagie;
    } catch (error: unknown) {
      const err = error as ErrorWithMessage;
      throw new BadRequestException(err.message);
    }
  }

  @Post(':id/collaborators')
  async addCollaborator(
    @Param('id') id: string, 
    @Body() addCollaboratorDto: AddCollaboratorDto,
    @Query('userId') requestUserId: string
  ) {
    try {
      // Check if requester is the creator of the hoagie
      const hoagie = await this.hoagiesService.findOne(id);
      if (!hoagie) {
        throw new NotFoundException(`Hoagie with ID ${id} not found`);
      }
      
      const creator = hoagie.creator as UserDocument;
      if (creator._id.toString() !== requestUserId) {
        throw new ForbiddenException(`Only the creator can add collaborators`);
      }
      
      return await this.hoagiesService.addCollaborator(id, addCollaboratorDto.userId);
    } catch (error: unknown) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      const err = error as ErrorWithMessage;
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id/collaborators/:userId')
  async removeCollaborator(
    @Param('id') id: string, 
    @Param('userId') collaboratorId: string,
    @Query('userId') requestUserId: string
  ) {
    try {
      // Check if requester is the creator of the hoagie
      const hoagie = await this.hoagiesService.findOne(id);
      if (!hoagie) {
        throw new NotFoundException(`Hoagie with ID ${id} not found`);
      }
      
      const creator = hoagie.creator as UserDocument;
      if (creator._id.toString() !== requestUserId) {
        throw new ForbiddenException(`Only the creator can remove collaborators`);
      }
      
      return await this.hoagiesService.removeCollaborator(id, collaboratorId);
    } catch (error: unknown) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      const err = error as ErrorWithMessage;
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const hoagie = await this.hoagiesService.remove(id);
    if (!hoagie) {
      throw new NotFoundException(`Hoagie with ID ${id} not found`);
    }
    return { message: 'Hoagie deleted successfully' };
  }
} 