import React, { Component } from 'react';
import { Platform,Text, Button, View, TouchableOpacity, StyleSheet, AsyncStorage, ScrollView } from 'react-native';
import { RkButton, RkStyleSheet, RkText, RkCard } from 'react-native-ui-kitten';
import { Icon, Container, Tabs, Tab, TabHeading } from 'native-base';
import { NavigationActions, TabNavigator, TabView } from 'react-navigation';
import { Service } from '../../../services';
import Moment from 'moment';
import { Avatar } from '../../../components';
import styleConstructor, { getStatusStyle } from './styles';
import { GradientButton } from '../../../components/gradientButton';

const REGISTRATION_RESPONSE_TABLE = "RegistrationResponse";
export class SessionDetails extends Component {
  static navigationOptions = {
    title: 'Session Details'.toUpperCase()
  };
  constructor(props) {
    super(props);
    this.styles = styleConstructor();
    this.sessionDetails = this.props.navigation.state.params.session,
      this.state = {
        sessionDetails: this.props.navigation.state.params.session,
        speakerDetails: this.sessionDetails.speakersDetails,
        sessionId: this.props.navigation.state.params.session.key,
        user: "",
        description: this.sessionDetails.description ? this.sessionDetails.description : "No details found...",
        sessionName: this.sessionDetails.eventName,
        sesssionDuration: this.sessionDetails.duration,
        sessionVenue: this.sessionDetails.room ? this.sessionDetails.room : "TBD",
        showPanelButton: false,
        showFeedbackButton: false,
        startTime: this.sessionDetails.startTime,
        endTime: this.sessionDetails.endTime,
        userObj: {},
        regStatus: "",
        regId: ""
      }
  }
  componentWillMount() {
    Service.getCurrentUser((userDetails) => {
      this.setState({
        user: userDetails.firstName + " " + userDetails.lastName,
        userObj: userDetails
      });
      this.checkSurveyResponse();
      this.fetchRegistrationStatus();
    });
  }
  checkSurveyResponse = () => {
    Service.getDocRef("SessionSurvey")
      .where("SessionId", "==", this.state.sessionId)
      .where("ResponseBy", "==", this.state.userObj.uid)
      .get().then((snapshot) => {
        if (snapshot.size == 0) {
          this.setState({
            showPanelButton: true,
            showFeedbackButton: true
          })
        }
        else {
          this.setState({
            showPanelButton: true
          })
        }
        this.getSurveyAccess();
      })
      .catch(function (err) {
        console.log("err", err);
      });
  }
  getSurveyAccess = () => {
    if (this.state.showPanelButton == true && this.state.showFeedbackButton == true) {
      return (
        <View style={{ alignItems: 'flex-end' ,flexDirection: 'row', width:Platform.OS === 'ios' ? 320 : 380, marginBottom: 3 }}>
          <View style={{ width: Platform.OS === 'ios' ? 162 : 182 }} >
            <GradientButton colors={['#f20505', '#f55050']} text='Panel Q&A' style={{width: Platform.OS === 'ios' ? 142 :160, marginLeft: 2, marginRight: 5 }}
              onPress={() => this.props.navigation.navigate('QueTab', { sessionDetails: this.state.sessionDetails })}
            />
          </View>
          <View style={{  width: Platform.OS === 'ios' ? 162 : 182 }} >
            <GradientButton colors={['#f20505', '#f55050']} text='Feedback' style={{  width: Platform.OS === 'ios' ? 142 :160, marginLeft: 5, marginRight: 2 }}
              onPress={() => this.props.navigation.navigate('Survey', { sessionDetails: this.state.sessionDetails })}
            />
          </View>
        </View>
      );
    }
    else if (this.state.showPanelButton == true) {
      return (
        <View style={{ width: 360 }} >
          <GradientButton colors={['#f20505', '#f55050']} text='Panel Q&A' style={{ flexDirection: 'row', width: 340, marginLeft: 5, marginRight: 5 }}
            onPress={() => this.props.navigation.navigate('QueTab', { sessionDetails: this.state.sessionDetails })}
          />
        </View>
      );
    }
    else {
      return null;
    }
  }
  getDuration = () => {
    let endTime = Moment(this.state.endTime).format("hh:mm A");
    let startTime = Moment(this.state.startTime).format("hh:mm A");
    let sessionDate = Moment(this.state.startTime).format("DD MMM,YYYY");
    return (<Text>{startTime} - {endTime}   {sessionDate} </Text>);
  }
  getSpeakers = () => {
    return this.state.speakerDetails
      .map((speaker, index) => {
        let avatar;
        if (speaker.profileImageURL) {
          avatar = <Avatar rkType='small' imagePath={speaker.profileImageURL} />
        } else {
          let firstLetter = speaker.firstName ? speaker.firstName[0] : '?';
          avatar = <RkText rkType='small' style={styles.avatar}>{firstLetter}</RkText>
        }
        return (
          <View key={index} style={[styles.row, styles.heading, styles.speakerView]} >
            {avatar}
            <Text style={[styles.text, styles.speaker]} rkType='header6'> {speaker.firstName + ' ' + speaker.lastName}</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('AttendeeProfile', { speakerDetails: speaker })}
            >
              <RkText style={[styles.attendeeScreen]} ><Icon name="ios-arrow-forward" /></RkText>
            </TouchableOpacity>
          </View>
        )
      });
  }

  attendRequestStatus = () => {
    if (this.state.regStatus) {
      return (
        <View style = {[styles.attendBtn]}>
          <RkButton rkType='outline small'
            contentStyle={getStatusStyle(this.state.regStatus)}>{this.state.regStatus}</RkButton>
        </View>
      )
    } else {
      return (
        <View style = {[styles.attendBtn]} >
          <RkButton
            rkType='outline small'
            onPress={this.onAttendRequest}>
            Attend
            </RkButton>
        </View>
      );
    }
  }
  onAttendRequest = (event) => {
    const attendeeId = this.state.userObj.uid;
    let attendRequest = {
      sessionId: this.state.sessionDetails.key,
      session: this.state.sessionDetails,
      registeredAt: new Date(),
      status: this.state.sessionDetails.isRegrequired ? "Pending" : "Going",
      attendee: {},
      attendeeId: attendeeId
    }
    Service.getDocRef("RegistrationResponse").add(attendRequest).then((req) => {
      this.setState({
        regId: req.id,
        regStatus: attendRequest.status,

      });
    }).catch((error) => {
      console.warn(error);
    });
  }

  fetchRegistrationStatus = () => {
    const baseObj = this;
    if (this.state.userObj) {
      const attendeeId = this.state.userObj.uid;
      Service.getDocRef(REGISTRATION_RESPONSE_TABLE)
        .where("sessionId", "==", this.state.sessionDetails.key)
        .where("attendeeId", "==", attendeeId)
        .onSnapshot((snapshot) => {
          if (snapshot.size > 0) {
            snapshot.forEach((doc) => {
              let regResponse = doc.data();
              baseObj.setState({
                regStatus: regResponse.status,
                regId: doc.id
              })
            });
          }
        });
    } else {
      console.warn("User object is undefined");
    }
  }
  render() {
    const speakers = this.getSpeakers();
    const surveyButton = this.getSurveyAccess();
    return (
      <ScrollView style={styles.root}>
        <RkCard>

          <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText style={{ fontSize: 20 }} rkType='header6 primary'>{this.state.sessionName}</RkText>
            </View>
          </View>

          <View style={styles.subSection}>
            <View style={[styles.row, styles.heading]}>
              <Text style={{flexDirection : 'column',width: 25, fontSize: 12 }}><Icon name="md-time" /></Text>
             <Text style={{flexDirection : 'column'}} rkType='header6' > {this.getDuration()} </Text>
            </View>
            <View style={[styles.row, styles.heading]}>
             
              <RkText style={{flexDirection : 'column',width: 25, fontSize: 12 }}><Icon name="md-pin" /></RkText>
              <Text style={{flexDirection : 'column'}} rkType='header6'>{this.state.sessionVenue}</Text>
           
            </View>
            <View>
              {this.attendRequestStatus()}
            </View>
          </View>

          <View style={styles.descSection}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6'>Summary: </RkText>
            </View>
            <View style={[styles.row]}>
              <Text style={[styles.text]}>{this.state.description}</Text>
            </View>
          </View>
          <View style={styles.speakerSection}>
            <View style={[styles.heading]}>
              <View style={[styles.row]}>
                <RkText style={{ marginLeft: 5, fontSize: 16 }} ><Icon name="md-people" /> </RkText>
                <RkText style={{ marginLeft: 5, fontSize: 16 }} rkType='header6 primary' >Speakers </RkText>
              </View>
            </View>
            {speakers}
          </View>
          <View style={[styles.surveButton]}>
          {surveyButton}
        </View>
        </RkCard>
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  section: {
    marginVertical: 25,
    marginBottom: 10
  },
  descSection: {
    marginVertical: 25,
    marginBottom: 10,
    marginTop: 5
  },
  speakerSection: {
    marginVertical: 25,
    marginBottom: 10,
    marginTop: 5
  },
  subSection: {
    marginTop: 5,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 17.5,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  text: {
    marginBottom: 5,
    fontSize: 15,
    marginLeft: 15
  },
  surveButton: {
    alignItems : 'center',
    flexDirection: 'column',
    width:Platform.OS === 'ios' ? 320 : 380,
    marginTop: 8,
    marginBottom: 3,
    marginLeft: 5,
    marginRight: 5
  },
  speakerView: {
    marginTop: 5,
    marginBottom: 5
  },
  speaker: {
    flexDirection: 'column',
    width: Platform.OS === 'ios' ? 200 : 225,
  },
  attendeeScreen: {
    flexDirection: 'column',
    fontSize: 25,
    marginRight: 5,
    alignItems : 'flex-end'
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
  tileIcons: {
    paddingLeft: 4,
    paddingTop: 4,
    fontSize: 16,
    color: '#C9C9C9'
  },
  attendBtn : {
    flexDirection: 'column',
    alignItems : 'flex-end',
    marginRight : 5,
    marginTop : -10
  }
}));
