import { create } from 'zustand';
import { Track } from 'react-native-track-player';
import Sequence from '../constants/types';
import { getSequences, deleteSequence } from '../db/dbSequence';
import { getTracksDb } from '../db/dbTrack';
import { getTracksFromSequenceId } from '../db/dbJunction';
import { addSequence as addSequenceToDb } from '../db/dbSequence';
import { addTrackDb } from '../db/dbTrack';
import { addSoundToSequence as addSoundToSequenceInDb } from '../db/dbJunction';
import { deleteTrackDb } from '../db/dbTrack';
import { renameTrackDb } from '../db/dbTrack';
import TrackPlayer from 'react-native-track-player';

interface LibraryState {
  sequences: Sequence[];
  tracks: Track[];
  sequenceTracks: { [sequenceId: string]: Track[] };
  isLoading: boolean;

  fetchSequences: () => Promise<void>;
  fetchTracks: () => Promise<void>;
  fetchTracksForSequence: (sequenceId: string) => Promise<void>;
  deleteSequence: (sequence: Sequence) => Promise<void>;
  addSequence: (sequence: Sequence) => Promise<void>;
  addTrack: (track: Track) => Promise<void>;
  deleteTrack: (track: Track) => Promise<void>;
  renameTrack: (track: Track, newTitle: string) => Promise<void>;
  addTrackToSequence: (track: Track, sequenceId: string) => Promise<void>;

  activeSequence: Sequence | null;
  activeSequenceTracks: Track[];
  setActiveSequence: (sequenceId: string) => Promise<void>;
  playNextTrack: () => Promise<void>;
}

const useLibraryStore = create<LibraryState>((set, get) => ({
  sequences: [],
  tracks: [],
  sequenceTracks: {},
  isLoading: false,

  activeSequence: null,
  activeSequenceTracks: [],

  fetchSequences: async () => {
    set({ isLoading: true });
    try {
      const sequences = await getSequences();
      set({ sequences, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch sequences:', error);
      set({ isLoading: false });
    }
  },
  fetchTracks: async () => {
    set({ isLoading: true });
    try {
      const tracks = await getTracksDb();
      set({ tracks, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
      set({ isLoading: false });
    }
  },
  fetchTracksForSequence: async (sequenceId: string) => {
    set({ isLoading: true });
    try {
      const tracks = await getTracksFromSequenceId(sequenceId);
      set(state => ({
        sequenceTracks: { ...state.sequenceTracks, [sequenceId]: tracks },
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to fetch tracks for sequence:', error);
      set({ isLoading: false });
    }
  },
  deleteSequence: async (sequence: Sequence) => {
    try {
      await deleteSequence(sequence);
      get().fetchSequences();
    } catch (error) {
      console.error('Failed to delete sequence:', error);
    }
  },
  addSequence: async (sequence: Sequence) => {
    try {
      await addSequenceToDb(sequence);
      get().fetchSequences();
    } catch (error) {
      console.error('Failed to add sequence:', error);
      throw error;
    }
  },

  addTrack: async (track: Track) => {
    try {
      await addTrackDb(track);
      get().fetchTracks();
    } catch (error) {
      console.error('Failed to add track:', error);
      throw error;
    }
  },
  deleteTrack: async (track: Track) => {
    try {
      await deleteTrackDb(track);
      get().fetchTracks();
    } catch (error) {
      console.error('Failed to delete track:', error);
      throw error;
    }
  },
  renameTrack: async (track: Track, newTitle: string) => {
    try {
      await renameTrackDb(track, newTitle);
      get().fetchTracks();
    } catch (error) {
      console.error('Failed to rename track:', error);
      throw error;
    }
  },
  addTrackToSequence: async (track: Track, sequenceId: string) => {
    try {
      const sequence = get().sequences.find(seq => seq.id === sequenceId);
      if (!sequence) {
        throw new Error('Sequence not found');
      }
      await addSoundToSequenceInDb(sequence, track);
      get().fetchTracksForSequence(sequenceId);
    } catch (error) {
      console.error('Failed to add track to sequence:', error);
      throw error;
    }
  },
  
  setActiveSequence: async (sequenceId: string) => {
    const sequences = get().sequences;
    const sequence = sequences.find(seq => seq.id === sequenceId) || null;
    const tracks = await getTracksFromSequenceId(sequenceId);
    set({ activeSequence: sequence, activeSequenceTracks: tracks });
  },
  playNextTrack: async () => {
    const { activeSequenceTracks } = get();
    if (activeSequenceTracks.length === 0) {
      console.log('No tracks in the active sequence');
      return;
    }

    const trackToPlay = activeSequenceTracks[0];
    const updatedTracks = [...activeSequenceTracks.slice(1), trackToPlay];

    await TrackPlayer.reset();
    await TrackPlayer.add(updatedTracks);

    await TrackPlayer.play();

    set({ activeSequenceTracks: updatedTracks });

    const duration = await TrackPlayer.getDuration();
    setTimeout(async () => {
      await TrackPlayer.pause();
    }, duration * 1000);
  },
}));

export default useLibraryStore;
