// dbSequence.ts -> Sequence database operations
import { open } from '@op-engineering/op-sqlite';
import Track from 'react-native-track-player'
import Sequence from '../constants/types';
import RNFS from 'react-native-fs';

/**
 * adds a new sequence to the database
 * @param sequence given sequence 
 */
export const addSequence = async (sequence: Sequence) => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          }); 

        await db.executeAsync(`INSERT INTO sequences (id, name, date_created) VALUES (?, ?, ?);`, [ sequence.id, sequence.name, sequence.dateCreated]);
        console.log('Added sequence to database:', sequence);

    } catch (error) {
        console.error('Failed to add', sequence, 'to the database:', error);
        throw error;
    }
};

/**
 * returns all sequences from the database
 * @returns an array of all Sequence type objects in the database 
 */
export const getSequences = async (): Promise<Sequence[]> => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          }); 
        let { rows } = await db.executeAsync('SELECT * FROM sequences;');

        const sequences: Sequence [] = rows._array.map((row: any) => ({
            id: row.id,
            name: row.name,
            dateCreated: row.date_created
        }));

        console.log('Fetched sequences from database:', sequences);

        return sequences;

    } catch (error) {
        console.error('Failed to fetch sequence data: ', error);
        throw error;
    }
};

/**
 * deletes a given sequence from the database
 * @param sequence given sequence to delete
 */
export const deleteSequence = async (sequence: Sequence) => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          }); 

        // delete from both tables
        await db.executeAsync(`DELETE FROM sequences WHERE id = ?;`, [ sequence.id ]);
        await db.executeAsync(`DELETE FROM sequence_tracks WHERE sequence_id = ?;`, [ sequence.id ]);

        console.log('Removed sequence and associated records from database:', sequence);

    } catch (error) {
        console.error('Failed to delete', sequence, 'from the database:', error);
        throw error;
    }
};

/**
 * renames a given sequence in the database
 * @param sequenceId ID of the sequence to rename
 * @param newName New name to assign to the sequence
 */
export const renameSequence = async (sequence: Sequence, newName: string) => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          }); 

        // Update the name of the sequence
        await db.executeAsync(`UPDATE sequences SET name = ? WHERE id = ?;`, [ newName, sequenceId ]);

        console.log(`Renamed sequence ${sequenceId} to ${newName}`);

    } catch (error) {
        console.error(`Failed to rename sequence ${sequenceId} in the database:`, error);
        throw error;
    }
};