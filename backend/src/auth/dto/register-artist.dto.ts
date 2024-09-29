import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterArtistDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  bio: string;
}
