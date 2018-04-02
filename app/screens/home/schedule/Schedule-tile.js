import React from 'react';
import {Text, View, Icon} from 'native-base';
import {AsyncStorage, FlatList, TouchableOpacity, Alert, Image} from 'react-native';
import {RkComponent, RkTheme, RkText, RkButton, RkCard} from 'react-native-ui-kitten';
import {NavigationActions} from 'react-navigation';

import styleConstructor, {getStatusStyle} from './styles';
import {Service} from '../../../services';
import ReactMoment from 'react-moment';
import Moment from 'moment';
import {Avatar} from '../../../components';

const REGISTRATION_RESPONSE_TABLE = "RegistrationResponse";

export default class ScheduleTile extends RkComponent {

    constructor(props) {
        super(props);
        this.styles = styleConstructor();
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
                .onSnapshot((snapshot)=>{
                    if (snapshot.size > 0) {
                        snapshot.forEach((doc) => {
                            let regResponse = doc.data();
                            let newSession = Object.assign(this.state.session, {regStatus: regResponse.status, regId: doc.id});
                            baseObj.setState((prevState) => ({
                                ...prevState,
                                session: newSession
                            }));
                        });
                    }
                });
        }else{
            console.warn("User object is undefined");
        }
    }
    /**
     * Fetch Speaker Details
     */
    fetchSpeakers = () => {
        if(this.props.session.speakers){
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
    }
    /**
    * On Cancel Request
    */
    onCancelRequest = (event)=>{
        console.log("RegID", this.state.session.regId);
        Service.getDocRef("RegistrationResponse").doc(this.state.session.regId).delete().then((req)=>{
            let newSession = Object.assign({}, this.state.session);
            delete newSession['regStatus'];
            delete newSession['regId'];
            this.setState((prevState) => ({
                ...prevState,
                session: newSession
            }));
        }).catch((error)=>{
            console.warn(error);
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
            let newSession = Object.assign(this.state.session, {regStatus: attendRequest.status, regId: req.id});
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
                    avatar = <Image style={this.styles.avatarImage} source={{uri:speaker.profileImageURL}}/>
                } else {
                    let firstLetter = speaker.firstName ? speaker.firstName[0]: '?';
                    avatar = <Text style={this.styles.avatar}>{firstLetter}</Text>
                }
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => this.props.navigation.navigate('AttendeeProfile', {speaker: speaker})}
                        style={this.styles.speaker}>
                        {avatar}
                        <Text style={this.styles.speakerName}>{speaker.firstName + ' ' + speaker.lastName}</Text>
                    </TouchableOpacity>
                )
            });

    }
    /**
    * Duration Details
    */
    getDuration = ()=>{
        return (
            <View  style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                <Icon name="md-time" style={this.styles.tileIcons}/>
                <Text style={this.styles.duration}>{Moment(this.props.session.startTime).format("HH:mm")} - {Moment(this.props.session.endTime).format("HH:mm")}</Text>
            </View>
        );
    }
    /**
    * Location Details
    */
    getLocation =()=>{
        return (
            <View style={{marginLeft:20, flexDirection: 'row', alignSelf: 'flex-end'}}>
                <Icon name="md-pin" style={this.styles.tileIcons} />
                <Text style={this.styles.roomName}>{this.props.session.room}</Text>
            </View>
        );
    }
    /**
    * Attend request Status
    */
    attendRequestStatus = ()=> {
        if (this.state.session.regStatus) {                
            return (
                <View style={{flexDirection:'row'}}>
                    <Text style={getStatusStyle(this.state.session.regStatus)}>{this.state.session.regStatus}</Text>
                    <TouchableOpacity onPress={this.onCancelRequest}>
                        <Icon name="md-close" style={this.styles.tileIcons} /> 
                    </TouchableOpacity>
                </View>
            )
        }else{
            return (
                <RkButton
                    rkType='success small'
                    style ={this.styles.actionBtn}
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
                <RkCard rkType='shadowed' style={this.styles.card}>
                    <View style={this.styles.header}>
                        <View style={this.styles.mainHeader}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('SessionDetails', {session: this.props.session})}
                                style={{
                                flexDirection: 'row',
                                flex: 3,
                            }}>
                            <Text style={this.styles.headerText}>{this.props.session.eventName}</Text>
                            </TouchableOpacity>
                            {this.attendRequestStatus()}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            
                        </View>
                    </View >
                    <View style={this.styles.content}>
                        {speakers}
                        <View
                            style={this.styles.tileFooter}>
                            {this.getDuration()}
                            {this.getLocation()}
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
}