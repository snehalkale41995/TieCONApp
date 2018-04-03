import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";

import MyAgenda from './schedule/MyAgenda';
import EventCal from './schedule/EventCal';
import {Service} from '../../services';

export class ProgramsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tabs style={{ elevation: 3 }} style={styles.tabContent}>
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
          <MyAgenda navigation={this.props.navigation} />
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
  tabContent: {
    backgroundColor: 'red',
  }
}));