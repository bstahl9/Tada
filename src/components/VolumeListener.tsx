import React, { useEffect } from 'react';
import { VolumeManager } from 'react-native-volume-manager';
import useLibraryStore from '../store/libraryStore';

const VolumeListener: React.FC = () => {
  const playNextTrack = useLibraryStore(state => state.playNextTrack);

  useEffect(() => {
    let lastVolume = 0;

    const volumeListener = VolumeManager.addVolumeListener(async (result) => {
      // Check if volume changed or if a button was pressed
      if (result.volume !== lastVolume || result.button) {
        lastVolume = result.volume;
        await playNextTrack();
      }
    });

    // Attempt to suppress the volume UI
    VolumeManager.showNativeVolumeUI({ enabled: false });

    return () => {
      volumeListener.remove();
      // Re-enable the volume UI when component unmounts
      VolumeManager.showNativeVolumeUI({ enabled: true });
    };
  }, [playNextTrack]);

  return null; // This component doesn't render anything
};

export default VolumeListener;