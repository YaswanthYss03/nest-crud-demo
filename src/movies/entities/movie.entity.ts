export class Movie {
  id: number;
  title: string;
  genre: string;
  director: string;
  language: string;
  releaseYear: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}