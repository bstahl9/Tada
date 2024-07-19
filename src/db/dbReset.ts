// dbReset.ts -> reset the database
import { open } from '@op-engineering/op-sqlite';
import Sequence from '../constants/types';
import RNFS from 'react-native-fs';
import { initializeDatabase } from './initDB';

/**
 * reset/format the database. deletes all data
 * @param sequence given sequence 
 */
export const resetDB = async () => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          });
          
        await db.executeAsync(`DELETE FROM sequence_tracks;`);
        await db.executeAsync(`DELETE FROM sequences;`);
        await db.executeAsync(`DELETE FROM tracks;`);
        
        console.log('Database has been reset');
        await initializeDatabase();

    } catch (error) {
        console.error('Failed to reset the database', error);
        throw error;
    }
};