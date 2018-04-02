import React, { Component } from 'react';
import { Text, Button, View, TouchableOpacity, StyleSheet, AsyncStorage, ScrollView } from 'react-native';
import { RkButton, RkStyleSheet, RkText, RkCard } from 'react-native-ui-kitten';
import { Icon, Container, Tabs, Tab, TabHeading } from 'native-base';
import { NavigationActions, TabNavigator, TabView } from 'react-navigation';
import { Service } from '../../../services';
import Moment from 'moment';
import {Avatar} from '../../../components';


export class SessionDetails extends Component {
  static navigationOptions = {
    title: 'Session Details'.toUpperCase()
  };
  constructor(props) {
    super(props);
    this.sessionDetails = this.props.navigation.state.params.session,
      this.state = {
        sessionDetails : this.props.navigation.state.params.session,
        speakerDetails: this.sessionDetails.speakersDetails,
        sessionId: this.props.navigation.state.params.session.key,
        user: "",
        description: this.sessionDetails.description ? this.sessionDetails.description : "No details found...",
        sessionName: this.sessionDetails.eventName,
        sesssionDuration: this.sessionDetails.duration,
        sessionVenue: this.sessionDetails.room ? this.sessionDetails.room : "TBD" ,
        showSurveyButton: false,
        startTime: this.sessionDetails.startTime,
        endTime: this.sessionDetails.endTime
      }
  }
  componentWillMount() {
    Service.getCurrentUser((userDetails) => {
      this.setState({
        user: userDetails.firstName + " " + userDetails.lastName
      });
      this.checkSurveyResponse();
    });
  }
  checkSurveyResponse = () => {
    Service.getDocRef("SessionSurvey")
      .where("SessionId", "==", this.state.sessionId)
      .where("ResponseBy", "==", this.state.user)
      .get().then((snapshot) => {
        if (snapshot.size == 0) {
          this.setState({
            showSurveyButton: true
          })
        }
        this.getSurveyAccess();
      });
  }
  getSurveyAccess = () => {
    if (this.state.showSurveyButton == true) {
      return (
        <View style={{ alignItems: 'baseline', flexDirection: 'row', width: 380, marginBottom: 3 }}>
          <View style={{ width: 182 }} >
            <RkButton rkType='outline' style={{ flexDirection: 'row', width: 160, marginLeft: 5, marginRight: 2 }}
              onPress={() => this.props.navigation.navigate('Survey', { sessionDetails: this.state.sessionDetails })}
            >Survey </RkButton>
          </View>
          <View style={{ width: 182 }} >
            <RkButton rkType='outline' style={{ flexDirection: 'row', width: 160, marginLeft: 2, marginRight: 5 }}
              onPress={() => this.props.navigation.navigate('QueTab', { sessionDetails: this.state.sessionDetails })}
            >Ask Questions </RkButton>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={{ width: 360 }} >
          <RkButton rkType='outline' style={{ flexDirection: 'row', width: 340, marginLeft: 5, marginRight: 5 }}
            onPress={() => this.props.navigation.navigate('QueTab', { sessionDetails: this.state.sessionDetails })}
          >Ask Questions </RkButton>
        </View>
      );
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
            avatar = <Avatar  rkType='small'  imagePath={speaker.profileImageURL} />
        } else {
            let firstLetter = speaker.firstName ?  speaker.firstName[0]: '?';
            avatar = <RkText rkType='small'  style={styles.avatar}>{firstLetter}</RkText>
        }
        return (
           <View style={[styles.row, styles.heading ,styles.speakerView] }>
             {avatar}
            <Text style={[styles.text,styles.speaker]} rkType='header6'> {speaker.firstName + ' ' + speaker.lastName}</Text>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AttendeeProfile', { speakerDetails: speaker })}
            >
            
            <RkText style={[styles.attendeeScreen]}><Icon name="ios-arrow-forward" /></RkText>
          </TouchableOpacity>
           </View>
        )
      });
  }
  render() {
    const speakers = this.getSpeakers();
    const surveyButton = this.getSurveyAccess();
    return (
      <ScrollView style={styles.root}>
        <RkCard style={{ marginLeft: 5, marginRight: 5}}>
          <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText style={{ fontSize: 20 }} rkType='header6 primary'>{this.state.sessionName}</RkText>
            </View>
          </View>

          <View style={styles.subSection}>
            <View style={[styles.row, styles.heading]}>
              <RkText style={{ fontSize: 15 }}><Icon name="ios-calendar-outline" /> </RkText>
              <Text style={[styles.text]} rkType='header6' > {this.getDuration()} </Text>
            </View>
            <View style={[styles.row, styles.heading]}>
              <RkText style={{ fontSize: 15 }}><Icon name="ios-locate-outline" /></RkText>
              <Text style={[styles.text]} rkType='header6'>{this.state.sessionVenue}</Text>
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
            <View style={[ styles.heading]}>
            <View style={[styles.row]}>
              <RkText style={{ marginLeft:5  ,fontSize: 16 }} ><Icon name="ios-people-outline" /> </RkText>
              <RkText style={{ marginLeft:5  ,fontSize: 16 }} rkType='header6 primary' >Speakers </RkText>
              </View>
              {speakers}
            </View>
          </View>
        </RkCard>

        <View style={[styles.surveButton]}>
          {surveyButton}
        </View>

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
    marginBottom : 10
  },
  descSection : {
    marginVertical: 25,
    marginBottom : 10,
    marginTop : 5
  },
  speakerSection : {
    marginVertical: 25,
    marginBottom : 10,
    marginTop : 5
  },
  subSection: {
    marginTop : 5,
    marginBottom :10
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 17.5,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  text :{
    marginBottom : 5,
    fontSize : 15,
    marginLeft: 20
  },
  surveButton :{
    alignItems: 'baseline',
    flexDirection: 'row',
    width: 380,
    marginTop: 8, 
    marginBottom: 3,
    marginLeft: 5,
    marginRight: 5 
  },
  speakerView : {
    marginTop : 5,
    marginBottom :5
  },
  speaker: {
    flexDirection : 'column',
    width : 250
  },
  attendeeScreen : {
    flexDirection: 'column',
    fontSize: 25,
    marginRight: 5 
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
}));

