import { IsString, IsInt, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsString()
  director: string;

  @IsString()
  language: string;

  @IsInt()
  releaseYear: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;
}
