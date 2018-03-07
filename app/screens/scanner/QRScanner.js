import React from 'react';
import { LayoutAnimation, StatusBar, StyleSheet, Alert, Linking, View, ScrollView, TouchableOpacity, Text, Image, Dimensions, Keyboard } from 'react-native';
import { RkButton, RkText, RkChoice, RkModalImg, RkCard, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTabView, RkTheme } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import { NavigationActions } from 'react-navigation';
import { BarCodeScanner, Permissions } from 'expo';

import firebase from '../../config/firebase';
var firestoreDB = firebase.firestore();


export class QRScanner extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Scanner'.toUpperCase(),
  });

  constructor(props) {
    super(props);
    this.state = {
        hasCameraPermission: null,
        lastScannedUrl: null,
        isErrorDisplayed: false
      };
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
    this.setState({ lastScannedUrl: 'Setting Data for ' + scannedData.fn });
    firestoreDB.collection('usersInEvent').doc(scannedData.fn).set({
			EventName: 'Entry',
			ConfRoom: 'Conf1',
			Name: scannedData.fn
		})
    .then((docRef) => {
      this.setState({ lastScannedUrl: 'Updated' });
    })
    .catch((error) => {
      this.setState({ lastScannedUrl: 'Error Updating' });
    });
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
    if (data.startsWith('BEGIN:VCARD')) {
      this._setVCardDetails(data);
    } else {
      this.setState({isErrorDisplayed: true});
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

  render() {
    return (
      <View style={styles.container}>

        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                  Camera permission is not granted
                </Text>
              : <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={{
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                  }}
                />}

        {this._maybeRenderUrl()}

        <StatusBar hidden />
      </View>
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 15,
      flexDirection: 'row',
    },
    url: {
      flex: 1,
    },
    urlText: {
      color: '#fff',
      fontSize: 20,
    },
    cancelButton: {
      marginLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 18,
    },
  });