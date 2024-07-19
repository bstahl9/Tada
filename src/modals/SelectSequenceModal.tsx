// selectSequenceModal.tx
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { addSoundToSequence } from '../db/dbJunction';
import Sequence from '../constants/types';
import { Track } from 'react-native-track-player';
import { defaultStyles } from '../constants/styles';

type SelectSequenceModalProps = {
	visible: boolean;
	onClose: () => void;
	sequences: Sequence[];
	track: Track;
};

export const SelectSequenceModal = ({ visible, onClose, sequences, track }: SelectSequenceModalProps) => {
	const [selectedSequence, setSelectedSequence] = useState("");

	const handleAddToSequence = async () => {
		if (!selectedSequence) {
			Alert.alert('Error', 'Please select a sequence.');
			return;
		}

		const sequenceToAdd = sequences.find(seq => seq.name === selectedSequence);

		if (!sequenceToAdd) {
			Alert.alert('Error', 'Selected sequence not found.');
			return;
		}

		try {
			await addSoundToSequence(sequenceToAdd, track);
			onClose(); // close the modal after adding to sequence
		} catch (error) {
			Alert.alert('Error', 'Failed to add track to sequence.');
			console.error('Failed to add track to sequence:', error);
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
					<Text style={styles.title}>Add to Sequence</Text>
					<SelectList
						setSelected={setSelectedSequence}
						data={sequences.map(sequence => ({ key: sequence.id, value: sequence.name }))}
						save="value"
						boxStyles={styles.selectList}
						dropdownStyles={styles.dropdownList}
					/>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.button, styles.okButton]} onPress={handleAddToSequence}>
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
		// fontFamily: defaultStyles.text.fontFamily,
	},
	selectList: {
		marginBottom: 10,
		borderColor: 'black'
	},
	dropdownList: {
		borderColor: 'black',
		borderWidth: 1,
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
		// fontFamily: defaultStyles.text.fontFamily,
	},
});
