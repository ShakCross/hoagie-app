import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHoagieDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  ingredients: string[];

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  @IsNotEmpty()
  creator: string; // ID of the creator
}

export class UpdateHoagieDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsOptional()
  ingredients?: string[];

  @IsString()
  @IsOptional()
  picture?: string;

  @IsArray()
  @IsOptional()
  collaborators?: string[];
}

export class AddCollaboratorDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
} 