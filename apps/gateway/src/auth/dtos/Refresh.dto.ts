import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString({ message: 'Always string!' })
  readonly token: string;
}
