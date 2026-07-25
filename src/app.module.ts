import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { TodosModule } from './todos/todos.module';
import { StudentsModule } from './students/students.module';
import { EmployeesModule } from './employees/employees.module';
import { BooksModule } from './books/books.module';
import { MoviesModule } from './movies/movies.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [NotesModule, TodosModule, StudentsModule, EmployeesModule, BooksModule, MoviesModule, ProductsModule, PrismaModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}