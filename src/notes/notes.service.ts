import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

import { Note } from './entities/note.entity'


@Injectable()
export class NotesService {
  
  private notes : Note[] = [];
  private nextId = 1;

 //This action adds a new note
  create(createNoteDto: CreateNoteDto) {
    const note: Note = {
      id:this.nextId++,
      ...createNoteDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notes.push(note);

    // console.log(this.notes);
    return note;
  }


  //Used to get all the notes
  findAll() {
    return this.notes;
  }


  //Used to Find the exact Note using the id
  findOne(id: number) {
    const note = this.notes.find(note => note.id === id);
    if(!note){
      throw new NotFoundException(`Note with id ${id} not found`)
    }
    return note
  }


  //Used to Update the notes using their id
  update(id: number, updateNoteDto: UpdateNoteDto) {
    const note = this.findOne(id);

    Object.assign(note, updateNoteDto)

    note.updatedAt = new Date();

    return note;
  }


  //Used to Delete the notes Using their id
  remove(id: number) {
    const index = this.notes.findIndex(note => note.id === id);

    if(index === -1){
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    const deleteNote = this.notes[index];
    this.notes.splice(index,1);

    return {
      message: 'Note deleted successfully',
      deleteNote,
    };
  }
}
