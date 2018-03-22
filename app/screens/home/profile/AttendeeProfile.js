import React, {Component} from 'react';
import {Text} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {RkText, RkButton, RkStyleSheet} from 'react-native-ui-kitten';

export class AttendeeProfile extends Component {
    static navigationOptions = {
        title: 'User Profile'.toUpperCase()
    };

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.userId = params.id;
    }

    componentDidMount(){
        //Fetch User Details
        this.user = this.getAttendeeDetails();
    }

    getAttendeeDetails = ()=>{

    }
    render() {
        return (
            <Text>{this.userId}</Text>
        )
    }
}

let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base
    }
}));