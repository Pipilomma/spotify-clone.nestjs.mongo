import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(4, 32)
  username!: string;

  @IsEmail()
  email!: string;
}