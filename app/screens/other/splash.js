import React from 'react';
import { StyleSheet, Image, View, Dimensions, StatusBar, AsyncStorage, Alert } from 'react-native';
import { RkText, RkStyleSheet, RkButton, RkTheme } from 'react-native-ui-kitten'
import {ProgressBar} from '../../components';
import {
  KittenTheme
} from '../../config/theme';
import {NavigationActions} from 'react-navigation';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import firebase from '../../config/firebase';
import { Toast } from 'native-base';

let timeFrame = 500;

export class SplashScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    }
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    let navigation = this.props.navigation;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        AsyncStorage.getItem("USER_DETAILS").then((userDetails)=>{
          if(userDetails) {
            navigation.navigate('App');
          } else {
            var db = firebase.firestore();
            var docRef = db.collection("Attendee").doc(user.uid);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    let data = doc.data();
                    data.uid = user.uid;
                    let userInfo = JSON.stringify(data);
                    AsyncStorage.setItem("USER_DETAILS", userInfo);
                    navigation.navigate('App');
                } else {
                   console.warn('Unable to get document');
                }
            }).catch(function(error) {
                console.warn("Error getting warn:", error);
            });
          }
        }).catch(function(error) {
          console.warn('Error reading local storage.');
        });;
        //navigation.navigate('App');
      } else {
        navigation.navigate('Auth');
      }
    });
  };

  componentDidMount() {
    StatusBar.setHidden(true, 'none');
    RkTheme.setTheme(KittenTheme);

    this.timer = setInterval(() => {
      if (this.state.progress == 1) {
        clearInterval(this.timer);
        setTimeout(() => {
          StatusBar.setHidden(false, 'slide');
          // let toHome = NavigationActions.reset({
          //   index: 0,
          //   actions: [NavigationActions.navigate({routeName: 'Auth'})]
          // });
          // this.props.navigation.dispatch(toHome)
          this._bootstrapAsync();
        }, timeFrame);
      } else {
        let random = Math.random() * 0.5;
        let progress = this.state.progress + random;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({progress});
      }
    }, timeFrame)

  }

  render() {
    let width = Dimensions.get('window').width;
    return (
      <View style={styles.container}>
        <View>
          <Image style={[styles.image, {width}]} source={require('../../assets/images/splashBack.png')}/>
          <View style={styles.text}>
            <RkText rkType='light' style={styles.hero}>TiE</RkText>
            <RkText rkType='logo' style={styles.appName}>Pune</RkText>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.textRow}>
            <RkText rkType='primary3'>Sponsored by:</RkText>
          </View>
        </View>
        <View style={styles.buttons}>
          <RkButton style={styles.button} rkType='sponsorsSplashScreen'>
            <Image style={styles.sponsorsImage} source={require('../../assets/images/eternusLogo.png')}/>;
          </RkButton>
          <RkButton style={styles.button} rkType='sponsorsSplashScreen'>
            <Image style={styles.sponsorsImage} source={require('../../assets/images/bajajLogo.jpg')}/>;
          </RkButton>
        </View>
        <ProgressBar
          color={RkTheme.current.colors.accent}
          style={styles.progress}
          progress={this.state.progress} width={scale(320)}/>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: KittenTheme.colors.screen.base,
    justifyContent: 'space-between',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  button: {
    borderColor: theme.colors.border.solid
  },
  sponsorsImage: {
    resizeMode: 'cover',
    height: scaleVertical(430),
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  image: {
    resizeMode: 'cover',
    height: scaleVertical(430),
  },
  text: {
    alignItems: 'center'
  },
  hero: {
    fontSize: 37,
  },
  appName: {
    fontSize: 62,
  },
  progress: {
    alignSelf: 'center',
    marginBottom: 35,
    backgroundColor: '#e5e5e5'
  }
}));