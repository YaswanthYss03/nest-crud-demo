import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsInt()
  @Min(1)
  @Max(6)
  academicYear: number;

  @IsNumber()
  @Min(0.0)
  @Max(10.0)
  cgpa: number;
}

