import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from '../../../../../src';
import { DriverData } from './driverData';

@Entity()
@TableInheritance({ column: { name: 'type', type: 'varchar' }})
export class Vehicle {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column(type => DriverData)
    public driverData = new DriverData();
}
