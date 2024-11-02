import { IsNumberString, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString({ message: 'Always string!' })
  readonly id: string;

  @IsString({ message: 'Always string!' })
  readonly property: string;

  @IsNumberString({}, { message: 'String or number!' })
  readonly value: string | number;
}
