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
            <TabHeading  style={{backgroundColor : '#ed1b24' }} contentStyle ={{color : 'white'}}><Icon  style ={{color: 'white'}} name="calendar"/><Text style ={{color: 'white'}}>Schedule</Text></TabHeading>
          }
        >        
          <EventCal navigation={this.props.navigation}/>
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor : '#ed1b24' }}><Icon name="ios-link"/><Text>My Agenda</Text></TabHeading>
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