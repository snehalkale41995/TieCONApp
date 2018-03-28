import React, {Component} from 'react';
import {Text, View,TouchableOpacity, StyleSheet, AsyncStorage,ScrollView} from 'react-native';
import { RkButton,RkStyleSheet,RkText,RkCard } from 'react-native-ui-kitten';
import {NavigationActions} from 'react-navigation';
import {Service} from '../../../services';

export class SessionDetails extends Component {
  static navigationOptions = {
    title: 'Session Details'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.sessionDetails =  this.props.navigation.state.params.session,
    this.state= {
      speakerDetails : this.sessionDetails.speakersDetails,
      sessionId : this.props.navigation.state.params.session.key,
      user : "",
      description :this.sessionDetails.description,
      sessionName :  this.sessionDetails.eventName,
      sesssionDuration :this.sessionDetails.duration,
      sessionVenue : this.sessionDetails.room,
      showSurveyButton : true,
      startTime : this.sessionDetails.startTime,
      endTime : this.sessionDetails.endTime,

    }
  }
  componentWillMount(){
    Service.getCurrentUser((userDetails)=>{
        this.setState({
          user :  userDetails.firstName + " " + userDetails.lastName
        });
        this.checkSurveyResponse();
    });
}
  
 checkSurveyResponse = () => {
  Service.getDocRef("SessionSurvey")
  .where("SessionId", "==", this.state.sessionId)
  .where("ResponseBy", "==", this.state.user)
  .get().then((snapshot) => {
      if (snapshot.size > 0) {
        this.setState({
          showSurveyButton : false
        })
      }
  });
}

getDuration = ()=>{
  let _endTime =new Date(this.state.endTime).getTime();
  let _startTime = new Date(this.state.startTime).getTime();
  let difference = (_endTime - _startTime)/(60000);
  let __minutes = (difference % 60);
  let __hours = Math.floor(difference/60);  
  return (<Text>{(__hours>0)? __hours +' Hrs': ''} {__minutes + 'Min'}</Text>);
}
getSpeakers = () => {
  return this.state.speakerDetails
  .map((speaker, index) => {
      return (
              <Text>{speaker.firstName + ' ' + speaker.lastName}</Text>
      )
  });
}
  render() {
    const speakers = this.getSpeakers();
    return (
        <ScrollView style={styles.root}>
          <RkCard style ={{marginLeft : 5 ,marginRight : 5}}>
        <View style={styles.section}>
        <View style={[styles.row, styles.heading]}>
          <RkText rkType='header6 primary'>Session Summary   : </RkText>
          <RkText rkType='header4'>{this.state.sessionName}</RkText>
        </View>
          <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6 primary'>Duration   : </RkText>
              <RkText rkType='header4'>{this.getDuration()}</RkText>
          </View>
          <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6 primary'>Venue    : </RkText>
              <RkText rkType='header4'>{this.state.sessionVenue}</RkText>
          </View>
          <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6 primary'>Speakers    : </RkText>
              <RkText rkType='header4'>{speakers}</RkText>
          </View>
          <View style={[styles.row, styles.heading]}>
          <RkText rkType='header6 primary'>Description    : </RkText>
          <Text >{this.state.description}</Text>
            </View>
          </View>
          </RkCard>
        <View style= {{alignSelf : 'center' ,width : 400 , marginBottom : 3}}>
        <RkButton rkType='dark' style={{ alignSelf: 'center', flexDirection: 'row', width: 340, marginBottom: 5 }}
           onPress={() => this.props.navigation.navigate('Survey', { sessionId: this.state.sessionId })}
         >Give Feedback </RkButton>
          <RkButton rkType='success' style={{alignSelf : 'center', flexDirection: 'row', width: 340 }}
            onPress={() => this.props.navigation.navigate('QueTab', { sessionId: this.state.sessionId })}
          >Ask Questions </RkButton>
        </View>
       </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  root: {
    backgroundColor: theme.colors.screen.base
  },
  header: {
    backgroundColor: theme.colors.screen.neutral,
    paddingVertical: 25
  },
  section: {
    marginVertical: 25
  },
  loading: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heading: {
    paddingBottom: 12.5
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32
  }
}));

