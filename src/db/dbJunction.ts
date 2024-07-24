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

      // Get the current maximum order for the sequence
      const maxOrderQuery = `
          SELECT COALESCE(MAX(track_order), 0) as maxOrder
          FROM sequence_tracks
          WHERE sequence_id = ?;
      `;
      const { rows: maxOrderResult } = await db.executeAsync(maxOrderQuery, [sequence.id]);
      const newOrder = maxOrderResult.item(0).maxOrder + 1;

      // Insert the new track with the new order
      const insertQuery = `
          INSERT INTO sequence_tracks (sequence_id, track_id, track_order)
          VALUES (?, ?, ?);
      `;
      await db.executeAsync(insertQuery, [sequence.id, track.id, newOrder]);

      console.log(`Added track ${track.title} to sequence ${sequence.name} at order ${newOrder}`);
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

      // Query to fetch tracks associated with the sequence, ordered by the 'order' column
      const query = `
          SELECT t.id, t.url, t.title, t.artist, st.track_order
          FROM tracks t
          INNER JOIN sequence_tracks st ON t.id = st.track_id
          WHERE st.sequence_id = ?
          ORDER BY st.track_order;
      `;
      const { rows } = await db.executeAsync(query, [sequenceId]);

      const tracks: Track[] = [];
      for (let i = 0; i < rows.length; i++) {
          const track: Track = {
              id: rows.item(i).id,
              title: rows.item(i).title,
              url: rows.item(i).url,
              artist: rows.item(i).artist,
              order: rows.item(i).order, // You might want to add this to your Track type
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