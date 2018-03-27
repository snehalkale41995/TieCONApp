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
            renderDay={this.renderDay}
        />);
    }
    /**
     * Render time on left side of tile
     */
    renderDay = (day, item) => {
            return (
                <Text>{item?Moment(item.startTime).format("hh:mm") : ''}</Text>
            )
    }
    /**
     * Fetch Sessions for selected date
     */
    loadItems = (day) => {
        const currentDate = Moment(day.dateString).format("YYYY-MM-DD");
        Service.getDocRef(SESSIONS_TABLE)
        .where("startTime", ">=", Moment(day.dateString).toDate())
        .where("startTime", "<=", Moment(day.dateString).add(1,'day').toDate())
        .orderBy("startTime")
        .get().then((snapshot)=>{
            var sessions = [];
            let allSpeakers =[];
            let index=0;
            snapshot.forEach((session)=>{
                const __index = ++index;
                const {
                    eventName,
                    extraServices,
                    isRegrequired,
                    room,
                    startTime,
                    speakers,
                    endTime
                } = session.data();
                const duration = Moment(endTime).diff(Moment(startTime), 'minutes');
                const startingAt = Moment().format("hh:mm");
                sessions.push({
                    key: session.id,
                    eventName,
                    extraServices,
                    isRegrequired,
                    room,
                    speakers,
                    speakersDetails:[],
                    startTime,
                    startingAt,
                    endTime,
                    duration
                });
            });
            let newItems = {};
            newItems[currentDate] = sessions;
            this.setState({items: newItems});
        });
    }
    /**
     * Session Rendering
     */
    renderItem = (item) => {
        return (<ScheduleTile navigation={this.props.navigation} session={item}/>);
    }
    /**
     * Handle Session Rendering 
     * when no event is present on selected date
     */
    renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    }
    /**
     */
    rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    }
    /**
     * get the time in string format
     */
    timeToString = (time) => {
        const date = new Date(time);
        return date
            .toISOString()
            .split('T')[0];
    }
}
/**
 * Component Styles parameters
 */
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