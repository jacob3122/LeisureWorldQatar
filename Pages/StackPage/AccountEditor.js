import * as React from 'react';
import {ScrollView,TextInput,Keyboard,TouchableWithoutFeedback,TouchableOpacity,StyleSheet,View,Text,ImageBackground,Image,KeyboardAvoidingView,Platform, SafeAreaView, Alert, StatusBar } from 'react-native'
import PropTypes from 'prop-types';
// import DatePicker from 'react-native-datepicker';
import DatePicker from '../../Tools/Components/DatePicker'
// import RNPickerSelect from 'react-native-picker-select';
// import countryList from '../../Data/Countrylist.json';
import countryCode from '../../Data/countrycode.json';
// import PickerModal from 'react-native-picker-modal-view';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../../Tools/constants/Colors.js';
import homebg from'../../assets/bg/bg-01.jpg'
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

// import appLogo from '../../assets/Icons/leisure_white.png'
// import proceedB from '../../assets/Icons/back.png'
import HeaderLogo from '../../Tools/Components/HeaderLogo';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import BackButton from '../../Tools/Components/BackButton';
import * as Tools from '../../Tools/Components/Tools.js'
import {Dimensions } from "react-native";
import signoffButton from '../../assets/Icons/signoff.png'
import editIcon from '../../assets/Icons/edit.png'
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import PhoneDropDownInput from '../../Tools/Components/PhoneDropDownInput';
import * as UIElements from '../../Tools/Components/UIElements'
import { connect } from 'react-redux';
import { bin } from 'npm';
import { CommonActions, useFocusEffect, useRoute } from '@react-navigation/native';
import SecureStore from '../../Tools/Components/SecureStore';
import DeleteConfirmation from '../../Tools/Components/DeleteConfirmation';
import AddressInputForm from '../../Tools/Components/AddressInputForm';
import TopBackBar from '../../Tools/Components/TopBackBar';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';
// import PhoneInput from "react-native-phone-number-input";
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useEffect } from 'react';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { useState } from 'react';
import WebServices from '../../Tools/constants/WebServices.js';

import GoogleRecaptcha, {
    GoogleRecaptchaSize,
    GoogleRecaptchaToken,
    GoogleRecaptchaRefAttributes
} from 'react-native-google-recaptcha'
import OtpVerify from '../../Tools/Components/OtpVerify.js';
import ReactMoE from 'react-native-moengage';


export default function AccountEditor(props){
    const Colors=useTheme();
    
    
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [address, setAddress] = useState({});
    const [change, setChange] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [email, setEmail] = useState(state.profile!=undefined?state.profile.Email:'');
    const [mobile, setMobile] = useState(state.profile!=undefined?state.profile.Mobile:'');
    const [firstname, setFirstName] = useState(state.profile!=undefined?state.profile.FirstName:'');
    const [lastname, setLastName] = useState(state.profile!=undefined?state.profile.LastName:'');
    const [profile, setProfile] = useState(state.profile);
    const [showDate, setShowDate] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteOtpModal, setDeleteOtpModal] = useState(false);
    const [addressModal, setAddressModal] = useState(false);
    let nameInputRef = React.createRef();
    
    const [googleToken,setgoogleToken]=useState('');
    let recaptchaRef=React.createRef();
    
    useEffect(()=>{
        logScreenViewEvent("AccountEditor","Profile")
        Tools.updateRatePoints(1);
        setAddress(state.profile.BillingAddress)
    },[])
    
    
    let changeCheck=false;
    
    const pickImage = async () => {
        
    };
    
    // const getCountrywithCode=(code)=>{
        //     for(t=0;t<countryList.length;t++){
    //         if(countryList[t].Code===code){
    //             return countryList[t];
    //         }
    //     }
    //     return null;
    // } 
    
    // const setChosenCountry=(selectedItem)=>{
        //     setState({ chosenCountry:selectedItem});
    //     props.profile.nationality=selectedItem.Code;
    //     changeHappened();
    // }   
    const onClosed=()=> {
        // console.log('close key pressed');
    }
    
    const handleSend=async()=>{
        // console.log('Recaptcha Token');
        try {
            if(recaptchaRef!=undefined){
                const token = await recaptchaRef.getToken();
                // console.log('Recaptcha Token2'+token);
                setgoogleToken(token);
                // console.log('Recaptcha Token:', token);
                return token;
            }else{
                console.error('Recaptcha Error')
            }
        } catch (e) {
            console.error('Recaptcha Error:', e)
        }
    }
    
    const onBackButtonPressed=()=>{
        // console.log('back key pressed');
    }
    
    
    const findCountry=(_number)=> {
        countries = countryCode; // as below
        i = 0;
        while(countries[i] && (!_number.includes(countries[i].dial_code))) {
            i++;
        }
        if (countries[i]) {
            return _number.replace(countries[i].dial_code,''); // Or countries[i].code, or the whole countries[i] object
        }
        return '';
    }
    
    const findCountryCode=(_number)=> {
        countries = countryCode; // as below
        i = 0;
        while(countries[i] && (!_number.includes(countries[i].dial_code))) {
            i++;
        }
        if (countries[i]) {
            return countries[i].code; // Or countries[i].code, or the whole countries[i] object
        }
        return 'QA';
    }
    const findCountryDialCode=(_number)=> {
        countries = countryCode; // as below
        i = 0;
        while(countries[i] && (!_number.includes(countries[i].dial_code))) {
            i++;
        }
        if (countries[i]) {
            return countries[i].dial_code; // Or countries[i].code, or the whole countries[i] object
        }
        return 'QA';
    }
    
    const SignOut=()=>{
        Alert.alert(i18n.t('signoutConfirm'),"",[
            {
                text:i18n.t('yes'),
                onPress:()=>{
                    SecureStore.setItemAsync('loginRequested','N');
                    var assignSignout  =   props.assignProfile;
                    assignSignout('','','');
                    props.navigation.popToTop();
                    ReactMoE.logout();
                    
                }
            },
            {
                text:i18n.t('no'),
                onPress:()=>{
                }
            }
        ])
        
    }
    const styles = StyleSheet.create({
        backbut:{
            position:'absolute',
            bottom:heightPercentageToDP('5%'),
            alignSelf:'center',
            width:50,
            height:50,
        },
        logoImg:{
            alignSelf:'flex-start',
            marginLeft:15,
            width:70.2*(width/280),
            height:65.3*(width/280),
            // maxWidth:220,
        }, titleView:{
            position:'absolute',
            borderWidth:2,
            borderRadius:10,
            alignSelf:'flex-end',
            transform:[{translateX:width/4.5},{translateY:50}],
            borderColor:Colors.whiteColor,
        },
        titleTxt:{
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            fontSize: widthPercentageToDP(3.95),
            paddingHorizontal:widthPercentageToDP(4.5)
        },
        bgImage:{
            // position:'absolute',
            // alignSelf:'center',
            // width:'100%',
            // // marginTop:0,
            // height:heightPercentageToDP(100),
            // resizeMode:'contain'
            color:Colors.orangeColor,
            backgroundColor:Colors.orangeColor,
            position:'absolute',
            top:0,
            resizeMode:'cover',
            width:'100%',
            // height:heightPercentageToDP('100%'),
            height:heightPercentageToDP(100)+(Platform.OS=='ios'?0: heightPercentageToDP('9.5%')),
            
        },
        dateValue:{
            fontSize: 16,
            width:'100%',
            alignSelf:'flex-start',
            borderWidth:2,
            color:Colors.whiteColor,
            fontFamily:'Cairo-Bold'
            
        },
        inputViewDate:{
            flex:2,
            borderWidth:1,
            width:'100%',
            height:50,
            
        },
        gradStyle:{
            position:'absolute',
            width:width,
            height:height,
            zIndex:-1,
        },
        buttonSign:{
            // flex:1,
            height:heightPercentageToDP(4.75),
            alignSelf:'center',
            alignItems:'center',
            borderRadius:heightPercentageToDP(4.75),
            backgroundColor:Colors.blueColor,
            justifyContent:'center'
        },
        buttontext:{
            paddingHorizontal:widthPercentageToDP(5),
            fontSize:widthPercentageToDP(4),
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular'
        },
        inner: {
            justifyContent: "center",
        },
        genderview: {
            flexDirection:'column',
            flex:1,
            // borderWidth:2,
            alignContent:'center',
            justifyContent:'center',
        },
        inputIOS: {
            fontSize: 16,
            alignSelf:'flex-start',
            // textAlign:'left',
            color: Colors.darkfontColor,
            fontFamily:'Cairo-Bold'
            
        },
        inputAndroid: {
            fontSize: 16,
            alignSelf:'flex-start',
            // textAlign:'left',
            color: Colors.darkfontColor,
            fontFamily:'Cairo-Bold'
            
        },
        
        rowView:{
            flex: 0.8,
            flexDirection:'row',
            justifyContent:'center'
        },               
        dpView:{
            paddingTop:15,
            alignItems:'center',
        },
        dp:{
            width: 150,
            height: 150,
            borderRadius: 150/ 2,
        },
        heading: {
            textAlign:'center',
            fontSize: 20,
            color: Colors.darkfontColor,
            fontFamily:'Cairo-Bold'
            
        },mobileView:{
            flex:.185,
            height:35,
            // borderWidth:2,
            // flexDirection:'column',
            // alignItems:'flex-start',
            // alignContent:'flex-start',
            justifyContent:'center',
            backgroundColor:Colors.whiteColor,
            borderRadius:15,
            // marginBottom:20,
        },inputView:{
            flex:.8,
            alignSelf:'center',
            // borderWidth:2,
            flexDirection:'column',
            alignItems:'flex-start',
            alignContent:'center',
            backgroundColor:Colors.whiteColor,
            borderRadius:15,
            // marginRight:10,
            marginBottom:20,
        },
        inputtext:{
            // letterSpacing:width/4.5,
            // fontSize: 20,
            textAlign:'left',
            fontWeight:'200',
            color: 'black',
            // height:40,
            fontFamily:'Cairo-Regular',
            fontSize: 20,
            // lineHeight: AdaptiveWidth(18) * 1.6,
            // height: AdaptiveWidth(18)* 1.3, 
        },
        inputConst: {
            // alignSelf:'center',
            textAlign:'left',
            justifyContent:'center',
            // paddingStart:10,
            fontSize: 15,
            // textAlign:'left',
            fontWeight: '100',
            color:Colors.inputfontColor,
            // width:'100%',
            // height:50,
            fontFamily:'Cairo-Regular',
            // borderRadius:10,
            // textAlign:'left',
            // marginEnd:10,
            marginStart:10,
            // margin:10,
        },
        inputValue: {
            // justifyContent:'center',
            // alignItems:'center',
            // alignContent:'center',
            alignSelf:'center',
            padding:1,
            paddingStart:15,
            fontSize: 17,
            height:40,
            textAlign:'left',
            fontWeight: '100',
            color:Colors.inputfontColor,
            width:'97%',
            fontFamily:'Cairo-Regular',
        },
        textButton: {
            paddingTop:15,
            textAlign:'center',
            fontSize: 15,
            fontFamily:'Cairo-Bold',
            color:'#0079d4'
        },
        pId: {
            textAlign:"center",
            fontSize: 20,
            fontWeight: '200',
            fontFamily:'Cairo-Regular'
            
        },detailshead:{
            fontSize: 20,
            paddingBottom:15,
            textAlign:'left',
            color: Colors.darkfontColor,
            fontFamily:'Cairo-Bold'
            // borderWidth:2,
        },
        detailstitle:{
            // borderWidth:2,
            // width:150,
            fontSize: 18,
            textAlign:'left',
            paddingTop:15,
            paddingBottom:15,
            flex:0.5,
            color: Colors.whiteColor,
            fontFamily:'Cairo-Bold'
            
            
        },
        homeScrollView: {
            // backgroundColor:'#fff',
            padding:15,
            
        },homeView: {
            marginTop:heightPercentageToDP(1),
            paddingBottom:heightPercentageToDP(1),
            width:widthPercentageToDP(93),
            backgroundColor:Colors.whiteColor,
            borderRadius:widthPercentageToDP(4),
            alignSelf:'center'
        },
        accountView: {
            paddingTop:25,
        },Names:{
            color:Colors.blueColor,
            fontFamily:'Cairo-Bold',
            alignSelf:'center',
            fontSize:widthPercentageToDP(5),
            lineHeight:widthPercentageToDP(5)*1.4
        },titleBar:{
            backgroundColor:Colors.blueColor,
            borderRadius:widthPercentageToDP(2)
        },infoBar:{
            marginTop:heightPercentageToDP(.8),
            flexDirection:'row',
            width:'90%',
            justifyContent:'space-between',
            alignSelf:'center'
        },infoBarHalf:{
            width:'90%',
            alignSelf:'flex-start'
        },editIcon:{
            tintColor:Colors.blueColor,
            alignSelf:'center',width:widthPercentageToDP(5.5),height:widthPercentageToDP(5.5)
        },titleInfo:{
            alignSelf:'flex-start',
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(4.5),
            lineHeight:widthPercentageToDP(4.5)*1.5,
            color:Colors.inactiveTab
        },inputInfo:{
            // textAlign:'left',
            textAlign:Tools.stringIsContains(i18n.locale,'ar')?'right':'left',
            width:'100%',
            alignSelf:'flex-start',
            marginTop:-heightPercentageToDP(1),
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(5),
            // borderWidth:2,
            // height:heightPercentageToDP(5.5),
            // lineHeight:widthPercentageToDP(5)*1.5,
            color:Colors.inputfontColor,
        }
        
        
    });
    
    const onAddressDone=(addressVal=undefined)=>{
        if(addressVal!=undefined){
            // console.log(JSON.stringify(addressVal))
            setAddress(addressVal.address)
            changeHappened();
        }
        setAddressModal(false);
    }
    const getDate=()=>{
        return(
            <View style={[styles.inputView,{flexDirection:'row'}]}>
            <Text allowFontScaling={false}  style={{flex:1,color:(showDate?'grey':Colors.whiteColor),alignSelf:'center',width:'100%',height:'50%'}} 
            onPress={()=>{
                setShowDate(true)
            }}>{state.profile.dob}</Text></View>
        )
    }
    
    const getDateView=()=>{
        
        return(
            <DatePicker showDate={showDate} backgroundColor={Colors.yellowColor}
            textColor={Colors.whiteColor}
            onDone={()=>{setShowDate(false)}}
            onDateChange={(date) => {
                // props.profile.dob=date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
                changeHappened();
                setChosenDate(date);
            }} />
        );
    }
    const  getcallingNumber=(_ref,_number)=>{
        // console.log('come'+_number);
        const codeNumb=_ref.current?.getCallingCode(_number);
        // console.log(codeNumb);
        //const callingNumber = _number.replace('+'+codeNumb,"");
        
        //console.log(callingNumber);
        // setState({startnumber:callingNumber})
    }
    const getCountryCode=(_number)=>{
        const CountryCode = phoneInputRef.current?.getCountryCode(_number);
        // console.log(CountryCode);
        return CountryCode;
    }
    const getGender=()=>{
        const placeholder = {
            label: 'Select gender',
            value: null,
            color: '#9EA0A4',
        };
        const genders = [
            {
                label: 'Male',
                value: 'm',
            },
            {
                label: 'Female',
                value: 'f',
            }
        ];
        
        return(
            <View style={styles.genderview}>
            </View>);
        }
        const getProfile=()=>{
            return(
                <View>
                <Text style={styles.Names} allowFontScaling={false}>{state.profile.FirstName}</Text>
                {/* <Text style={styles.company} allowFontScaling={false}>{props.profile.FirstName} {props.profile.LastName}</Text> */}
                <View style={styles.titleBar}>
                <GoogleRecaptcha
                ref={(ref)=>{recaptchaRef=ref}}
                size={GoogleRecaptchaSize.INVISIBLE}
                // baseUrl="http://localhost:3000"
                baseUrl={WebServices.googleRecaptchaSiteURL}
                siteKey={WebServices.googleRecaptchaSiteKey}
                />
                <Text allowFontScaling={false} style={styles.titleTxt}>{i18n.t('personalinfo')}</Text>
                </View>
                <View style={styles.infoBar}>
                <View style={styles.infoBarHalf}>
                <Text allowFontScaling={false} style={styles.titleInfo}>{i18n.t('name')}</Text>
                <TextInput 
                ref={ref=>{nameInputRef.current=ref;}}
                onChangeText={(text) => {
                    setFirstName(text);
                    changeHappened();}}
                    allowFontScaling={false} value={firstname} style={styles.inputInfo}/>
                    </View>
                    <TouchableOpacity  style={{alignSelf:'flex-end',paddingBottom:heightPercentageToDP(1)}}
                    onPress={()=>{
                        nameInputRef.current?.focus();
                    }}><Image style={styles.editIcon} source={editIcon}/></TouchableOpacity>
                    </View>
                    
                    <View style={styles.infoBar}>
                    <View style={styles.infoBarHalf}>
                    <Text allowFontScaling={false} style={styles.titleInfo}>{i18n.t('mobile')}</Text>
                    <TextInput editable={false} allowFontScaling={false} value={mobile} style={[styles.inputInfo,{opacity:1}]}/>
                    </View>
                    {/* <Image style={styles.editIcon} source={editIcon}/> */}
                    </View>
                    
                    <View style={styles.infoBar}>
                    <View style={styles.infoBarHalf}>
                    <Text allowFontScaling={false} style={[styles.titleInfo]}>{i18n.t('email')}</Text>
                    <TextInput editable={false} allowFontScaling={false} value={email} style={[styles.inputInfo,{opacity:1}]}/>
                    </View>
                    {/* <Image style={styles.editIcon} source={editIcon}/> */}
                    </View>
                    
                    <View style={styles.infoBar}>
                    <View style={styles.infoBarHalf}>
                    <Text allowFontScaling={false} style={[styles.titleInfo]}>{i18n.t('address')}</Text>
                    <TextInput numberOfLines={1} editable={false} allowFontScaling={false} 
                    value={getAddressString()} style={[styles.inputInfo,{opacity:1}]}/>
                    </View>
                    <TouchableOpacity  style={{alignSelf:'flex-end',paddingBottom:heightPercentageToDP(1)}}
                    onPress={()=>{
                        setAddressModal(true);
                    }}><Image style={styles.editIcon} source={editIcon}/></TouchableOpacity>
                    </View>
                    <View style={styles.infoBar}>
                    <View style={styles.infoBarHalf}>
                    <Text allowFontScaling={false} style={[styles.titleInfo]}>{i18n.t('membership')}</Text>
                    <TextInput numberOfLines={1} editable={false} allowFontScaling={false} value={profile.CardNo} style={[styles.inputInfo,{opacity:1}]}/>
                    </View>
                    {/* <Image style={styles.editIcon} source={editIcon}/> */}
                    </View>
                    {UIElements.drawGap(15)}
                    {change&&(
                        <View>
                        {UIElements.drawGap(5)}
                        <TouchableOpacity
                        onPress={()=>saveChanges()}
                        style={styles.buttonSign}
                        disabled={change===false?true:false}>
                        
                        <Text allowFontScaling={false}  style={styles.buttontext}>{i18n.t('savechange')}</Text>
                        </TouchableOpacity>
                        {UIElements.drawGap(15)}
                        </View>
                    )
                }
                <View style={styles.titleBar}>
                <Text allowFontScaling={false} style={styles.titleTxt}>{i18n.t('accountdetails')}</Text>
                </View>
                {UIElements.drawGap(15)}
                
                <View style={styles.infoBar}>
                <TouchableOpacity
                onPress={()=>{
                    Alert.alert(i18n.t('changepasssure'),"",[
                        {
                            text:i18n.t('yes'),
                            onPress:()=>{
                                
                                var submitRequest=props.submitChangePassRequest;
                                handleSend().then((_token)=>{
                                    submitRequest(null,null,null,null,_token);
                                });
                            }
                        },
                        {
                            text:i18n.t('no'),
                            onPress:()=>{
                            }
                        }
                    ])
                }} style={styles.infoBarHalf}>
                <Text numberOfLines={1} editable={false} allowFontScaling={false} style={[styles.inputInfo,{textAlign:'left'}]}>
                {i18n.t('changepass')}
                </Text>
                </TouchableOpacity>
                {/* <Image style={styles.editIcon} source={editIcon}/> */}
                </View>
                {UIElements.drawGap(15)}
                
                <View style={styles.infoBar}>
                <TouchableOpacity onPress={()=>{
                    setDeleteModal(true);
                }} style={[styles.infoBarHalf,{}]}>
                <Text numberOfLines={1} editable={false} allowFontScaling={false} style={[styles.inputInfo,{textAlign:'left'}]}>
                {i18n.t('deleteAccount')}
                </Text>
                </TouchableOpacity>
                {/* <Image style={styles.editIcon} source={editIcon}/> */}
                </View>
                </View>
            )
        }
        
        const onDeleteOtpConfirm=(_otp,_state,_token)=>{
            if(_state){
                completeDeleteRequest(_otp);
                // handleSend().then((_token)=>{
                    var submitDeleteRequest=props.submitDeleteRequest;
                // handleSend().then((_token)=>{
                    submitDeleteRequest(null,null,()=>{
                    props.navigation.popToTop();
                },_token);
                // });
            }
            setDeleteOtpModal(false);
        }
        const onDeleteConfirm=(_state)=>{
            if(_state){
                handleSend().then((_token)=>{
                    Alert.alert(i18n.t('deletesure'),"",[
                        {
                            text:i18n.t('yes'),
                            onPress:()=>{
                                // setDeleteOtpModal(true);
                                var submitDeleteRequest=props.submitDeleteRequest;
                                // handleSend().then((_token)=>{
                                    submitDeleteRequest(null,null,null,_token);
                                // });
                            }
                        },
                        {
                            text:i18n.t('no'),
                            onPress:()=>{
                            }
                        }
                    ])
                });
                
            }
            setDeleteModal(false);
        }
        const  getAddressString=()=>{
            return (Tools.stringIsEmpty(address.street)?'':address.street)+","
            +(Tools.stringIsEmpty(address.city)?'':address.city+",")
            +(Tools.stringIsEmpty(address.state)?'':address.state+",")
            +(Tools.stringIsEmpty(address.country)?'':address.country+",")
            +(Tools.stringIsEmpty(address.postalCode)?'':address.postalCode)
        }
        
        const getProfileEdit=()=>{
            
            return(
                <View style={{width:width,alignContent:'center',alignSelf:'center'}} >
                <View style={styles.rowView}>
                <View style ={styles.inputView}>
                <TextInput allowFontScaling={false}  style ={styles.inputValue}
                editable={true}
                placeholderTextColor='#676667'
                placeholder='First Name'
                onChangeText={(text) => {
                    setFirstName(text);
                    changeHappened();}}
                    value={firstname}></TextInput></View>
                    </View>
                    
                    
                    <View style={styles.rowView}>
                    <View style ={styles.inputView}><TextInput allowFontScaling={false}  style ={styles.inputValue}
                    placeholderTextColor='#676667'
                    editable={true}
                    placeholder='Last Name'
                    onChangeText={(text) => {
                        setLastName(text);
                        changeHappened();}}
                        value={lastname}></TextInput></View>
                        </View>
                        
                        
                        <View style={styles.rowView}>
                        <View style ={[styles.inputView,{backgroundColor:Colors.bgColor}]}><TextInput allowFontScaling={false}  style ={styles.inputValue}
                        editable={false}
                        placeholderTextColor='#C0C0C0'
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            changeHappened();}}
                            keyboardType='email-address'
                            returnKeyType='done'
                            placeholder='Email Address'></TextInput></View>
                            </View>
                            
                            <PhoneDropDownInput
                            editable={false}
                            ref={phoneInputRef}
                            textStyle={{color:'#C0C0C0'}}
                            inputStyle={{backgroundColor:Colors.bgColor,color:'#C0C0C0'}}
                            viewStyle={{width:'80%',backgroundColor:Colors.bgColor}}
                            defaultValue={findCountryDialCode(mobile)}
                            defaultPhone={findCountry(mobile)}
                            inputChange={(text) => {
                                setMobile(text);
                                changeHappened();}}
                                />
                                
                                </View>
                            );
                        }
                        const changeHappened=()=>{
                            setChange(true);
                            // if(changeCheck){
                            //     setState({change:true});
                            //     var saveUpdate  =   props.saveChange;
                            //     saveUpdate(true);
                            // }
                            
                        }
                        const saveChanges=()=>{
                            var profileData=profile;
                            // console.log(JSON.stringify(profileData));
                            profileData.FirstName=firstname;
                            profileData.FullName=firstname;
                            profileData.BillingAddress=address;
                            setChange(false);
                            var handleToUpdate  =   props.handler;
                            handleToUpdate(profileData);
                        }
                        const getAddress=()=>{
                            return(
                                <View>
                                
                                {UIElements.drawGap(15)}
                                {change&&(<TouchableOpacity
                                    onPress={()=>saveChanges()}
                                    style={styles.buttonSign}
                                    disabled={change===false?true:false}>
                                    
                                    <Text allowFontScaling={false}  style={styles.buttontext}>{i18n.t('savechange')}</Text>
                                    </TouchableOpacity>)}
                                    {UIElements.drawGap(25)}
                                    
                                    </View>
                                );
                            }
                            
                            const drawGap=(valueGap)=>{
                                return(
                                    <View
                                    style={{paddingTop:valueGap}}/>
                                );
                            }
                            return (
                                <View
                                style={{ flex:1,backgroundColor:Colors.bgColor }}>
                                {/* <ResetParams/> */}
                                {/* <TouchableWithoutFeedback style={{backgroundColor:Colors.transparent}} onPress={()=>{Keyboard.dismiss()}}> */}
                                <View style={{ flex:1 }}>
                                <BackgroundWall/>
                                <SafeAreaView style={{flex:1,marginTop:StatusBar.currentHeight}}>
                                <View style={{height:heightPercentageToDP(78),width:widthPercentageToDP(100)}}>
                                <TopBackBar onDone={()=>{
                                    props.navigation.popToTop();
                                }}>
                                <TouchableOpacity style={{ alignSelf:'center',}} onPress={()=>{
                                    //signout
                                    SignOut();
                                }}>
                                <Image resizeMode='contain' style={{tintColor:Colors.blueColor,width:25,height:25}} source={signoffButton}/>
                                </TouchableOpacity>
                                </TopBackBar>
                                <ScrollView 
                                showsVerticalScrollIndicator = {false}
                                contentContainerStyle={styles.homeScrollView}
                                style={styles.homeView}>
                                {UIElements.drawGap(10)}
                                <View style={styles.inner}>
                                
                                {state.profile!=undefined&&getProfile()}
                                {/* {getAddress()} */}
                                </View>
                                </ScrollView>
                                </View></SafeAreaView></View>
                                {/* </TouchableWithoutFeedback> */}
                                {deleteModal&&(<DeleteConfirmation  onDismiss={onDeleteConfirm}/>)}
                                {/* {deleteOtpModal&&<OtpVerify title={i18n.t('deleteAccount')} details={i18n.t("pleaseentertheotp")} onDone={onDeleteOtpConfirm}/>} */}
                                {addressModal&&(<AddressInputForm address={address} onDismiss={onAddressDone}/>)}
                                </View>
                            )
                        }
                        
                        // }
                        // const mapStateToProps = state=>{
                            //     return {
                        //         profile: state.profileReducer.profile,
                        //     }
                        // }
                        
                        // export default connect(
                        //     mapStateToProps,
                        //     )(AccountEditor)
                        
                        
                        // AccountEditor.propTypes = {
                        //     profile: PropTypes.object.isRequired,
                        //     handler:PropTypes.func.isRequired
                        // }
                        
                        