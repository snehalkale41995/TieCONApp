import React from 'react';
import {
  DrawerNavigator,
  StackNavigator
} from 'react-navigation';
import {withRkTheme} from 'react-native-ui-kitten';
import {AppRoutes} from './config/navigation/routesBuilder';
import * as Screens from './screens';
import {bootstrap} from './config/bootstrap';
import track from './config/analytics';
import {data} from './data'
import {AppLoading, Font} from 'expo';
import {View} from "react-native";

import { createRootNavigator } from "./initialRouter";
import { isSignedIn } from "./auth";


bootstrap();
data.populateData();

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

let SideMenu = withRkTheme(Screens.SideMenu);
const KittenApp = StackNavigator({
  First: {
    screen: Screens.SplashScreen
  },
  Home: {
    screen: DrawerNavigator({
        ...AppRoutes,
      },
      {
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        contentComponent: (props) => <SideMenu {...props}/>
      })
  }
}, {
  headerMode: 'none',
});

export default class App extends React.Component {
  state = {
    loaded: false,
    signedIn: false,
    checkedSignIn: false
  };

  componentWillMount() {
    this._loadAssets();
    isSignedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }

  _loadAssets = async() => {
    await Font.loadAsync({
      'fontawesome': require('./assets/fonts/fontawesome.ttf'),
      'icomoon': require('./assets/fonts/icomoon.ttf'),
      'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
      'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({loaded: true});
  };

  render() {
    if (!this.state.loaded) {
      return <AppLoading />;
    }

    // const { checkedSignIn, signedIn } = this.state;

    // const Layout = createRootNavigator(signedIn);
    // return <Layout />;

    return (
      <View style={{flex: 1}}>
        <KittenApp
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getCurrentRouteName(currentState);
            const prevScreen = getCurrentRouteName(prevState);

            if (prevScreen !== currentScreen) {
              track(currentScreen);
            }
          }}
        />
      </View>
    );
  }
}

Expo.registerRootComponent(App);
