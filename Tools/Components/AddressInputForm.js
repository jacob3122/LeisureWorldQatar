import React, { Component, useState } from 'react';
import  { DatePickerIOS,View,Modal,Text,StyleSheet,Dimensions,TextInput,Image, TouchableOpacity,Alert,Keyboard,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Platform,ImageBackground  } from 'react-native';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UIElements from './UIElements'
import * as Tools from './Tools'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

// import Colors from '../constants/Colors';
import backButton from '../../assets/Icons/back.png'
import WebServices from '../../Tools/constants/WebServices'
import OverlayLoad from './OverlayLoad'
import CountryDropDown from './CountryDropDown';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
import { useAppContext } from '../../src/js/reducers/AppReducer';
export default function AddressInputForm(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [postalCode, setPostalCode] = useState(props.address.postalCode);
    const [street, setStreet] = useState(props.address.street);
    const [city, setCity] = useState(props.address.city);
    const [country, setCountry] = useState(props.address.country);
    const [isLoading, setIsLoading] = useState(false);
    const [passfilled,setPassFilled]=useState(false);
    const [confirmpassword,setConfirmPassword]=useState('');
    const [otpModal,setOtpModal]=useState(false);
    const [showPass,setShowPass]=useState(false);
    const onloadEnd=()=>{
    }
    
    const checkLoading=(elements)=>{
        return(<Modal statusBarTranslucent={true} animationType={'fade'} transparent = {true}>
        <View style={{flex:1}} >
        {elements}
        {isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={isLoading} onDismiss={onloadEnd} />}
        </View></Modal>);
        
    }
    
    const togglePassword=()=>{
        setShowPass(!showPass);
    }
        const styles = StyleSheet.create({
            inputField:{
                // borderColor:Colors.inputfontColor,
                fontFamily:'Cairo-Regular',backgroundColor:Colors.whiteColor,
                fontSize:widthPercentageToDP(4),width:'100%',alignSelf:'center',
                height:heightPercentageToDP(4.75),borderRadius:heightPercentageToDP(4.75)
                ,paddingLeft:10,marginBottom:5,paddingRight:10
            },
            button:{
                backgroundColor:Colors.blueColor,
                justifyContent:'center',
                width:widthPercentageToDP(30),
                height:heightPercentageToDP(4.75),
                borderRadius:heightPercentageToDP(4.75)
            },
            buttontext:{
                textAlign:'center',
                fontFamily:'Cairo-Regular',
                fontSize:18,
                color:Colors.whiteColor
            },
            contentText:{
                textAlign:'center',
                fontFamily:'Cairo-Regular',
                fontSize:widthPercentageToDP(5),
                lineHeight:widthPercentageToDP(5)*1.5,
                
                color:Colors.inputfontColor
            },inputView:{
                overflow:'visible',
                flexDirection:'column',
                alignSelf:'center',
                backgroundColor:Colors.whiteColor,
                borderWidth:2,
                width:'100%',
                borderColor:Colors.whiteColor,
                height:heightPercentageToDP(4.75),
                borderRadius:heightPercentageToDP(4.75),
                justifyContent:'center'
                // alignItems:'flex-start',
                // alignContent:'flex-start',
            }, shadow:{
                shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 3,
                    shadowOpacity: 0.12,
                    elevation:3
            },     
            inputValue: {
                fontSize: widthPercentageToDP(4),
                textAlign:'left',
                alignSelf:'center',
                color: Colors.inputfontColor,
                width:'100%',
                // padding:5,
                height:heightPercentageToDP(5),
                paddingStart:15,
                paddingEnd:10,
                // fontFamily:'Cairo-Regular',
            },
            button:{
                justifyContent:'center',
                backgroundColor:Colors.blueColor,
                height:heightPercentageToDP(4.75),
                borderRadius:heightPercentageToDP(4.75)
            },
            buttonTxt:{
                fontFamily:'Cairo-Regular',
                fontSize:widthPercentageToDP(4),
                color:Colors.whiteColor,
                paddingHorizontal:heightPercentageToDP(4.75),
            }
        });
        const closeStack = (onclose=undefined) =>{
            {
                var dismiss=props.onDismiss;
                dismiss(onclose);
                // setState({visible:false})
            }
        }
        
  
        const checkConfirmPassword=(text)=>{
            setConfirmPassword(text);
                if(!Tools.stringIsEmpty(password)&&password===text)
                setPassFilled(true);
                else
                setPassFilled(false);
            
        }
   
        
        const OnVerifyDone=(otpvalue,Vstate)=>{
            VerifyOtpWS(otpvalue);
            setOtpModal(false);
        }
        
        const checkPassFilled=()=>{
            if(passfilled){
                return(
                    <Text allowFontScaling={false} style={styles.buttontext}>{i18n.t('setpass')}</Text>
                    );
                }else{
                    return(
                        <Text allowFontScaling={false} style={styles.buttontext}>{i18n.t('setpass')}</Text>
                        );
                    }
                }
        return (
            checkLoading(
                <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                >
                <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
                <View style={{width:'100%',height:'100%',justifyContent:'center'}} >
                    <BackgroundWall blur/>
                <View style={{padding:20,backgroundColor:Colors.bgColor,borderRadius:15,
                    width:widthPercentageToDP(93),alignSelf:'center',justifyContent:'center'}} >
                    <Text style={{alignSelf:'center',color:Colors.inputfontColor,fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(6)}}>{i18n.t('address')}</Text>
                    <View style ={[styles.inputView,styles.shadow]}>
                    <TextInput allowFontScaling={false} style ={[styles.inputValue,]}
                    placeholderTextColor='#676667'
                    editable={true}
                    value={street}
                    onChangeText={(text) => {
                        setStreet(text);
                    }}
                    returnKeyType='done'
                    placeholder='*Street'></TextInput>
                    </View>
                    {UIElements.drawGap(heightPercentageToDP(3))}
                    <View style ={[styles.inputView,styles.shadow]}>
                    <TextInput allowFontScaling={false} style ={[styles.inputValue,]}
                    placeholderTextColor='#676667'
                    editable={true}
                    value={city}
                    onChangeText={(text) => {
                        setCity(text);
                    }}
                    returnKeyType='done'
                    placeholder='*City'></TextInput>
                    </View>
                    {UIElements.drawGap(heightPercentageToDP(3))}
                    <View style ={[styles.inputView,styles.shadow]}>
                    <TextInput allowFontScaling={false} style ={[styles.inputValue,]}
                    placeholderTextColor='#676667'
                    editable={true}
                    value={postalCode}
                    onChangeText={(text) => {
                        setPostalCode(text);
                    }}
                    returnKeyType='done'
                    placeholder='PostalCode'></TextInput>
                    </View>
                    {UIElements.drawGap(heightPercentageToDP(3))}
                    <TouchableOpacity style={[styles.inputField,{justifyContent:'center'},styles.shadow]}>
                    <CountryDropDown
                    defaultValue={country}
                    textStyle={[{fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(4)},{borderWidth:0}]}
                    updateData={(text)=>{
                        setCountry(text);
                    }}
                    /></TouchableOpacity> 
                   
                    {UIElements.drawGap(heightPercentageToDP(3))}
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <TouchableOpacity onPress={()=>{
                        closeStack({address:{"postalCode":postalCode,
                        "street":street,
                        "city":city,
                        "country":country}});
                    }}style={styles.button}>
                    <Text style={styles.buttonTxt}>{i18n.t('submit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{
                        closeStack();
                    }} style={styles.button}>
                    <Text style={styles.buttonTxt}>{i18n.t('cancel')}</Text>
                    </TouchableOpacity>
                    </View>
                    </View>
                    </View>
                    
                    </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                    )
                    )
                }
                
               
                    
                    