import React, { Component } from 'react';
import  { View,Text,StyleSheet,Dimensions,TextInput, TouchableOpacity,Linking } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import Colors from '../constants/Colors';
// import Gradient from 'react-native-css-gradient';
import * as UIElements from './UIElements'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const helpcontact=''

export default class MobileCode extends Component {
    
    static navigationOptions = ({navigation}) => {
        return{
            title: 'Verify OTP',
            headerTintColor: Colors.darkfontColor,
            headerStyle: {
                backgroundColor: Colors.orangeColor
            },
            headerTitleStyle:{textAlign:'center',
            fontFamily:'Cairo-Bold',flex:1},
            
        };
    };
    
    constructor(props){
        super(props);
        this.state={
            signinCode:0,
        }
    }
    
    // drawGap=(valueGap)=>{
    //     return(
    //         <View
    //         style={{paddingTop:valueGap}}/>
    //         );
    //     }
        render() {
            return (
                <View>
                {/* <Gradient gradient={Colors.gradient} style={styles.gradStyle}/> */}
                {UIElements.drawGap(40)}
                {/* <TouchableOpacity
                    onPress={()=>this.props.navigation.goBack()}><Text style={styles.cancelB}>Back</Text></TouchableOpacity>
                {this.drawGap(50)} */}
                <View style={styles.gapView}>
                
                <Text allowFontScaling={false} style ={styles.subheading}>{i18n.t('verifyaccount')} </Text>
                <Text allowFontScaling={false} style ={[styles.subheading,{fontWeight:'300'}]}>{i18n.t('verficationcode')}  </Text>
                
                {this.getInputMethod()}
                
                <Text allowFontScaling={false} style ={[styles.subheading,{fontWeight:'300',alignSelf:'center'}]}>{i18n.t('ihavntreceive')} </Text>
                <TouchableOpacity style={styles.buttonSave}
                onPress={()=>{}}>
                {/* <Gradient gradient={Colors.gradientBut} style={styles.buttonSave}> */}
                    <Text allowFontScaling={false} style={[styles.buttontext,{alignSelf:'center'}]}>{i18n.t('resendnow')} </Text>
                    {/* </Gradient> */}
                    </TouchableOpacity>
                {UIElements.drawGap(50)}
                
                <View style ={styles.rowView}>
                <Text allowFontScaling={false} style ={[styles.subheading,{fontWeight:'300',fontSize:15}]}> {i18n.t('needhelp')} </Text>
                <TouchableOpacity
                onPress={()=>this.reDirect('tel:119')}><Text allowFontScaling={false} style={[styles.cancelB,{fontSize:15,color:Colors.orangeColor}]}>{i18n.t('callus')}</Text></TouchableOpacity>
                </View>
                </View>
                </View>
                )
            }
            
            reDirect(url){
                Linking.openURL(url);
            }
            getInputMethod(){
                return(
                    <View style={styles.boxcontainer}>
                    <TextInput 
                    placeholderTextColor='#676667'
                    onChangeText={(text)=>{this.checkOnContinue(text)}}
                    style={styles.inputtext}
                    placeholder=""
                    keyboardType='number-pad'
                    maxLength = {4}
                    returnKeyType='done'></TextInput>
                    </View>);
                }
                checkOnContinue(val){
                    
                }
            }
            
            const styles = StyleSheet.create({
                gradStyle:{
                    position:'absolute',
                    width:width,
                    height:height,
                    zIndex:-1,
                },
                buttonSave:{
                    // flex:1,
                    width:width/1.25,
                    height:60,
                    alignSelf:'center',
                    alignItems:'center',
                    backgroundColor:'grey',
                    borderRadius:10,
                    justifyContent:'center'
                },
                buttontext:{
                    fontSize:20,
                    color:'white'
                },
                rowView:{
                    paddingLeft:width/2.5,
                    flexDirection:'row',
                    alignContent:'center',
                    alignItems:'center',
                },cancelB:{
                    padding:10,
                    color:'#1d78cb',
                    fontSize:20,
                    fontWeight:'300',
                    textAlign:'left',
                    // borderWidth:1,
                    alignSelf:'flex-start'
                },
                inputtext:{
                    letterSpacing:width/4.5,
                    fontSize: 20,
                    textAlign:'left',
                    fontFamily:'Cairo-Bold',
                    height:45,
                    color: 'black',
                },
                heading: {
                    fontSize: 40,
                    fontFamily:'Cairo-Bold',
                    paddingBottom:15,
                    paddingTop:35,
                },
                gapView:{
                    padding:10,
                    justifyContent:'center'
                },
                subheading: {
                    fontSize: 20,
                    textAlign:'left',
                    fontFamily:'Cairo-Bold',
                    paddingBottom:15,
                    paddingTop:15,
                    color:Colors.darkfontColor,
                    alignSelf:'center'
                },
                boxcontainer: {
                    // backgroundColor: 'white',
                    // padding:10,
                    borderRadius:10,
                    // borderWidth:1
                    backgroundColor:Colors.inputboxColor
                },
                homeView: {
                    flex:1,
                    // alignItems:'center',
                }
            });