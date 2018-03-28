import React from 'react';
import {Text, View} from 'native-base';
import {FlatList, SectionList} from 'react-native';
import ScheduleTile from './Schedule-tile';
import Moment from 'moment';

import {Service} from '../../../services';

/**
 *
 */
const SESSIONS_TABLE = 'Sessions';
export default class Schedule extends React.Component {
    /**
     *
     * @param {Properties passed by parent} props
     */
    constructor(props) {
        super(props);

        this.state = {
            sessionList: [],
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
        Service.addSnapshotListener(SESSIONS_TABLE, (snapshot) => {
            const sessionList = [];
            snapshot.forEach((event) => {
                const {
                    eventName,
                    extraServices,
                    isRegrequired,
                    room,
                    startTime,
                    speakers, 
                    endTime
                } = event.data();
                const duration = Moment(endTime).diff(Moment(startTime), 'minutes');

                sessionList.push({
                    key: event.id,
                    eventName,
                    extraServices,
                    isRegrequired,
                    room,
                    speakers,
                    startTime,
                    endTime,
                    duration
                });
            });
            this.setState({sessionList});
        }, (error)=>{
            console.log("Error has occurred");
        });
    }

    /**
     * Render method of component
     */
    render() {
        /* Pre-render Processing */
        / * Display Logic * /
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.sessionList}
                    renderItem={({item}) => <ScheduleTile 
                    navigation={this.props.navigation} 
                    session={item}/>}/>                
            </View >
        );
    }
}

