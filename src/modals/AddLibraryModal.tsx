// src/components/AddLibraryModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Track } from 'react-native-track-player';
import uuid from 'react-native-uuid';
import useLibraryStore from '../store/libraryStore';

type AddLibraryModalProps = {
  visible: boolean;
  onClose: () => void;
};

const AddLibraryModal = ({ visible, onClose }: AddLibraryModalProps) => {
  const [showSequenceInput, setShowSequenceInput] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const { addSequence, addTrack, fetchSequences, fetchTracks } = useLibraryStore();

  useEffect(() => {
    if (!visible) {
      setShowSequenceInput(false);
      setNewTitle("");
    }
  }, [visible]);

  const handleCreateSequence = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Sequence name cannot be empty.');
      return;
    }
    
    const newSequence = {
      id: uuid.v4().toString(),
      name: newTitle.trim(),
      dateCreated: new Date().toString(),
    };

    try {
      await addSequence(newSequence);
      console.log('New sequence created:', newSequence);
      setNewTitle("");
      setShowSequenceInput(false);
      fetchSequences(); // Refresh the sequences list
      onClose();
    } catch (error) {
      console.error('Failed to add sequence:', error);
      Alert.alert('Error', 'Failed to create sequence. Please try again later.');
    }
  };

  const handleImportTrack = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.audio],
      });

      if (result && result.uri) {
        const audioDir = `${RNFS.DocumentDirectoryPath}/audio`;
        await RNFS.mkdir(audioDir);

        const newFileUri = `${audioDir}/${result.name}`;
        await RNFS.copyFile(result.uri, newFileUri);

        const newTrack: Track = {
          id: uuid.v4().toString(),
          url: newFileUri,
          title: result.name ?? '~~No Title~~',
          artist: 'Unknown',
        };

        console.log('Imported track:', newTrack);
        await addTrack(newTrack);
        fetchTracks(); // Refresh the tracks list
        onClose();
      } else {
        console.log('No track selected');
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled the picker');
      } else {
        console.error('Failed to import track:', error);
      }
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
          <Text style={styles.title}>Add to Library</Text>
          {showSequenceInput ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter sequence name"
                maxLength={20}
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.okButton]} onPress={handleCreateSequence}>
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.optionButton} onPress={handleImportTrack}>
                <Text style={styles.optionText}>Import Track</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => setShowSequenceInput(true)}>
                <Text style={styles.optionText}>Create New Sequence</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
                <Text style={styles.optionText}>Import Voice Memos</Text>
              </TouchableOpacity>
            </>
          )}
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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
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
  },
  cancelButton: {
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  okButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  optionButton: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddLibraryModal;
