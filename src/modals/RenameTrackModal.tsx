// src/components/RenameTrackModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Track } from 'react-native-track-player';
import useLibraryStore from '../store/libraryStore';
import { defaultStyles } from '../constants/styles';

type RenameTrackModalProps = {
  visible: boolean;
  onClose: () => void;
  track: Track;
};

export const RenameTrackModal = ({ visible, onClose, track }: RenameTrackModalProps) => {
  const [newTitle, setNewTitle] = useState("");
  const { renameTrack, fetchTracks } = useLibraryStore();

  const handleRenameTrack = async () => {
    if (!newTitle || !newTitle.trim()) {
      Alert.alert(
        'Invalid track title',
        'Please enter a valid track title.',
        [{ text: 'OK', onPress: () => console.log('Invalid track title') }]
      );
      return;
    }

    try {
      await renameTrack(track, newTitle);
      fetchTracks(); // Refresh the tracks list
      Alert.alert('Success', `Track renamed to: ${newTitle}`);
      onClose();
    } catch (error) {
      console.error('Failed to rename track:', error);
      Alert.alert('Error', 'Failed to rename track. Please try again later.');
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPressOut={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Rename Track</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new track name"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.okButton]} onPress={handleRenameTrack}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: defaultStyles.text.fontFamily,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    marginRight: 10,
    backgroundColor: 'white',
    borderColor: 'black',
  },
  okButton: {
    backgroundColor: 'white',
    borderColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: defaultStyles.text.fontFamily,
  },
});

export default RenameTrackModal;