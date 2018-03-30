import {StyleSheet} from 'react-native';

export default function styleConstructor() {
    return StyleSheet.create({
        card: {
            margin: 2,
            padding: 3
        },
        header: {
            flex: 1,
            flexDirection: 'column'
        },
        mainHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 5
        },
        roomName: {
            fontSize: 14,
            color: '#C9C9C9'
        },
        headerText: {
            fontWeight: 'bold',
            fontSize: 16
        },
        content: {
            margin: 2,
            padding: 2
        },
        actionBtn: {
            flex: 1,
            width: 85,
            height: 20,
            alignSelf: 'flex-end'
        },
        avatar: {
            backgroundColor: '#C0C0C0',
            width: 40,
            height: 40,
            borderRadius: 20,
            textAlign: 'center',
            fontSize: 20,
            textAlignVertical: 'center',
            marginRight: 5
        },
        avatarImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 5
        },
        speaker: {
            margin: 0,
            padding: 0,
            flexDirection: 'row'
        },
        speakerName: {
            textAlignVertical: 'center',
            fontStyle: 'italic',
            fontSize: 14
        },
        duration: {
            fontSize: 11,
            fontStyle: 'italic'
        },
        item: {
            backgroundColor: 'white',
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17
        },
        emptyDate: {
            height: 15,
            flex: 1,
            paddingTop: 30
        }
    });
}

export function getStatusStyle(regStatus) {
    switch (regStatus) {
        case "Going":
            {
                return {color: '#00FF00'}
            }
        case "Pending":
            {
                return {color: '#FFFF00'}
            }
        case "Denied":
            {
                return {color: '#FF0000'}
            }
    }
}