import { open } from '@op-engineering/op-sqlite';
import RNFS from 'react-native-fs';

/**
 * initializes the op-sqlite database with necessary tables.
 */
export const initializeDatabase = async () => {
  try {
    const db = await open({ 
      name: 'sounds.db', 
      location: RNFS.DocumentDirectoryPath // next to the audio folder
    });

    console.log('Database path:', db.getDbPath());

    // ensure foreign key constraints are enabled in the db
    await db.executeAsync(`PRAGMA foreign_keys = ON;`);

    // create tracks table
    await db.executeAsync(`
      CREATE TABLE IF NOT EXISTS tracks (
        id TEXT PRIMARY KEY NOT NULL,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL
      );
    `);

    // create sequences table
    await db.executeAsync(`
      CREATE TABLE IF NOT EXISTS sequences (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        date_created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // create sequence_tracks junction table with an order column
    await db.executeAsync(`
      CREATE TABLE IF NOT EXISTS sequence_tracks (
        sequence_id TEXT NOT NULL,
        track_id TEXT NOT NULL,
        track_order INTEGER NOT NULL,
        PRIMARY KEY (sequence_id, track_id),
        FOREIGN KEY (sequence_id) REFERENCES sequences(id) ON DELETE CASCADE,
        FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
      );
    `);

    console.log('Database initialized successfully');

  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};