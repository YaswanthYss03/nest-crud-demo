import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StudentsService', () => {
  let service: StudentsService;
  let createStudentMock: jest.Mock;

  beforeEach(async () => {
    createStudentMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: PrismaService,
          useValue: {
            student: {
              create: createStudentMock,
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects an empty update', async () => {
    await expect(service.update(1, {})).rejects.toThrow(
      'At least one field is required',
    );
  });

  it('maps a unique constraint error to conflict', async () => {
    createStudentMock.mockRejectedValue({ code: 'P2002' });

    await expect(
      service.create({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        department: 'Mathematics',
        academicYear: 2,
        cgpa: 9.5,
      }),
    ).rejects.toThrow('A student with this email already exists');
  });
});

