import React from 'react';
import {Text, View} from 'native-base';
import {StyleSheet, FlatList} from 'react-native';
import {Service} from '../../../services';
import Moment from 'moment';

export default class ScheduleTile extends React.Component {

    constructor(props) {
        super(props);
    }
    /**
     * Render Schedule Tile
     */
    render() {
        if(this.props.session){

        
        const speakers = this
            .props
            .session
            .speakers
            .map((speaker, index) => <Text key={index}>{speaker}</Text>);
        return (
            <View style={{marginBottom: 10, borderBottomWidth:2, borderBottomColor: '#c8c8c8'}}> 
                <Text>Session Name: {this.props.session.key}</Text > 
                <Text>Session Room: {this.props.session.room}</Text>
                <Text>Start Time: {Moment(this.props.session.startTime).format('DD-MMM HH:mm')}</Text>
                <Text>Speakers</Text>
                    {speakers}
            </View>
        );
        }else{
            <Text>Unable to fetch detailis </Text>
        }
    }
}