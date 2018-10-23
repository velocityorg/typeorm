import * as TypeOrm from '../../../../src/';
import { Person } from './person';

@TypeOrm.Entity()
export class Note {
    @TypeOrm.PrimaryGeneratedColumn()
    public id: number;

    @TypeOrm.Column()
    public label: string;

    @TypeOrm.ManyToOne(type => Person, { lazy: true })
    public owner: Promise<Person> | Person;
}
