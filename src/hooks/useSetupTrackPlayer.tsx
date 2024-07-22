import { useEffect, useRef } from 'react';
import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player';

const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      // maxCacheSize: 1024 * 10 could explore lower cache sizes if buffering is an issue
    });

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });

    // await TrackPlayer.setVolume(0.3) // adjust volume if needed ( 0 - 1 )
    await TrackPlayer.setRepeatMode(RepeatMode.Queue); // don't repeat any tracks
  } catch (error) {
    console.error('Error during TrackPlayer setup:', error);
    throw error; // Re-throw the error to be caught in the useEffect
  }
};

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    setupPlayer()
      .then(() => {
        isInitialized.current = true;
        onLoad?.();
      })
      .catch((error) => {
        isInitialized.current = false;
        console.error('Error in useSetupTrackPlayer:', error);
      });
  }, [onLoad]);
};
