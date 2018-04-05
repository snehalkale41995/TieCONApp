import React from 'react';
import {Text, View} from 'native-base';
import {FlatList, SectionList, StyleSheet,ActivityIndicator} from 'react-native';
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
            user: {},
            isLoaded : false
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
            .onSnapshot((snapshot)=>{
                var sessions = [];
                let allSpeakers =[];
                let index=0;
                snapshot.forEach((request)=>{
                    const obj = request.data();
                    const session = obj.session;
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
                    sessionList: newSessions,
                    isLoaded : true
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
        if(!this.state.isLoaded){
            return (
                <View style={styles.loading} >
                    <ActivityIndicator size='large' />
                </View>
            );   
        }
        else{
            return (
                <View style={styles.listContainer}>
                    {sessionList}
                </View >
            );
        } 
    }
}

/** * Component Styling Details */
const styles = StyleSheet.create({
    listContainer :{
        flex: 1,
        flexDirection: 'column'
    },
    loading: {
        marginTop: 200,
        left: 0,
        opacity: 0.5,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
});
