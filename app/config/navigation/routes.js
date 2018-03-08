import React from 'react';
import {FontIcons} from '../../assets/icons';
import * as Screens from '../../screens/index';
import { HomePage } from '../../screens/index';
import _ from 'lodash';
import { TabNavigator, TabView } from 'react-navigation'

export class HomePageMenuScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'.toUpperCase()
  };
  render() {
    return (
     <HomePage navigation={this.props.navigation} />
    )
  }
}

export const MainRoutes = [
  {
    id: 'HomeMenu',
    title: 'Home',
    icon: FontIcons.login,
    screen: HomePageMenuScreen,
    children: [
      {
        id: 'Contacts',
        title: 'Contacts',
        screen: Screens.Contacts,
        children: []
      },
      {
        id: 'Chat',
        title: 'Chat',
        screen: Screens.Chat,
        children: []
      },
      {
        id: 'ChatList',
        title: 'Chat List',
        screen: Screens.ChatList,
        children: []
      },
      {
        id: 'ProfileV1',
        title: 'User Profile V1',
        screen: Screens.ProfileV1,
        children: []
      }
    ]
  },
  {
    id: 'QRScanner',
    title: 'QR Scanner',
    icon: FontIcons.login,
    screen: Screens.QRScanner,
    children: [
    ]
  },
  {
    id: 'Themes',
    title: 'Themes',
    icon: FontIcons.theme,
    screen: Screens.Themes,
    children: []
  },
];

const TabNav = TabNavigator({
  Chat: {
      // screen: ({ navigation }) => <Screens.Chat screenProps={{ rootNavigation: navigation }} /> },
      screen: Screens.Chat,
      navigationOptions: {
          tabBarLabel:"Chat",
          tabBarIcon: ({ tintColor }) => <Icon name={"ios-add"} size={30} color={tintColor} />
      }
  },
  ChatList: {
    screen: Screens.ChatList,
    navigationOptions: {
        tabBarLabel:"ChatList",
        tabBarIcon: ({ tintColor }) => <Icon name={"ios-add"} size={30} color={tintColor} />
    }
  },
  Comments: {
    screen: Screens.Comments,
    navigationOptions: {
        tabBarLabel:"Comments",
        tabBarIcon: ({ tintColor }) => <Icon name={"ios-add"} size={30} color={tintColor} />
    }
  }
}, {
      tabBarOptions: {
          activeTintColor: '#222',
      }
});


let menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: 'GridV2',
  title: 'Start',
  screen: HomePageMenuScreen,
  children: [
    {
      id: 'Contacts',
      title: 'Contacts',
      screen: Screens.Contacts,
      children: []
    },
    {
      id: 'Chat',
      title: 'Chat',
      screen: Screens.Chat,
      children: []
    },
  ]
},);

export const MenuRoutes = menuRoutes;