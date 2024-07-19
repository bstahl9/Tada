import TrackPlayer, { Event } from 'react-native-track-player';
import { VolumeManager } from 'react-native-volume-manager';

export const PlaybackService = async function() {
    // Setup TrackPlayer event listeners
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
        TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {
        TrackPlayer.stop();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
        TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
        TrackPlayer.skipToPrevious();
    });
};

export const initializeVolumeListener = () => {
    const volumeListener = VolumeManager.addVolumeListener(async (result) => {
        console.log('Current volume:', result.volume);

        const { volume: currentVolume } = await VolumeManager.getVolume();
        if (currentVolume > result.volume) {
            // Volume has increased
            await TrackPlayer.skipToNext();
            // Optionally pause playback after moving to the next track
            // await TrackPlayer.pause();
        }
    });

    // Clean up listener when no longer needed
    return () => volumeListener.remove();
}
