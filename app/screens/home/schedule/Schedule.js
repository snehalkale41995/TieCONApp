import React from 'react';
import {Text, View} from 'native-base';
import {FlatList} from 'react-native';
import ScheduleTile from './Schedule-tile';

import {Service} from '../../../services';
//import {Service} from '../../../services/Service';

/**
 *
 */
export default class Schedule extends React.Component {
    /**
     *
     * @param {Properties passed by parent} props
     */
    constructor(props) {
        super(props);

        this.state = {
            sessionList: [],
            todos: [
                {
                    title: 'Hello Mahesh',
                    completed: false
                }, {
                    title: 'Hello Yogesh',
                    completed: true
                }, {
                    title: 'Hello Monia',
                    completed: false
                }, {
                    title: 'Hello Sayali',
                    completed: true
                }
            ]
        }
    }
    /**
    *
    */
    componentDidMount() {
        this.fetchSessionList();
    }

    /**
    *
    */
    fetchSessionDetails = () => {}

    /**
     *
     */
    fetchSessionList = () => {
        Service.addSnapshotListener('Event', (snapshot) => {
            const sessionList = [];
            snapshot.forEach((event) => {
                const {eventName, extraServices, isRegrequired, room, startTime, speakers} = event.data();
                sessionList.push({
                    key: event.id,
                    eventName,
                    extraServices,
                    isRegrequired,
                    room,
                    speakers,
                    startTime
                });
            });
            this.setState({sessionList});
        });
    }

    /**
     * Render method of component
     */
    render() {
        /* Pre-render Processing */
        / * Display Logic * /
        return (
            <View style={{
                flex: 1
            }}>
                <FlatList
                    data={this.state.sessionList}
                    renderItem={({item}) => <ScheduleTile session={item}/>}/>
            </View >
        );
    }
}