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
            question: "Are you coming to Pune ?",
            value: ["Yes", "No"],
            response: "",
            positiveResponse: "",
            negativeResponse: "",
            showGraph: false,
            feedBackGiver: ""
        }
    }
    componentWillMount() {
        let thisRef = this;
        AsyncStorage.getItem("USER_DETAILS").then((userDetails) => {
            let user = JSON.parse(userDetails)
            thisRef.setState({
                feedBackGiver: user.firstName + " " + user.lastName    
            })  
            thisRef.checkPollResponse();
        })
        .catch(err => {
            console.warn('Errors', err);
        });  
    }

    checkPollResponse = () =>{
        let thisRef = this;
        let sessionId = this.state.sessionId;
        let user  = this.state.feedBackGiver;
        var query = firestoreDB.collection("Feedback_Responses")
        query = query.where("FeedBackGiver", "==" , user);
        query = query.where("sessionId" ,"==" , sessionId);
        query.get().then(function(docRef){
           if(docRef.docs.length > 0){
            thisRef.setState({
                showGraph : true
            })
            thisRef.getSessionPollOverview();
           }
        })
        .catch( function ( error){
            console.log("error", error);
        })
    }
    getSessionPollOverview = () => {
        let sessionId = this.state.sessionId;
        let thisRef = this;
        this.state.value.map(fItem =>{
            if(fItem == "Yes"){
                var query = firestoreDB.collection("Feedback_Responses")
                query = query.where("Response", "==" , fItem);
                query = query.where("sessionId" ,"==" , sessionId);
                query.get().then(function(docRef){
                    thisRef.setState({
                        positiveResponse : docRef.docs.length
                    })
                })
                .catch( function ( error){
                    console.log("error", error);
                })
            }
            else{
                var query = firestoreDB.collection("Feedback_Responses")
                query = query.where("Response", "==" , fItem);
                query = query.where("sessionId" ,"==" , sessionId);
                query.get().then(function(docRef){
                    thisRef.setState({
                        negativeResponse : docRef.docs.length
                    })
                })
                .catch( function ( error){
                    console.log("error", error);
                })
            }
        }) 
    }
    onSelectOption = (id) => {
        var response = this.state.value[id];
        this.setState({
            response: response
        })
    }

    onSubmitResponse = () => {
        let thisRef = this;
        if (this.state.response !== "") {
            firestoreDB.collection("Feedback_Responses")
                .add({
                    question: thisRef.state.question,
                    Response: thisRef.state.response,
                    Date: firebase.firestore.FieldValue.serverTimestamp(),
                    FeedBackGiver: thisRef.state.feedBackGiver,
                    sessionId: thisRef.state.sessionId
                })
                .then(function (docRef) {
                    thisRef.getSessionPollOverview();
                    thisRef.setState({
                        response: "",
                        showGraph : true
                    }) 
                })
                .catch(function (error) {
                });
        }
        else {
            Alert.alert("Please give feedback");
        }
    }
    render(){
        const data = [
            {
                key: 1,
                amount: parseInt(this.state.positiveResponse),
                svg: { fill: 'green' },
            },
            {
                key: 2,
                amount: parseInt(this.state.negativeResponse),
                svg: { fill: 'red' }
            }
        ]
        if(this.state.showGraph == false){
            return (
                <View style={{marginTop : 5 , marginLeft : 10}}>
                    <Text>{this.state.question}</Text>
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
                 <Text >{this.state.question}</Text>
                 <Text style={{color : "red"}}>Negative response =>  {this.state.negativeResponse}</Text>
                 <Text style={{color : "green"}}>Positive response => {this.state.positiveResponse}</Text>
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
