import React from 'react';
import { ScrollView, View, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { RkText, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';
import {data} from '../../data';
import {Avatar} from '../../components';
import {SocialSetting} from '../../components';
import {FontAwesome} from '../../assets/icons';
import {GradientButton} from '../../components';
import LinkedInModal from 'react-native-linkedin';
import firebase from '../../config/firebase';
var firestoreDB = firebase.firestore();

function renderIf(condition, content) {
  if (condition) {
      return content;
  } else {
      return null;
  }
}

export class ProfileSettings extends React.Component {
  static navigationOptions = {
    title: 'Profile Settings'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.user = data.getUser();
    this.state = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      country: this.user.country,
      phone: this.user.phone,
      password: this.user.password,
      newPassword: this.user.newPassword,
      confirmPassword: this.user.confirmPassword,
      twitter: true,
      google: false,
      facebook: false,
      linkedInSummary: '',
      isLinkedInConnected: false,
      linkedInToken: {},
      userDetails: {}
    }
    this.onLinkedInError = this.onLinkedInError.bind(this);
    this.onLinkedInConnect = this.onLinkedInConnect.bind(this);
    this.getLinkedinProfileDetails = this.getLinkedinProfileDetails.bind(this);
  }

  componentWillMount() {
    let thisRef = this;
    AsyncStorage.getItem("USER_LINKEDIN_TOKEN").then((token)=>{
      if(token){
        thisRef.setState({isLinkedInConnected: true, linkedInToken: JSON.parse(token) });
      }
    });
    AsyncStorage.getItem("USER_DETAILS").then((userDetails)=>{
      thisRef.setState({userDetails: JSON.parse(userDetails) });
     })
     .catch(err => {
       console.warn('Errors');
     });
  }

  onLinkedInError(error) {
    Alert.alert(
      'Error',
      error.message,
      [
        { text: 'Ok', onPress: () => {} },
      ],
      { cancellable: false }
    );
  }

  onLinkedInConnect(token) {
    AsyncStorage.setItem("USER_LINKEDIN_TOKEN", JSON.stringify(token));
    this.setState({isLinkedInConnected: true, linkedInToken: token});
  }

  getLinkedinProfileDetails() {
    const baseApi = 'https://api.linkedin.com/v1/people/';
    const qs = { format: 'json' };
    const params = [
      'first-name',
      'last-name',
      'industry',
      'summary',
      'picture-urls::(original)',
      'headline',
      'email-address',
    ];
    fetch(`${baseApi}~:(${params.join(',')})?format=json`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.state.linkedInToken.access_token,
      },
    }).then((response) => {
      response.json().then((payload) => {
        this.setState({linkedInSummary: payload.headline});
        firestoreDB.collection('Users').doc(this.state.userDetails.uid).set({
            linkedInSummary: payload.headline
          }, { merge: true })
          .then((docRef) => {
            this.setState({linkedInSummary: payload.headline});
          })
          .catch((error) => {
            console.warn('Error updating summary');
          });
      });        
    })
  }

  render() {
    return (
      <ScrollView style={styles.root}>
        <RkAvoidKeyboard>
          <View style={styles.header}>
            <Avatar img={this.user.photo} rkType='big'/>
          </View>
          <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6 primary'>INFO</RkText>
            </View>
            <View style={styles.row}>
              <RkTextInput label='First Name'
                           value={this.state.firstName}
                           rkType='right clear'
                           onChangeText={(text) => this.setState({firstName: text})}/>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Last Name'
                           value={this.state.lastName}
                           onChangeText={(text) => this.setState({lastName: text})}
                           rkType='right clear'/>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Email'
                           value={this.state.email}
                           onChangeText={(text) => this.setState({email: text})}
                           rkType='right clear'/>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Phone'
                           value={this.state.phone}
                           onChangeText={(text) => this.setState({phone: text})}
                           rkType='right clear'/>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType='header6 primary'>Linked In Details</RkText>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Summary'
                           value={this.state.linkedInSummary}
                           rkType='right clear'
                           onChangeText={(text) => this.setState({linkedInSummary: text})}/>
            </View>
            <GradientButton rkType='large' style={styles.button} text='Update from Linkedin Profile' onPress={() => this.getLinkedinProfileDetails()} />
          </View>

          <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType='primary header6'>CHANGE PASSWORD</RkText>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Old Password'
                           value={this.state.password}
                           rkType='right clear'
                           secureTextEntry={true}
                           onChangeText={(text) => this.setState({password: text})}/>
            </View>
            <View style={styles.row}>
              <RkTextInput label='New Password'
                           value={this.state.newPassword}
                           rkType='right clear'
                           secureTextEntry={true}
                           onChangeText={(text) => this.setState({newPassword: text})}/>
            </View>
            <View style={styles.row}>
              <RkTextInput label='Confirm Password'
                           value={this.state.confirmPassword}
                           rkType='right clear'
                           secureTextEntry={true}
                           onChangeText={(text) => this.setState({confirmPassword: text})}/>
            </View>
          </View>

          {/* <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType='primary header6'>CONNECT YOUR ACCOUNT</RkText>
            </View>
            <View style={styles.row}>
              <SocialSetting name='Linked In' tintColor={RkTheme.current.colors.facebook}/>
            </View>
          </View>
          <GradientButton rkType='large' style={styles.button} text='SAVE'/> */}
          {renderIf(this.state.isLinkedInConnected,
            <View style={styles.section}>
              <View style={[styles.row, styles.heading]}>
                <RkText rkType='primary header6'>CONNECTED TO LINKEDIN</RkText>
              </View>
            </View>            
          )}
          {renderIf(!this.state.isLinkedInConnected,
            <GradientButton rkType='large' style={styles.button} text='Connect to Linkedin' onPress={() => this.modal.open()} />
          )}
        </RkAvoidKeyboard>
        
        <View style={styles.container}>
        <LinkedInModal
          ref={ref => {
            this.modal = ref
          }}
          linkText=''
          clientID="81ri5ss1q7cmvg"
          clientSecret="NNn9HQRcQfLHHF5F"
          redirectUri="http://eternussolutions.com"
          onError={error => this.onLinkedInError(error)}
          onSuccess={token => this.onLinkedInConnect(token) }
        />
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