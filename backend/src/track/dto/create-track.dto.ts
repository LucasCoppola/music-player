import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  artist: string;

  @IsString()
  @IsNotEmpty()
  track_name: string;

  @IsString()
  @IsNotEmpty()
  audio_mimetype: string;

  @IsNotEmpty()
  @IsNumber()
  audio_size_in_kb: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_name: string | null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_mimetype: string | null;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  image_size_in_kb: number | null;
}
