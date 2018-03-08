import {FontIcons} from '../../assets/icons';
import * as Screens from '../../screens/index';
import _ from 'lodash';
import { TabNavigator, TabView } from 'react-navigation'

export const MainRoutes = [
  {
    id: 'HomeMenu',
    title: 'Home',
    icon: FontIcons.login,
    screen: Screens.HomePage,
    children: [
      {
        id: 'Contacts',
        title: 'Contacts',
        screen: Screens.Contacts,
        children: []
      },
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
  screen: Screens.HomePage,
  children: [
    {
      id: 'Contacts',
      title: 'Contacts',
      screen: Screens.Contacts,
      children: []
    },
  ]
},);

export const MenuRoutes = menuRoutes;