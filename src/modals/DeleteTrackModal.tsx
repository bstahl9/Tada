import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Track } from 'react-native-track-player';
import { deleteTrackDb } from '../db/dbTrack';
import { defaultStyles } from '../constants/styles';

type DeleteTrackModalProps = {
    visible: boolean;
    onClose: () => void;
    track: Track;
    onUpdate: () => Promise<void>;
};

export const DeleteTrackModal = ({ visible, onClose, track, onUpdate }: DeleteTrackModalProps) => {
    const handleDeleteTrack = async () => {
        try {
            await deleteTrackDb(track);
            onUpdate();
            Alert.alert('Track deleted successfully');
            onClose();
        } catch (error) {
            console.error('Failed to delete track:', error);
            Alert.alert('Error', 'Failed to delete track. Please try again later.');
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
                    <Text style={styles.title}>Delete Track</Text>
                    <Text style={styles.message}>Are you sure you want to delete this track?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTrack}>
                            <Text style={[styles.buttonText, { color: 'red' }]}>Delete</Text>
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
        marginBottom: 10,
        textAlign: 'center',
        // fontFamily: defaultStyles.text.fontFamily,
    },
    message: {
        marginBottom: 20,
        textAlign: 'center',
        // fontFamily: defaultStyles.text.fontFamily,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 80,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: 'white',
        borderColor: 'black',
    },
    deleteButton: {
        backgroundColor: 'white',
        borderColor: 'red',
    },
    buttonText: {
        fontSize: 16,
        // fontFamily: defaultStyles.text.fontFamily,
    },
});

