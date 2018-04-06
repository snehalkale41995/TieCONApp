import React from 'react';
import { RkText} from 'react-native-ui-kitten';


function renderIf(condition, content) {
  if (condition) {
      return content;
  } else {
      return null;
  }
}

export class HelpDesk extends React.Component {
  static navigationOptions = {
    title: 'About Tie'.toUpperCase()
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
