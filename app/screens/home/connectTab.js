import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";
import { Platform} from 'react-native';
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
            <TabHeading style={{backgroundColor : '#ed1b24' }}><Icon style={[styles.textColor]} name="calendar"/><Text style={[styles.textColor]}>All Attendees</Text></TabHeading>
          }
        >
          <Contacts navigation={this.props.navigation} />
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor : '#ed1b24' }}><Icon style={[styles.textColor]} name="ios-link"/><Text style={[styles.textColor]}>My Chats</Text></TabHeading>
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
  textColor : {
    color: Platform.OS === 'ios' ? 'white' :  'white'
  }
}));