import "reflect-metadata";

import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";

import {Person} from "./entity/person";
import {Note} from "./entity/note";

describe("github issues > #2965 Reuse preloaded lazy relations", () => {
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [ __dirname + "/entity/*{.js,.ts}" ],
        logging: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should resuse preloaded lazy relations", () => Promise.all(connections.map(async connection => {

        const repoPerson = connection.getRepository(Person);
        const repoNote = connection.getRepository(Note);

        const personA  = await repoPerson.create({ name: 'personA' });
        const personB    = await repoPerson.create({ name: 'personB' });

        await repoPerson.save([
            personA,
            personB,
        ])

        await repoNote.insert({ label: 'note1', owner: personA });
        await repoNote.insert({ label: 'note2', owner: personB });


        const originalLoad: (...args: any[]) => Promise<any[]> = connection.relationLoader.load;
        let loadCalledCounter = 0;
        connection.relationLoader.load = (...args: any[]): Promise<any[]> => {
            loadCalledCounter++;
            return originalLoad.call(connection.relationLoader, ...args);
        }

        {
            console.log('preload notes');
            const res = await repoPerson.find({ relations: [ 'notes' ] });
            console.log(res);
            const personANotes = await res[ 0 ].notes;
            console.log(personANotes);
            loadCalledCounter.should.be.equal(0);
            personANotes[0].label.should.be.equal('note1');
        }

        {
            console.log('lazy load notes');
            const res = await repoPerson.find();
            console.log(res);
            const personBNotes = await res[ 1 ].notes;
            console.log(personBNotes);
            loadCalledCounter.should.be.equal(1);
            personBNotes[0].label.should.be.equal('note2');
        }
    })));

});
