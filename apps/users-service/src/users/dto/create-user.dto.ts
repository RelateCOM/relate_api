import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Always string!' })
  @IsNotEmpty()
  readonly username: string;

  @IsString({ message: 'Always string!' })
  @IsEmail({}, { message: 'Incorrect email address' })
  readonly email: string;

  @IsString({ message: 'Always string!' })
  @Length(4, 30, { message: 'Count of symbols in the password min 4, max 30' })
  readonly password: string;
}
