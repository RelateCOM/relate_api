import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
