// dbtrack.ts -> track database operations
import { open } from '@op-engineering/op-sqlite';
import { Track } from 'react-native-track-player'; 
import RNFS from 'react-native-fs';

/**
 * adds a given track to the database
 * @param track given track
 */
export const addTrackDb = async (track: Track) => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          }); 
  
      await db.executeAsync(`
        INSERT INTO tracks (id, url, title, artist)
        VALUES (?, ?, ?, ?);
      `, [
        track.id,
        track.url,
        track.title,
        track.artist
      ]);
  
      console.log('Added track to database:', track);
    } catch (error) {
      console.error('Failed to add', track, 'to the database:', error);
      throw error;
    }
  };

/**
 * deletes a given track from the databse, not the file system for now
 * @param track given track
 */
export const deleteTrackDb = async (track: Track) => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          }); 

        await db.executeAsync(`DELETE FROM tracks WHERE id = ?;`, [track.id]);
        await db.executeAsync('DELETE FROM sequence_tracks WHERE track_id = ?;', [track.id]);

        return true;
    } catch (error) {
        console.error('Failed to delete', track, 'from the database and file system:', error);
        throw error;
    }
};


/**
 * changes the title of the track. does not change the filename or the file itself/uri
 * @param track track to rename
 * @param newTitle new title for the track
 */
export const renameTrackDb = async (track: Track, newTitle: string): Promise<Track> => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          }); 

        await db.executeAsync(`UPDATE tracks SET title = ? WHERE id = ?;`, [newTitle, track.id]);

        const updatedTrack: Track = {
            ...track,
            title: newTitle,
        };

        console.log('Renamed track in database:', updatedTrack);
        return updatedTrack;
    } catch (error) {
        console.error('Failed to rename track in the database:', error);
        throw error;
    }
};


/**
 * returns an array of all track type objects in the database
 * @returns all tracks from the database
 */
export const getTracksDb = async (): Promise<Track[]> => {
    try {
        const db = await open({ 
            name: 'sounds.db', 
            location: RNFS.DocumentDirectoryPath 
          }); 
          
        let { rows } = await db.executeAsync('SELECT * FROM tracks;');

        const tracks: Track[] = rows._array.map((row: any) => ({
            id: row.id,
            url: row.url,
            title: row.title,
            artist: row.artist
        }));

        console.log('dbTrack.ts] tracks: ', tracks);

        return tracks;

    } catch (error) {
        console.error('Failed to fetch track Data: ', error);
        throw error;
    }
};
