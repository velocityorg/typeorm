import * as TypeOrm from '../../../../src/';
import { Note } from './note';

@TypeOrm.Entity()
export class Person {
    @TypeOrm.PrimaryGeneratedColumn()
    public id: number;

    @TypeOrm.Column()
    public name: string;

    @TypeOrm.OneToMany(type => Note, note => note.owner, { lazy: true })
    public notes: Promise<Note[]> | Note[];
}
