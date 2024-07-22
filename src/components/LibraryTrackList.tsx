import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Track } from 'react-native-track-player';
import TrackListItem from './LibraryTrackListItem';
import TrackPlayer from 'react-native-track-player';

interface LibraryTrackListProps {
  tracks: Track[];
  queueId: string;
  onUpdate?: () => Promise<void>;
}

const ListItemDivider = () => (
  <View style={styles.divider} />
);

const LibraryTrackList: React.FC<LibraryTrackListProps> = ({ tracks, onUpdate }) => {
  const handleTrackSelect = async (selectedTrack: Track) => {
    await TrackPlayer.pause();
    await TrackPlayer.reset();
    await TrackPlayer.add(selectedTrack);
    await TrackPlayer.play();
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

export default LibraryTrackList;
