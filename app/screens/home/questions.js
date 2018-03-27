import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert,Dimensions, Keyboard } from 'react-native';
import { RkButton, RkText, RkChoice, RkModalImg, RkCard, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTabView, RkTheme, RkChoiceGroup } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import { NavigationActions } from 'react-navigation';
import { Container, Content, Footer,CheckBox, Header, Title, Button, Icon, Tabs, Tab, Text, Right, Left, Body, TabHeading, Label } from "native-base";
import { TabNavigator, TabView } from 'react-navigation'
import firebase from '../../config/firebase'

var firestoreDB = firebase.firestore();
let ShareInput = [];
let AnswerInput = [];
let QueArray = [];
export class Questions extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Questions'.toUpperCase(),
    });

    constructor(props) {
        super(props);
        this.state = {
            currentTab: 'Home',
            queForm: []
        };
        this.onFormSelectValue = this.onFormSelectValue.bind(this);
        this.onChange = this.onChange.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    }
    componentWillMount() {
        let comRef = this;
        firestoreDB.collection("QuestionsForm").doc("fzEbwY1XHROtpw7HF8du").get().then(function (doc) {
            let form = doc.data();
            comRef.setState({
                queForm: form.Questions
            })
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

    onFormSelectValue(queForm) {
        ShareInput = this.state.queForm.map(Fitem => {
            QueArray.push({Question : Fitem.QuestionTitle , Answer: ""});
            return (
                <View >
                    <Label style={{ flexDirection: 'row', alignItems: 'center' }}>Que.{Fitem.QueId} :{Fitem.QuestionTitle}</Label>
                    {this.RenderAnswerField(Fitem)}
                </View>
            )
        });
        return ShareInput;
    }

    RenderAnswerField(item) {
        if (item.AnswerFeild == "Input Text") {
            AnswerInput:
            return (
                <RkTextInput type="text" placeholder="Answer Title" name="Answer"  onChangeText={(text) => this.onChange(text, item.QueId)}  id={item.QueId} />
            )
        } else if (item.AnswerFeild == "Mulitple Choice") {
            AnswerInput:
            return (
                <RkChoiceGroup radio  onChange={(id,value) => console.log('id: ', id,value)} >
                    {this.onMultiChoice(item.value, item.QueId)}
                </RkChoiceGroup>
            )
        }
        else if (item.AnswerFeild == "Check Box") {
            AnswerInput:
            return (
                <RkChoiceGroup   >
                    {this.onCheckBox(item.value, item.QueId)}
                </RkChoiceGroup >
            )
        }
        return AnswerInput;
    }
    onMultiChoice(value, id) {
        let MultiChoice = value.map(fItem => {
            return (
                <TouchableOpacity  choiceTrigger >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RkChoice rkType='radio'
                        style={{backgroundColor : '#adafb2'}}
                        id={id} value={fItem.Value}
                         />
                        <Text>{fItem.Value}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return MultiChoice;
    }


    onCheckBox(value, id) {
        let CheckBox1 = value.map(fItem => {
            return (
                // <TouchableOpacity choiceTrigger style={{marginTop : 1}}>
                    <View style={{ flexDirection: 'row', marginTop : 1,alignItems: 'center' }}>
                    <RkChoice rkType='clear'
                        id={id} value={fItem.Value} />
                        <Text>{fItem.Value}</Text>
                    </View>
                // </TouchableOpacity>
            )
        })
        return CheckBox1;
    }

    onChange(text, id) {
        QueArray[id].Answer = text;
        console.log('value', QueArray);
    }
    // onClick(text,id){
    //     QueArray[id].Answer = text;
    //     console.log('value', QueArray);
    // }
    onSubmit(){
        let alertMsg = false;
        QueArray.forEach(fItem => {
            if(fItem.Answer == ""){
                alertMsg = true;
            }
            else{
            
                console.log('yes',QueArray);
            }
        })
        if(alertMsg == true)
        {
            Alert.alert('please answer all questions');
            //alert('please answer all questions');
        }
        console.log('yes',QueArray);

    }
    render() {
        return (
            <Container>
                <ScrollView style={styles.root}>
                    {this.onFormSelectValue(this.state.queForm)}
                    <RkButton rkType='success'
                     style={{  alignSelf : 'center' ,width : 340  }}
                    onPress= {() => this.onSubmit()}>SUBMIT</RkButton>
                </ScrollView >
            </Container>
        )
    }
}

let styles = RkStyleSheet.create(theme => ({

}));