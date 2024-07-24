import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import LoaderKit from 'react-native-loader-kit';
import { Track, useActiveTrack, useIsPlaying } from 'react-native-track-player';
import { TrackMenu } from './TrackMenu';
import { StopPropagation } from './StopPropagation';
import Icon from 'react-native-vector-icons/Feather';

export type TrackListItemProps = {
  track: Track;
  handleTrackSelect: (track: Track) => Promise<void>;
  onUpdate: () => Promise<void>;
}

const TrackListItem: React.FC<TrackListItemProps> = ({ track, handleTrackSelect, onUpdate }) => {
  const { playing } = useIsPlaying();
  const isActiveTrack = useActiveTrack()?.url === track.url;

  return (
    <TouchableHighlight onPress={() => handleTrackSelect(track)} underlayColor={'grey'}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>{track.title}</Text>
            {track.artist && <Text numberOfLines={1} style={styles.length}>{track.artist}</Text>}
          </View>
          <StopPropagation>
            {isActiveTrack && (playing ? (
              <LoaderKit
                style={styles.playingIndicator}
                name="LineScaleParty"
                color={'black'}
              />
            ) : (
              <Icon name="play" size={24} color="black" style={styles.menuIcon} />
            ))}
            <TrackMenu
              track={track}
              onUpdate={onUpdate}
            >
              <Icon name="more-horizontal" size={18} color="black" style={styles.menuIcon} />
            </TrackMenu>
          </StopPropagation>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderColor: 'black',
    borderWidth: 0,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Ligconsolata',
    fontWeight: '600',
    color: 'black',
    maxWidth: '90%',
  },
  length: {
    fontSize: 14,
    color: 'black',
    marginTop: 4,
  },
  menuIcon: {
    marginRight: 10,
  },
  playingIndicator: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  pausedIndicator: {
    marginRight: 10,
  },
});

export default TrackListItem;
