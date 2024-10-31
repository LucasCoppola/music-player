import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string | null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  artist: string | null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_name: string | null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  mimetype: string | null;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  large_image_size_in_kb: number | null;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  small_image_size_in_kb: number | null;
}
