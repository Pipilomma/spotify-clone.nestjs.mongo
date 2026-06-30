import { IsEmail, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';

export class LoginUserDto {
  id?: Types.ObjectId;

  @IsString({message: "The password must contain a-z, A-Z, or special characters"})  
  @Length(8, 32, { message: "The password must be at least 8 characters long" })
  password!: string;

  @IsEmail()
  email!: string;

  @IsString()
  role?: string;
}