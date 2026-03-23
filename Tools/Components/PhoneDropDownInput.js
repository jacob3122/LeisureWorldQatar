import React, { Component,PureComponent, useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet,View,Text, TextInput } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Colors from '../constants/Colors';
import PhoneDropDown from './PhoneDropDown';
import countryCodes from '../../Data/countrycodeinuse.json'
import { PhoneNumberUtil } from "google-libphonenumber";
import WebServices from '../constants/WebServices';
import * as Tools from '../Components/Tools'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import StripAboveKeyboard from './StripAboveKeyboard';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';

const phoneUtil = PhoneNumberUtil.getInstance();

export default function PhoneDropDownInput(props){
    const Colors =useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;

    const [selected, setSelected] = useState(0);
    const [open, setOpen] = useState(0);
    const [setView,setViewState]=useState(1);
    const [loading, setLoading] = useState(false);
    const [finalValue, setFinalValue] = useState('');
    const [textValue, setTextValue] = useState('');
    const [defaultPhone,setDefaultPhone]=useState(props.defaultPhone);
    const [datafromDropDown, setDataFromDropDown] = useState(0);
    const [countryCode,setCountryCode] = useState([
        {
            "name": "Qatar",
            "dial_code": "+974",
            "code": "QA"
        }
    ]);
    let loaded=0;
    //     return <PhoneDropDownInput isValidNumber={PhoneDropDownInput.isValidNumber} {...props} Colors={Colors}/>
    // }
    // class PhoneDropDownInput extends PureComponent {
    // styles=undefined;
    // constructor(props){
    //     super(props);
    // state={
    //     selected:0,
    //     open:0,
    //     finalValue:'',
    //     textValue:'',
    //     datafromDropDown:0,
    //     countryCode:[{
    //         "name": "Qatar",
    //         "dial_code": "+974",
    //         "code": "QA"
    //     }],
    //     selected:0
    // }
    // getData=getData.bind(this);
    // getCountryInUseData=getCountryInUseData.bind(this);
    // }
    
    useEffect(()=>{
        getCountryInUseData();
    },[])
    
    useEffect(()=>{
        setDefaultPhone(props.defaultPhone);
    },[props.defaultPhone]);
    
    const separateCountryCode = (phoneNumber) => {
        // Match the country code and the remaining phone number using a regular expression
        const match = phoneNumber.match(/^(\+\d{1,4})?\s?(\d{4}\s?\d{4})$/);
        
        if (match) {
            // Extract the country code and the remaining phone number
            const countryCode = match[1] || ''; // Use an empty string if no country code is present
            const remainingPhoneNumber = match[2];
            
            return {
                countryCode,
                phoneNumber: remainingPhoneNumber.replace(/\s/g, ''), // Remove spaces from the phone number
            };
        } else {
            // If no match is found, return the original number
            return {
                countryCode: '',
                phoneNumber: phoneNumber.replace(/\s/g, ''), // Remove spaces from the phone number
            };
        }
    };
    const getCountryInUseData=()=>{
        if(global.countryCode!=undefined){
            var json = global.countryCode;
            setCountryCode(json);
            setLoading(false)
            for (let index = 0; index < json.length; index++) {
                const element = json[index];
                // console.log("C :"+element.dial_code);
                if(element.dial_code==props.defaultValue){
                    setDataFromDropDown(index);
                    return;
                }
            }
            loaded=0;
            return;
        }
        // setState({countryCode:countryCodes})
        return fetch(WebServices.MainURL+WebServices.countryinUseData.replace('{Localize}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en'))
        .then(response  => response.text())
        .then((findresponse)=>{
            let json = JSON.parse(findresponse);
            let countrycodes =json.countrycodes;
            setCountryCode(countrycodes);
            setLoading(false)
            global.countryCode=countrycodes;
            // console.log(" CC : "+JSON.stringify(countrycodes));
            for (let index = 0; index < countrycodes.length; index++) {
                const element = countrycodes[index];
                // console.log(props.defaultValue+" CC : "+element.dial_code);
                if(element.dial_code==props.defaultValue){
                    setDataFromDropDown(index);
                    return;
                }
            }
            loaded=0;
        }).catch(function(error) {
            loaded=2;
            // console.warn(loaded+' Request Failed: ', error);
            setCountryCode([
                {
                    "name": "Qatar",
                    "dial_code": "+974",
                    "code": "QA"
                }]);
                setLoading(false);
            });
        }
        const getallItems=()=>{
            if(countryCode!=undefined)
            {
                allLines=[];
                for (let index = 0; index < countryCode.length; index++) {
                    const element = countryCode[index];
                    allLines.push(
                        <TouchableOpacity onPress={()=>{
                            setOpen(0);
                            setSelected(index);}} style={[styles.ItemStyle,props.ItemStyle]}>
                            <Text allowFontScaling={false} style={[{color:Colors.inputfontColor,includeFontPadding:false},props.textStyle]}>{countryCode[index].dial_code}</Text>
                            </TouchableOpacity>
                            )
                        }
                        return allLines;
                    }
                    return (
                        <View></View>
                        )
                    }
                    const getData=(index)=>{
                        setDataFromDropDown(index);
                        setFinalValue((countryCode[index].dial_code+textValue));
                        var inputCha=props.inputChange;
                        if(inputCha)
                        inputCha(countryCode[index].dial_code+textValue);
                        if(textValue.length>0){
                            var inputVal=props.inputValue;
                            if(inputVal)
                            inputVal(countryCode[index].dial_code+textValue);
                            var inputValNo=props.inputValueNo;
                            if(inputValNo)
                            inputValNo(textValue);
                        }
                    }
                    const styles = StyleSheet.create({
                        ItemStyle:{
                            backgroundColor:Colors.bgColor,
                            width:200,
                            height:50,
                            justifyContent:'center',
                        },shadow:{
                            shadowOffset: { width: 0, height: 3 },
                            shadowRadius: 3,
                            shadowOpacity: 0.12,
                        },
                    });
                    const isValidNumber = (number) => {
                        // console.log(number+"//"+countryCode[datafromDropDown].code);
                        try {
                            const parsedNumber = phoneUtil.parse(number, countryCode[datafromDropDown].code);
                            return phoneUtil.isValidNumber(parsedNumber);
                        } catch (err) {
                            return false;
                        }
                    };
                    return(
                        <View style={[{zIndex:2, flexDirection:'row',width:widthPercentageToDP(70),alignSelf:'center',justifyContent:'space-between', borderRadius:heightPercentageToDP(5),
                        height:heightPercentageToDP(5),backgroundColor:Colors.whiteColor},props.viewStyle,styles.shadow]}>
                        <PhoneDropDown
                        editable={props.editable}
                        ContainerStyle={{backgroundColor:Colors.whiteColor,borderRadius:15}}
                        setView={setView}
                        textStyle={[{textAlign:'left',textAlignVertical:'center',alignSelf:'center',fontSize:17,fontFamily:'Cairo-Regular',height:heightPercentageToDP(4)},props.textStyle]}
                        ItemStyle={{width:widthPercentageToDP(20),zIndex:5,backgroundColor:Colors.whiteColor,justifyContent:'center',height:heightPercentageToDP(5),alignItems:'center'}}
                        ItemSelectedStyle={{borderRadius:15,width:widthPercentageToDP(20),justifyContent:'center',alignSelf:'center'}}
                        data={countryCode}
                        defaultValue={datafromDropDown}
                        updateData={getData}
                        />
                        <TextInput
                        allowFontScaling ={false}
                        scrollEnabled={false}
                        textContentType='telephoneNumber'
                        keyboardType="phone-pad"
                        inputAccessoryViewID={global.inputAccessoryViewID}
                        editable={props.editable}
                        value={defaultPhone}
                        onFocus={()=>{
                            setViewState(0);
                        }} maxLength={20} 
                        onChangeText={
                            (textIn)=>{
                                var TextInp=textIn;
                                var TextInp_DCode=countryCode[datafromDropDown]?.dial_code || "+974";

                                const separatedNumbers = separateCountryCode(textIn);
                                if(!Tools.IsNull(separatedNumbers.countryCode)){
                                    // console.log('Country Code:', separatedNumbers.countryCode);
                                    // console.log('Phone Number:', separatedNumbers.phoneNumber);
                                    var json = global.countryCode || countryCode;
                                    setCountryCode(json);
                                    setLoading(false)
                                    for (let index = 0; index < json.length; index++) {
                                        const element = json[index];
                                        // console.log("C :"+element.dial_code+"="+separatedNumbers.countryCode);
                                        if(element.dial_code==separatedNumbers.countryCode){
                                            setDataFromDropDown(index);
                                            TextInp_DCode=separatedNumbers.countryCode;
                                            break;
                                        }
                                    }
                                    TextInp=separatedNumbers.phoneNumber;
                                    setDefaultPhone(separatedNumbers.phoneNumber);
                                }else{
                                    setDefaultPhone(TextInp);
                                }
                                
                                var inputCha=props.inputChange;
                                if(inputCha)
                                inputCha(TextInp_DCode+TextInp);
                            }
                        }
                        onEndEditing={(textIn)=>{
                            
                            var TextInp=textIn.nativeEvent.text;
                            var TextInp_DCode=countryCode[datafromDropDown]?.dial_code || "+974";

                            // console.log('End:', TextInp_DCode+TextInp);

                            const separatedNumbers = separateCountryCode(TextInp);
                            if(!Tools.IsNull(separatedNumbers.countryCode)){
                                // console.log('Country Code End:', separatedNumbers.countryCode);
                                // console.log('Phone Number End:', separatedNumbers.phoneNumber);
                                var json = global.countryCode || countryCode;
                                setCountryCode(json);
                                setLoading(false)
                                for (let index = 0; index < json.length; index++) {
                                    const element = json[index];
                                    // console.log("C :"+element.dial_code+"="+separatedNumbers.countryCode);
                                    if(element.dial_code==separatedNumbers.countryCode){
                                        setDataFromDropDown(index);
                                        TextInp_DCode=separatedNumbers.countryCode;
                                        break;
                                    }
                                }
                                TextInp=separatedNumbers.phoneNumber;
                                setDefaultPhone(separatedNumbers.phoneNumber);
                            }else{
                                setDefaultPhone(TextInp);
                            }
                            setTextValue(TextInp);
                            setFinalValue((TextInp_DCode+textIn.nativeEvent.text));
                            var inputVal=props.inputValue;
                            if(inputVal)
                            inputVal(TextInp_DCode+textIn.nativeEvent.text);
                            var inputValueCheck=props.inputValueCheck;
                            if(inputValueCheck)
                            return inputValueCheck(isValidNumber(TextInp_DCode+textIn.nativeEvent.text));
                            
                        }} placeholderTextColor={Colors.placeholdertext} placeholder='Phone Number'
                        style={[{backgroundColor:Colors.whiteColor,flex:1,fontSize:17,borderRadius:heightPercentageToDP(4.75),includeFontPadding:false,
                            padding:5,paddingLeft:30,color:Colors.inputfontColor},
                            Tools.stringIsContains(i18n.locale,'ar')?{textAlign:'right'}:{textAlign:'left'},props.inputStyle]}/>
                            <StripAboveKeyboard/>
                            </View>
                            )
                        }
                        
                        
                        
                        
                        