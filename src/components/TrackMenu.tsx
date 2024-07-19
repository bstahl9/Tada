import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MenuView } from '@react-native-menu/menu';
import { PropsWithChildren } from 'react';
import { getSequences } from '../db/dbSequence';
import Sequence from '../constants/types';
import { RenameTrackModal } from '../modals/RenameTrackModal';
import { SelectSequenceModal } from '../modals/SelectSequenceModal';
import { DeleteTrackModal } from '../modals/DeleteTrackModal';
import { Track } from 'react-native-track-player';

type TrackMenuProps = PropsWithChildren<{
    track: Track;
    onUpdate: () => Promise<void>;
}>;


export const TrackMenu = ({ track, onUpdate, children }: TrackMenuProps) => {
    const [sequences, setSequences] = useState<Sequence[]>([]);
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [addToSequenceModalVisible, setAddToSequenceModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false); 

    const handlePressAction = async (id: string, trackAction: Track) => {
        switch (id) {
            case 'add-to-sequence':
                try {
                    const fetchedSequences = await getSequences();
                    setSequences(fetchedSequences);
                    setAddToSequenceModalVisible(true);
                } catch (error) {
                    console.error('Failed to fetch sequences:', error);
                }
                break;
            case 'delete':
                setDeleteModalVisible(true);
                break;
            case 'rename':
                setRenameModalVisible(true);
                break;
            default:
                console.warn(`Unknown menu action ${id}`);
                break;
        }
    };

    return (
        <>
            <MenuView
                onPressAction={({ nativeEvent: { event } }) => handlePressAction(event, track)}
                actions={[
                    {
                        id: 'add-to-sequence',
                        title: 'Add to sequence',
                        image: 'plus',
                    }, 
                    {
                        id: 'rename',
                        title: 'Rename track',
                        image: 'pencil',
                    },
                    {
                        id: 'delete',
                        title: 'Delete track',
                        image: 'trash',
                        titleColor: 'red',
                    },
                ]}
            >
                {children}
            </MenuView>
            <RenameTrackModal
                visible={renameModalVisible}
                onClose={() => setRenameModalVisible(false)}
                track={track}
                onUpdate={onUpdate} 
            />
            <SelectSequenceModal
                visible={addToSequenceModalVisible}
                onClose={() => setAddToSequenceModalVisible(false)}
                sequences={sequences}
                track={track}
            />
            <DeleteTrackModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                track={track}
                onUpdate={onUpdate}
            />
        </>
    );
};
