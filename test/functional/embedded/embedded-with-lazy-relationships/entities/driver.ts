import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from '../../../../../src';
import { Vehicle } from './vehicle';

@Entity()
export class Driver {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany(type => Vehicle, vehicle => vehicle.driverData.driver)
    public vehicles: Vehicle[];
}
