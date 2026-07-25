import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTodoDto) {
    return this.prisma.todo.create({ data: dto });
  }

  findAll(priority?: string, completed?: string, sortBy?: string) {
    return this.prisma.todo.findMany({
      where: {
        ...(priority && { priority }),
        ...(completed !== undefined && { completed: completed === 'true' }),
      },
      orderBy: sortBy ? { [sortBy]: 'asc' } : undefined,
    });
  }

  async findOne(id: number) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  update(id: number, dto: UpdateTodoDto) {
    return this.prisma.todo.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.todo.delete({ where: { id } });
  }
}