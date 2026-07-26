import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

const trimQueryValue = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class StudentsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trimQueryValue)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trimQueryValue)
  department?: string;
}
