import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(4, 32)
  username!: string;

  @IsString()
  @Length(8, 32, { message: "The password must be at least 8 characters long." })
  password!: string;

  @IsString()
  @Length(8, 32, { message: "The password confirm must be at least 8 characters long." })
  passwordConfirm!: string;

  @IsEmail()
  email!: string;

  @IsString()
  role!: string;
}