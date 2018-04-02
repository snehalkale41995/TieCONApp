
import React from 'react';
import { ScrollView, View, StyleSheet, Alert, AsyncStorage, ActivityIndicator ,Text} from 'react-native';
import { RkText,RkComponent, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';
import {data} from '../../../data';
import {Avatar} from '../../../components';
import {SocialSetting} from '../../../components';
import {FontAwesome} from '../../../assets/icons';
import {GradientButton} from '../../../components';
import LinkedInModal from 'react-native-linkedin';
import firebase from '../../../config/firebase'
var firestoreDB = firebase.firestore();

function renderIf(condition, content) {
    if (condition) {
        return content;
    } else {
        return null;
    }
  }

export class AttendeeProfile extends RkComponent {
    static navigationOptions = {
        title: 'Speaker Profile'.toUpperCase()
    };
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.speaker = params.speaker;
        this.state = {
            speaker : this.speaker,
            isLoading: true,
            password: this.speaker.password,
            newPassword: this.speaker.newPassword,
            confirmPassword: this.speaker.confirmPassword,
            linkedInSummary: '',
            isLinkedInConnected: false,
            linkedInToken: {},
            userDetails : this.speaker,
            firstName: this.speaker.firstName,
            lastName: this.speaker.lastName,
            fullName : this.speaker.fullName.toUpperCase(),
            email: this.speaker.email,
            phone: this.speaker.contactNo,
            linkedInSummary: this.speaker.linkedInSummary ? this.speaker.linkedInSummary : "No details available..." ,
            isLoading: false,
            pictureUrl: this.speaker.profileImageURL,
        }
        this.onLinkedInError = this.onLinkedInError.bind(this);
        this.onLinkedInConnect = this.onLinkedInConnect.bind(this);
        this.getLinkedinProfileDetails = this.getLinkedinProfileDetails.bind(this);
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
        this.getLinkedinProfileDetails(true);
      }
    
      getLinkedinProfileDetails(forceConnect = false) {
        if(this.state.isLinkedInConnected || forceConnect){
          this.setState({ isLoading: true });
          const baseApi = 'https://api.linkedin.com/v1/people/';
          const qs = { format: 'json' };
          const params = [
            'first-name',
            'last-name',
            'industry',
            'summary',
            'picture-url',
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
            this.setState({ isLoading: false });
            response.json().then((payload) => {
              this.setState({linkedInSummary: payload.headline, pictureUrl: payload.pictureUrl});
              firestoreDB.collection('Users').doc(this.state.userDetails.uid).set({
                  linkedInSummary: payload.headline,
                  pictureUrl: payload.pictureUrl
                }, { merge: true })
                .then((docRef) => {
                  this.setState({linkedInSummary: payload.headline});
                  let userDetailsToSave = this.state.userDetails;
                  userDetailsToSave.linkedInSummary = payload.headline;
                  userDetailsToSave.pictureUrl = payload.pictureUrl;
                  AsyncStorage.setItem("USER_DETAILS", JSON.stringify(userDetailsToSave));
                })
                .catch((error) => {
                  console.warn('Error updating summary');
                });
            });        
          })
        } else {
          this.modal.open();
        }    
      }
    
      render() {

        let avatar;
        if (this.state.speaker.profileImageURL) {
            avatar = <Avatar  rkType='big'  imagePath={this.state.speaker.profileImageURL} />
        } else {
            let firstLetter = this.state.speaker.firstName ?  this.state.speaker.firstName[0]: '?';
            avatar = <RkText rkType='big'  style={styles.avatar}>{firstLetter}</RkText>
        }
        return (
          <ScrollView style={styles.root}>
            <RkAvoidKeyboard>
              <View style={styles.header}>
                {avatar}
                {/* <Avatar imagePath={this.state.pictureUrl} rkType='big'/> */}
              </View>
              <View style={styles.section} pointerEvents='none'>
                <View style={[styles.row, styles.heading]}>
                  <RkText rkType='header6 primary'>INFO</RkText>
                </View>
                <View style={styles.row}>
                  <RkTextInput label='Full Name'
                               value={this.state.fullName}
                               editable={false}
                               rkType='right clear'
                               />
                </View>
                <View style={styles.row}>
                  <RkTextInput label='Email'
                               value={this.state.email}
                               editable={false}
                               rkType='right clear'/>
                </View>
                <View style={styles.row}>
                  <RkTextInput label='Phone'
                               value={this.state.phone}
                               editable={false}
                               rkType='right clear'/>
                </View>
              </View>
              <View style={styles.section}>
                <View style={[styles.row, styles.heading]}>
                  <RkText rkType='header6 primary'>Linked In Summary</RkText>
                </View>
                <View style={styles.row}>
                  <RkText rkType='header4'>{this.state.linkedInSummary}</RkText>
                </View>
                <GradientButton rkType='large' style={styles.button} text='Connect on Linkedin' onPress={() => this.getLinkedinProfileDetails()} />
              </View>
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
            {renderIf(this.state.isLoading,
                <View style={styles.loading}> 
                  <ActivityIndicator size='large' /> 
                </View>
              )}
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
    },
    avatar: {
      backgroundColor: '#C0C0C0',
      width: 100,
      height: 100,
      borderRadius: 60,
      textAlign: 'center',
      fontSize: 40,
      textAlignVertical: 'center',
      marginRight: 5,
      alignSelf: 'center'
  }
  }));
