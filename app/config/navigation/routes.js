import React from 'react';
import {FontIcons} from '../../assets/icons';
import * as Screens from '../../screens/index';
import { HomePage } from '../../screens/index';
import _ from 'lodash';

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
    icon: 'md-home',
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
    icon: 'md-qr-scanner',
    screen: Screens.QRScanner,
    children: [],
    roleNames: ['Admin','Speaker']
  },
  // {
  //   id: 'Dashboard',
  //   title: 'Dashboard',
  //   icon: 'ios-list',
  //   screen: Screens.Dashboard,
  //   children: []
  // },
  // {
  //   id: 'Themes',
  //   title: 'Themes',
  //   icon: FontIcons.theme,
  //   screen: Screens.Themes,
  //   children: []
  // },
];

let menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: 'GridV2',
  title: 'Start',
  screen: HomePageMenuScreen,
  children: []
},);

export const MenuRoutes = menuRoutes;