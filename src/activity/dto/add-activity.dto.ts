import { IsEmail, IsString, Length } from 'class-validator';

export class AddActiveDto {
  readonly userId!: string;
  readonly type!: string;
  readonly trackId?: string;
  readonly targetId?: string;
}