import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  image_name: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @IsNumber()
  @IsNotEmpty()
  size_in_kb: number;
}
