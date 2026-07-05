import { IsIn } from 'class-validator';
import type { Action } from '../types/action.type';

export class PlayActionDto {
  @IsIn(['ROCK', 'PAPER', 'SCISSORS'])
  action: Action;
}
