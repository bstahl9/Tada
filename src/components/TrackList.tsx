import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Track } from 'react-native-track-player';
import TrackListItem from './LibraryTrackListItem';
import TrackPlayer from 'react-native-track-player';

interface TrackListProps {
  tracks: Track[];
  onUpdate: () => Promise<void>;
  playlistId: string;
}

const ListItemDivider = () => (
  <View style={styles.divider} />
);

const TrackList: React.FC<TrackListProps> = ({ tracks, onUpdate, playlistId }) => {
  const handleTrackSelect = async (selectedTrack: Track) => {
    try {
      await TrackPlayer.reset();

      await TrackPlayer.add(tracks);
      
      const selectedTrackIndex = tracks.findIndex(track => track.id === selectedTrack.id);
      if (selectedTrackIndex !== -1) {
        await TrackPlayer.skip(selectedTrackIndex);
      }

      await TrackPlayer.play();
    } catch (error) {
      console.error('Failed to select track:', error);
    }
  };

  return (
    <View style={styles.container}>
      {tracks.map((track, index) => (
        <React.Fragment key={track.id}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleTrackSelect(track)}>
            <TrackListItem track={track} handleTrackSelect={handleTrackSelect} onUpdate={onUpdate} />
          </TouchableOpacity>
          {index < tracks.length - 1 && <ListItemDivider />}
        </React.Fragment>
      ))}
      {onUpdate && (
        <TouchableOpacity activeOpacity={0.8} onPress={onUpdate}>
          <ListItemDivider />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    backgroundColor: 'grey',
    marginHorizontal: 0,
  },
});

export default TrackList;