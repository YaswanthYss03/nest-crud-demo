import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MoviesService', () => {
  let service: MoviesService;
  const mockPrisma = {
    movie: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a movie', async () => {
    const dto = { title: 'Inception', genre: 'Sci-Fi', director: 'Nolan', language: 'English', releaseYear: 2010, rating: 9 };
    mockPrisma.movie.create.mockResolvedValue(dto);
    expect(await service.create(dto)).toEqual(dto);
  });
});