import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Service} from '../../../services';
import ScheduleTile from './Schedule-tile';
import Moment from 'moment';

const SESSIONS_TABLE = 'Sessions';
export default class EventCal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {}
        };
    }

    componentWillMount() {}

    render() {
        return (<Agenda
            items={this.state.items}
            hideKnob={true}
            loadItemsForMonth={this.loadItems}
            selected={'2018-04-20'}
            renderItem={this.renderItem}
            renderEmptyDate={this.renderEmptyDate}
            rowHasChanged={this.rowHasChanged}
            minDate={'2018-04-20'}
            maxDate={'2018-04-21'}
            monthFormat={'yyyy'}
            theme={{
                agendaKnobColor: 'green'
            }}

            //renderDay={this.renderDay}
        />);
    }

    renderDay = (day, item) => {
            return (
                <Text>{item?item.eventName : 'default'}</Text>
            )
    }
    loadItems = (day) => {
        Service.getDocRef(SESSIONS_TABLE).where("startTime", ">=", new Date());
        Service.getList(SESSIONS_TABLE, (snapshot) => {
            const sessions = [];
            snapshot.forEach((event) => {
                const {
                    eventName,
                    extraServices,
                    isRegrequired,
                    room,
                    startTime,
                    speakers,
                    endTime
                } = event.data();
                const duration = Moment(endTime).diff(Moment(startTime), 'minutes');
                
                const startingAt = Moment().format("hh:mm");
                sessions.push({
                    key: event.id,
                    eventName,
                    extraServices,
                    isRegrequired,
                    room,
                    speakers,
                    startTime,
                    startingAt,
                    endTime,
                    duration
                });
            });
            let newItems = {};
            console.log("date String"+day.dateString);
            newItems[Moment(day.dateString).format("YYYY-MM-DD")] = sessions;
            this.setState({items: newItems});
        })
    }

    renderItem = (item) => {
        return (<ScheduleTile navigation={this.props.navigation} session={item}/>);
    }

    renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    }

    rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    }

    timeToString = (time) => {
        const date = new Date(time);
        return date
            .toISOString()
            .split('T')[0];
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});