import React from 'react';
import {ScrollView} from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage } from 'react-native';
import { RkComponent, RkTheme,RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';

//import { Service } from '../../../services';
import ReactMoment from 'react-moment';
import Moment from 'moment';
//import { Avatar } from '../../../components';
import firebase from './../../config/firebase'

var firestoreDB = firebase.firestore();
let ShareInput = []; 
let AnswerInput = [];
let QueArray = [];
let form = [];
export class Survey extends RkComponent {
    static navigationOptions = {
        title: 'Survey'.toUpperCase()
      };
    constructor(props) {
        super(props);
        this.state = {
            queForm: [],
            askedBy: "",
            Responses : [],
            sessionId : this.props.navigation.state.params.sessionId,
        }
        this.onFormSelectValue = this.onFormSelectValue.bind(this);
        this.onChangeMultiChoice = this.onChangeMultiChoice.bind(this);
    }
    componentWillMount() {
        this.getForm();
        let thisRef = this;
        AsyncStorage.getItem("USER_DETAILS").then((userDetails) => {
            let user = JSON.parse(userDetails)
            let Name = user.firstName + " " + user.lastName;
            thisRef.setState({
                askedBy: Name
            })
        })
            .catch(err => {
                console.warn('Errors');
            });



    }

    getForm = () => {
        let thisRef = this;
        firestoreDB.collection("QuestionsForm").doc("oQwNtp86Zxlu1JFkFhwg").get().then(function (doc) {
            form = doc.data();
            thisRef.setState({
                queForm: form.Questions
            })
            //console.log("form", form);
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
    onSubmit = () => {
        QueArray.forEach(fItem => {
            if (fItem.Answer.size >= 1)
                fItem.Answer = Array.from(fItem.Answer);
        })
        this.setState({
            Responses: QueArray,
        })
        let compRef = this;
        firestoreDB.collection('SessionSurvey').add({
            Responses: QueArray,
            pollBy: compRef.state.askedBy,
            date: new Date(),
            SessionId :  compRef.state.sessionId
        })
            .then(function (docRef) {
                Alert.alert("Thanks for your response");
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }
    onFormSelectValue = (queForm) => {
        ShareInput = this.state.queForm.map(Fitem => {

            QueArray.push({ Question: Fitem.QuestionTitle, Answer: new Set() });
            
            return (
               
                    <View style={{ marginLeft: 10 ,marginBottom :10}}>
                        <Label style={{ flexDirection: 'row', fontFamily: RkTheme.current.fonts.family.regular, alignItems: 'center', marginTop: 3, marginBottom: 2, fontSize: 20 }}>Que.{Fitem.QueId} :{Fitem.QuestionTitle}</Label>
                        {this.RenderAnswerField(Fitem)}
                    </View>
                
            )
        });
        return ShareInput;
    }

    RenderAnswerField = (item) => {
        if (item.AnswerFeild == "Input Text") {
            AnswerInput:
            return (
                <RkTextInput type="text" placeholder="Answer Title" name="Answer" onChangeText={(text) => this.onChangeText(text, item.QueId)} id={item.QueId} />
            )
        } else if (item.AnswerFeild == "Mulitple Choice") {
            AnswerInput:
            return (
                //onChange={(id) => {this.onChange(item.value, item.QueId,id)}}
                <RkChoiceGroup radio style= {{marginTop :3 ,marginBottom: 3}}  onChange={(id) => {this.onChangeMultiChoice(item.value, item.QueId,id)}} >
                    {this.onMultiChoice(item.value, item.QueId)}
                </RkChoiceGroup>
            )
        }
        else if (item.AnswerFeild == "Check Box") {
            AnswerInput:
            return (
                <RkChoiceGroup   style= {{marginTop :3 ,marginBottom: 3}}>
                    {this.onCheckBox(item.value, item.QueId)}
                </RkChoiceGroup >
            )
        }
        return AnswerInput;
    }
    onMultiChoice = (value, Qid) => {
        let MultiChoice = value.map(fItem => {
            return (
                <TouchableOpacity choiceTrigger >
                    <View style={{ flexDirection: 'row',marginBottom: 3,marginRight :15 ,alignItems: 'center' }}>
                        <RkChoice rkType='radio'
                            style={{ backgroundColor: '#adafb2' }}
                            id={Qid} value={fItem.Value}
                            />
                        <Text>{fItem.Value}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return MultiChoice;
    }


    onCheckBox = (value, Qid) => {
        let CheckBox1 = value.map(fItem => {
            return (
                // <TouchableOpacity choiceTrigger style={{marginTop : 1}}>
                <View style={{ flexDirection: 'row', marginBottom: 3,marginRight :15 ,marginTop: 1, alignItems: 'center' }}>
                    <RkChoice rkType='clear'
                        id={Qid} value={fItem.Value} 
                        onChange={(id) => {this.onChangeCheckBox(id ,fItem.Value,Qid)}} />
                    <Text>{fItem.Value}</Text>
                </View>
                // </TouchableOpacity>
            )
        })
        return CheckBox1;
    }
    onChangeCheckBox = (eventValue , value, Qid) => {
        let label = value;
        if(QueArray[Qid].Answer.has(label)){
            QueArray[Qid].Answer.delete(label);
        }
        else{
            QueArray[Qid].Answer.add(label);
        }
         //console.log('Quearray', QueArray);
    }
    onChangeMultiChoice = (values, Qid, eventId) => {
        // QueArray[id].Answer = text;
        QueArray[Qid].Answer = values[eventId].Value;
    }
onChangeText(text ,Qid){
    QueArray[Qid].Answer = text;

}
    render() {
        if(this.state.queForm.length == 0 ){
            return (
                <Text style={{fontSize : 20 ,alignSelf: 'center' ,marginTop : 200}} ><Icon name="ios-sync"/>  Loading... </Text>
            );

        }
        else{
            return (
                <Container>
                    <ScrollView>
                    {this.onFormSelectValue(this.state.queForm)}
                    <RkButton rkType='success'
                        style={{ alignSelf: 'center', width: 340 ,marginTop: 3, marginBottom : 3 }}
                        onPress={() => this.onSubmit()}>SUBMIT</RkButton>
                    </ScrollView>
                </Container>
            );
        }
        
    }
}

let styles = RkStyleSheet.create(theme => ({
    
    }));

  
     // <Container>
            //     <ScrollView>
            // {/* <RkAvoidKeyboard
            //     onStartShouldSetResponder={(e) => true}
            //     onResponderRelease={(e) => Keyboard.dismiss()}> */}

            //         {this.onFormSelectValue(this.state.queForm)}
            //         <RkButton rkType='dark' 
            //          style={{  alignSelf : 'center' ,width : 340  }}
            //         onPress= {() => this.onSubmit()}>SUBMIT</RkButton>

            // {/* </RkAvoidKeyboard> */}
            // </ScrollView>
            // </Container>


/** * Component Styling Details */
// const styles = StyleSheet.create ({
//    header : {
//        flex : 1,
//        flexDirection : 'column'
//    },
//    mainHeader:{
//        flex : 1,
//        flexDirection : 'row',
//        justifyContent: 'space-between',
//    },
//    roomName:{
//        fontSize: 15,
//        color : '#C9C9C9'
//    },
//    headerText : {
//        fontWeight: 'bold',
//        fontSize: 25
//    },
//    actionBtn : {
//        width: 85,
//        height: 20,
//        alignSelf: 'flex-end'
//    },
//    avatar : {
//        backgroundColor : '#C0C0C0',
//        width: 40,
//        height: 40,
//        borderRadius: 20,
//        textAlign: 'center',
//        fontSize: 20,
//        textAlignVertical: 'center' ,
//        marginRight:5
//    },
//    speakerName: {
//        textAlignVertical: 'center',
//        fontStyle:'italic',
//        fontSize: 15
//    }
// });