import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

export class SessionDetails extends Component {
  static navigationOptions = {
    title: 'Session Details'.toUpperCase()
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.sessionView}>
        <Text>
          Session Details here
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sessionView: {
    flex: 1,
    flexDirection: 'column'
  }
});
