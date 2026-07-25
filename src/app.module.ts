import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { EmployeesModule } from './employees/employees.module';
import { MoviesModule } from './movies/movies.module';
import { NotesModule } from './notes/notes.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { StudentsModule } from './students/students.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [NotesModule, TodosModule, StudentsModule, EmployeesModule, BooksModule, MoviesModule, ProductsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
