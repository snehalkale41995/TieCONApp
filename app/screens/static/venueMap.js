import React from 'react';
import { RkText} from 'react-native-ui-kitten';


function renderIf(condition, content) {
  if (condition) {
      return content;
  } else {
      return null;
  }
}

export class VenueMap extends React.Component {
  static navigationOptions = {
    title: 'Venue Map'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return (<RkText>Coming Soon</RkText>);
  }
}
