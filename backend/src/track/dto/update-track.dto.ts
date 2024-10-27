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

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  size_in_kb: number | null;
}
