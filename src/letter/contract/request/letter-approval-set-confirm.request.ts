import { IsPositive } from 'class-validator';

export class LetterApprovalSetConfirmRequest {
  @IsPositive()
  departmentRoleId: number;
}
