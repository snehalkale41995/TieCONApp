import React from 'react';
import { LayoutAnimation, StatusBar, StyleSheet, Alert, Linking, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Keyboard, ActivityIndicator, AsyncStorage } from 'react-native';
import { RkButton, RkText, RkTextInput, RkStyleSheet, RkTheme, RkAvoidKeyboard } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import { Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { BarCodeScanner, Permissions } from 'expo';
import { Container, Header, Title, Content, Button, Icon, Right, Body, Left, Picker, ListItem } from "native-base";

import firebase from '../../config/firebase';
var firestoreDB = firebase.firestore();

const Item = Picker.Item;

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export class QRScanner extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Scanner'.toUpperCase(),
  });

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      isErrorDisplayed: false,
      selectedItem: undefined,
      selectedConf: "",
      isLoading: true,
      sessions: [],
      scanHistory: [],
      sessionUsers: [],
      results: {
        items: []
      }
    };
    this._getCurrentSessionUsers = this._getCurrentSessionUsers.bind(this);
    this._getSessions = this._getSessions.bind(this);
    this._getSesssionsFromServer = this._getSesssionsFromServer.bind(this);
  }
  
  _getSesssionsFromServer() {
    let db = firebase.firestore();
    let thisRef = this;
    let sessions = [];    
    db.collection("Sessions").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let sessionData = doc.data();
        sessionData['id'] = doc.id;
        sessions.push(sessionData);
      });
      if (sessions.length > 0) {
        thisRef.setState({ sessions, selectedConf: sessions[0].id });
        AsyncStorage.setItem("SESSIONS", JSON.stringify(sessions));
        thisRef._getCurrentSessionUsers(sessions[0].id);
      } else {
        thisRef.setState({ error: 'No sessions found.', isLoading: false });
      }
    }).catch(function (error) {
      thisRef.setState({ error: 'Error getting Sessions.', isLoading: false })
      Alert.alert(
        'Error',
        'Unable to get sessions information. Please try again.',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancellable: false }
      );
    });
  }

  _getSessions() {
    let thisRef = this;
    AsyncStorage.getItem("SESSIONS").then((sessions) => {
      if (sessions !== null){
        let sessionsObj = JSON.parse(sessions);
        thisRef.setState({ sessions: sessionsObj, selectedConf: sessions[0].id });
        thisRef._getCurrentSessionUsers(sessions[0].id);
      } else {
        thisRef._getSesssionsFromServer();
      }
    })
    .catch(err => {
      thisRef._getSesssionsFromServer();
    });
  }

  componentDidMount() {
    this._requestCameraPermission();
    this._getSessions();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _getSelectedSession = () => {
    let session = _.find(this.state.sessions, { 'id': this.state.selectedConf });
    return session;
  }

  _updateUserData(scannedData) {
      if (this.state.scanHistory.indexOf(scannedData) == -1 && !this.state.isLoading) {
        this.setState({ isLoading: true });
        let updatedScannedHistory = this.state.scanHistory;
        if (updatedScannedHistory.length >= 5) {
          updatedScannedHistory.push(scannedData);
          updatedScannedHistory.slice(0, updatedScannedHistory.length - 1)
        }

        this.setState({ scanHistory: updatedScannedHistory });
        let selectedSession = this._getSelectedSession();
        if (this.state.sessionUsers.indexOf(scannedData) == -1) {
          Alert.alert(
            'Unregistered User',
            'This user is not registered for this session. Do you still want to continue?',
            [
              {
                text: 'Yes', onPress: () => {
                  firestoreDB.collection('Attendance').doc(scannedData).set({
                    userId: scannedData,
                    sessionId: this.state.selectedConf,
                    session: selectedSession,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  }, { merge: true })
                    .then((docRef) => {
                      this.setState({ isLoading: false });
                    })
                    .catch((error) => {
                      this.setState({ isLoading: false });
                      Alert.alert(
                        'Error',
                        'Unable to update attendance. Please try again.',
                        [
                          { text: 'Ok', onPress: () => { } },
                        ],
                        { cancellable: false }
                      );
                    });
                }
              },
              {
                text: 'No', onPress: () => {
                  this.setState({ isLoading: false });
                }
              },
            ],
            { cancellable: false }
          );
        } else {
          firestoreDB.collection('Attendance').doc(scannedData).set({
            userId: scannedData,
            sessionId: this.state.selectedConf,
            session: selectedSession,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true })
            .then((docRef) => {
              this.setState({ isLoading: false });
            })
            .catch((error) => {
              this.setState({ isLoading: false });
              Alert.alert(
                'Error',
                'Unable to update attendance. Please try again.',
                [
                  { text: 'Ok', onPress: () => { } },
                ],
                { cancellable: false }
              );
            });
        }
      }
  }

  _validateQRData(data) {
    if (data.startsWith('TIECON:')) {
      this._updateUserData(data.substring(7));
    } else {
      this.setState({ isErrorDisplayed: true, isLoading: false });
      Alert.alert(
        'Invalid Data',
        'This QR code is not valid TiE QR Code.',
        [
          {
            text: 'Ok', onPress: () => {
              this.setState({ isErrorDisplayed: false });
            }
          },
        ],
        { cancellable: false }
      );
    }
  }

  _handleBarCodeRead = result => {
    if (this.state.isErrorDisplayed == false) {
      LayoutAnimation.spring();
      this._validateQRData(result.data);
    }
  };

  _getCurrentSessionUsers(selectedSessionId) {
    let thisRef = this;
    let sessionUsers = [];
    var db = firebase.firestore();
    db.collection("RegistrationResponse").where("sessionId", "==", selectedSessionId).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let sessionData = doc.data();
        sessionUsers.push(sessionData.userId);
      });
      thisRef.setState({ sessionUsers, isLoading: false });
    }).catch(function (error) {
      thisRef.setState({ isLoading: false });
      Alert.alert(
        'Error',
        'Unable to get selected session users. Please try again.',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancellable: false }
      );
    });
  }

  onConfChange(selectedSessionId) {
    this.setState({
      selectedConf: selectedSessionId,
      isLoading: true,
      scanHistory: []
    });
    this._getCurrentSessionUsers(selectedSessionId);
  }

  render() {

    let sessionItems = this.state.sessions.map(function (session, index) {
      return (
        <Item key={index} label={session.eventName} value={session.id} />
      )
    });

    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={(e) => true}
        onResponderRelease={(e) => Keyboard.dismiss()}>
        <ListItem icon>
          <Left>
            <Text>Select Session</Text>
          </Left>
          <Body>
            <Picker
              note
              mode="dropdown"
              selectedValue={this.state.selectedConf}
              onValueChange={this.onConfChange.bind(this)}
            >
              {sessionItems}
            </Picker>
          </Body>
        </ListItem>
        <View>
          {this.state.hasCameraPermission === null
            ? <RkText>Requesting for camera permission</RkText>
            : this.state.hasCameraPermission === false
              ? <RkText style={{ color: '#fff' }}>
                Camera permission is not granted
                  </RkText>
              : <BarCodeScanner
                style={styles.barCode}
                onBarCodeRead={this._handleBarCodeRead}
                style={{
                  height: (Dimensions.get('window').height - (Platform.OS === 'ios' ? 130 : 145)),
                  width: (Dimensions.get('window').width - 20),
                }}
              />}
        </View>
        {renderIf(this.state.isLoading,
          <View style={styles.loading}>
            <ActivityIndicator size='large' />
          </View>
        )}
      </RkAvoidKeyboard>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 10,
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
  barCode: {
    padding: 10,
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
  }
}));