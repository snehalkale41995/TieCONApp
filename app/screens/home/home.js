import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Dimensions, Keyboard } from 'react-native';
import { RkButton, RkText, RkChoice, RkModalImg, RkCard, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTabView, RkTheme } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import { NavigationActions } from 'react-navigation';
import { Container, Content, Footer, Header, Title, Button, Icon, Tabs, Tab, Text, Right, Left, Body, TabHeading } from "native-base";
import { onSignOut } from "../../auth";
import * as Screens from '../index';
import { Contacts, Chat, ProgramsTab, ConnectTab } from  '../index';
import { TabNavigator, TabView } from 'react-navigation'

export default function renderIf(condition, content) {
  if (condition) {
      return content;
  } else {
      return null;
  }
}

const TabNav = TabNavigator({
  Home: {
      // screen: ({ navigation }) => <Screens.Chat screenProps={{ rootNavigation: navigation }} /> },
      screen: Screens.Chat,
      navigationOptions: {
          tabBarLabel:"Home",
          tabBarIcon: ({ tintColor }) => <Icon name={"home"} size={30} color={tintColor} />
      }
  },
  Program: {
    screen: Screens.Chat,
    navigationOptions: {
        tabBarLabel:"Program",
        tabBarIcon: ({ tintColor }) => <Icon name={"calendar"} size={30} color={tintColor} />
    }
  },
  Connect: {
    screen: Screens.Chat,
    navigationOptions: {
        tabBarLabel:"Connect",
        tabBarIcon: ({ tintColor }) => <Icon name={"ios-link"} size={30} color={tintColor} />
    }
  },
  Speakers: {
    screen: Screens.Contacts,
    navigationOptions: {
        tabBarLabel:"Speakers",
        tabBarIcon: ({ tintColor }) => <Icon name={"ios-people"} size={30} color={tintColor} />
    }
  },
}, {
      animationEnabled: true,
      tabBarOptions: {
          activeTintColor: '#222',
          showIcon: true
      },
      tabBarPosition: "bottom",
      swipeEnabled: true,
});

export class HomePage extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Home'.toUpperCase(),
  });

  constructor(props) {
    super(props);
    this.state = { 
      currentTab: 'Home' 
    };
  }

  render() {
    return (
      // <TabNav />
      // <Contacts />
      <Container>
        <Tabs tabBarPosition="bottom" style={{ elevation: 3 }}>
          <Tab
            heading={
              <TabHeading style={{ flexDirection: 'column' }}><Icon name="calendar"/><Text>Program</Text></TabHeading>
            }
          >
            <ProgramsTab />
          </Tab>
          <Tab
            heading={
              <TabHeading style={{ flexDirection: 'column' }}><Icon name="ios-link"/><Text>Connect</Text></TabHeading>
            }
          >
            <ConnectTab />
          </Tab>
          <Tab
            heading={
              <TabHeading style={{ flexDirection: 'column' }}><Icon name="ios-people"/><Text>Speakers</Text></TabHeading>
            }
          >
            <Contacts />
          </Tab>
        </Tabs>
      </Container>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
}));