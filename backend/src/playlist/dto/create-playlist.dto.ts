import { IsString, IsNotEmpty } from 'class-validator';

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
}
