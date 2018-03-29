import React from 'react';
import {Text, View, Icon} from 'native-base';
import {AsyncStorage, StyleSheet, FlatList, TouchableOpacity, Alert, Image} from 'react-native';
import {RkComponent, RkTheme, RkText, RkButton, RkCard} from 'react-native-ui-kitten';
import {NavigationActions} from 'react-navigation';

import {Service} from '../../../services';
import ReactMoment from 'react-moment';
import Moment from 'moment';
import {Avatar} from '../../../components';

const REGISTRATION_RESPONSE_TABLE = "RegistrationResponse";

export default class ScheduleTile extends RkComponent {

    constructor(props) {
        super(props);
        this.state = props;
    }
    /**
     *  Get Speaker Details
     */
    componentDidMount() {       
        this.fetchSpeakers();
        this.fetchRegistrationStatus();
    }
    /**
     * Fetch Registration Status
     */
    fetchRegistrationStatus = () => {
        const baseObj = this;
        if(this.state.user){
            const attendeeId = this.state.user.uid;
            Service.getDocRef(REGISTRATION_RESPONSE_TABLE)
                .where("sessionId", "==", this.state.session.key)
                .where("attendeeId", "==", attendeeId)
                .get().then((snapshot) => {
                    if (snapshot.size > 0) {
                        snapshot.forEach((doc) => {
                            let regResponse = doc.data();
                            let newSession = Object.assign(this.state.session, {regStatus: regResponse.status});
                            baseObj.setState((prevState) => ({
                                ...prevState,
                                session: newSession
                            }));
                        });
                    }
                });
        }else{
            console.log("Still undefined");
        }
    }
    /**
     * Fetch Speaker Details
     */
    fetchSpeakers = () => {
        this.props.session.speakers.forEach((speaker) => {
                Service.getDocument("Attendee", speaker, (data) => {
                    const prevSpeakersDetails = this.state.session.speakersDetails;
                    let newSession = Object.assign(this.state.session, {
                        speakersDetails: [
                            ...prevSpeakersDetails,
                            data
                        ]
                    });
                    this.setState((prevState) => ({
                        ...prevState,
                        session: newSession
                    }));
                });
            });
    }
    
    /**
    * Session Attend Request raised by Attendee
    *
    */
    onAttendRequest = (event) => {
        const attendeeId = this.state.user.uid;
        let attendRequest = {
            sessionId : this.state.session.key,
            session : this.state.session,
            registeredAt : new Date(),
            status : this.state.session.isRegrequired? "Pending" : "Going",
            attendee : {},
            attendeeId : attendeeId
        }
        Service.getDocRef("RegistrationResponse").add(attendRequest).then((req)=>{
            let newSession = Object.assign(this.state.session, {regStatus: attendRequest.status});
            this.setState((prevState) => ({
                ...prevState,
                session: newSession
            }));
        }).catch((error)=>{
            console.warn(error);
        });
    }
    /**
     * Fetch Speaker Details
     */
    getSpeakers = () => {
        return this.props.session.speakersDetails
            .map((speaker, index) => {
                let avatar;
                if (speaker.profileImageURL) {
                    avatar = <Image style={styles.avatarImage} source={{uri:speaker.profileImageURL}}/>
                } else {
                    let firstLetter = speaker.firstName ? speaker.firstName[0]: '?';
                    avatar = <Text style={styles.avatar}>{firstLetter}</Text>
                }
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => this.props.navigation.navigate('AttendeeProfile', {speaker: speaker})}
                        style={styles.speaker}>
                        {avatar}
                        <Text style={styles.speakerName}>{speaker.firstName + ' ' + speaker.lastName}</Text>
                    </TouchableOpacity>
                )
            });

    }
    getDuration = ()=>{
        let _endTime =new Date(this.props.session.endTime).getTime();
        let _startTime = new Date(this.props.session.startTime).getTime();
        let difference = (_endTime - _startTime)/(60000);
        let __minutes = (difference % 60);
        let __hours = Math.floor(difference/60);  
        return (<Text style={styles.duration}>{(__hours>0)? __hours +' Hrs': ''} {__minutes + 'Min'}</Text>);
    }
    
    attendRequestStatus = ()=> {
        if (this.state.session.regStatus) {                
            return (
                <Text style={this.getStatusStyle()}>{this.state.session.regStatus}</Text>
            )
        }else{
            return (
                <RkButton
                    rkType='success small'
                    style ={styles.actionBtn}
                    onPress={this.onAttendRequest}>
                    Attend
                </RkButton>
            );
        }
    }
    /**
    * Render Schedule Tile
    */
    render() {
        if (this.props.session) {
            const speakers = this.getSpeakers();
            return (
                <RkCard rkType='shadowed' style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.roomName}>{this.props.session.room}</Text>
                        <View style={styles.mainHeader}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('SessionDetails', {session: this.props.session})}
                                style={{
                                flexDirection: 'row',
                                flex: 3,
                            }}>
                                <Text style={styles.headerText}>{this.props.session.eventName}</Text>
                            </TouchableOpacity>
                            {this.attendRequestStatus()}
                        </View>
                    </View >
                    <View style={styles.content}>
                        {speakers}
                        <View
                            style={{
                            flexDirection: 'row'
                        }}>
                            {this.getDuration()}
                        </View>
                    </View>
                </RkCard>
            );
        } else {
            return (
                <Text>
                    Unable to fetch detailis
                </Text>
            );
        }
    }

    getStatusStyle =()=>{
        let regStatus = this.state.session.regStatus;
        switch(regStatus){
            case "Going": {
                return {
                    color : '#00FF00'
                }
            }
            case "Pending" : {
                return {
                    color : '#FFFF00'
                }
            }
            case "Denied" : {
                return  {
                    color : '#FF0000'
                }
            }
        }
    }
}

/** * Component Styling Details */
const styles = StyleSheet.create({
    card :{
        margin : 2,
        padding: 3,
    },
    header: {
        flex: 1,
        flexDirection: 'column',
    },
    mainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft : 5,
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
        margin : 2,
        padding: 2,
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
    avatarImage:{
        width: 40,
        height:40,
        borderRadius:20,
        marginRight : 5
    },
    speaker : {
        margin: 0,
        padding: 0,
        flexDirection: 'row',
    },
    speakerName: {
        textAlignVertical: 'center',
        fontStyle: 'italic',
        fontSize: 14
    },
    duration: {
        fontSize : 11,
        fontStyle: 'italic'
    }
});