import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  owner_id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_name: string;
}
