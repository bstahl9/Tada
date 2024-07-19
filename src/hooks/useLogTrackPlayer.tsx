import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';

const events = [Event.PlaybackState, Event.PlaybackError, Event.PlaybackActiveTrackChanged];

export const useLogTrackPlayerState = () => {
  useTrackPlayerEvents(events, async (event) => {
    if (event.type === Event.PlaybackError) {
      const state = await TrackPlayer.getState();
      const currentTrack = await TrackPlayer.getCurrentTrack();
      const trackObject = currentTrack !== null ? await TrackPlayer.getTrack(currentTrack) : null;

      console.warn('An error occurred: ', event);
      console.log('Current player state: ', state);
      if (trackObject) {
        console.log('Current track details: ', trackObject);
      }
    }

    if (event.type === Event.PlaybackState) {
      console.log('Playback state: ', event.state);
    }

    if (event.type === Event.PlaybackActiveTrackChanged) {
      console.log('Track changed, new track index: ', event.index);
      if (event.index !== undefined && event.index !== null) {
        const newTrack = await TrackPlayer.getTrack(event.index);
        if (newTrack) {
          console.log('New track details: ', newTrack);
        } else {
          console.warn('Failed to fetch new track details');
        }
      } else {
        console.warn('No valid track index available');
      }
    }
  });
};
