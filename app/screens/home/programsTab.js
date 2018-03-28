import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";

import Schedule from './schedule/Schedule';
import EventCal from './schedule/EventCal';
export class ProgramsTab extends React.Component {
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
            <TabHeading><Icon name="calendar"/><Text>Schedule</Text></TabHeading>
          }
        >        
          <EventCal navigation={this.props.navigation}/>
        </Tab>
        <Tab
          heading={
            <TabHeading><Icon name="ios-link"/><Text>My Agenda</Text></TabHeading>
          }
        >
          <Text>In Progress </Text>
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