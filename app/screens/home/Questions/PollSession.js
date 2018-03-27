import React from 'react';
import { View, Text } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage } from 'react-native';
import { RkComponent, RkTheme, RkText, RkStyleSheet, RkChoiceGroup, RkChoice, RkAvoidKeyboard, RkButton, RkCard, RkTextInput } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import { PieChart } from 'react-native-svg-charts'
import firebase from '../../../config/firebase'

var firestoreDB = firebase.firestore();

export default class PollSession extends React.Component {
    static navigationOptions = {
        title: 'PollSession'.toUpperCase()
    };
    constructor(props) {
        super(props);
        this.state = {
            sessionId: this.props.navigation.state.params.sessionId,
            Question: "Are you coming to Pune ?",
            Value: ["Yes", "No"],
            Response: "",
            PositiveResponse: "",
            NegativeResponse: "",
            ShowGraph: false,
            FeedBackGiver: ""
        }
    }
    componentWillMount() {
        let thisRef = this;
        AsyncStorage.getItem("USER_DETAILS").then((userDetails) => {
            let user = JSON.parse(userDetails)
            thisRef.setState({
                FeedBackGiver: user.firstName + " " + user.lastName
            })
        })
        .catch(err => {
            console.warn('Errors', err);
        });       
    }

    onSelectOption = (id) => {
        var Response = this.state.Value[id];
        this.setState({
            Response: Response
        })
    }

    onSubmitResponse = () => {
        let thisRef = this;
        if (this.state.Response !== "") {
            firestoreDB.collection("Feedback_Responses")
                .add({
                    Question: thisRef.state.Question,
                    Response: thisRef.state.Response,
                    Date: firebase.firestore.FieldValue.serverTimestamp(),
                    FeedBackGiver: thisRef.state.FeedBackGiver,
                    sessionId: thisRef.state.sessionId
                })
                .then(function (docRef) {
                    thisRef.getPollData();
                    thisRef.setState({
                        Response: "",
                        ShowGraph : true
                    }) 
                })
                .catch(function (error) {
                });
        }
        else {
            Alert.alert("Please give feedback");
        }
    }
    getPollData = () => {
        let thisRef = this;
        this.state.Value.map(fItem => {
            if (fItem == "Yes") {
                firestoreDB.collection("Feedback_Responses")
                    .where("Response", "==", fItem)
                    .get()
                    .then(function (docRef) {
                        thisRef.setState({
                            PositiveResponse: docRef.docs.length
                        })
                    })
                    .catch(function (error) {
                    });
            }
            else {
                firestoreDB.collection("Feedback_Responses")
                    .where("Response", "==", fItem)
                    .get()
                    .then(function (docRef) {
                        thisRef.setState({
                            NegativeResponse: docRef.docs.length
                        })
                    })
                    .catch(function (error) {
                    });
            }
        })
    }
    render(){
        const data = [
            {
                key: 1,
                amount: parseInt(this.state.PositiveResponse),
                svg: { fill: 'green' },
            },
            {
                key: 2,
                amount: parseInt(this.state.NegativeResponse),
                svg: { fill: 'red' }
            }
        ]
        if(this.state.ShowGraph == false){
            return (
                <View style={{marginTop : 5 , marginLeft : 10}}>
                    <Text>{this.state.Question}</Text>
                    <RkChoiceGroup radio style={{ marginTop: 3, marginBottom: 3 }} onChange={(id) => { this.onSelectOption(id) }} >
                        <TouchableOpacity choiceTrigger >
                            <View style={{ flexDirection: 'row', marginBottom: 3, marginRight: 15, alignItems: 'center' }}>
                                <RkChoice rkType='radio'
                                    style={{ backgroundColor: '#adafb2' }}
                                    id="Yes" value="Yes"
                                />
                                <Text>Yes</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity choiceTrigger >
                            <View style={{ flexDirection: 'row', marginBottom: 3, marginRight: 15, alignItems: 'center' }}>
                                <RkChoice rkType='radio'
                                    style={{ backgroundColor: '#adafb2' }}
    
                                    id="No" value="No"
                                />
                                <Text>No</Text>
                            </View>
                        </TouchableOpacity>
                    </RkChoiceGroup>
                    <RkButton rkType='success' style={{ alignSelf: 'center', width: 340 }} onPress={() => this.onSubmitResponse()}> Submit </RkButton>
    
                </View>
    
            );
        }
        else{
            return(
                <View style={{marginTop : 5 , marginLeft : 10}}>
                    <Text style={{fontSize : 15}}>FeedBack Overview</Text>
                <PieChart
                    style={{ height: 200, marginTop : 25 }}
                    valueAccessor={({ item }) => item.amount}
                    data={data}
                    spacing={0}
                    outerRadius={'95%'}
                    renderDecorator={({ item, pieCentroid, index }) => (
                        <Text
                            key={index}
                            x={pieCentroid[ 0 ]}
                            y={pieCentroid[ 1 ]}
                            fill={'white'}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={24}
                            stroke={'black'}
                            strokeWidth={0.2}
                        >
                            {item.amount}
                        </Text>
                       
                    )} 
                />
                 <Text >{this.state.Question}</Text>
                 <Text style={{color : "red"}}>Negative Response =>  {this.state.NegativeResponse}</Text>
                 <Text style={{color : "green"}}>Positive Response => {this.state.PositiveResponse}</Text>
            </View>
            );
            
        }
    }

    
}

let styles = RkStyleSheet.create(theme => ({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.screen.base
    },
}));
