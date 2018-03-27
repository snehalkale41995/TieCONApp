import React from 'react';
import { Text, View } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity,Keyboard, Alert,AsyncStorage } from 'react-native';
import { RkComponent, RkTheme, RkText, RkAvoidKeyboard,RkButton, RkCard, RkTextInput } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';

import { Service } from '../../../services';
import ReactMoment from 'react-moment';
import Moment from 'moment';
import { Avatar } from '../../../components';
import firebase from '../../../config/firebase'

var firestoreDB = firebase.firestore();
export default class AskQuestion extends RkComponent {

    constructor(props) {
        super(props);
       //console.log('askProps',this.props.UserName)
        this.state = {
            Question : "",
            askedBy : "",
            sessionId :this.props.sessionId 
        }
    }
    componentWillMount(){
        let thisRef =this;
        AsyncStorage.getItem("USER_DETAILS").then((userDetails)=>{
          let user = JSON.parse(userDetails)
          let Name = user.firstName + " " + user.lastName;
            thisRef.setState({
                askedBy : Name
            })
         })
         .catch(err => {
           console.warn('Errors');
         });
      }
    onShowDetails = (event) => {
        Alert.alert('Test Dialog');
    }

    onSubmit = () => {
        let compRef = this; 
         let que = this.state.Question;
         let user = this.state.askedBy;
         let sessionId = this.state.sessionId;
         if(que.length !== 0){
            firestoreDB.collection('AskedQuestions')
            .add({
                Question : que ,
                askedBy : user,
                SessionId: sessionId,
                date : new Date()
            })
            .then(function(docRef) {
               compRef.setState({
                   Question : ""
               })
               Alert.alert("Question submitted successfully");
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
         }
         else{
             Alert.alert("Please fill the question field...");
         }
    
       

    }
   
    onChange = (text) => {
       // console.log('que',text);
        let Question = text;
        this.setState({
            Question : Question
        })
    }

    render() {
        return (
            <RkAvoidKeyboard
                onStartShouldSetResponder={(e) => true}
                onResponderRelease={(e) => Keyboard.dismiss()}>
                <View>
                    <RkText> Enter your question below :   </RkText>
                    <RkTextInput type="text" placeholder="Question" value={this.state.Question} name="Question" onChangeText={(text) => this.onChange(text)} />
                    <RkButton rkType='success' style={{ alignSelf: 'center', width: 340  }} onPress={() => this.onSubmit()}> Submit </RkButton>
                </View>
            </RkAvoidKeyboard>
);
    }
}
