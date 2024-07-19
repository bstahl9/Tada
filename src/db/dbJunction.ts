import { open } from '@op-engineering/op-sqlite';
import { Track } from 'react-native-track-player';
import Sequence from '../constants/types';
import RNFS from 'react-native-fs';

/**
 * adds a track to a sequence in the database.
 * @param sequence given sequence.
 * @param track given track.
 */
export const addSoundToSequence = async (sequence: Sequence, track: Track) => {
  try {
    const db = await open({ 
      name: 'sounds.db', 
      location: RNFS.DocumentDirectoryPath 
    });

    // get the current max track_order for the sequence
    const orderQuery = `
      SELECT MAX(track_order) as maxOrder
      FROM sequence_tracks
      WHERE sequence_id = ?;
    `;

    const { rows } = await db.executeAsync(orderQuery, [sequence.id]);
    const maxOrder = rows.length > 0 ? rows.item(0).maxOrder : 0;
    const trackOrder = maxOrder + 1;

    // insert the new track with the calculated track_order
    const insertQuery = `
      INSERT INTO sequence_tracks (sequence_id, track_id, track_order)
      VALUES (?, ?, ?);
    `;

    await db.executeAsync(insertQuery, [sequence.id, track.id, trackOrder]);

    console.log(`Added track ${track.title} to sequence ${sequence.name} with order ${trackOrder}`);

  } catch (error) {
    console.error('Failed to add track to the sequence in the database:', error);
    throw error;
  }
};

/**
 * fetch all tracks associated with a given sequence.
 * @param sequenceId ID of the sequence.
 * @returns array of tracks.
 */
export const getTracksFromSequenceId = async (sequenceId: string): Promise<Track[]> => {
  try {
    const db = await open({ 
      name: 'sounds.db', 
      location: RNFS.DocumentDirectoryPath 
    });

    // query to fetch tracks associated with the sequence, ordered by track_order
    const query = `
      SELECT t.id, t.url, t.title, t.artist 
      FROM tracks t
      INNER JOIN sequence_tracks st ON t.id = st.track_id
      WHERE st.sequence_id = ?
      ORDER BY st.track_order;
    `;

    const { rows } = await db.executeAsync(query, [sequenceId]);
    const tracks: Track[] = [];

    // map rows to Track objects
    for (let i = 0; i < rows.length; i++) {
      const track: Track = {
        id: rows.item(i).id,
        title: rows.item(i).title,
        url: rows.item(i).url,
        artist: rows.item(i).artist,
      };
      tracks.push(track);
    }

    console.log(`Fetched ${tracks.length} tracks for sequence ${sequenceId}`);
    
    return tracks;

  } catch (error) {
    console.error('Failed to fetch tracks for sequence:', error);
    throw error;
  }
};