// src/screens/LibraryScreen/SequenceScreen.tsx
import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { colours } from '../../../constants/colours';
import Sequence from '../../../constants/types';
import SequenceList from '../../../components/SequenceList';
import useLibraryStore from '../../../store/libraryStore';

const SequenceScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { sequences, isLoading, fetchSequences, deleteSequence } = useLibraryStore();

  useFocusEffect(
    React.useCallback(() => {
      fetchSequences();
    }, [fetchSequences])
  );

  const handleDelete = async (sequence: Sequence) => {
    await deleteSequence(sequence);
  };

  const handleRefresh = () => {
    fetchSequences();
  };

  const handleSequencePress = (sequence: Sequence) => {
    navigation.navigate('SequenceDetails', { id: sequence.id, name: sequence.name });
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? colours.dark.background : colours.light.background}
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
        <SequenceList
          sequences={sequences}
          deleteSequence={handleDelete}
          onPress={handleSequencePress}
        />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
  },
});

export default SequenceScreen;