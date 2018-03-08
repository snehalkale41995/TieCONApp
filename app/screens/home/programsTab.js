import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";

export class ProgramsTab extends React.Component {
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
              <TabHeading><Icon name="calendar"/><Text>Schedule</Text></TabHeading>
            }
          >
            <Text> Schedule </Text>
          </Tab>
          <Tab
            heading={
              <TabHeading><Icon name="ios-link"/><Text>My Agenda</Text></TabHeading>
            }
          >
            <Text> My Agenda </Text>
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