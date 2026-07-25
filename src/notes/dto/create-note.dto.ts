import { IsString, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'


export class CreateNoteDto {

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    title:string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    description:string;
}
