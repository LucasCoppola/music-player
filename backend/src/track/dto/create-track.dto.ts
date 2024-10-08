import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  artist: string;

  @IsString()
  @IsNotEmpty()
  track_file_path: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;
}
