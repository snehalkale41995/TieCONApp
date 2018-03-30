import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";
import { AsyncStorage } from "react-native";
import AskQuestion from './Questions/AskQuestion';
import PollSession from './Questions/PollSession';

export  class QueTab extends React.Component {
  static navigationOptions = {
    title: 'Ask Questions'.toUpperCase()
  };
  constructor(props) {
    super(props);
    this.state ={
      sessionId : this.props.navigation.state.params.sessionId,
    }
  }

  render() {
    return (
      <Tabs style={{ elevation: 3 }}>
        <Tab
          heading={
            <TabHeading><Icon name="md-help"/><Text>Ask Questions</Text></TabHeading>
          }
        >
         <AskQuestion  navigation={this.props.navigation} sessionId = {this.state.sessionId}  />
        </Tab>
        <Tab
          heading={
            <TabHeading><Icon name="ios-stats"/><Text>Poll Session </Text></TabHeading>
          }
        >
          <PollSession navigation={this.props.navigation} sessionId = {this.state.sessionId}  UserName = {this.state.UserName}/>
        </Tab>
      </Tabs>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
}));