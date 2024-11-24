import React from 'react'
import { StyleSheet,View, InputAccessoryView, Button, Text, ScrollView, TextInput, Keyboard } from 'react-native';
import Colors from '../constants/Colors';
export default class StripAboveKeyboard extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = { 
            keyboardHeight: 0,
            textIn:''
        }
        global.inputAccessoryViewID='uniqueID'
    }
    render() {
        
        
        return (<>
            <InputAccessoryView nativeID={global.inputAccessoryViewID}>
                <View style={{width:'100%',alignItems:'flex-end', backgroundColor:Colors.bgColor}}>
            <Button
            style={{alignSelf:'flex-end'}}
            onPress={() => {Keyboard.dismiss()}}
            title="Done"
            color={Colors.bluelightShadeColor}
            /></View>
            </InputAccessoryView>
            </>
            )    }
        }
        
        const style = StyleSheet.create({
            
        }) 