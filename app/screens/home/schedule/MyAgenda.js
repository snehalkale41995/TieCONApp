import React from 'react';
import {Text, View} from 'native-base';
import {FlatList, SectionList, StyleSheet} from 'react-native';
import ScheduleTile from './Schedule-tile';
import Moment from 'moment';

import {Service} from '../../../services';

/**
 *
 */
const TABLE = 'RegistrationResponse';
export default class MyAgenda extends React.Component {
    /**
     *
     */
    constructor(props) {
        super(props);
        this.state = Object.assign(props, {
            sessionList : [],
            user: {}
        });
    }
    /**
    *
    */
    componentDidMount() {
        this.fetchSessionList();
        Service.getCurrentUser((userObj)=>{
            this.setState((prevState) => ({
                ...prevState,
                user: userObj
            }));
        });
    }

    /**
     *
     */
    fetchSessionList = () => {
        Service.getCurrentUser((user)=>{
            Service.getDocRef(TABLE)
            .where('attendeeId', '==', user.uid)
            .get().then((snapshot)=>{
                var sessions = [];
                let allSpeakers =[];
                let index=0;
                snapshot.forEach((request)=>{
                    const obj = request.data();
                    const session = obj.session;
                    console.log(session.id);
                    sessions.push({
                        key: obj.sessionId,
                        eventName: session.eventName,
                        room : session.room,
                        speakers : session.speakers,
                        startTime : session.startTime,
                        endTime : session.endTime,
                        description : session.duration,
                        speakersDetails:[],
                    });
                });
                let newSessions = [];
                newSessions = [...sessions];
                this.setState((prevState) => ({
                    ...prevState,
                    sessionList: newSessions
                }));
            });
        });
    }

    /**
     * Render method of component
     */
    render() {
        /* Pre-render Processing */
        let sessionsList;
        if(this.state.sessionList && this.state.sessionList.length > 0 ){
            sessionList = (<FlatList
                    data={this.state.sessionList}
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) => <ScheduleTile user={this.state.user} navigation={this.props.navigation} session={item}/>}
                />)
        }else{
            sessionList = (<Text>No session added to agenda yet</Text>)
        }
        return (
            <View style={styles.listContainer}>
                {sessionList}
            </View >
        );
    }
}

/** * Component Styling Details */
const styles = StyleSheet.create({
    listContainer :{
        flex: 1,
        flexDirection: 'column'
    }
});
