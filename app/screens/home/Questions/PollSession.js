import React from 'react';
import { View, Text } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage,ActivityIndicator } from 'react-native';
import { RkComponent, RkTheme, RkText, RkStyleSheet, RkChoiceGroup, RkChoice, RkAvoidKeyboard, RkButton, RkCard, RkTextInput } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import { PieChart } from 'react-native-svg-charts';
import firebase from '../../../config/firebase';
import {GradientButton} from '../../../components/gradientButton';

var firestoreDB = firebase.firestore();

export default class PollSession extends React.Component {
    constructor(props) {
        super(props);
        this.sessionDetails = this.props.navigation.state.params.sessionDetails;
        this.state = {
            sessionId: this.sessionDetails.key,
            question: "Are you coming to Pune ?",
            pollResponseValue: ["Yes", "No"],
            response: "",
            positiveResponse: "",
            negativeResponse: "",
            showGraph: false,
            feedBackGiver: "",
            showPoll : false
        }
    }
    componentWillMount() {
        let thisRef = this;
        AsyncStorage.getItem("USER_DETAILS").then((userDetails) => {
            let user = JSON.parse(userDetails)
            thisRef.setState({
                feedBackGiver: user
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
        let user  = this.state.feedBackGiver.uid;
        var getPollResponse= firestoreDB.collection("feedbackResponses")
        getPollResponse = getPollResponse.where("FeedBackGiver", "==" , user)
        getPollResponse = getPollResponse.where("sessionId" ,"==" , sessionId)
        getPollResponse.get().then(function(docRef){
           if(docRef.docs.length > 0){
            thisRef.setState({
                showGraph : true
            })
            thisRef.getSessionPollOverview();
           }
           else{
            thisRef.setState({
                showPoll : true
            })
           }
        })
        .catch( function ( error){
            console.log("error", error);
        })
    }
    getSessionPollOverview = () => {
        let sessionId = this.state.sessionId;
        let thisRef = this;
        this.state.pollResponseValue.map(fItem =>{
            if(fItem == "Yes"){
                var getPositiveCount = firestoreDB.collection("feedbackResponses")
                getPositiveCount = getPositiveCount.where("Response", "==" , fItem)
                getPositiveCount = getPositiveCount.where("sessionId" ,"==" , sessionId)
                getPositiveCount.get().then(function(docRef){
                    thisRef.setState({
                        positiveResponse : docRef.docs.length
                    })
                })
                .catch( function ( error){
                    console.log("error", error);
                })
            }
            else{
                var getNegativeCount = firestoreDB.collection("feedbackResponses")
                getNegativeCount = getNegativeCount.where("Response", "==" , fItem)
                getNegativeCount = getNegativeCount.where("sessionId" ,"==" , sessionId)
                getNegativeCount.get().then(function(docRef){
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
        var response = this.state.pollResponseValue[id];
        this.setState({
            response: response
        })
    }

    onSubmitResponse = () => {
        let thisRef = this;
        if (this.state.response !== "") {
            firestoreDB.collection("feedbackResponses")
                .add({
                    question: thisRef.state.question,
                    Response: thisRef.state.response,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    FeedBackGiver: thisRef.state.feedBackGiver.uid,
                    sessionId: thisRef.state.sessionId
                })
                .then(function (docRef) {
                    thisRef.getSessionPollOverview();
                    thisRef.setState({
                        response: "",
                        showGraph : true,
                        showPoll : false
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
        if(this.state.showGraph == false && this.state.showPoll == true){
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
                    <GradientButton colors={['#f20505', '#f55050']} text='Submit'
                    style={{ alignSelf: 'center', width: 340 }} onPress={() => this.onSubmitResponse()} /> 
    
                </View>
    
            );
        }
        else if(this.state.showGraph == true && this.state.showPoll == false){
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
        else{
            return(
                <View style={[styles.loading]} > 
                <ActivityIndicator size='large' /> 
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
    loading: {
        marginTop: 250,
        left: 0,
        opacity: 0.5,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
}));
