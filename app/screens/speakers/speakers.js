import React from 'react';
import {ScrollView, Platform} from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage ,ActivityIndicator} from 'react-native';
import { RkComponent, RkTheme,RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import ReactMoment from 'react-moment';
import {GradientButton} from '../../components/gradientButton';
import { Service } from '../../services';
import Moment from 'moment';
import firebase from './../../config/firebase';

var firestoreDB = firebase.firestore();
let speakerTile = [];
export class Speakers extends RkComponent {
    static navigationOptions = {
        title: 'Speakers'.toUpperCase()
      };
      constructor(props) {
        super(props);
        
        this.state = {
           Speakers : []
        }
    }

      componentWillMount() {
          let thisRef = this;
          let speakerCollection = [];
        firestoreDB.collection("Attendee")
        .get()
        .then(function (doc) {
           doc.forEach(fItem => {
               fItem.data().profileServices.forEach(tItem =>{
                   if(tItem == 'Speaker'){
                       speakerCollection.push(fItem.data());
                   }
               })
           })
          thisRef.setState({
              Speakers : speakerCollection
          })
          thisRef.displaySpeakers();
        })
        .catch(function (error){
            console.log("error",error);
        });
    }
    displaySpeakers = () => {
       speakerTile =  this.state.Speakers.map(speaker => {
          <View>
          <TouchableOpacity>
              <RkCard>
                  <View style={{ flexDirection: 'row' }}>
                      <RkText >{speaker.fullName} </RkText>
                  </View>
              </RkCard>
          </TouchableOpacity>
          </View>
        });
        return speakerTile;
        
    }
    render(){
        if(this.state.Speakers){
            return (
                <Container style={[styles.root]}>
                    <View>
                        {speakerTile}
                    </View>
                </Container>
            )
        }
        else{
            <Container style={[styles.root]}>
            <View>
               <ActivityIndicator size ='small' />
            </View>
        </Container>
        }
        
    }
}
let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base
    }
}));