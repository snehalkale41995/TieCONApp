import React from "react";
import { DrawerNavigator, StackNavigator, TabNavigator } from 'react-navigation';
import { withRkTheme } from 'react-native-ui-kitten';
import { AppRoutes } from './config/navigation/routesBuilder';
import track from './config/analytics';
import { Platform, StatusBar, View } from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import * as Screens from './screens';

const headerStyle = {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};


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
                contentComponent: (props) => <SideMenu {...props} />
            })
    }
}, {
        headerMode: 'none',
    });

export const AppLayout = ({}) => (
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

export const SignedOut = StackNavigator({
    SignUp: {
        screen: Screens.LoginV2,
        navigationOptions: {
            title: "Sign Up",
            headerStyle
        }
    },
    SignIn: {
        screen: Screens.SignUp,
        navigationOptions: {
            title: "Sign In",
            headerStyle
        }
    }
});

export const SignedIn = StackNavigator({
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
                contentComponent: (props) => <SideMenu {...props} />
            })
    }
}, {
        headerMode: 'none',
    });

export const createRootNavigator = (signedIn = false) => {
    return StackNavigator(
        {
            SignedIn: {
                screen: SignedIn,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SignedOut: {
                screen: SignedOut,
                navigationOptions: {
                    gesturesEnabled: false
                }
            }
        },
        {
            headerMode: "none",
            mode: "modal",
            initialRouteName: signedIn ? "SignedIn" : "SignedOut"
        }
    );
};