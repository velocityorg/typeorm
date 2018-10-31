import { ManyToOne } from '../../../../../src';
import { Driver } from './driver';

export class DriverData {
    @ManyToOne(type => Driver, driver => driver.vehicles, { lazy: true })
    public driver: Promise<Driver> | Driver;
}
