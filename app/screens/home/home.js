import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Dimensions, Keyboard } from 'react-native';
import { RkButton, RkText, RkChoice, RkModalImg, RkCard, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTabView, RkTheme } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import { NavigationActions } from 'react-navigation';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import { onSignOut } from "../../auth";
import * as Screens from '../index';
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
        tabBarIcon: ({ tintColor }) => <Icon name={"slideshare"} size={30} color={tintColor} />
    }
  },
  Speakers: {
    screen: Screens.Chat,
    navigationOptions: {
        tabBarLabel:"Speakers",
        tabBarIcon: ({ tintColor }) => <Icon name={"users"} size={30} color={tintColor} />
    }
  },
  Buzz: {
    screen: Screens.Chat,
    navigationOptions: {
        tabBarLabel:"Buzz",
        tabBarIcon: ({ tintColor }) => <Icon name={"bubbles"} size={30} color={tintColor} />
    }
  }
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

  onTabChange = (event, viewName) => {
    this.setState({
      currentTab: viewName
    })
  }

  render() {
    return (
      <TabNav />
      // <Container>
      //   <Header />
      //   <Content>
      //     <Text>Body</Text>
      //   </Content>
      //   <Footer>
      //   <FooterTab>
      //     <Button active onPress={(event) => this.onTabChange(event, 'Home')} vertical>
      //       <Icon name="apps" />
      //       <Text>Home</Text>
      //     </Button>
      //     <Button active onPress={(event) => this.onTabChange(event, 'Program')} vertical>
      //       <Icon name="apps" />
      //       <Text>Program</Text>
      //     </Button>
      //     <Button vertical onPress={(event) => onSignOut().then(() => this.props.navigation.navigate("SignedOut"))} vertical>
      //       <Icon name="camera" />
      //       <Text>Signout</Text>
      //     </Button>
      //     <Button vertical onPress={(event) => this.onTabChange(event, 'Speakers')} vertical>
      //       <Icon active name="navigate" />
      //       <Text>Speaker</Text>
      //     </Button>
      //     <Button vertical onPress={(event) => this.onTabChange(event, 'Buzz')} vertical>
      //       <Icon name="person" />
      //       <Text>Buzz</Text>
      //     </Button>
      //   </FooterTab>
      //   </Footer>
      // </Container>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
}));