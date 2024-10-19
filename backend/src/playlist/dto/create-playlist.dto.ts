import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(['regular', 'favorite'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_name: string;
}
