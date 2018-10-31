import { ChildEntity, Column, } from '../../../../../src';
import { Vehicle } from './vehicle';

@ChildEntity()
export class Car extends Vehicle {
    @Column()
    public make: string;

    @Column()
    public model: string;

    @Column()
    public year: number;
}
