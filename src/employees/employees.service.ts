import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        joiningDate: new Date(createEmployeeDto.joiningDate),
      },
    });
  }
  async findAll() {
    return await this.prisma.employee.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return await this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.employee.delete({
      where: { id },
    });
  }
}
