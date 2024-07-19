import { TouchableOpacity } from "react-native-gesture-handler";
import { Track, useActiveTrack } from "react-native-track-player";
import { View, Text, StyleSheet, ViewProps } from "react-native";
import { unknownTrackImageUri } from "../constants/images";
import { PlayPauseButton } from "./PlayerControls";
import { useLastActiveTrack } from "../hooks/useLastActiveTrack";
import { SkipToNextButton } from "./PlayerControls";

export const FloatingPlayer = ({ style }: ViewProps) => {
	const activeTrack = useActiveTrack()
	const lastActiveTrack = useLastActiveTrack()

	const displayedTrack = activeTrack ?? lastActiveTrack

	const handlePress = () => {
		// navigate to the queue screen
	}

	if (!displayedTrack) return null

	return (
		<TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={[styles.container, style]}>
			<>
				<View style={styles.trackTitleContainer}>
                    <Text style={styles.trackTitle}>{displayedTrack.title ?? ''}</Text>
				</View>

				<View style={styles.trackControlsContainer}>
					<PlayPauseButton iconSize={24} />
					<SkipToNextButton iconSize={22} />
				</View>
			</>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'grey',
		padding: 8,
		borderRadius: 12,
		paddingVertical: 10,
        marginBottom: 10,
	},
	trackArtworkImage: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
		marginLeft: 10,
	},
	trackTitle: {
        fontFamily: 'Ligconsolata',
		fontSize: 18,
		fontWeight: '600',
		paddingLeft: 10,
	},
	trackControlsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 20,
		marginRight: 16,
		paddingLeft: 16,
	},
})