import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { colours } from '../../../constants/colours';
import Header from '../../../components/Header';
import TrackList from '../../../components/TrackList';
import useLibraryStore from '../../../store/libraryStore';

const SequenceDetails = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const { id, name } = route.params;
  const { sequenceTracks, isLoading, fetchTracksForSequence, setActiveSequence, activeSequence } = useLibraryStore();

  React.useEffect(() => {
    fetchTracksForSequence(id);
  }, [id]);

  const handleRefresh = () => {
    fetchTracksForSequence(id);
  };

  const handleSetActiveSequence = async () => {
    try {
      await setActiveSequence(id);
      Alert.alert('Success', `${name} set as active sequence`);
    } catch (error) {
      console.error('Failed to set active sequence:', error);
      Alert.alert('Error', 'Failed to set active sequence. Please try again.');
    }
  };

  const tracks = sequenceTracks[id] || [];
  const styles = createStyles(theme);
  const isActive = activeSequence?.id === id;

  return (
    <View style={styles.container}>
      <Header 
        title={name}
        onButtonPress={handleSetActiveSequence}
        buttonIcon={isActive ? 'check-circle' : 'play-circle'}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            progressViewOffset={50}
          />
        }
      >
        <TrackList tracks={tracks} playlistId={id} onUpdate={() => fetchTracksForSequence(id)} />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
    },
  });

export default SequenceDetails;