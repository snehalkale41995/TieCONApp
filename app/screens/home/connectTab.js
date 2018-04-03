import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";
import { ChatList, Contacts } from  '../index';

export class ConnectTab extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <Tabs style={{ elevation: 3 }}>
        <Tab
          heading={
            <TabHeading style={{backgroundColor : '#ed1b24' }}><Icon name="calendar"/><Text>All Attendees</Text></TabHeading>
          }
        >
          <Contacts navigation={this.props.navigation} />
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor : '#ed1b24' }}><Icon name="ios-link"/><Text>My Chats</Text></TabHeading>
          }
        >
          <ChatList navigation={this.props.navigation} />
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