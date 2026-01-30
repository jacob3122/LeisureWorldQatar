import React, { useState } from 'react'
import { StyleSheet,TouchableOpacity, Text, View, Image, FlatList, SafeAreaView, Alert, DeviceEventEmitter, ScrollView } from 'react-native';
// import Barcode from 'react-native-barcode-builder';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
// import Colors from '../constants/Colors';
import * as UIElements from '../../Tools/Components/UIElements'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import AppIcon from './AppIcon';
import * as Tools from '../../Tools/Components/Tools'
import { useEffect } from 'react';
import FastImage from '@d11/react-native-fast-image';
import OpenAuthenticate from './OpenAuthenticate';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import WebServices from '../constants/WebServices';
import signoffButton from '../../assets/Icons/signoff.png'
import SecureStore from './SecureStore';
import {updateProfile,updateAccessToken,updateCart} from '../../src/js/actions/profileActions';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import ReactMoE from 'react-native-moengage';
import Barcode from './Barcode';

export default function ProfileInHam({route,OpenMenu,hamView,referralCode,assignProfile,menuVisible,updateCart}) {
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const Colors=useTheme();
    const [hamData,setHamData] =useState(undefined);
    const [profileData,setProfileData] =useState('');
    const [selectedNo,setSelected] =useState(-1);
    
    const [showLogin,setLogin]=useState(false);
    const [signOff,setSignOff]=useState(false);
    const [showRegister,setRegister]=useState(false);
    
    const navigationIn = useNavigation();
    
    const styles = StyleSheet.create({
        barCodeValue:{
            letterSpacing:widthPercentageToDP(0.2),
            marginTop:-widthPercentageToDP(1),
            color:'black',
            textAlign:'center',
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(4.2),
            lineHeight:widthPercentageToDP(4.2)*1.3,
        },
        nameTxt:{
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(5),
        },
        nameTxtPro:{
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(5),
            lineHeight:widthPercentageToDP(5)*1.5,
        },
        normalTxt:{
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            textAlignVertical:'center',
            fontSize:widthPercentageToDP(4),
            lineHeight:widthPercentageToDP(4)*1.8,
        }, shadow:{
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 3,
            shadowOpacity: 0.12,
        },
    })
    
    useEffect(()=>{
        i18n.locale=global.locale;
    },[global.locale])
    const getHamBurger=()=>{
        // console.log("getHamBurger"+(state.profile));
        
        verifyurl=WebServices.hampageData.replace('{Lang}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en').replace('{MemberID}',Tools.IsNull(state.profile)?'':state.profile.Id);
        // console.log(verifyurl);
        return fetch (WebServices.MainURL+verifyurl+("&rand="+ (Math.floor(Math.random() * 100000) + 1)),{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },WebServices.timeout)
        .then((response) =>  response.text())
        .then((responseJson) => {
            if(!Tools.IsNull(state.profile)){
                setProfileData(state.profile.Id);
                // console.log("P "+JSON.stringify(profileData));
            }else{
                setProfileData('');
            }
            // console.log("HAM: "+responseJson);
            let DataIn=JSON.parse(responseJson);
            global.hamData=DataIn;
            setHamData(DataIn);
        })
        .catch((error) =>{
        });
    }
    
    useEffect(()=>{
        setHamData(global.hamData);
        setSelected(-1);
    },[global.hamData,hamView])
    
    
    useEffect(()=>{
        // console.log("P: "+profileData+"PH :"+JSON.stringify(state.profile));
        if(Tools.IsNull(profileData)||(!Tools.IsNull(state.profile)&&(state.profile.Id!=profileData))||Tools.IsNull(state.profile)){
            // console.log("PH :"+JSON.stringify(profile));
            getHamBurger();
        }
        
    },[state.profile,profileData])
    
    const SignOut=()=>{
        Alert.alert(i18n.t('signoutConfirm'),"",[
            {
                text:i18n.t('yes'),
                onPress:()=>{
                    // DeviceEventEmitter.emit("signout");
                    menuVisible();
                    // updateProfile({})
                    dispatch({
                        type: 'update_Profile',
                        payload: undefined
                    });
                    SecureStore.setItemAsync('accessToken','');
                    SecureStore.setItemAsync('profile','');
                    // updateAccessToken({});
                    dispatch({
                        type:"update_AccessToken",
                        payload:undefined
                    })
                    // updateCart(undefined);
                    dispatch({
                        type:"update_Cart",
                        stateIn:undefined
                    })
                    navigationIn.navigate('Homescreen');
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
    const getDyanmicButtons=(hamData,OpenMenu,selectedNo,setSelected,styles)=>{
        allButtons=[];
        // if(hamData!=undefined)
        // console.log("D: "+hamData[0].ContentItems.length);
        if(hamData!=undefined&&hamData.length>0){
            allItems=hamData[0].ContentItems;
            if(allItems.length>0){
                for(let t=0;t<allItems.length;t++){
                    allButtons.push(
                        <TouchableOpacity
                        onPress={()=>{
                            setSelected(t);
                            console.log(JSON.stringify(allItems[t]))
                            OpenMenu(allItems[t]);
                        }} 
                        style={[{flexDirection:'row',paddingVertical:heightPercentageToDP(0.75),paddingHorizontal:widthPercentageToDP(3)},t==selectedNo?{backgroundColor:Colors.blueHardColor}:{}]}>
                        {/* <AppIcon name='Parkscreen' style={{tintColor:Colors.whiteColor}} /> */}<View>
                        {!Tools.IsNull(allItems[t].Banner)&&!Tools.stringIsEmpty(allItems[t].Banner.MainBannerImgURL)&&
                            <Image
                            style={{width:widthPercentageToDP(6.5),height:widthPercentageToDP(6.5),alignSelf:'center',tintColor:Colors.whiteColor}}
                            source={{
                                uri:allItems[t].Banner.MainBannerImgURL,
                            }}
                            />
                        }</View>
                        {UIElements.drawRGap(10)}
                        <Text style={styles.normalTxt}>{allItems[t].Title}</Text>
                        </TouchableOpacity>
                    )
                    allButtons.push(UIElements.drawLine(Colors.bluelightShadeColor,'100%',widthPercentageToDP(0.25)));
                }
            }
        }
        return allButtons;
    }
    
    const OpenMenuTo=(menuTo)=>{
        OpenMenu(menuTo);
    }
    const  cardFormatting=(cardNo)=>{
        cardFormatNo='';
        let n=0;
        if(!Tools.stringIsEmpty(cardNo)){
            for(let t=0;t<cardNo.length;t++){
                if(n==4){
                    cardFormatNo+='  ';
                    n=0;
                }
                cardFormatNo+=cardNo[t];
                n=n+1;
            }}
            return cardFormatNo;
        }
        
        return(<View style={{}}>
            {/* <Barcode value={"123456789"} viewStyle={{marginTop:heightPercentageToDP(1),marginBottom:heightPercentageToDP(1)}} width={widthPercentageToDP('.42%')} height={heightPercentageToDP('4.5%')}/> */}
            
            {!Tools.IsNull(state.profile)&&state.profile.FirstName!=undefined&&<>
                <View style={{marginHorizontal:widthPercentageToDP(3)}}>
                <Text style={styles.nameTxt}>{state.profile.FirstName}</Text>
                </View>
                <View style={{width:'90%',alignSelf:'center',borderRadius:10,overflow:'visible',backgroundColor:'white'}}>
                {/* <Barcode
                    value={state.profile.CardNo} 
                    width={widthPercentageToDP('.42%')} height={heightPercentageToDP('4.5%')}
                    format="CODE128" /> */}
                    <Barcode value={state.profile.CardNo} viewStyle={{marginTop:heightPercentageToDP(1),marginBottom:heightPercentageToDP(1)}} width={widthPercentageToDP('.32%')} height={heightPercentageToDP('4.5%')}/>
                    <Text  allowFontScaling={false} style ={styles.barCodeValue}>{cardFormatting(state.profile.CardNo)}</Text>
                    </View>
                    {UIElements.drawGap(20)}
                    </>}
                    {(Tools.IsNull(state.profile)||Tools.IsNull(state.profile.FirstName))&&<View>
                        <View style={{marginHorizontal:widthPercentageToDP(5)}}>
                        <Text style={styles.nameTxtPro}>{i18n.t('welcometo')}</Text>
                        <Text style={[styles.nameTxtPro,{fontSize:widthPercentageToDP(6)}]}>{i18n.t('leisureqatar')}</Text>
                        </View>
                        
                        <View style={{marginHorizontal:widthPercentageToDP(5),alignSelf:'flex-start',justifyContent:'space-around',}}>
                        {UIElements.drawGap(heightPercentageToDP(1))}
                        <TouchableOpacity
                        onPress={()=>{
                            setLogin(true);
                            menuVisible();
                        }}
                        style={[{height:heightPercentageToDP(4.75),alignSelf:'flex-start',
                            width:widthPercentageToDP(25),justifyContent:'center'
                            ,backgroundColor:Colors.whiteColor,borderRadius:heightPercentageToDP(4.75)},styles.shadow]}>
                            <Text style={{fontFamily:'Cairo-Regular',paddingHorizontal:widthPercentageToDP(4),
                                alignSelf:'center',lineHeight:widthPercentageToDP(4)*1.8
                                ,fontSize:widthPercentageToDP(4),color:Colors.blueColor}}>{i18n.t('signin')}</Text>
                                </TouchableOpacity>
                                {UIElements.drawGap(heightPercentageToDP(2))}
                                <TouchableOpacity
                                onPress={()=>{
                                    setRegister(true);
                                    menuVisible();
                                }}
                                style={[{height:heightPercentageToDP(4.75),justifyContent:'center',
                                    width:widthPercentageToDP(25),justifyContent:'center'
                                    ,backgroundColor:Colors.whiteColor,borderRadius:heightPercentageToDP(4.75)},styles.shadow]}>
                                    <Text style={{fontFamily:'Cairo-Regular',paddingHorizontal:widthPercentageToDP(4),lineHeight:widthPercentageToDP(4)*1.8,
                                        alignSelf:'center',fontSize:widthPercentageToDP(4),color:Colors.blueColor}}>{i18n.t('register')}</Text>
                                        </TouchableOpacity>
                                        </View>
                                        {UIElements.drawGap(20)}
                                        </View>}
                                        <ScrollView style={{height:heightPercentageToDP(58),overflow:'hidden'}}>
                                        <View style={{marginHorizontal:widthPercentageToDP(4)}}>
                                        
                                        {getDyanmicButtons(hamData,OpenMenu,selectedNo,setSelected,styles,Colors)}
                                        {!Tools.IsNull(state.profile)&&state.profile.FirstName!=undefined&&<>
                                            <TouchableOpacity
                                            onPress={()=>{
                                                SignOut();
                                            }}
                                            style={[{flexDirection:'row',paddingVertical:heightPercentageToDP(1),paddingHorizontal:widthPercentageToDP(3)},{}]}>
                                            <View style={{width:widthPercentageToDP(6),height:widthPercentageToDP(6),borderRadius:widthPercentageToDP(6),alignSelf:'center',backgroundColor:Colors.whiteColor,justifyContent:'center'}}>
                                            <Image resizeMode='contain' style={{tintColor:Colors.blueColor, width:widthPercentageToDP(3.5),height:widthPercentageToDP(3.5),alignSelf:'center'}} source={signoffButton}/></View>
                                            {UIElements.drawRGap(10)}
                                            <Text style={styles.normalTxt}>{i18n.t('signout')}</Text>
                                            </TouchableOpacity></>}
                                            </View>
                                            </ScrollView>
                                            <OpenAuthenticate showLogin={showLogin} setLogin={setLogin} setRegister={setRegister} showRegister={showRegister} navigation={navigationIn}/>
                                            </View>)
                                        }
                                        
                                        
                                        
                                        // function mapStateToProps(state) {
                                        //     return {  profile: state.profileReducer.profile, };
                                        // } function mapDispatchToProps(dispatch) {
                                        //     return {updateProfile: (pData) => dispatch(updateProfile(pData)),
                                        //         updateCart:(cData)=> dispatch(updateCart(cData)),
                                        //         updateAccessToken: (pData) => dispatch(updateAccessToken(pData)),
                                        //     }
                                        // } 
                                        
                                        // export default connect(mapStateToProps,mapDispatchToProps)(ProfileInHam);
                                        