import { IsString, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  department: string;

  @IsString()
  designation: string;

  @IsNumber()
  salary: number;

  @IsDateString()
  joiningDate: string;
}
