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