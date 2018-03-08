import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";
import { Chat, Contacts } from  '../index';

export class ConnectTab extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
        <Tabs style={{ elevation: 3 }}>
          <Tab
            heading={
              <TabHeading><Icon name="calendar"/><Text>All Attendees</Text></TabHeading>
            }
          >
            <Contacts />
          </Tab>
          <Tab
            heading={
              <TabHeading><Icon name="ios-link"/><Text>My Chats</Text></TabHeading>
            }
          >
            <Text>My Chats</Text>
          </Tab>
        </Tabs>
      </RkAvoidKeyboard>        
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
}));