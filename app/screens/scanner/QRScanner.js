import React from 'react';
import { LayoutAnimation, StatusBar, StyleSheet, Alert, Linking, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Keyboard, ActivityIndicator } from 'react-native';
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
  static navigationOptions = ({navigation}) => ({
    title: 'Scanner'.toUpperCase(),
  });

  constructor(props) {
    super(props);
    this.state = {
        hasCameraPermission: null,
        lastScannedUrl: null,
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
  }
  
  componentWillMount() {
    var db = firebase.firestore();
    let sessions = [];
    let thisRef = this;
    db.collection("Sessions").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let sessionData = doc.data();
        sessionData['id'] = doc.id;
        sessions.push(sessionData);
      });
      if(sessions.length > 0)
      {
        thisRef.setState({sessions, selectedConf: sessions[0].id});
        thisRef._getCurrentSessionUsers(sessions[0].id);
      } else {
        thisRef.setState({error: 'No sessions found.', isLoading: false})
      }
    }).catch(function(error) {
      thisRef.setState({error: 'Error getting Sessions.', isLoading: false})
      console.warn("Error getting Sessions:", error);
    });
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _updateUserData(scannedData) {
    if(scannedData.title.startsWith('id')) {
      if(this.state.scanHistory.indexOf(scannedData.fn) == -1 && !this.state.isLoading) {
        this.setState({ lastScannedUrl: 'Setting Data for ' + scannedData.fn , isLoading: true });
        let updatedScannedHistory = this.state.scanHistory;
        if(updatedScannedHistory.length >= 5) {
          updatedScannedHistory.push(scannedData.fn);
          updatedScannedHistory.slice(0, updatedScannedHistory.length-1)
        }

        this.setState({scanHistory: updatedScannedHistory});

        if(this.state.sessionUsers.indexOf(scannedData.fn) == -1) {
          Alert.alert(
            'Unregistered User',
            'This user is not registered for this session. Do you still want to continue?',
            [
              { text: 'Yes', onPress: () => {
                  firestoreDB.collection('Attendance').doc(scannedData.title.substring(3)).set({
                    userId: scannedData.title.substring(3),
                    fullName: scannedData.fn,
                    sessionId: this.state.selectedConf,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  })
                  .then((docRef) => {
                    this.setState({ lastScannedUrl: 'Updated', isLoading: false });
                  })
                  .catch((error) => {
                    this.setState({ lastScannedUrl: 'Error Updating', isLoading: false });
                  });
                } 
              },
              { text: 'No', onPress: () => {
                this.setState({isLoading: false});
                } 
              },
            ],
            { cancellable: false }
          );
        } else {
          firestoreDB.collection('Attendance').doc(scannedData.title.substring(3)).set({
            userId: scannedData.title.substring(3),
            fullName: scannedData.fn,
            sessionId: this.state.selectedConf,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then((docRef) => {
            this.setState({ lastScannedUrl: 'Updated', isLoading: false });
          })
          .catch((error) => {
            this.setState({ lastScannedUrl: 'Error Updating', isLoading: false });
          });
        }
      }
    } else {
      this.setState({isErrorDisplayed: true, isLoading: false});
      Alert.alert(
        'Invalid Data',
        'This QR code is not valid TiECON QR Code.',
        [
          { text: 'Ok', onPress: () => {
            this.setState({isErrorDisplayed: false});
          } },
        ],
        { cancellable: false }
      );
    }
  }

  _setVCardDetails = (scannedResult) => {
		let Re1 = /^(version|fn|title|org):(.+)$/i;
		let Re2 = /^([^:;]+);([^:]+):(.+)$/;
		let ReKey = /item\d{1,2}\./;
    let fields = {};
		scannedResult.split(/\r\n|\r|\n/).forEach((line) => {
			let results, key;
			if (Re1.test(line)) {
				results = line.match(Re1);
				key = results[1].toLowerCase();
				fields[key] = results[2];
			} else if (Re2.test(line)) {
				results = line.match(Re2);
				key = results[1].replace(ReKey, '').toLowerCase();
	
				let meta = {};
				results[2].split(';')
					.map((p, i) => {
						let match = p.match(/([a-z]+)=(.*)/i);
						if (match) {
							return [match[1], match[2]];
						}
						return ['TYPE' + (i === 0 ? '' : i), p];
						
					})
					.forEach((p) => {
						meta[p[0]] = p[1];
					});
	
				if (!fields[key]) fields[key] = [];
	
				fields[key].push({
					meta,
					value: results[3].split(';')
				});
			}
    });
    this._updateUserData(fields);
  }
  
  _validateQRData(data) {
    if (data.startsWith('BEGIN:VCARD') && data.indexOf('TITLE') > -1) {
      this._setVCardDetails(data);
    } else {
      this.setState({isErrorDisplayed: true, isLoading: false});
      Alert.alert(
        'Invalid Data',
        'This QR code is not valid TiECON QR Code.',
        [
          { text: 'Ok', onPress: () => {
            this.setState({isErrorDisplayed: false});
          } },
        ],
        { cancellable: false }
      );
    }
  }

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl && this.state.isErrorDisplayed == false) {
      LayoutAnimation.spring();
      this._validateQRData(result.data);
    }
  };

  _getCurrentSessionUsers(selectedSessionId) {
    let thisRef = this;
    let sessionUsers = [];
    var db = firebase.firestore();
    db.collection("RegistrationResponse").where("sessionId", "==", selectedSessionId).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let sessionData = doc.data();
        sessionUsers.push(sessionData.userId);
      });
      thisRef.setState({sessionUsers, isLoading: false});
    }).catch(function(error) {
        thisRef.setState({isLoading: false});
        console.warn("Error getting Session Users:", error);
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
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
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
                      height: (Dimensions.get('window').height - (Platform.OS === 'ios' ? 130 : 145) ),
                      width: (Dimensions.get('window').width- 20),
                    }}
                  />}
          {/* {this._maybeRenderUrl()} */}
          </View>
          {renderIf(this.state.isLoading,
            <View style={styles.loading}> 
              <ActivityIndicator size='large' /> 
            </View>
          )}
      </RkAvoidKeyboard>
    );
  }

  _handlePressUrl = () => {
    Alert.alert(
      'Open this URL?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Yes',
          onPress: () => Linking.openURL(this.state.lastScannedUrl),
        },
        { text: 'No', onPress: () => {} },
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            {this.state.lastScannedUrl}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this._handlePressCancel}>
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
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