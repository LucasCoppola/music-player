import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  mimetype: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  size_in_kb: number;
}
