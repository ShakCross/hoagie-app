import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  user: string; // ID of the user

  @IsString()
  @IsNotEmpty()
  hoagie: string; // ID of the hoagie
}

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  text?: string;
} 