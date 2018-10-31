import 'reflect-metadata';
import { Connection } from '../../../../src';
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from '../../../utils/test-utils';
import { Car } from './entities/car';
import { Driver } from './entities/driver';
import { DriverData } from './entities/driverData';
import { Vehicle } from './entities/vehicle';
import {expect} from 'chai';


describe("embedded > embedded-with-lazy-relationships", () => {
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entities/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert, preload, lazy-load relationships", () => Promise.all(connections.map(async connection => {
        let driver: Driver;

        {
            // insert
            const em = connection.createEntityManager();
            driver = new Driver();
            driver.name = 'speedracer'
            driver = await em.save(driver);
            typeof expect(driver.id).to.be.greaterThan(0);
            expect(driver.name).to.be.equal('speedracer');

            let car = new Car();
            car.make = 'Pops Racer';
            car.model = 'Mach 5';
            car.year = 1993;
            car.driverData.driver = driver;

            car = await em.save(car);
            expect(car.driverData.driver).to.deep.equal(driver);
        }

        {
            // preload
            const car = await connection.getRepository(Vehicle).findOne({ relations: ['driverData.driver'] }) as Car;
            expect((car as any as DriverData).driver).to.be.undefined;
            expect(car.driverData.driver).to.be.instanceof(Promise);
            expect(await car.driverData.driver).to.deep.equal(driver);
        }

        {
            // lazy load
            const car = await connection.getRepository(Vehicle).findOne() as Car;
            expect((car as any as DriverData).driver).to.be.undefined;
            expect(car.driverData.driver).to.be.instanceof(Promise);
            expect(await car.driverData.driver).to.deep.equal(driver);
        }
    })));
});
