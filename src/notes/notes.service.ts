import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  // This action adds a new note
  async create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: createNoteDto,
    });
  }

  // Used to get all the notes
  async findAll() {
    return this.prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Used to Find the exact Note using the id
  async findOne(id: number) {
    const note = await this.prisma.note.findUnique({
      where: { id },
    });
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return note;
  }

  // Used to Update the notes using their id
  async update(id: number, updateNoteDto: UpdateNoteDto) {
    // Check if the note exists first to throw NotFoundException if not found
    await this.findOne(id);

    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  // Used to Delete the notes Using their id
  async remove(id: number) {
    // Check if the note exists first to throw NotFoundException if not found
    const note = await this.findOne(id);

    const deletedNote = await this.prisma.note.delete({
      where: { id },
    });

    return {
      message: 'Note deleted successfully',
      deleteNote: deletedNote,
    };
  }
}

